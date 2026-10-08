import type { PlatformRole, UserProfile, UserRole } from "@/data/types";

// Demo personas — one per product surface. Fictional people and organisations only
// (see STRUCTURE/BUILD_GUIDE/SEED_DATA.md).

const created = "2026-09-01T09:00:00.000Z";

function profile(
  id: string,
  p: Omit<UserProfile, "id" | "user_id" | "avatar_url" | "timezone" | "locale" | "created_at" | "updated_at"> &
    Partial<Pick<UserProfile, "timezone">>,
): UserProfile {
  return {
    id: `profile-${id}`,
    user_id: id,
    avatar_url: null,
    timezone: "UTC",
    locale: "en",
    created_at: created,
    updated_at: created,
    ...p,
  };
}

export const userProfileFixtures: UserProfile[] = [
  profile("user-amara", {
    full_name: "Amara Okafor",
    email: "amara.okafor@example.com",
    headline: "MSc student · London",
    primary_role: "candidate",
    organization_name: null,
    country_code: "NG",
    timezone: "Africa/Lagos",
    onboarding_completed: true,
  }),
  profile("user-kwame", {
    full_name: "Kwame Mensah",
    email: "kwame.mensah@example.com",
    headline: "MSc Data Science graduate · Graduate route",
    primary_role: "candidate",
    organization_name: null,
    country_code: "GB",
    timezone: "Europe/London",
    onboarding_completed: false,
  }),
  profile("user-sarah", {
    full_name: "Sarah Whitfield",
    email: "sarah@northwind-health.example",
    headline: "Head of Talent",
    primary_role: "employer",
    organization_name: "Northwind Health",
    country_code: "GB",
    timezone: "Europe/London",
    onboarding_completed: true,
  }),
  profile("user-james", {
    full_name: "James Carter",
    email: "james@northwind-health.example",
    headline: "Senior Recruiter",
    primary_role: "employer",
    organization_name: "Northwind Health",
    country_code: "GB",
    timezone: "Europe/London",
    onboarding_completed: true,
  }),
  profile("user-lena", {
    full_name: "Lena Vogel",
    email: "admissions@rhine-tech.example",
    headline: "International Admissions Lead",
    primary_role: "provider",
    organization_name: "Rhine Technical University",
    country_code: "DE",
    timezone: "Europe/Berlin",
    onboarding_completed: true,
  }),
  profile("user-chinedu", {
    full_name: "Chinedu Eze",
    email: "chinedu.eze@example.com",
    headline: "Verified Scholastiar Forwarder",
    primary_role: "forwarder",
    organization_name: null,
    country_code: "NG",
    timezone: "Africa/Lagos",
    onboarding_completed: true,
  }),
  profile("user-priya", {
    full_name: "Priya Raman",
    email: "priya@office.scholastiar.example",
    headline: "Mobility Consultant",
    primary_role: "office",
    organization_name: "Scholastiar Office · Lagos",
    country_code: "NG",
    timezone: "Africa/Lagos",
    onboarding_completed: true,
  }),
  profile("user-marco", {
    full_name: "Marco Silva",
    email: "marco@atlas-migration.example",
    headline: "Partner Consultant",
    primary_role: "partner_agency",
    organization_name: "Atlas Migration Partners",
    country_code: "PT",
    timezone: "Europe/Lisbon",
    onboarding_completed: true,
  }),
  profile("user-grace", {
    full_name: "Grace Adeyemi",
    email: "grace@scholastiar.example",
    headline: "Platform Operations",
    primary_role: "admin",
    organization_name: "Scholastiar.ai",
    country_code: "GB",
    timezone: "Europe/London",
    onboarding_completed: true,
  }),
];

function role(user_id: string, r: PlatformRole): UserRole {
  return { id: `role-${user_id}-${r}`, user_id, role: r, granted_by: null, created_at: created };
}

export const userRoleFixtures: UserRole[] = [
  role("user-amara", "candidate"),
  role("user-kwame", "candidate"),
  role("user-sarah", "employer_owner"),
  role("user-james", "recruiter"),
  role("user-lena", "provider_admin"),
  role("user-chinedu", "forwarder"),
  role("user-chinedu", "candidate"),
  role("user-priya", "office_staff"),
  role("user-marco", "partner_agency_member"),
  role("user-grace", "super_admin"),
];
