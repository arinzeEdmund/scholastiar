import type { EmployerCompany, EmployerMembership, ProviderMembership, ProviderOrganization } from "@/data/types";

// Fictional organisations for the demo personas.
const created = "2026-09-01T09:00:00.000Z";

export const employerCompanyFixtures: EmployerCompany[] = [
  {
    id: "company-northwind",
    name: "Northwind Health",
    slug: "northwind-health",
    website_url: "https://northwind-health.example",
    headquarters_country_code: "GB",
    hires_students: true,
    sponsors_graduate_work_visas: true,
    verification_status: "verified",
    created_by: "user-sarah",
    created_at: created,
    updated_at: created,
  },
];

export const employerMembershipFixtures: EmployerMembership[] = [
  {
    id: "em-sarah",
    employer_company_id: "company-northwind",
    user_id: "user-sarah",
    role: "owner",
    status: "active",
    joined_at: created,
  },
  {
    id: "em-james",
    employer_company_id: "company-northwind",
    user_id: "user-james",
    role: "recruiter",
    status: "active",
    joined_at: created,
  },
];

export const providerOrganizationFixtures: ProviderOrganization[] = [
  {
    id: "provider-rhine",
    name: "Rhine Technical University",
    slug: "rhine-technical-university",
    organization_type: "university",
    country_code: "DE",
    website_url: "https://rhine-tech.example",
    verification_status: "verified",
    created_by: "user-lena",
    created_at: created,
    updated_at: created,
  },
];

export const providerMembershipFixtures: ProviderMembership[] = [
  {
    id: "pm-lena",
    provider_organization_id: "provider-rhine",
    user_id: "user-lena",
    role: "admin",
    status: "active",
    joined_at: created,
  },
];
