import "server-only";

import { redirect } from "next/navigation";

import type { Session } from "@/data";
import { nextStepFor } from "@/lib/auth-flow";
import { getSession } from "@/lib/session";

/**
 * Candidate screens: signed in, a candidate, plan paid and email verified.
 * Anything missing sends the user to the step that fixes it.
 */
export async function requireCandidate(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");
  if (session.user.primary_role !== "candidate") redirect("/unauthorized");

  const next = await nextStepFor(session.user.user_id);
  if (next === "/billing/checkout" || next === "/auth/verify-email" || next === "/auth/choose-role") redirect(next);
  return session;
}
