import type { Metadata } from "next";

import { preferencesDefaults } from "@/components/candidate/forms/defaults";
import { PreferencesForm } from "@/components/candidate/forms/preferences-form";
import { StepFrame } from "@/components/candidate/onboarding/step-frame";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Goals · Set up your profile" };

export default async function PreferencesStepPage() {
  const { user } = await requireCandidate();
  const [preferences, visa, countries] = await Promise.all([
    repos.candidate.getPreferences(user.user_id),
    repos.candidate.getVisa(user.user_id),
    repos.reference.listCountries(),
  ]);
  return (
    <StepFrame step="preferences">
      <PreferencesForm
        mode="onboarding"
        defaults={preferencesDefaults(preferences, visa)}
        countries={countries}
        visaHourLimit={visa.study_status === "graduated" ? null : visa.term_time_weekly_hour_limit}
      />
    </StepFrame>
  );
}
