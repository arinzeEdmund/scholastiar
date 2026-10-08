import type { PlanKey } from "@/data/types";

// Plan entitlements from STRUCTURE/BUILD_GUIDE/PRICING.md.

/** Jobs and post-study jobs are Pro only (PRICING.md → Jobs Are Pro Only). Starter sees them locked. */
export function hasJobAccess(planId: PlanKey | null | undefined): boolean {
  return planId === "pro";
}

/** The no-promise line shown wherever jobs are offered. */
export const JOB_CONNECTIONS_NOTE = "We connect you to openings employers post. We can't promise a job.";

/** Tailored AI CVs per calendar month: 25 on Starter, unlimited on Pro (decided 2026-10-08). */
export const STARTER_MONTHLY_AI_CVS = 25;

export function aiCvMonthlyLimit(planId: PlanKey | null | undefined): number | null {
  return planId === "pro" ? null : STARTER_MONTHLY_AI_CVS;
}

/** AI essays and application answers per calendar month: 250 on Starter, unlimited on Pro (decided 2026-10-08). */
export const STARTER_MONTHLY_AI_ANSWERS = 250;

export function aiAnswerMonthlyLimit(planId: PlanKey | null | undefined): number | null {
  return planId === "pro" ? null : STARTER_MONTHLY_AI_ANSWERS;
}

/** Start of the current calendar month (UTC), for monthly allowances. */
export function monthStart(now = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}
