import type { PlanAudience, PrimaryRole } from "@/data/types";

export type ShellKey = "public" | "candidate" | "employer" | "provider" | "forwarder" | "office" | "admin";

interface SurfaceConfig {
  label: string;
  shell: ShellKey;
  /** Where this surface lands after sign-in. */
  home: string;
  planAudience: PlanAudience | null;
}

export const SURFACES: Record<PrimaryRole, SurfaceConfig> = {
  candidate: { label: "Candidate", shell: "candidate", home: "/dashboard", planAudience: "candidate" },
  employer: { label: "Employer", shell: "employer", home: "/employers/dashboard", planAudience: "employer" },
  provider: { label: "Provider", shell: "provider", home: "/providers/dashboard", planAudience: "provider" },
  forwarder: { label: "Forwarder", shell: "forwarder", home: "/forwarder/dashboard", planAudience: null },
  office: { label: "Scholastiar office", shell: "office", home: "/office/dashboard", planAudience: null },
  partner_agency: { label: "Partner agency", shell: "office", home: "/partner-agency/dashboard", planAudience: null },
  admin: { label: "Admin", shell: "admin", home: "/admin", planAudience: null },
};

export const ROLE_LABELS: Record<string, string> = {
  candidate: "Candidate",
  employer_owner: "Employer owner",
  employer_admin: "Employer admin",
  recruiter: "Recruiter",
  hiring_manager: "Hiring manager",
  employer_viewer: "Employer viewer",
  provider_owner: "Provider owner",
  provider_admin: "Provider admin",
  provider_member: "Provider member",
  forwarder: "Forwarder",
  office_staff: "Office staff",
  partner_agency_member: "Partner agency",
  support_admin: "Support admin",
  moderation_admin: "Moderation admin",
  billing_admin: "Billing admin",
  platform_admin: "Platform admin",
  super_admin: "Super admin",
};
