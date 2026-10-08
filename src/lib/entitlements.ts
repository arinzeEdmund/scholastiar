import type { PlanKey } from "@/data/types";

// Plan entitlements from STRUCTURE/BUILD_GUIDE/PRICING.md.

/** Jobs and post-study jobs are Pro only (PRICING.md → Jobs Are Pro Only). Starter sees them locked. */
export function hasJobAccess(planId: PlanKey | null | undefined): boolean {
  return planId === "pro";
}

/** The no-promise line shown wherever jobs are offered. */
export const JOB_CONNECTIONS_NOTE = "We connect you to openings employers post. We can't promise a job.";
