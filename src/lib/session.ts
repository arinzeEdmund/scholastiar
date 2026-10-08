import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import { repos, type Session } from "@/data";
import { DEV_COOKIES } from "@/lib/dev-settings";

/**
 * Current session. Phase A reads the mock session cookie (set by mock sign-in
 * and the dev persona switcher). Phase B replaces this with Supabase Auth.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const userId = (await cookies()).get(DEV_COOKIES.session)?.value;
  if (!userId) return null;
  const user = await repos.users.getProfile(userId);
  if (!user) return null;
  return { user, roles: await repos.users.getRoles(userId) };
});

const SESSION_COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
} as const;

/** Starts a session for the user (Phase B: Supabase Auth session). Call from server actions only. */
export async function startSession(userId: string) {
  (await cookies()).set(DEV_COOKIES.session, userId, SESSION_COOKIE_OPTIONS);
}

export async function endSession() {
  (await cookies()).delete(DEV_COOKIES.session);
}
