import type { EmployerCompany, ProviderOrganization, ProviderOrganizationType } from "@/data/types";

export interface OrganizationsRepository {
  /** The active employer company the user belongs to, if any. */
  getEmployerCompanyForUser(userId: string): Promise<EmployerCompany | null>;
  createEmployerCompany(input: {
    name: string;
    websiteUrl: string | null;
    countryCode: string;
    hiresStudents: boolean;
    sponsorsGraduateWorkVisas: boolean;
    ownerUserId: string;
  }): Promise<EmployerCompany>;
  createProviderOrganization(input: {
    name: string;
    organizationType: ProviderOrganizationType;
    websiteUrl: string | null;
    countryCode: string;
    ownerUserId: string;
  }): Promise<ProviderOrganization>;
}
