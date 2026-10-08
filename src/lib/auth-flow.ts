import "server-only";

import { repos, type UserProfile } from "@/data";
import { SURFACES } from "@/config/personas";
import { isRouteReady } from "@/config/routes";

/** Account types that must hold a paid plan before using the app. */
const PAID_SURFACES = new Set(["candidate", "employer", "provider"]);

const ONBOARDING: Partial<Record<UserProfile["primary_role"], string>> = {
  candidate: "/onboarding",
  employer: "/employers/onboarding",
  provider: "/providers/onboarding",
};

/** Where a fully set-up user lands: onboarding if unfinished, otherwise their workspace. */
export function landingFor(profile: UserProfile): { href: string; label: string } {
  const onboarding = ONBOARDING[profile.primary_role];
  const target = !profile.onboarding_completed && onboarding ? onboarding : SURFACES[profile.primary_role].home;
  if (isRouteReady(target)) {
    return { href: target, label: target === onboarding ? "Continue to set-up" : "Go to your workspace" };
  }
  // Screens built in later UI stages fall back to the homepage until they exist.
  return { href: "/", label: "Go to the homepage" };
}

/**
 * The next screen an account must see: checkout until a plan is paid,
 * then email verification, then onboarding or the workspace.
 */
export async function nextStepFor(userId: string): Promise<string> {
  const profile = await repos.users.getProfile(userId);
  if (!profile) return "/auth/choose-role";

  if (PAID_SURFACES.has(profile.primary_role)) {
    const subscription = await repos.billing.getSubscription(userId);
    if (subscription?.status !== "active") return "/billing/checkout";
  }

  const account = await repos.auth.getAccount(userId);
  if (account && !account.email_verified_at) return "/auth/verify-email";

  return landingFor(profile).href;
}
