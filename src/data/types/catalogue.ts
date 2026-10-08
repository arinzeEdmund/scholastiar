import type { DegreeLevel, DocumentType } from "./candidate";

// Study catalogue — DATABASE/db.md → Study Catalogue Tables, SERVICES/21-study-catalogue.md.

export type ProgramLevel =
  | "foundation"
  | "diploma"
  | "bachelors"
  | "medicine"
  | "postgraduate_diploma"
  | "masters"
  | "doctorate"
  | "language_course"
  | "short_course";

export type StudyMode = "on_campus" | "online" | "blended";

/** verified: from the institution or funder. checked: reviewed against the official site. */
export type VerificationState = "verified" | "checked" | "unverified" | "outdated";

export type ApplyRoute = "hosted" | "partner" | "official";

export type CatalogueItemType = "program" | "university" | "scholarship";

/** opportunity_type in saved_opportunities and the board tables. */
export type SavedOpportunityType = "job" | CatalogueItemType;

export type ListingStatus = "draft" | "published" | "archived";

/** universities */
export interface University {
  id: string;
  slug: string;
  name: string;
  /** Initials for the logo tile until real logos exist. */
  short_name: string;
  country_iso2: string;
  city: string;
  institution_type: "university" | "college" | "institute";
  description: string;
  founded_year: number | null;
  international_students: number | null;
  official_website: string;
  is_partner: boolean;
  verification_state: VerificationState;
  last_verified_at: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

/** university_programs */
export interface UniversityProgram {
  id: string;
  university_id: string;
  slug: string;
  name: string;
  level: ProgramLevel;
  /** MSc, BEng, PhD, PGDip… */
  award: string;
  field_slug: string;
  field_name: string;
  study_mode: StudyMode;
  attendance: "full_time" | "part_time";
  duration_months: number;
  language_of_instruction: string;
  tuition_amount: number;
  tuition_currency: string;
  tuition_period: "year" | "total" | "semester";
  application_fee_amount: number | null;
  minimum_qualification: DegreeLevel;
  english_tests_accepted: string[];
  entrance_exam_required: boolean;
  description: string;
  official_url: string;
  verification_state: VerificationState;
  last_verified_at: string;
  next_check_at: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

/** program_intakes */
export interface ProgramIntake {
  id: string;
  program_id: string;
  intake_month: number;
  intake_year: number;
  application_opens_at: string | null;
  application_deadline: string;
}

/** program_requirements */
export interface ProgramRequirement {
  id: string;
  program_id: string;
  requirement_type: "document" | "test" | "academic" | "other";
  label: string;
  details: string | null;
  /** For document requirements: the vault document type that satisfies it. */
  document_type: DocumentType | null;
  required: boolean;
  sort_order: number;
}

export type ScholarshipCoverage = "tuition" | "stipend" | "travel" | "accommodation" | "health_insurance";

/** scholarships (catalogue fields; application fields arrive with the Scholarships stage) */
export interface Scholarship {
  id: string;
  slug: string;
  name: string;
  funder_name: string;
  funder_type: "government" | "university" | "foundation";
  host_country_iso2: string;
  coverage: ScholarshipCoverage[];
  fully_funded: boolean;
  amount_summary: string;
  /** ISO codes, or empty for every nationality. */
  eligible_nationalities: string[];
  eligible_levels: ProgramLevel[];
  application_deadline: string;
  description: string;
  official_url: string;
  verification_state: VerificationState;
  last_verified_at: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

/** scholarship_links */
export interface ScholarshipLink {
  id: string;
  scholarship_id: string;
  link_type: "program" | "university" | "country";
  program_id: string | null;
  university_id: string | null;
  country_iso2: string | null;
}

/** application_routes — one active route per programme or scholarship. */
export interface ApplicationRouteRecord {
  id: string;
  target_type: "program" | "scholarship";
  target_id: string;
  route: ApplyRoute;
  official_apply_url: string | null;
  active: boolean;
  updated_at: string;
}

/** saved_opportunities */
export interface SavedOpportunity {
  id: string;
  user_id: string;
  opportunity_type: SavedOpportunityType;
  opportunity_id: string;
  status: "saved";
  created_at: string;
}

export type BoardKey = "ai_apply_agent" | "apply_for_me";

/** ai_apply_board_items and apply_for_me_board_items, unified for the UI. */
export interface BoardItem {
  id: string;
  board: BoardKey;
  user_id: string;
  opportunity_type: SavedOpportunityType;
  opportunity_id: string;
  status: "due" | "open";
  created_at: string;
}

// Joined view models the catalogue repository returns (one query in Phase B).

export interface ProgramEntry {
  type: "program";
  program: UniversityProgram;
  university: University;
  intakes: ProgramIntake[];
  requirements: ProgramRequirement[];
  route: ApplyRoute;
  scholarship_count: number;
}

export interface UniversityEntry {
  type: "university";
  university: University;
  program_count: number;
  tuition_from: { amount: number; currency: string } | null;
  levels: ProgramLevel[];
  next_deadline: string | null;
  scholarship_count: number;
}

export interface ScholarshipEntry {
  type: "scholarship";
  scholarship: Scholarship;
  route: ApplyRoute;
  /** Programmes this scholarship is linked to (directly or through their university). */
  program_count: number;
}

export type CatalogueEntry = ProgramEntry | UniversityEntry | ScholarshipEntry;
