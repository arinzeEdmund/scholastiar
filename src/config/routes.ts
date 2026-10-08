import { ROUTE_STAGES } from "./route-stages";

/**
 * Routes whose screens are built (Definition Of UI Done met).
 * Each UI stage adds its routes here as they are completed. Navigation shows
 * any other route as "Soon" instead of linking to a dead end.
 */
export const READY_ROUTES = new Set<string>([
  // U0 Foundation
  "/unauthorized",
  "/not-found",
  "/server-error",
  "/maintenance",
  "/offline",
  "/dev",
  "/dev/gallery",
  // U1 Public & marketing
  "/",
  "/about",
  "/how-it-works",
  "/pricing",
  "/blog",
  "/blog/[slug]",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/search",
  // U2 Auth
  "/auth/sign-in",
  "/auth/choose-role",
  "/auth/sign-up/candidate",
  "/auth/sign-up/employer",
  "/auth/sign-up/provider",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/billing/checkout",
  // U3 Candidate core
  "/dashboard",
  "/onboarding",
  "/onboarding/personal",
  "/onboarding/visa",
  "/onboarding/education",
  "/onboarding/experience",
  "/onboarding/skills",
  "/onboarding/preferences",
  "/onboarding/personality-cv",
  "/onboarding/review",
  "/onboarding/complete",
  "/profile",
  "/profile/edit",
  "/profile/experience/[experienceId]",
  "/profile/skills",
  "/profile/visa",
  "/profile/preferences",
  "/profile/documents",
  "/settings",
  "/settings/notifications",
  // U5 Candidate tools
  "/ai-cv",
  "/ai-cv/generate",
  "/ai-cv/[cvId]",
  "/ai-cv/[cvId]/edit",
  "/ai-cv/history",
  "/personality-cv",
  "/personality-cv/record",
  "/personality-cv/preview",
  "/personality-cv/settings",
  "/signia",
  "/signia/builder",
  "/signia/projects/[projectId]",
  "/signia/media",
  "/signia/social-links",
  "/signia/preview",
  "/s/[handle]",
  "/billing",
  "/notifications",
  "/messages",
  "/messages/[threadId]",
  "/applications/insights",
]);

function pathOf(href: string) {
  return href.split(/[?#]/)[0] || "/";
}

/** "/blog/[slug]" → /^\/blog\/[^/]+$/ so concrete paths match their dynamic route. */
const DYNAMIC_READY = [...READY_ROUTES]
  .filter((route) => route.includes("["))
  .map((route) => new RegExp(`^${route.replace(/\[[^\]]+\]/g, "[^/]+")}$`));

export function isRouteReady(href: string): boolean {
  const path = pathOf(href);
  return READY_ROUTES.has(path) || path.startsWith("/dev/") || DYNAMIC_READY.some((pattern) => pattern.test(path));
}

export function routeStage(href: string): string | undefined {
  return ROUTE_STAGES[pathOf(href)];
}
