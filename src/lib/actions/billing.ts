"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos, type CryptoPayment, type PaymentMethod, type PaymentProvider, type Plan, type PlanKey } from "@/data";
import { SURFACES } from "@/config/personas";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { nextStepFor } from "@/lib/auth-flow";
import { isMock } from "@/lib/env";
import { notify } from "@/lib/messages/notify";
import { CRYPTO_ASSETS, CRYPTO_PROVIDER, QUOTE_MINUTES } from "@/lib/payments/crypto";
import { chargeCard, mockCryptoQuote, passesLuhn } from "@/lib/payments/mock-gateway";
import { getSession } from "@/lib/session";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/auth";

// Phase A checkout against mock providers. Phase B: Stripe Elements / Paystack / Flutterwave for
// card and local payments (card details go straight to the provider), Cryptomus for crypto
// (invoice + webhooks). Every outcome sends email + WhatsApp + in-app messages.

const METHOD_LABEL: Record<PaymentMethod, string> = { card: "card", local: "local payment", crypto: "crypto" };
const money = (plan: Plan) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency, maximumFractionDigits: 0 }).format(
    plan.price ?? 0,
  );

/** The plan this signed-in user may buy, or an error message. */
async function payablePlan(planId: string): Promise<{ userId: string; plan: Plan } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "Your session has ended. Sign in to finish paying." };
  const plan = await repos.billing.getPlan(planId as PlanKey);
  const audience = SURFACES[session.user.primary_role].planAudience;
  if (!plan || plan.sales_led || plan.price === null || plan.audience !== audience) {
    return { error: "This plan isn't available for your account. Choose another plan." };
  }
  if (plan.id === "employer_starter") {
    const company = await repos.organizations.getEmployerCompanyForUser(session.user.user_id);
    if (company?.sponsors_graduate_work_visas)
      return { error: "Sponsored post-study jobs need Employer Pro. Choose Pro to continue." };
  }
  return { userId: session.user.user_id, plan };
}

/** Records the outcome, activates the plan on success, sends messages and returns the next screen. */
async function completePayment(input: {
  userId: string;
  plan: Plan;
  subscriptionId: string;
  method: PaymentMethod;
  provider: PaymentProvider;
  succeeded: boolean;
  failureReason: string | null;
  /** Set when the user already had a paid plan: this payment changes it. */
  changingFrom?: PlanKey | null;
}): Promise<ActionResult<{ redirectTo: string }>> {
  const attempt = await repos.billing.recordPayment({
    userId: input.userId,
    subscriptionId: input.subscriptionId,
    method: input.method,
    provider: input.provider,
    amount: input.plan.price ?? 0,
    currency: input.plan.currency,
    succeeded: input.succeeded,
    failureReason: input.failureReason,
  });
  const vars = { planName: input.plan.name, amount: money(input.plan), method: METHOD_LABEL[input.method] };
  if (!input.succeeded) {
    await notify("payment.failed", { userId: input.userId }, { ...vars, reason: input.failureReason ?? "" });
    return fail(input.failureReason ?? "Your payment didn't go through.");
  }
  await notify("payment.succeeded", { userId: input.userId }, { ...vars, reference: attempt.provider_reference });

  // The first verification email goes out once the plan is paid for.
  const account = await repos.auth.getAccount(input.userId);
  if (account && !account.email_verified_at) {
    const token = await repos.auth.issueToken(input.userId, "verify_email");
    await notify(
      "email.verification_sent",
      { userId: input.userId },
      { link: `/auth/verify-email/confirm?token=${token}` },
    );
  }
  revalidatePath("/", "layout");
  if (input.changingFrom && input.changingFrom !== input.plan.id) return ok({ redirectTo: "/billing?changed=1" });
  return ok({ redirectTo: await nextStepFor(input.userId) });
}

export async function payForPlan(input: CheckoutInput): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
  const data = parsed.data;
  const target = await payablePlan(data.planId);
  if ("error" in target) return fail(target.error);

  if (data.method === "card" && !passesLuhn(data.cardNumber)) {
    return fail("Check the highlighted fields.", { cardNumber: ["That card number isn't valid. Check the digits."] });
  }
  if (data.method === "card") {
    const [month, year] = data.expiry.split("/").map(Number);
    if (new Date(2000 + year, month, 1) <= new Date()) {
      return fail("Check the highlighted fields.", { expiry: ["This card has expired."] });
    }
  }

  const current = await repos.billing.getSubscription(target.userId);
  const changingFrom = current?.status === "active" ? current.plan_id : null;
  const subscription = await repos.billing.startSubscription(target.userId, target.plan.id);
  if (subscription.status === "active") return ok({ redirectTo: await nextStepFor(target.userId) });

  const result = data.method === "card" ? chargeCard(data.cardNumber) : ({ succeeded: true } as const);
  return completePayment({
    userId: target.userId,
    plan: target.plan,
    subscriptionId: subscription.id,
    method: data.method,
    provider: data.method === "card" ? "stripe" : data.provider,
    succeeded: result.succeeded,
    failureReason: result.succeeded ? null : result.reason,
    changingFrom,
  });
}

// ---- Crypto ----------------------------------------------------------------------------------

const cryptoInvoiceSchema = z.object({ planId: z.string().min(1), asset: z.string(), network: z.string() });

/** Creates a crypto invoice with a price locked for QUOTE_MINUTES. */
export async function createCryptoInvoice(
  input: z.input<typeof cryptoInvoiceSchema>,
): Promise<ActionResult<CryptoPayment>> {
  const parsed = cryptoInvoiceSchema.safeParse(input);
  if (!parsed.success) return fail("Choose a coin and network.");
  const option = CRYPTO_ASSETS.find((a) => a.asset === parsed.data.asset);
  if (!option || !option.networks.some((n) => n.key === parsed.data.network)) return fail("Choose a coin and network.");
  const target = await payablePlan(parsed.data.planId);
  if ("error" in target) return fail(target.error);

  const subscription = await repos.billing.startSubscription(target.userId, target.plan.id);
  if (subscription.status === "active") return fail("Your plan is already active.");

  const quote = mockCryptoQuote(option.asset, parsed.data.network, target.plan.price ?? 0);
  const invoice = await repos.billing.createCryptoPayment({
    user_id: target.userId,
    subscription_id: subscription.id,
    provider: CRYPTO_PROVIDER.key,
    provider_invoice_id: quote.invoiceId,
    asset: option.asset,
    network: parsed.data.network,
    amount_crypto: quote.amountCrypto,
    amount_usd: target.plan.price ?? 0,
    quote_rate: quote.rate,
    quote_expires_at: new Date(Date.now() + QUOTE_MINUTES * 60_000).toISOString(),
    pay_address: quote.address,
    received_crypto: "0",
    tx_hash: null,
    confirmations: 0,
    status: "awaiting_payment",
    payment_attempt_id: null,
  });
  return ok(invoice);
}

/** Current status of an invoice (the checkout polls this while waiting). */
export async function getCryptoInvoice(id: string): Promise<ActionResult<CryptoPayment & { redirectTo?: string }>> {
  const session = await getSession();
  if (!session) return fail("Your session has ended. Sign in to finish paying.");
  const invoice = await repos.billing.getCryptoPayment(session.user.user_id, id);
  if (!invoice) return fail("That invoice no longer exists.");

  if (invoice.status === "awaiting_payment" && new Date(invoice.quote_expires_at) < new Date()) {
    return ok(await repos.billing.updateCryptoPayment(id, { status: "expired" }));
  }
  // Confirming → paid once enough confirmations arrive (Phase B: provider webhook).
  if (invoice.status === "confirming") {
    const confirmations = invoice.confirmations + 1;
    if (confirmations < 3) return ok(await repos.billing.updateCryptoPayment(id, { confirmations }));
    // The invoice pays either a first plan or a change waiting behind the active one.
    const [current, pending] = await Promise.all([
      repos.billing.getSubscription(session.user.user_id),
      repos.billing.getPendingSubscription(session.user.user_id),
    ]);
    const subscription = [current, pending].find((s) => s?.id === invoice.subscription_id);
    const changingFrom =
      current?.status === "active" && current.id !== invoice.subscription_id ? current.plan_id : null;
    const plan = subscription ? await repos.billing.getPlan(subscription.plan_id) : null;
    const paid = await repos.billing.updateCryptoPayment(id, { confirmations, status: "paid" });
    // Plan changed after the invoice was created: keep the payment on record for staff to resolve.
    if (!plan) return ok(paid);
    const result = await completePayment({
      userId: session.user.user_id,
      plan,
      subscriptionId: invoice.subscription_id,
      method: "crypto",
      provider: "cryptomus",
      succeeded: true,
      failureReason: null,
      changingFrom,
    });
    return ok({ ...paid, redirectTo: result.ok ? result.data.redirectTo : undefined });
  }
  return ok(invoice);
}

/** Mock mode only: stands in for the customer's wallet so every crypto outcome can be tested. */
export async function simulateCryptoPayment(
  id: string,
  outcome: "full" | "underpaid" | "expire",
): Promise<ActionResult<CryptoPayment>> {
  if (!isMock) return fail("Not available.");
  const session = await getSession();
  if (!session) return fail("Your session has ended.");
  const invoice = await repos.billing.getCryptoPayment(session.user.user_id, id);
  if (!invoice) return fail("That invoice no longer exists.");
  const quote = mockCryptoQuote(invoice.asset, invoice.network, invoice.amount_usd);

  if (outcome === "expire")
    return ok(
      await repos.billing.updateCryptoPayment(id, { status: "expired", quote_expires_at: new Date().toISOString() }),
    );
  if (outcome === "underpaid") {
    const partial = (Number(invoice.amount_crypto) * 0.6).toFixed(invoice.amount_crypto.split(".")[1]?.length ?? 2);
    return ok(
      await repos.billing.updateCryptoPayment(id, {
        status: "underpaid",
        received_crypto: partial,
        tx_hash: quote.txHash(),
      }),
    );
  }
  return ok(
    await repos.billing.updateCryptoPayment(id, {
      status: "confirming",
      received_crypto: invoice.amount_crypto,
      tx_hash: quote.txHash(),
      confirmations: 0,
    }),
  );
}

// ---- Plan changes -----------------------------------------------------------------------------

const downgradeSchema = z.object({ planId: z.enum(["starter"]).nullable() });

/** Downgrades take effect at the end of the paid period; null cancels a scheduled downgrade. */
export async function scheduleDowngrade(input: z.infer<typeof downgradeSchema>): Promise<ActionResult<null>> {
  const session = await getSession();
  if (!session || session.user.primary_role !== "candidate") return fail("Your session has ended. Sign in again.");
  const parsed = downgradeSchema.safeParse(input);
  if (!parsed.success) return fail("That plan isn't available.");
  const current = await repos.billing.getSubscription(session.user.user_id);
  if (current?.status !== "active" || current.plan_id !== "pro") return fail("Only Pro can move to Starter.");
  await repos.billing.scheduleDowngrade(session.user.user_id, parsed.data.planId);
  revalidatePath("/billing");
  return ok(null);
}
