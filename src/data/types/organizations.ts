// Shaped after STRUCTURE/DATABASE/db.md → Employer And Provider Tables.

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

/** employer_companies */
export interface EmployerCompany {
  id: string;
  name: string;
  slug: string;
  website_url: string | null;
  headquarters_country_code: string;
  hires_students: boolean;
  sponsors_graduate_work_visas: boolean;
  verification_status: VerificationStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/** employer_memberships */
export interface EmployerMembership {
  id: string;
  employer_company_id: string;
  user_id: string;
  role: "owner" | "admin" | "recruiter" | "hiring_manager" | "viewer";
  status: "active" | "invited";
  joined_at: string;
}

export type ProviderOrganizationType = "university" | "scholarship_funder" | "other";

/** provider_organizations */
export interface ProviderOrganization {
  id: string;
  name: string;
  slug: string;
  organization_type: ProviderOrganizationType;
  country_code: string;
  website_url: string | null;
  verification_status: VerificationStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/** provider_memberships */
export interface ProviderMembership {
  id: string;
  provider_organization_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  status: "active" | "invited";
  joined_at: string;
}
