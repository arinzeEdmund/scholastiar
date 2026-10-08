import "server-only";

import { SURFACES } from "@/config/personas";
import { getSession } from "@/lib/session";

/** Where "go home" should take the current visitor. */
export async function getHomeHref(): Promise<string> {
  const session = await getSession();
  return session ? SURFACES[session.user.primary_role].home : "/";
}
