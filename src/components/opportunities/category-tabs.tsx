import Link from "next/link";

import { ActiveChipScroller } from "@/components/marketing/active-chip-scroller";
import { CATALOGUE_TABS, tabLabel, type CatalogueTab } from "@/config/catalogue";
import { catalogueSearch, type CatalogueQuery } from "@/lib/catalogue/query";
import { cn } from "@/lib/utils";

const LABEL = "Catalogue categories";

/**
 * Category tabs with counts (SERVICES/21-study-catalogue.md → Category Tabs). Plain links,
 * so every tab is a shareable, indexable address. Scrolls sideways on small screens.
 */
export function CategoryTabs({
  query,
  counts,
  basePath,
  hash = "",
}: {
  query: CatalogueQuery;
  counts: Record<CatalogueTab, number>;
  basePath: string;
  hash?: string;
}) {
  return (
    <nav aria-label={LABEL} className="relative rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 rounded-r-2xl bg-gradient-to-l from-card to-transparent"
      />
      <ul className="relative flex scrollbar-none gap-1 overflow-x-auto p-1.5 [&::-webkit-scrollbar]:hidden">
        {CATALOGUE_TABS.map((tab) => {
          const active = tab === query.tab;
          const count = counts[tab];
          return (
            <li key={tab} className="shrink-0">
              <Link
                href={`${basePath}${catalogueSearch({ ...query, tab })}${hash}`}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-green-action text-white shadow-md shadow-green/30"
                    : count === 0
                      ? "text-subtle-text hover:bg-soft"
                      : "text-secondary-text hover:bg-soft hover:text-primary-text dark:hover:bg-white/5",
                )}
              >
                {tabLabel(tab)}
                <span
                  className={cn(
                    "min-w-5 rounded-full px-1.5 py-px text-center text-xs tabular-nums",
                    active ? "bg-white/20 text-white" : "bg-neutral-soft text-secondary-text dark:bg-white/10",
                  )}
                >
                  <span className="sr-only">(</span>
                  {count}
                  <span className="sr-only"> results)</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <ActiveChipScroller label={LABEL} />
    </nav>
  );
}
