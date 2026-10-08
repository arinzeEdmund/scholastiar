import "server-only";

import type { PlanAudience } from "@/data/types";

import { readSystem } from "./store";

// Readers for Phase A dev tooling only (dev panel, shell previews). They ignore
// the dev "screen state" switch so the tools keep working while screens show
// empty/error states. Product screens must use `repos` instead.

export const devListProfiles = () => readSystem((db) => db.user_profiles);

export const devListPlans = (audience?: PlanAudience) =>
  readSystem((db) => db.plans.filter((p) => !audience || p.audience === audience));

/** Latest unused email link for a user — stands in for an inbox in mock mode. */
export const devLatestToken = (userId: string, type: "verify_email" | "reset_password") =>
  readSystem(
    (db) =>
      db.auth_tokens
        .filter((t) => t.user_id === userId && t.type === type && !t.used_at && new Date(t.expires_at) > new Date())
        .at(-1)?.token ?? null,
  );
