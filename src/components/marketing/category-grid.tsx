import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { OPPORTUNITY_CATEGORIES, RELOCATION_CATEGORY } from "@/config/opportunities";
import { isRouteReady, routeStage } from "@/config/routes";

/** The public opportunity services plus Relocation. Categories without a built listing show when they arrive. */
export function CategoryGrid({ compact = false }: { compact?: boolean }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {[...OPPORTUNITY_CATEGORIES, RELOCATION_CATEGORY].map(({ label, description, href, icon: Icon }) => {
        const ready = isRouteReady(href);
        const body = (
          <>
            <span className="flex size-10 items-center justify-center rounded-lg bg-soft-green text-green-dark">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-primary-text sm:mt-4">
              {label}
              {ready ? (
                <ArrowRight
                  className="size-4 text-secondary-text transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              ) : (
                <span className="rounded-full bg-neutral-soft px-1.5 py-px text-[0.625rem] font-semibold tracking-wide text-secondary-text uppercase">
                  Soon
                </span>
              )}
            </span>
            {!compact && <span className="mt-1 hidden text-sm text-secondary-text sm:block">{description}</span>}
          </>
        );
        return (
          <li key={href}>
            {ready ? (
              <Link
                href={href}
                className="group flex h-full flex-col rounded-lg border bg-card p-4 transition-colors hover:border-green sm:p-5"
              >
                {body}
              </Link>
            ) : (
              <div
                className="flex h-full flex-col rounded-lg border bg-card p-4 sm:p-5"
                title={`${label} listings are built in stage ${routeStage(href) ?? "later"}`}
              >
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
