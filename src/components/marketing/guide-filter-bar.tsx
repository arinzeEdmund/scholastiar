import Link from "next/link";

import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_ICONS } from "@/config/opportunities";

import { ActiveChipScroller } from "./active-chip-scroller";
import type { ArticleCategory } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * Floating category filter for guides: icon, label and guide count per category.
 * Overlaps the bottom edge of the page header. Scrolls sideways on small screens.
 */
export function GuideFilterBar({
  active,
  counts,
}: {
  active?: ArticleCategory;
  /** Guides per category; omitted while counts are unavailable. */
  counts?: Partial<Record<ArticleCategory | "all", number>>;
}) {
  const filters: [ArticleCategory | undefined, string][] = [
    [undefined, "All guides"],
    ...(Object.entries(ARTICLE_CATEGORIES) as [ArticleCategory, string][]),
  ];

  return (
    <nav
      aria-label="Guide categories"
      className="relative rounded-2xl border bg-card/90 shadow-lg shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-card/80 dark:shadow-black/40"
    >
      {/* Edge fade hints that the row scrolls on small screens. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 rounded-r-2xl bg-gradient-to-l from-card to-transparent lg:hidden"
      />
      <ul className="relative flex scrollbar-none gap-1 overflow-x-auto p-1.5 [&::-webkit-scrollbar]:hidden">
        {filters.map(([value, label]) => {
          const isActive = value === active;
          const Icon = ARTICLE_CATEGORY_ICONS[value ?? "all"];
          const count = counts?.[value ?? "all"];
          return (
            <li key={label} className="shrink-0">
              <Link
                href={value ? `/blog?category=${value}` : "/blog"}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group inline-flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-medium whitespace-nowrap transition-all",
                  isActive
                    ? "bg-green-action text-white shadow-md shadow-green/30"
                    : "text-secondary-text hover:bg-soft hover:text-primary-text",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 transition-colors",
                    isActive ? "text-white" : "text-subtle-text group-hover:text-green-dark",
                  )}
                  aria-hidden
                />
                {label}
                {count !== undefined && (
                  <span
                    className={cn(
                      "min-w-5 rounded-full px-1.5 py-px text-center text-xs tabular-nums",
                      isActive ? "bg-white/20 text-white" : "bg-neutral-soft text-secondary-text",
                    )}
                  >
                    <span className="sr-only">(</span>
                    {count}
                    <span className="sr-only"> guides)</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <ActiveChipScroller label="Guide categories" />
    </nav>
  );
}
