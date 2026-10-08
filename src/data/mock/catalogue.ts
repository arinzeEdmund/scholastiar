import "server-only";

import { CATALOGUE_TABS, type CatalogueTab } from "@/config/catalogue";
import type { MockDb } from "@/data/fixtures";
import type { CatalogueFacets, CatalogueRepository } from "@/data/repositories/catalogue";
import type {
  ApplyRoute,
  CatalogueEntry,
  ProgramEntry,
  Scholarship,
  ScholarshipEntry,
  University,
  UniversityEntry,
  UniversityProgram,
} from "@/data/types";
import { toUsd, yearlyTuitionUsd } from "@/lib/catalogue/money";
import type { CatalogueQuery } from "@/lib/catalogue/query";

import { readList, readOne, readSystem } from "./store";

const TRUST: Record<University["verification_state"], number> = { verified: 0, checked: 1, outdated: 2, unverified: 3 };

const today = () => new Date().toISOString().slice(0, 10);
const published = <T extends { status: string; verification_state: string }>(row: T) =>
  row.status === "published" && row.verification_state !== "unverified";

function routeOf(db: MockDb, targetId: string): ApplyRoute {
  return db.application_routes.find((r) => r.target_id === targetId && r.active)?.route ?? "official";
}

/** Scholarships that can fund a programme: linked to it, its university, or its country at its level. */
function scholarshipsFor(db: MockDb, program: UniversityProgram, university: University): Scholarship[] {
  return db.scholarships.filter((s) => {
    if (!published(s) || !s.eligible_levels.includes(program.level)) return false;
    return db.scholarship_links.some(
      (l) =>
        l.scholarship_id === s.id &&
        (l.program_id === program.id ||
          l.university_id === university.id ||
          (l.link_type === "country" && l.country_iso2 === university.country_iso2)),
    );
  });
}

function buildEntries(db: MockDb): CatalogueEntry[] {
  const universities = db.universities.filter(published);
  const uniById = new Map(universities.map((u) => [u.id, u]));
  const programs = db.university_programs.filter((p) => published(p) && uniById.has(p.university_id));

  const programEntries = programs.map((program): ProgramEntry => {
    const university = uniById.get(program.university_id)!;
    return {
      type: "program",
      program,
      university,
      intakes: db.program_intakes
        .filter((i) => i.program_id === program.id)
        .sort((a, b) => a.application_deadline.localeCompare(b.application_deadline)),
      requirements: db.program_requirements
        .filter((r) => r.program_id === program.id)
        .sort((a, b) => a.sort_order - b.sort_order),
      route: routeOf(db, program.id),
      scholarship_count: scholarshipsFor(db, program, university).length,
    };
  });

  const universityEntries = universities.map((university): UniversityEntry => {
    const own = programEntries.filter((e) => e.university.id === university.id);
    const cheapest = [...own].sort((a, b) => yearlyTuitionUsd(a.program) - yearlyTuitionUsd(b.program))[0];
    const deadlines = own
      .flatMap((e) => e.intakes.map((i) => i.application_deadline))
      .filter((d) => d >= today())
      .sort();
    return {
      type: "university",
      university,
      program_count: own.length,
      tuition_from: cheapest
        ? { amount: cheapest.program.tuition_amount, currency: cheapest.program.tuition_currency }
        : null,
      levels: [...new Set(own.map((e) => e.program.level))],
      next_deadline: deadlines[0] ?? null,
      scholarship_count: new Set(own.flatMap((e) => scholarshipsFor(db, e.program, university).map((s) => s.id))).size,
    };
  });

  const scholarshipEntries = db.scholarships.filter(published).map((scholarship): ScholarshipEntry => ({
    type: "scholarship",
    scholarship,
    route: routeOf(db, scholarship.id),
    program_count: programEntries.filter((e) => scholarshipsFor(db, e.program, e.university).includes(scholarship))
      .length,
  }));

  return [...programEntries, ...universityEntries, ...scholarshipEntries];
}

function countryOf(entry: CatalogueEntry) {
  return entry.type === "scholarship" ? entry.scholarship.host_country_iso2 : entry.university.country_iso2;
}

function textOf(entry: CatalogueEntry): string {
  switch (entry.type) {
    case "program":
      return [
        entry.program.name,
        entry.program.award,
        entry.program.field_name,
        entry.university.name,
        entry.university.city,
      ].join(" ");
    case "university":
      return [entry.university.name, entry.university.city, entry.university.description].join(" ");
    case "scholarship":
      return [entry.scholarship.name, entry.scholarship.funder_name, entry.scholarship.description].join(" ");
  }
}

function relevance(entry: CatalogueEntry, terms: string[]): number {
  if (terms.length === 0) return 0;
  const text = textOf(entry).toLowerCase();
  const title = (
    entry.type === "program"
      ? entry.program.name
      : entry.type === "university"
        ? entry.university.name
        : entry.scholarship.name
  ).toLowerCase();
  return terms.reduce((score, t) => score + (title.includes(t) ? 3 : 0) + (text.includes(t) ? 1 : 0), 0);
}

function nextDeadline(entry: CatalogueEntry): string | null {
  if (entry.type === "program")
    return entry.intakes.find((i) => i.application_deadline >= today())?.application_deadline ?? null;
  if (entry.type === "university") return entry.next_deadline;
  return entry.scholarship.application_deadline >= today() ? entry.scholarship.application_deadline : null;
}

function verification(entry: CatalogueEntry) {
  return entry.type === "scholarship"
    ? entry.scholarship.verification_state
    : entry.type === "program"
      ? entry.program.verification_state
      : entry.university.verification_state;
}

function matchesFilters(entry: CatalogueEntry, query: CatalogueQuery, db: MockDb, programs: ProgramEntry[]): boolean {
  const terms = query.q.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length && !terms.every((t) => textOf(entry).toLowerCase().includes(t))) return false;
  if (query.countries.length && !query.countries.includes(countryOf(entry))) return false;
  if (query.verifiedOnly && verification(entry) !== "verified") return false;
  if (query.openOnly && !nextDeadline(entry)) return false;

  if (entry.type === "program") {
    const p = entry.program;
    if (query.fields.length && !query.fields.includes(p.field_slug)) return false;
    if (query.modes.length && !query.modes.includes(p.study_mode)) return false;
    if (query.languages.length && !query.languages.includes(p.language_of_instruction)) return false;
    if (query.maxTuitionUsd && yearlyTuitionUsd(p) > query.maxTuitionUsd) return false;
    if (query.fundedOnly && !scholarshipsFor(db, p, entry.university).some((s) => s.fully_funded)) return false;
    return true;
  }
  if (entry.type === "university") {
    // A university matches when at least one of its programmes passes the programme filters.
    const own = programs.filter((e) => e.university.id === entry.university.id);
    if (
      query.fields.length ||
      query.modes.length ||
      query.languages.length ||
      query.maxTuitionUsd ||
      query.fundedOnly
    ) {
      return own.some((e) =>
        matchesFilters(
          { ...e },
          { ...query, q: "", countries: [], verifiedOnly: false, openOnly: false },
          db,
          programs,
        ),
      );
    }
    return true;
  }
  if (query.fundedOnly && !entry.scholarship.fully_funded) return false;
  return true;
}

function inTab(entry: CatalogueEntry, tab: CatalogueTab): boolean {
  if (tab === "all") return true;
  if (tab === "universities") return entry.type === "university";
  if (tab === "scholarships") return entry.type === "scholarship";
  return entry.type === "program" && entry.program.level === tab;
}

function tuitionUsd(entry: CatalogueEntry): number {
  if (entry.type === "program") return yearlyTuitionUsd(entry.program);
  if (entry.type === "university" && entry.tuition_from)
    return toUsd(entry.tuition_from.amount, entry.tuition_from.currency);
  return Number.MAX_SAFE_INTEGER;
}

function facetsOf(entries: CatalogueEntry[]): CatalogueFacets {
  const countries = new Map<string, number>();
  const fields = new Map<string, { name: string; count: number }>();
  const languages = new Map<string, number>();
  for (const entry of entries) {
    if (entry.type !== "program") continue;
    const code = entry.university.country_iso2;
    countries.set(code, (countries.get(code) ?? 0) + 1);
    const field = fields.get(entry.program.field_slug) ?? { name: entry.program.field_name, count: 0 };
    fields.set(entry.program.field_slug, { ...field, count: field.count + 1 });
    languages.set(
      entry.program.language_of_instruction,
      (languages.get(entry.program.language_of_instruction) ?? 0) + 1,
    );
  }
  return {
    countries: [...countries].map(([code, count]) => ({ code, count })).sort((a, b) => b.count - a.count),
    fields: [...fields].map(([slug, f]) => ({ slug, ...f })).sort((a, b) => a.name.localeCompare(b.name)),
    languages: [...languages].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
  };
}

export const mockCatalogueRepository: CatalogueRepository = {
  search: async (query) => {
    // readList honours the dev screen states (loading, empty, error).
    const [all, db] = await Promise.all([readList(buildEntries), readSystem((d) => d)]);
    const programs = all.filter((e): e is ProgramEntry => e.type === "program");
    const terms = query.q.toLowerCase().split(/\s+/).filter(Boolean);
    const matching = all.filter((e) => matchesFilters(e, query, db, programs));

    const tabCounts = Object.fromEntries(
      CATALOGUE_TABS.map((tab) => [tab, matching.filter((e) => inTab(e, tab)).length]),
    ) as Record<CatalogueTab, number>;

    const entries = matching
      .filter((e) => inTab(e, query.tab))
      .sort((a, b) => {
        if (query.sort === "deadline") return (nextDeadline(a) ?? "9999").localeCompare(nextDeadline(b) ?? "9999");
        if (query.sort === "tuition") return tuitionUsd(a) - tuitionUsd(b);
        if (query.sort === "updated") {
          const at = (e: CatalogueEntry) =>
            e.type === "scholarship"
              ? e.scholarship.last_verified_at
              : e.type === "program"
                ? e.program.last_verified_at
                : e.university.last_verified_at;
          return at(b).localeCompare(at(a));
        }
        return (
          relevance(b, terms) - relevance(a, terms) ||
          TRUST[verification(a)] - TRUST[verification(b)] ||
          (nextDeadline(a) ?? "9999").localeCompare(nextDeadline(b) ?? "9999")
        );
      });

    return { entries, tabCounts, facets: facetsOf(all) };
  },

  getProgramEntry: (programId) =>
    readOne((db) => {
      const entry = buildEntries(db).find((e) => e.type === "program" && e.program.id === programId);
      return (entry as ProgramEntry | undefined) ?? null;
    }),
};
