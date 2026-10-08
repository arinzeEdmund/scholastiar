// Shaped after STRUCTURE/DATABASE/db.md → Shared Core Tables (user_profiles, user_roles).

export type PlatformRole =
  | "candidate"
  | "employer_owner"
  | "employer_admin"
  | "recruiter"
  | "hiring_manager"
  | "employer_viewer"
  | "provider_owner"
  | "provider_admin"
  | "provider_member"
  | "forwarder"
  | "office_staff"
  | "partner_agency_member"
  | "support_admin"
  | "moderation_admin"
  | "billing_admin"
  | "platform_admin"
  | "super_admin";

/** user_profiles.primary_role — which product surface a user lands in. */
export type PrimaryRole = "candidate" | "employer" | "provider" | "forwarder" | "office" | "partner_agency" | "admin";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  headline: string | null;
  primary_role: PrimaryRole;
  /** Organisation the user acts for (employer company, provider, office, agency). */
  organization_name: string | null;
  country_code: string;
  timezone: string;
  locale: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: PlatformRole;
  granted_by: string | null;
  created_at: string;
}

export interface Session {
  user: UserProfile;
  roles: PlatformRole[];
}
