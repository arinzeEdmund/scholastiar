import type { Metadata } from "next";

import { ExperienceEditor } from "@/components/candidate/forms/history-editors";
import { ContinueBar } from "@/components/candidate/onboarding/continue-bar";
import { StepFrame } from "@/components/candidate/onboarding/step-frame";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Experience · Set up your profile" };

export default async function ExperienceStepPage() {
  const { user } = await requireCandidate();
  const [records, countries] = await Promise.all([
    repos.candidate.listExperience(user.user_id),
    repos.reference.listCountries(),
  ]);
  return (
    <StepFrame step="experience">
      <ExperienceEditor records={records} countries={countries} />
      <ContinueBar
        step="experience"
        backHref="/onboarding/education"
        label={records.length ? "Continue" : "Skip for now"}
      />
    </StepFrame>
  );
}
