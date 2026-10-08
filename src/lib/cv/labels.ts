import type { CvVersion } from "@/data/types";

import { CV_FORMATS, keywordCoverage } from "./build";

export function formatLabel(cv: Pick<CvVersion, "format">) {
  return CV_FORMATS[cv.format].label;
}

/** Share of the target's keywords the CV already uses (0–100), or null for general CVs. */
export function coveragePercent(cv: CvVersion): number | null {
  if (cv.target_keywords.length === 0) return null;
  const { found } = keywordCoverage(cv.content, cv.target_keywords);
  return Math.round((found.length / cv.target_keywords.length) * 100);
}

export function formatCvDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
}
