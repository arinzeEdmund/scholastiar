import "server-only";

import type { OrganizationsRepository } from "@/data/repositories/organizations";

import { now, readSystem, write } from "./store";

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const mockOrganizationsRepository: OrganizationsRepository = {
  getEmployerCompanyForUser: (userId) =>
    readSystem((db) => {
      const membership = db.employer_memberships.find((m) => m.user_id === userId && m.status === "active");
      return db.employer_companies.find((c) => c.id === membership?.employer_company_id) ?? null;
    }),

  createEmployerCompany: (input) =>
    write((db) => {
      const company = {
        id: `company-${crypto.randomUUID()}`,
        name: input.name,
        slug: slugify(input.name),
        website_url: input.websiteUrl,
        headquarters_country_code: input.countryCode,
        hires_students: input.hiresStudents,
        sponsors_graduate_work_visas: input.sponsorsGraduateWorkVisas,
        verification_status: "unverified" as const,
        created_by: input.ownerUserId,
        created_at: now(),
        updated_at: now(),
      };
      db.employer_companies.push(company);
      db.employer_memberships.push({
        id: `em-${crypto.randomUUID()}`,
        employer_company_id: company.id,
        user_id: input.ownerUserId,
        role: "owner",
        status: "active",
        joined_at: now(),
      });
      return company;
    }),

  createProviderOrganization: (input) =>
    write((db) => {
      const organization = {
        id: `provider-${crypto.randomUUID()}`,
        name: input.name,
        slug: slugify(input.name),
        organization_type: input.organizationType,
        country_code: input.countryCode,
        website_url: input.websiteUrl,
        verification_status: "unverified" as const,
        created_by: input.ownerUserId,
        created_at: now(),
        updated_at: now(),
      };
      db.provider_organizations.push(organization);
      db.provider_memberships.push({
        id: `pm-${crypto.randomUUID()}`,
        provider_organization_id: organization.id,
        user_id: input.ownerUserId,
        role: "owner",
        status: "active",
        joined_at: now(),
      });
      return organization;
    }),
};
