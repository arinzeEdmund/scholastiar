// Shaped after STRUCTURE/DATABASE/db.md → Candidate Tables, Notifications Tables and
// Documents And Media Tables. Country references use ISO 3166-1 alpha-2 codes in Phase A.

export type LanguageLevel = "basic" | "conversational" | "fluent" | "native";

export interface CandidateLanguage {
  name: string;
  level: LanguageLevel;
}

/** Tone the AI uses when drafting CVs and application answers for this candidate. */
export type CommunicationStyle = "concise" | "warm" | "formal";

export type ProfileVisibility = "private" | "employers" | "public";

/** candidate_profiles */
export interface CandidateProfile {
  id: string;
  user_id: string;
  preferred_name: string | null;
  headline: string | null;
  professional_summary: string | null;
  date_of_birth: string | null;
  nationality_country_code: string | null;
  current_country_code: string | null;
  current_city: string | null;
  phone: string | null;
  languages: CandidateLanguage[];
  communication_style: CommunicationStyle;
  profile_visibility: ProfileVisibility;
  website_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  created_at: string;
  updated_at: string;
}

export const ONBOARDING_STEPS = [
  "personal",
  "visa",
  "education",
  "experience",
  "skills",
  "preferences",
  "personality-cv",
  "review",
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

/** candidate_onboarding_sessions */
export interface OnboardingSession {
  id: string;
  user_id: string;
  current_step: OnboardingStep;
  completed_steps: OnboardingStep[];
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type StudyStatus = "incoming" | "studying" | "graduated";
export type PermitStatus = "none" | "planning" | "applying" | "holding";
export type SponsorshipNeed = "yes" | "no" | "unsure";
export type RelocationWillingness = "yes" | "maybe" | "no";

/** candidate_visa_profiles — recorded by the candidate from their own visa documents. */
export interface CandidateVisaProfile {
  id: string;
  user_id: string;
  passport_country_code: string | null;
  study_status: StudyStatus | null;
  study_country_code: string | null;
  institution_name: string | null;
  course_start_date: string | null;
  course_end_date: string | null;
  current_visa_status: string | null;
  term_time_weekly_hour_limit: number | null;
  holiday_work_allowed: boolean | null;
  work_restrictions_notes: string | null;
  post_study_permit_type_id: string | null;
  post_study_permit_status: PermitStatus;
  post_study_permit_expiry_date: string | null;
  needs_sponsorship_after_study: SponsorshipNeed | null;
  countries_lived_in: string[];
  target_country_codes: string[];
  relocation_willingness: RelocationWillingness | null;
  updated_at: string;
}

/** post_study_permit_types — reference data with an official source and review date. */
export interface PostStudyPermitType {
  id: string;
  country_code: string;
  name: string;
  official_url: string | null;
  reviewed_at: string;
}

export type DegreeLevel = "secondary" | "diploma" | "bachelors" | "masters" | "doctorate" | "professional" | "other";

/** education_records */
export interface EducationRecord {
  id: string;
  user_id: string;
  institution_name: string;
  country_code: string | null;
  degree_level: DegreeLevel;
  qualification_name: string;
  field_of_study: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  grade: string | null;
  description: string | null;
  sort_order: number;
}

/** work_experiences */
export interface WorkExperience {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  country_code: string | null;
  city: string | null;
  employment_type: EmploymentType;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  responsibilities: string | null;
  achievements: string[];
  tools_used: string[];
  industry: string | null;
  sort_order: number;
}

export type EmploymentType = "full_time" | "part_time" | "internship" | "volunteer" | "freelance" | "placement";

export type SkillType = "technical" | "tool" | "soft" | "language" | "domain";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

/** candidate_skills */
export interface CandidateSkill {
  id: string;
  user_id: string;
  skill_name: string;
  skill_type: SkillType;
  proficiency_level: SkillLevel;
  years_experience: number | null;
  source: "manual" | "onboarding" | "cv_import";
}

/** certifications */
export interface Certification {
  id: string;
  user_id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_url: string | null;
}

export type CandidateGoal = "study" | "funding" | "student_jobs" | "post_study_jobs";
export type StudentJobType = "part_time" | "holiday" | "campus" | "internship_placement";
export type WorkMode = "on_site" | "hybrid" | "remote";

/** career_preferences */
export interface CareerPreferences {
  id: string;
  user_id: string;
  goals: CandidateGoal[];
  target_roles: string[];
  industries: string[];
  job_tracks: ("student" | "post_study")[];
  preferred_student_job_types: StudentJobType[];
  max_weekly_hours: number | null;
  pay_min: number | null;
  pay_currency: string;
  pay_period: "hour" | "year";
  work_modes: WorkMode[];
  target_country_codes: string[];
  earliest_start_date: string | null;
  updated_at: string;
}

export type DocumentType =
  | "cv"
  | "cover_letter"
  | "transcript"
  | "certificate"
  | "passport"
  | "visa"
  | "reference_letter"
  | "work_sample"
  | "other";

/** documents — metadata for files in storage. Private by default. */
export interface CandidateDocument {
  id: string;
  owner_user_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  document_type: DocumentType;
  visibility: "private" | "applications";
  tags: string[];
  /** Phase A only: small files are kept inline so preview and download work without storage. */
  mock_data_url: string | null;
  created_at: string;
  updated_at: string;
}

export type NotificationChannel = "email" | "whatsapp" | "in_app" | "push";
export type NotificationCategory =
  | "deadlines"
  | "application_updates"
  | "messages"
  | "new_matches"
  | "profile_activity"
  | "account_security"
  | "billing"
  | "product_news";

/** notification_preferences */
export interface NotificationPreference {
  id: string;
  user_id: string;
  channel: NotificationChannel;
  notification_type: NotificationCategory;
  enabled: boolean;
}
