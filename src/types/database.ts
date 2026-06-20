// Hand-authored DB types — replace with generated types once Supabase CLI is connected.

export type PrimaryRole = 'candidate' | 'employer' | 'admin';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  primary_role: PrimaryRole;
  timezone: string | null;
  locale: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CandidateProfile {
  id: string;
  user_id: string;
  preferred_name: string | null;
  headline: string | null;
  professional_summary: string | null;
  phone: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  nationality: string | null;
  date_of_birth: string | null;
  current_location_country: string | null;
  current_location_city: string | null;
  languages: string[];
  profile_visibility: 'private' | 'employers' | 'public';
  profile_completion_score: number;
  created_at: string;
  updated_at: string;
}

export interface CandidateVisaProfile {
  id: string;
  candidate_profile_id: string;
  passport_country: string | null;
  current_visa_status: string | null;
  needs_sponsorship: boolean;
  willing_to_relocate: boolean;
  target_countries: string[];
  work_authorization_notes: string | null;
  relocation_preferences: Record<string, unknown>;
  updated_at: string;
}

export interface EducationRecord {
  id: string;
  candidate_profile_id: string;
  institution_name: string;
  country: string | null;
  degree_level: string | null;
  field_of_study: string | null;
  qualification_name: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  grade: string | null;
  description: string | null;
}

export interface WorkExperience {
  id: string;
  candidate_profile_id: string;
  company_name: string;
  job_title: string;
  country: string | null;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  responsibilities: string | null;
  achievements: string | null;
  tools_used: string[];
  industry: string | null;
}

export interface CandidateSkill {
  id: string;
  candidate_profile_id: string;
  skill_name: string;
  skill_type: 'technical' | 'soft' | 'language' | 'tool' | 'certification' | 'other';
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
  years_experience: number | null;
  source: 'manual' | 'cv_import' | 'ai_detected';
}

export interface CareerPreferences {
  id: string;
  candidate_profile_id: string;
  target_roles: string[];
  industries: string[];
  seniority_levels: string[];
  salary_min: number | null;
  salary_currency: string;
  work_modes: string[];
  target_countries: string[];
  preferred_job_types: string[];
}

export type SponsorshipStatus =
  | 'available'
  | 'not_available'
  | 'open_to_discussion'
  | 'work_authorization_required'
  | 'unknown';

export type WorkMode = 'on_site' | 'remote' | 'hybrid';

export type JobStatus =
  | 'draft'
  | 'pending_review'
  | 'active'
  | 'paused'
  | 'closed'
  | 'rejected'
  | 'archived';

export interface EmployerCompany {
  id: string;
  name: string;
  slug: string | null;
  website_url: string | null;
  industry: string | null;
  company_size: string | null;
  headquarters_country: string | null;
  headquarters_city: string | null;
  description: string | null;
  sponsorship_policy: SponsorshipStatus;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  employer_company_id: string;
  title: string;
  slug: string | null;
  description: string;
  employment_type: string;
  seniority_level: string | null;
  work_mode: WorkMode;
  country: string | null;
  city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_disclosed: boolean;
  application_deadline: string | null;
  status: JobStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobSponsorshipMetadata {
  id: string;
  job_id: string;
  sponsorship_status: SponsorshipStatus;
  relocation_support_available: boolean;
  open_to_international_applicants: boolean;
  target_visa_types: string[];
  sponsorship_countries: string[];
  notes: string | null;
  employer_confirmed: boolean;
}

export interface JobRequirement {
  id: string;
  job_id: string;
  requirement_type: string;
  requirement_text: string;
  importance: 'required' | 'preferred' | 'nice_to_have';
}

// Joined type for list/detail views
export interface JobWithDetails extends Job {
  employer_companies: Pick<EmployerCompany, 'id' | 'name' | 'slug' | 'verification_status' | 'sponsorship_policy' | 'headquarters_country'>;
  job_sponsorship_metadata: JobSponsorshipMetadata | null;
  job_requirements: JobRequirement[];
}

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };
