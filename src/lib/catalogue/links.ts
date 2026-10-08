import type { CatalogueEntry } from "@/data/types";

/** Candidate sign-up that returns the visitor to `next` once set up (wired in U6). */
export function signUpHref(next: string): string {
  return `/auth/sign-up/candidate?next=${encodeURIComponent(next)}`;
}

/** Public page for a catalogue entry (ROUTES.md → Universities, Scholarships). */
export function entryHref(entry: CatalogueEntry): string {
  switch (entry.type) {
    case "program":
      return `/universities/${entry.university.slug}/programs/${entry.program.slug}`;
    case "university":
      return `/universities/${entry.university.slug}`;
    case "scholarship":
      return `/scholarships/${entry.scholarship.slug}`;
  }
}

export function entryRef(entry: CatalogueEntry): { type: CatalogueEntry["type"]; id: string } {
  switch (entry.type) {
    case "program":
      return { type: "program", id: entry.program.id };
    case "university":
      return { type: "university", id: entry.university.id };
    case "scholarship":
      return { type: "scholarship", id: entry.scholarship.id };
  }
}

const regions = new Intl.DisplayNames(["en"], { type: "region" });

export function countryName(iso2: string): string {
  try {
    return regions.of(iso2) ?? iso2;
  } catch {
    return iso2;
  }
}

export function formatDeadline(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatIntake(month: number, year: number): string {
  return `${MONTHS[month - 1]} ${year}`;
}

export function formatDuration(months: number): string {
  if (months < 12) return months === 1 ? "1 month" : `${months} months`;
  const years = months / 12;
  return Number.isInteger(years) ? `${years} year${years === 1 ? "" : "s"}` : `${years.toFixed(1)} years`;
}

/** Where a signed-in student starts applying (ROUTES.md). Every route begins on Scholastiar. */
export function applyHref(entry: CatalogueEntry): string {
  if (entry.type === "scholarship") return `/scholarships/${entry.scholarship.slug}/apply`;
  const university = entry.university;
  return entry.type === "program"
    ? `/universities/${university.slug}/apply?program=${entry.program.slug}`
    : `/universities/${university.slug}/apply`;
}
