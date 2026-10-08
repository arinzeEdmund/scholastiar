import { Award, CalendarClock } from "lucide-react";
import Link from "next/link";

import { PROGRAM_LEVELS } from "@/config/catalogue";
import { isRouteReady } from "@/config/routes";
import type { CatalogueEntry } from "@/data/types";
import { countryName, entryHref, formatDeadline } from "@/lib/catalogue/links";
import { flag } from "@/lib/flags";
import { cn } from "@/lib/utils";

import { FitScore } from "./fit-score";
import type { CardViewerState } from "./opportunity-card";
import { SaveButton } from "./save-button";

const DAY = 24 * 60 * 60 * 1000;
const today = () => new Date().toISOString().slice(0, 10);

/** Next open deadline for an entry, or null when nothing is open. */
export function openDeadline(entry: CatalogueEntry): string | null {
  if (entry.type === "program")
    return entry.intakes.find((i) => i.application_deadline >= today())?.application_deadline ?? null;
  if (entry.type === "university") return entry.next_deadline;
  return entry.scholarship.application_deadline >= today() ? entry.scholarship.application_deadline : null;
}

export function daysLeft(date: string): number {
  return Math.ceil((new Date(`${date}T00:00:00Z`).getTime() - Date.now()) / DAY);
}

/** "Apply by 30 Nov 2026 · 53 days left" — amber inside 30 days, red inside 7. */
export function DeadlineChip({ date, className }: { date: string | null; className?: string }) {
  if (!date) {
    return <span className={cn("text-xs text-secondary-text", className)}>Closed for this intake</span>;
  }
  const days = daysLeft(date);
  const tone = days <= 7 ? "text-danger" : days <= 30 ? "text-warning" : "text-secondary-text";
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs whitespace-nowrap", tone, className)}>
      <CalendarClock className="size-3" aria-hidden />
      {formatDeadline(date)}
      <span className="font-semibold">· {days <= 0 ? "today" : `${days} day${days === 1 ? "" : "s"} left`}</span>
    </span>
  );
}

function titleOf(entry: CatalogueEntry) {
  return entry.type === "program"
    ? entry.program.name
    : entry.type === "university"
      ? entry.university.name
      : entry.scholarship.name;
}

function subtitleOf(entry: CatalogueEntry) {
  if (entry.type === "program") return `${entry.university.name} · ${entry.university.city}`;
  if (entry.type === "university") return `${entry.university.city}, ${countryName(entry.university.country_iso2)}`;
  return `${entry.scholarship.funder_name} · ${entry.scholarship.amount_summary}`;
}

function kindOf(entry: CatalogueEntry) {
  if (entry.type === "program") return `${PROGRAM_LEVELS[entry.program.level].label} · ${entry.program.award}`;
  if (entry.type === "university") return "University";
  return entry.scholarship.fully_funded ? "Scholarship · Fully funded" : "Scholarship";
}

function countryOf(entry: CatalogueEntry) {
  return entry.type === "scholarship" ? entry.scholarship.host_country_iso2 : entry.university.country_iso2;
}

/** Compact one-line opportunity for lists (dashboard matches, shortlist, saved). */
export function OpportunityRow({ entry, viewer }: { entry: CatalogueEntry; viewer: CardViewerState }) {
  const title = titleOf(entry);
  const href = entryHref(entry);
  const ref =
    entry.type === "program"
      ? entry.program.id
      : entry.type === "university"
        ? entry.university.id
        : entry.scholarship.id;
  return (
    <div className="group relative flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-soft sm:gap-4 dark:hover:bg-white/[0.04]">
      <span
        className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-soft-green text-xs font-bold text-green-dark ring-1 ring-green/15 dark:bg-green/15"
        aria-hidden
      >
        {entry.type === "scholarship" ? <Award className="size-4.5" /> : entry.university.short_name}
        <span className="absolute -right-1 -bottom-1 text-xs leading-none">{flag(countryOf(entry))}</span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.6875rem] font-semibold text-green-dark">{kindOf(entry)}</p>
        <p className="truncate text-sm font-semibold text-primary-text">
          {isRouteReady(href) ? (
            <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {title}
            </Link>
          ) : (
            title
          )}
        </p>
        <p className="truncate text-xs text-secondary-text">{subtitleOf(entry)}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 sm:hidden">
          <DeadlineChip date={openDeadline(entry)} />
          {viewer.fit && (
            <span className="text-xs font-semibold text-green-dark md:hidden">{viewer.fit.score}% fit</span>
          )}
        </div>
        {viewer.fit && (
          <p className="hidden text-xs font-semibold text-green-dark sm:block md:hidden">{viewer.fit.score}% fit</p>
        )}
      </div>
      <DeadlineChip date={openDeadline(entry)} className="hidden sm:inline-flex" />
      {viewer.fit && (
        <div className="relative z-10 hidden md:block">
          <FitScore fit={viewer.fit} />
        </div>
      )}
      <div className="relative z-10">
        <SaveButton type={entry.type} id={ref} name={title} saved={viewer.saved} signUpHref={viewer.signUpHref} />
      </div>
    </div>
  );
}
