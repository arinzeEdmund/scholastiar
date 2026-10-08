import {
  BadgeCheck,
  CalendarClock,
  Check,
  CreditCard,
  FileText,
  FolderOpen,
  Bookmark,
  Sparkles,
  Video,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DowngradeButton } from "@/components/billing/downgrade-button";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Button } from "@/components/ui/button";
import { repos, type Plan } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Plan and billing" };

const day = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
const price = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
const METHOD = { card: "Card", local: "Local payment", crypto: "Crypto" } as const;

export default async function BillingPage({ searchParams }: PageProps<"/billing">) {
  const { user } = await requireCandidate();
  const changed = (await searchParams).changed === "1";
  const result = await safeLoad(async () => {
    const subscription = await repos.billing.getSubscription(user.user_id);
    const [plans, payments, cvs, personality, signia, saved] = await Promise.all([
      repos.billing.listPlans("candidate"),
      repos.billing.listPayments(user.user_id),
      repos.cvs.list(user.user_id),
      repos.personality.get(user.user_id),
      repos.signia.get(user.user_id),
      repos.opportunities.listSaved(user.user_id),
    ]);
    return { subscription, plans, payments, cvs, personality, signia, saved };
  });

  const header = (
    <PageHeader
      eyebrow="Billing"
      title="Your plan"
      description="Change plans, see what you've used this month and find every payment."
    />
  );
  if (!result.ok) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }
  const { subscription, plans, payments, cvs, personality, signia, saved } = result.data;
  const current = plans.find((p) => p.id === subscription?.plan_id) ?? null;
  const renews = subscription ? day(subscription.current_period_end) : "";
  const scheduled = subscription?.scheduled_plan_id ?? null;
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const cvsThisMonth = cvs.filter((c) => new Date(c.created_at) >= monthStart).length;

  const usage = [
    { icon: FileText, label: "Tailored CVs this month", value: String(cvsThisMonth), href: "/ai-cv" },
    {
      icon: Video,
      label: "PersonalityAI CV",
      value: personality.video ? "Recorded" : "Not recorded",
      href: "/personality-cv",
    },
    { icon: FolderOpen, label: "Signia projects", value: String(signia.projects.length), href: "/signia" },
    { icon: Bookmark, label: "Saved opportunities", value: String(saved.length), href: "/dashboard#shortlist" },
  ];

  function PlanCard({ plan }: { plan: Plan }) {
    const isCurrent = plan.id === current?.id;
    const isUpgrade = (plan.price ?? 0) > (current?.price ?? 0);
    return (
      <section
        aria-label={`${plan.name} plan`}
        className={cn(
          "flex flex-col rounded-2xl border bg-card p-5 shadow-xs dark:bg-white/[0.03]",
          isCurrent && "border-green-action ring-2 ring-green/20",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-primary-text">{plan.name}</p>
            <p className="text-sm text-secondary-text">{plan.description}</p>
          </div>
          {isCurrent && (
            <span className="shrink-0 rounded-full bg-soft-green px-2 py-0.5 text-xs font-semibold text-green-dark dark:bg-green/15">
              Current
            </span>
          )}
        </div>
        <p className="mt-3 text-2xl font-bold text-primary-text">
          {price(plan.price ?? 0, plan.currency)}
          <span className="text-sm font-normal text-secondary-text">/month</span>
        </p>
        {plan.includes_plan_id && (
          <p className="mt-3 text-xs font-semibold text-secondary-text">
            Everything in {plans.find((p) => p.id === plan.includes_plan_id)?.name}, plus:
          </p>
        )}
        <ul className="mt-2 space-y-1.5 text-sm text-secondary-text">
          {[...plan.features]
            // Lead with what students notice most: job connections.
            .sort((a, b) => Number(b.startsWith("Job connections")) - Number(a.startsWith("Job connections")))
            .slice(0, 6)
            .map((feature) => (
              <li key={feature} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-green-dark" aria-hidden />
                {feature}
              </li>
            ))}
        </ul>
        <div className="mt-auto pt-5">
          {isCurrent ? (
            <p className="text-center text-xs text-secondary-text">
              {scheduled ? `Ends on ${renews}` : `Renews on ${renews}`}
            </p>
          ) : isUpgrade ? (
            <Button asChild className="w-full rounded-xl">
              <Link href={`/billing/checkout?plan=${plan.id}`}>
                <Sparkles aria-hidden />
                Upgrade to {plan.name}
              </Link>
            </Button>
          ) : (
            <DowngradeButton scheduled={scheduled === plan.id} endsOn={renews} />
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {header}

      {changed && current && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green/30 bg-soft-green/60 px-4 py-3 text-sm text-primary-text dark:bg-green/10"
        >
          <BadgeCheck className="size-4 shrink-0 text-green" aria-hidden />
          You&apos;re on {current.name} now. Everything it includes is unlocked.
        </p>
      )}
      {scheduled && (
        <p className="flex items-center gap-2 rounded-xl bg-warning-soft px-4 py-3 text-sm text-primary-text dark:bg-warning/10">
          <CalendarClock className="size-4 shrink-0 text-warning" aria-hidden />
          You&apos;re moving to Starter on {renews}. Until then you keep everything in Pro.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {plans
          .filter((p) => !p.sales_led && p.price !== null)
          .map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
      </div>

      <section aria-labelledby="usage" className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]">
        <h2 id="usage" className="text-sm font-semibold text-primary-text">
          This month
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {usage.map(({ icon: Icon, label, value, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="block rounded-xl bg-soft px-3 py-3 transition-colors hover:bg-soft-green dark:bg-white/[0.04] dark:hover:bg-green/10"
              >
                <Icon className="size-4 text-green-dark" aria-hidden />
                <p className="mt-2 text-lg font-bold text-primary-text">{value}</p>
                <p className="text-xs text-secondary-text">{label}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="payments"
        className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
      >
        <h2 id="payments" className="text-sm font-semibold text-primary-text">
          Payments
        </h2>
        {payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments yet"
            description="Your payments and receipts appear here."
            className="mt-3 border-0 py-6"
          />
        ) : (
          <ul className="mt-2 divide-y">
            {payments.map((payment) => (
              <li key={payment.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
                <span className="min-w-28 font-medium text-primary-text">{day(payment.created_at)}</span>
                <span className="text-secondary-text">{METHOD[payment.method]}</span>
                <span className="text-xs text-subtle-text">Ref {payment.provider_reference}</span>
                <span className="ml-auto flex items-center gap-3">
                  <span
                    className={
                      payment.status === "succeeded"
                        ? "text-xs font-semibold text-green-dark"
                        : "text-xs font-semibold text-danger"
                    }
                  >
                    {payment.status === "succeeded" ? "Paid" : "Failed"}
                  </span>
                  <span className="font-semibold text-primary-text tabular-nums">
                    {price(payment.amount, payment.currency)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-secondary-text">
          Need a refund or a receipt with your institution&apos;s details?{" "}
          <Link href="/contact" className="font-medium text-green-dark hover:underline">
            Contact us
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
