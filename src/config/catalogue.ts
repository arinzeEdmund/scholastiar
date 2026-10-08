import type { ApplyRoute, ProgramLevel, ScholarshipCoverage, StudyMode, VerificationState } from "@/data/types";

// Study catalogue labels and tabs — SERVICES/21-study-catalogue.md → Category Tabs.

export const PROGRAM_LEVELS: Record<ProgramLevel, { label: string; tab: string }> = {
  foundation: { label: "Foundation", tab: "Foundation" },
  diploma: { label: "Diploma", tab: "Diploma" },
  bachelors: { label: "Bachelor's", tab: "Bachelor's" },
  medicine: { label: "Medicine", tab: "Medicine" },
  postgraduate_diploma: { label: "PGD / PGCert", tab: "PGD / PGCert" },
  masters: { label: "Master's", tab: "Master's" },
  doctorate: { label: "PhD", tab: "PhD" },
  language_course: { label: "Language course", tab: "Language courses" },
  short_course: { label: "Short course", tab: "Short courses" },
};

export const CATALOGUE_TABS = [
  "all",
  "foundation",
  "diploma",
  "bachelors",
  "medicine",
  "postgraduate_diploma",
  "masters",
  "doctorate",
  "language_course",
  "short_course",
  "universities",
  "scholarships",
] as const;

export type CatalogueTab = (typeof CATALOGUE_TABS)[number];

export function tabLabel(tab: CatalogueTab): string {
  if (tab === "all") return "All";
  if (tab === "universities") return "Universities";
  if (tab === "scholarships") return "Scholarships";
  return PROGRAM_LEVELS[tab].tab;
}

export const STUDY_MODES: Record<StudyMode, string> = {
  on_campus: "On campus",
  online: "Online",
  blended: "Blended",
};

export const COVERAGE_LABELS: Record<ScholarshipCoverage, string> = {
  tuition: "Tuition",
  stipend: "Stipend",
  travel: "Travel",
  accommodation: "Accommodation",
  health_insurance: "Health insurance",
};

export const VERIFICATION_LABELS: Record<VerificationState, string> = {
  verified: "Verified by the university",
  checked: "Checked against official source",
  unverified: "Not yet reviewed",
  outdated: "Due for re-check",
};

export const APPLY_ROUTE_LABELS: Record<ApplyRoute, { button: string; note: string }> = {
  hosted: { button: "Apply on Scholastiar", note: "You apply here, with your profile and documents." },
  partner: { button: "Apply with Scholastiar", note: "You prepare and approve; we submit it for you." },
  official: {
    button: "Prepare and apply",
    note: "Prepare here, then finish on the official application page.",
  },
};

export const CATALOGUE_SORTS = {
  relevance: "Most relevant",
  fit: "Best fit for you",
  deadline: "Deadline soonest",
  tuition: "Tuition low to high",
  updated: "Recently checked",
} as const;

export type CatalogueSort = keyof typeof CATALOGUE_SORTS;
