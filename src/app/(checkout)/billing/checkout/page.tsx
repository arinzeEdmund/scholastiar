import { ArrowRight, BadgeCheck, Check, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/billing/checkout-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { signUpSteps, StepIndicator } from "@/components/auth/step-indicator";
import { Button } from "@/components/ui/button";
import { SURFACES } from "@/config/personas";
import { repos, type Plan } from "@/data";
import { landingFor, nextStepFor } from "@/lib/auth-flow";
import { isMock } from "@/lib/env";
import { TEST_CARDS } from "@/lib/payments/mock-gateway";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Checkout" };

const formatPrice = (plan: Plan) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency, maximumFractionDigits: 0 }).format(
    plan.price ?? 0,
  );

export default async function CheckoutPage({ searchParams }: PageProps<"/billing/checkout">) {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");
  const { user } = session;

  const audience = SURFACES[user.primary_role].planAudience;
  if (!audience) redirect(landingFor(user).href);

  const steps = signUpSteps(user.primary_role);
  const subscription = await repos.billing.getSubscription(user.user_id);
  const requested = (await searchParams).plan;
  const currentPlan = subscription?.status === "active" ? await repos.billing.getPlan(subscription.plan_id) : null;
  const upgradeTo =
    currentPlan && typeof requested === "string" && requested !== currentPlan.id
      ? await repos.billing.getPlan(requested as Plan["id"])
      : null;
  // An active plan can only be changed here for an upgrade; downgrades are scheduled from /billing.
  const upgrading = Boolean(
    currentPlan &&
    upgradeTo &&
    upgradeTo.audience === currentPlan.audience &&
    (upgradeTo.price ?? 0) > (currentPlan.price ?? 0),
  );

  if (subscription?.status === "active" && !upgrading) {
    const plan = await repos.billing.getPlan(subscription.plan_id);
    return (
      <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
        <div role="status" className="rounded-2xl border bg-card p-6 text-center sm:p-8">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-soft-green text-green-dark">
            <BadgeCheck className="size-6" aria-hidden />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-foreground">Your plan is active</h1>
          <p className="mt-2 text-secondary-text">
            You&apos;re on <strong className="text-primary-text">{plan?.name ?? "a paid plan"}</strong>. There&apos;s
            nothing to pay right now.
          </p>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href={await nextStepFor(user.user_id)}>
              Continue
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const company = audience === "employer" ? await repos.organizations.getEmployerCompanyForUser(user.user_id) : null;
  const plans = (await repos.billing.listPlans(audience)).filter(
    (p) => !p.sales_led && p.price !== null && !(p.id === "employer_starter" && company?.sponsors_graduate_work_visas),
  );
  const plan = plans.find((p) => p.id === requested) ?? plans.find((p) => p.id === subscription?.plan_id) ?? plans[0];
  if (!plan) redirect("/pricing");

  const includes = plan.includes_plan_id ? plans.find((p) => p.id === plan.includes_plan_id) : undefined;
  const countries = await repos.reference.listCountries();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,30rem)_21rem] lg:justify-center lg:gap-14">
        <div className="min-w-0">
          {upgrading && currentPlan ? (
            <>
              <Link href="/billing" className="text-sm font-medium text-secondary-text hover:text-primary-text">
                ← Back to billing
              </Link>
              <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">Upgrade to {plan.name}</h1>
              <p className="mt-1.5 text-sm text-secondary-text">
                Your {currentPlan.name} plan stays active until this payment goes through. {plan.name} starts straight
                away.
              </p>
            </>
          ) : (
            <>
              <StepIndicator steps={steps} current={steps.length - 2} />
              <h1 className="mt-7 text-2xl font-bold tracking-tight text-foreground">Pay for your plan</h1>
            </>
          )}
          <p className="mt-1.5 text-sm text-secondary-text">
            Signed in as <strong className="text-primary-text">{user.email}</strong>.{" "}
            <SignOutButton label="Not you?" redirectTo="/auth/sign-in" />
          </p>
          <div className="mt-6">
            <CheckoutForm
              planId={plan.id}
              priceLabel={`${formatPrice(plan)}/month`}
              countries={countries.map((c) => ({ value: c.iso2, label: c.name }))}
              defaultCountry={user.country_code}
              testCards={isMock ? TEST_CARDS : null}
            />
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <section
            aria-labelledby="summary"
            className="overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]"
          >
            <div className="relative p-5">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-green/10 blur-2xl"
              />
              <h2 id="summary" className="relative text-xs font-medium text-secondary-text">
                Order summary
              </h2>
              {plans.length > 1 && !upgrading && (
                <nav
                  aria-label="Change plan"
                  className="relative mt-3 grid grid-cols-2 gap-1 rounded-xl bg-soft p-1 dark:bg-white/5"
                >
                  {plans.map((option) => {
                    const active = option.id === plan.id;
                    return (
                      <Link
                        key={option.id}
                        href={`/billing/checkout?plan=${option.id}`}
                        aria-current={active ? "true" : undefined}
                        className={cn(
                          "flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                          active
                            ? "bg-card text-primary-text shadow-sm ring-1 ring-border dark:bg-white/10"
                            : "text-secondary-text hover:text-primary-text",
                        )}
                      >
                        <span className="truncate">{option.name}</span>
                        <span className={active ? "text-green-dark" : "text-subtle-text"}>{formatPrice(option)}</span>
                      </Link>
                    );
                  })}
                </nav>
              )}
              <div className="relative mt-4 flex items-baseline justify-between gap-3">
                <p className="text-lg font-semibold text-primary-text">{plan.name}</p>
                <p className="shrink-0">
                  <span className="text-2xl font-bold tracking-tight text-primary-text">{formatPrice(plan)}</span>
                  <span className="text-xs text-secondary-text">/month</span>
                </p>
              </div>
              <p className="relative mt-1 text-xs leading-relaxed text-secondary-text">{plan.description}</p>
              <ul className="relative mt-4 space-y-1.5 border-t pt-4 text-[0.8125rem] leading-snug">
                {includes && (
                  <li className="flex gap-2 font-medium text-green-dark">
                    <Check className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                    Everything in {includes.name}
                  </li>
                )}
                {plan.features.slice(0, includes ? 3 : 4).map((feature) => (
                  <li key={feature} className="flex gap-2 text-secondary-text">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-green-dark" strokeWidth={2.5} aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <dl className="relative mt-4 space-y-1.5 border-t pt-4 text-sm">
                <div className="flex justify-between text-secondary-text">
                  <dt>Billed</dt>
                  <dd>Monthly, USD</dd>
                </div>
                <div className="flex items-baseline justify-between font-semibold text-primary-text">
                  <dt>Due today</dt>
                  <dd className="text-lg">{formatPrice(plan)}</dd>
                </div>
              </dl>
            </div>
            <p className="flex gap-2 border-t bg-soft/60 px-5 py-3 text-[0.6875rem] leading-relaxed text-secondary-text dark:bg-white/[0.02]">
              <ShieldCheck className="mt-px size-3.5 shrink-0 text-green-dark" aria-hidden />
              Cancel any time. Card details go straight to our payment provider and are never stored by Scholastiar.ai.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
