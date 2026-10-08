import { Check } from "lucide-react";

import { RouteButton } from "@/components/layout/route-button";
import type { Plan } from "@/data/types";
import { cn } from "@/lib/utils";

export function formatPlanPrice(plan: Plan) {
  if (plan.price === null) return null;
  if (plan.price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currency,
    maximumFractionDigits: 0,
  }).format(plan.price);
}

/** Pricing card. Prices and features come from plan records, never hardcoded (PRICING.md). */
export function PlanCard({
  plan,
  includedPlanName,
  highlighted = false,
  ctaLabel,
  ctaHref,
  featureLimit,
}: {
  plan: Plan;
  includedPlanName?: string;
  highlighted?: boolean;
  ctaLabel: string;
  ctaHref: string;
  featureLimit?: number;
}) {
  const price = formatPlanPrice(plan);
  const features = featureLimit ? plan.features.slice(0, featureLimit) : plan.features;

  // The featured plan is a dark card lit by a green glow (ux_ui_base.md → Atmosphere).
  const dark = highlighted;
  const strong = dark ? "text-white" : "text-primary-text";
  const muted = dark ? "text-white/70" : "text-secondary-text";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border p-6 sm:p-8",
        dark ? "grain border-white/10 aurora-dark text-white shadow-xl" : "bg-card",
      )}
      aria-labelledby={`plan-${plan.id}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 id={`plan-${plan.id}`} className={cn("text-lg font-semibold", strong)}>
          {plan.name}
        </h3>
        {dark && (
          <span className="rounded-full bg-mint/15 px-2.5 py-0.5 text-xs font-semibold text-mint">Most complete</span>
        )}
      </div>
      <p className={cn("mt-1 text-sm", muted)}>{plan.description}</p>
      <p className="mt-6 flex items-baseline gap-1">
        {price ? (
          <>
            <span className={cn("text-4xl font-bold", strong)}>{price}</span>
            {plan.price !== 0 && <span className={cn("text-sm", muted)}>/{plan.interval}</span>}
          </>
        ) : (
          <span className={cn("text-3xl font-bold", strong)}>{plan.sales_led ? "Custom" : "Price on request"}</span>
        )}
      </p>
      <RouteButton href={ctaHref} size="lg" variant={dark ? "default" : "outline"} className="mt-6 w-full">
        {ctaLabel}
      </RouteButton>
      <ul className="mt-6 space-y-2.5 text-sm">
        {includedPlanName && <li className={cn("font-medium", strong)}>Everything in {includedPlanName}, plus:</li>}
        {features.map((feature) => (
          <li key={feature} className={cn("flex gap-2", dark ? "text-white/80" : "text-secondary-text")}>
            <Check className={cn("mt-0.5 size-4 shrink-0", dark ? "text-mint" : "text-green")} aria-hidden />
            {feature}
          </li>
        ))}
        {featureLimit && plan.features.length > featureLimit && (
          <li className={muted}>and {plan.features.length - featureLimit} more</li>
        )}
      </ul>
    </article>
  );
}
