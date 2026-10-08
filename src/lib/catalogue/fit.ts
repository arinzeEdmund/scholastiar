import type { CandidateBundle } from "@/data/repositories/candidate";
import type { DegreeLevel, ProgramEntry, ProgramRequirement, ScholarshipEntry } from "@/data/types";

// Fit score and document readiness for one candidate (SERVICES/21-study-catalogue.md).
// The score is an estimate from the candidate's own profile, never a promise of admission
// or funding, and always comes with the factors that produced it.

export interface FitFactor {
  label: string;
  effect: "plus" | "minus" | "neutral";
}

export interface Fit {
  score: number;
  factors: FitFactor[];
}

const RANK: Record<DegreeLevel, number> = {
  secondary: 1,
  diploma: 2,
  bachelors: 3,
  professional: 3,
  masters: 4,
  doctorate: 5,
  other: 1,
};

const LANGUAGE_RANK = { basic: 1, conversational: 2, fluent: 3, native: 4 } as const;

const clamp = (n: number) => Math.max(20, Math.min(96, Math.round(n)));
const today = () => new Date().toISOString().slice(0, 10);

function highestLevel(bundle: CandidateBundle): DegreeLevel | null {
  const levels = bundle.education.filter((e) => !e.is_current).map((e) => e.degree_level);
  if (levels.length === 0) return bundle.education.length ? "secondary" : null;
  return levels.sort((a, b) => RANK[b] - RANK[a])[0];
}

function languageLevel(bundle: CandidateBundle, language: string) {
  const found = bundle.profile.languages.find((l) => l.name.toLowerCase() === language.toLowerCase());
  return found ? LANGUAGE_RANK[found.level] : 0;
}

function targets(bundle: CandidateBundle): Set<string> {
  return new Set([...bundle.preferences.target_country_codes, ...bundle.visa.target_country_codes]);
}

export interface ReadinessItem {
  requirement: ProgramRequirement;
  status: "ready" | "missing" | "later";
}

export interface Readiness {
  items: ReadinessItem[];
  ready: number;
  /** Requirements a document in the vault can satisfy. */
  total: number;
}

/** Which required documents the candidate already has in their vault. */
export function readinessFor(requirements: ProgramRequirement[], bundle: CandidateBundle | null): Readiness {
  const have = new Set(bundle?.documents.map((d) => d.document_type) ?? []);
  const items = requirements.map((requirement): ReadinessItem => {
    if (!requirement.document_type || requirement.requirement_type !== "document") {
      return {
        requirement,
        status:
          requirement.requirement_type === "test" && requirement.document_type && have.has(requirement.document_type)
            ? "ready"
            : "later",
      };
    }
    return { requirement, status: have.has(requirement.document_type) ? "ready" : "missing" };
  });
  const documents = items.filter((i) => i.requirement.requirement_type === "document");
  return { items, ready: documents.filter((i) => i.status === "ready").length, total: documents.length };
}

export function programFit(entry: ProgramEntry, bundle: CandidateBundle): Fit {
  const { program, university } = entry;
  const factors: FitFactor[] = [];
  let score = 60;

  const level = highestLevel(bundle);
  if (!level) {
    factors.push({ label: "Add your education to check the entry level", effect: "neutral" });
    score -= 5;
  } else if (RANK[level] >= RANK[program.minimum_qualification]) {
    factors.push({ label: "You have the qualification it asks for", effect: "plus" });
    score += 15;
  } else {
    factors.push({ label: "It asks for a higher qualification than you have", effect: "minus" });
    score -= 25;
  }

  const studied = bundle.education.map((e) => e.field_of_study.toLowerCase()).join(" ");
  const fieldWords = program.field_name.toLowerCase().split(/\s+/);
  const specialist = ["masters", "doctorate", "postgraduate_diploma"].includes(program.level);
  if (studied && fieldWords.some((w) => w.length > 3 && studied.includes(w))) {
    factors.push({ label: `Your studies match ${program.field_name.toLowerCase()}`, effect: "plus" });
    score += 12;
  } else if (specialist) {
    factors.push({ label: "Your previous studies are in a different field", effect: "minus" });
    score -= 8;
  }

  const language = program.language_of_instruction;
  const speaks = languageLevel(bundle, language);
  if (speaks >= 3) {
    factors.push({ label: `You're fluent in ${language}, the teaching language`, effect: "plus" });
    score += 8;
  } else if (program.level === "language_course") {
    factors.push({ label: `This course teaches ${language}`, effect: "neutral" });
  } else if (speaks === 2) {
    factors.push({ label: `Your ${language} may need a test or preparatory year`, effect: "neutral" });
  } else {
    factors.push({ label: `Taught in ${language}, which isn't on your profile`, effect: "minus" });
    score -= language === "English" ? 10 : 15;
  }

  if (targets(bundle).has(university.country_iso2)) {
    factors.push({ label: "In a country you're aiming for", effect: "plus" });
    score += 8;
  }

  const readiness = readinessFor(entry.requirements, bundle);
  if (readiness.total > 0) {
    const share = readiness.ready / readiness.total;
    factors.push({
      label: `${readiness.ready} of ${readiness.total} documents ready`,
      effect: share >= 0.5 ? "plus" : "minus",
    });
    score += Math.round(share * 10) - 4;
  }

  if (!entry.intakes.some((i) => i.application_deadline >= today())) {
    factors.push({ label: "Closed for this intake", effect: "minus" });
    score -= 15;
  }

  if (entry.scholarship_count > 0 && bundle.preferences.goals.includes("funding")) {
    factors.push({ label: "Scholarships can fund it", effect: "plus" });
    score += 5;
  }

  return { score: clamp(score), factors };
}

export function scholarshipFit(entry: ScholarshipEntry, bundle: CandidateBundle): Fit {
  const { scholarship } = entry;
  const factors: FitFactor[] = [];
  let score = 62;

  const nationality = bundle.profile.nationality_country_code;
  if (scholarship.eligible_nationalities.length === 0) {
    factors.push({ label: "Open to every nationality", effect: "plus" });
    score += 6;
  } else if (nationality && scholarship.eligible_nationalities.includes(nationality)) {
    factors.push({ label: "Your nationality is eligible", effect: "plus" });
    score += 15;
  } else {
    factors.push({
      label: nationality ? "Your nationality isn't eligible" : "Add your nationality to check eligibility",
      effect: nationality ? "minus" : "neutral",
    });
    score -= nationality ? 35 : 5;
  }

  if (targets(bundle).has(scholarship.host_country_iso2)) {
    factors.push({ label: "In a country you're aiming for", effect: "plus" });
    score += 8;
  }
  if (scholarship.fully_funded) {
    factors.push({ label: "Fully funded", effect: "plus" });
    score += 4;
  }
  if (scholarship.application_deadline < today()) {
    factors.push({ label: "The deadline has passed", effect: "minus" });
    score -= 20;
  }
  if (bundle.preferences.goals.includes("funding")) score += 4;

  return { score: clamp(score), factors };
}

/** Rough time to apply, shown as an effort label on cards. */
export function effortMinutes(entry: ProgramEntry | ScholarshipEntry, readiness?: Readiness): number {
  const base = entry.route === "hosted" ? 15 : entry.route === "partner" ? 25 : 45;
  const missing = readiness ? readiness.total - readiness.ready : 0;
  return base + missing * 10;
}

export function effortLabel(minutes: number): string {
  return minutes < 60
    ? `About ${Math.round(minutes / 5) * 5} min to apply`
    : `About ${Math.round(minutes / 30) / 2} h to apply`;
}
