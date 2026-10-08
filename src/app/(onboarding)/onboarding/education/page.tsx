import type { Metadata } from "next";

import { EducationEditor } from "@/components/candidate/forms/history-editors";
import { ContinueBar } from "@/components/candidate/onboarding/continue-bar";
import { StepFrame } from "@/components/candidate/onboarding/step-frame";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Education · Set up your profile" };

export default async function EducationStepPage() {
  const { user } = await requireCandidate();
  const [records, countries] = await Promise.all([
    repos.candidate.listEducation(user.user_id),
    repos.reference.listCountries(),
  ]);
  return (
    <StepFrame step="education">
      <EducationEditor records={records} countries={countries} />
      <ContinueBar step="education" backHref="/onboarding/visa" label={records.length ? "Continue" : "Skip for now"} />
    </StepFrame>
  );
}
