"use client";

import { Bot, Check, Compass, FileCheck2, type LucideIcon, Minus, Sparkles, LifeBuoy } from "lucide-react";
import { Fragment, useState } from "react";

import { RouteButton } from "@/components/layout/route-button";
import type { ComparisonGroup, ComparisonValue, PlanComparisonRow } from "@/data/types";
import { cn } from "@/lib/utils";

export interface ComparisonPlan {
  id: string;
  name: string;
  price: string;
  ctaHref: string;
  featured: boolean;
}

const GROUPS: Record<ComparisonGroup, { label: string; icon: LucideIcon }> = {
  discover: { label: "Find and organise", icon: Compass },
  prepare: { label: "AI preparation", icon: Sparkles },
  apply: { label: "Applying and tracking", icon: Bot },
  portfolio: { label: "Signia and documents", icon: FileCheck2 },
  support: { label: "Support", icon: LifeBuoy },
};

const sameValue = (row: PlanComparisonRow, plans: ComparisonPlan[]) =>
  plans.every(
    (p) =>
      JSON.stringify(row.values[p.id as keyof typeof row.values]) ===
      JSON.stringify(row.values[plans[0].id as keyof typeof row.values]),
  );

function Value({ value, featured }: { value: ComparisonValue | undefined; featured?: boolean }) {
  if (value === true) {
    return (
      <span
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-full",
          featured ? "bg-green text-white" : "bg-soft-green text-green-dark",
        )}
      >
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (!value) {
    return (
      <span className="inline-flex size-6 items-center justify-center text-subtle-text">
        <Minus className="size-4" aria-hidden />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  return <span className={cn("text-sm font-medium", featured ? "text-green-dark" : "text-primary-text")}>{value}</span>;
}

function DifferenceToggle({ value, onChange }: { value: boolean; onChange: (next: boolean) => void }) {
  return (
    <div role="radiogroup" aria-label="Rows to show" className="inline-flex rounded-lg border bg-card p-1 text-sm">
      {[
        [false, "All features"],
        [true, "Only differences"],
      ].map(([option, label]) => (
        <button
          key={String(option)}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option as boolean)}
          className={cn(
            "h-8 rounded-md px-3 font-medium text-secondary-text transition-colors hover:text-primary-text",
            value === option && "bg-soft-green text-green-dark hover:text-green-dark",
          )}
        >
          {label as string}
        </button>
      ))}
    </div>
  );
}

/**
 * Pricing comparison: grouped features with plain-language descriptions and real values,
 * sticky plan headers with calls to action on desktop, and a plan switcher on mobile.
 */
export function PlanComparison({ plans, rows }: { plans: ComparisonPlan[]; rows: PlanComparisonRow[] }) {
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [mobilePlanId, setMobilePlanId] = useState(plans.find((p) => p.featured)?.id ?? plans[0]?.id);

  const visible = onlyDifferences ? rows.filter((r) => !sameValue(r, plans)) : rows;
  const groups = (Object.keys(GROUPS) as ComparisonGroup[])
    .map((group) => ({ group, rows: visible.filter((r) => r.group === group) }))
    .filter((g) => g.rows.length > 0);

  const featured = plans.find((p) => p.featured);
  const base = plans.find((p) => !p.featured);
  const extras = featured && base ? rows.filter((r) => !sameValue(r, plans)).length : 0;
  const mobilePlan = plans.find((p) => p.id === mobilePlanId) ?? plans[0];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-text">Compare plans in detail</h3>
          {featured && base && (
            <p className="mt-1 text-secondary-text">
              {featured.name} includes everything in {base.name}, plus {extras} upgrades.
            </p>
          )}
        </div>
        <DifferenceToggle value={onlyDifferences} onChange={setOnlyDifferences} />
      </div>

      {/* Desktop and tablet: sticky-header comparison table */}
      <div className="mt-6 hidden md:block">
        <table className="w-full border-separate border-spacing-0 text-left">
          <caption className="sr-only">Features included in each applicant plan</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky top-16 z-10 w-[46%] bg-background pr-4 pb-3 align-bottom">
                <span className="block text-sm font-semibold text-primary-text">What&apos;s included</span>
                <span className="mt-2 flex gap-4 text-xs font-normal text-secondary-text" aria-hidden>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-soft-green text-green-dark">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    Included
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Minus className="size-4 text-subtle-text" />
                    Not included
                  </span>
                </span>
              </th>
              {plans.map((plan) => (
                <th key={plan.id} scope="col" className="sticky top-16 z-10 bg-background px-1.5 pb-3 align-bottom">
                  <div
                    className={cn(
                      "rounded-xl border px-3.5 py-3 text-left",
                      plan.featured ? "grain border-white/10 aurora-dark text-white" : "bg-card",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-semibold">{plan.name}</span>
                      {plan.featured && (
                        <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[0.7rem] font-semibold text-mint">
                          Most complete
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5">
                      <span className="text-xl font-bold">{plan.price}</span>
                      <span className={cn("text-sm", plan.featured ? "text-white/70" : "text-secondary-text")}>
                        {" "}
                        /month
                      </span>
                    </p>
                    <RouteButton
                      href={plan.ctaHref}
                      size="sm"
                      variant={plan.featured ? "default" : "outline"}
                      className="mt-2 w-full"
                    >
                      Choose {plan.name}
                    </RouteButton>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map(({ group, rows: groupRows }) => {
              const { label, icon: Icon } = GROUPS[group];
              return (
                <Fragment key={group}>
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={plans.length + 1}
                      className="border-b pt-8 pb-3 text-left text-sm font-semibold text-primary-text"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-soft-green text-green-dark">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        {label}
                      </span>
                    </th>
                  </tr>
                  {groupRows.map((row) => (
                    <tr key={row.id} className="group/row">
                      <th scope="row" className="border-b py-3.5 pr-4 align-top font-normal">
                        <span className="block text-[0.95rem] font-medium text-primary-text">{row.label}</span>
                        <span className="mt-0.5 block text-sm text-secondary-text">{row.description}</span>
                      </th>
                      {plans.map((plan) => (
                        <td
                          key={plan.id}
                          className={cn(
                            "border-b px-1.5 py-3.5 text-center align-middle",
                            plan.featured && "bg-soft-green/40",
                          )}
                        >
                          <Value value={row.values[plan.id as keyof typeof row.values]} featured={plan.featured} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: choose a plan, then read its features as a list */}
      <div className="mt-6 md:hidden">
        <div role="tablist" aria-label="Plan" className="grid grid-cols-2 gap-2">
          {plans.map((plan) => {
            const active = plan.id === mobilePlan?.id;
            return (
              <button
                key={plan.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMobilePlanId(plan.id)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors",
                  active
                    ? plan.featured
                      ? "grain border-white/10 aurora-dark text-white"
                      : "border-green bg-card ring-1 ring-green"
                    : "bg-card text-secondary-text",
                )}
              >
                <span className="block text-sm font-semibold">{plan.name}</span>
                <span className="text-lg font-bold">{plan.price}</span>
                <span className="text-xs"> /month</span>
              </button>
            );
          })}
        </div>

        {mobilePlan && (
          <div role="tabpanel" aria-label={`${mobilePlan.name} features`} className="mt-4 space-y-6">
            {groups.map(({ group, rows: groupRows }) => {
              const { label, icon: Icon } = GROUPS[group];
              return (
                <section key={group}>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-primary-text">
                    <Icon className="size-4 text-green" aria-hidden />
                    {label}
                  </h4>
                  <ul className="mt-2 divide-y rounded-lg border bg-card">
                    {groupRows.map((row) => {
                      const value = row.values[mobilePlan.id as keyof typeof row.values];
                      const proOnly = !value && featured && featured.id !== mobilePlan.id;
                      return (
                        <li key={row.id} className={cn("flex items-start gap-3 p-3.5", !value && "opacity-70")}>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-primary-text">{row.label}</p>
                            <p className="mt-0.5 text-xs text-secondary-text">{row.description}</p>
                            {typeof value === "string" && (
                              <p className="mt-1 text-xs font-semibold text-green-dark">{value}</p>
                            )}
                          </div>
                          {proOnly ? (
                            <span className="shrink-0 rounded-full bg-neutral-soft px-2 py-0.5 text-[0.7rem] font-semibold text-secondary-text">
                              {featured.name} only
                            </span>
                          ) : (
                            typeof value !== "string" && <Value value={value} featured={mobilePlan.featured} />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
            <RouteButton
              href={mobilePlan.ctaHref}
              size="lg"
              variant={mobilePlan.featured ? "default" : "outline"}
              className="w-full"
            >
              Choose {mobilePlan.name} · {mobilePlan.price}/month
            </RouteButton>
          </div>
        )}
      </div>
    </div>
  );
}
