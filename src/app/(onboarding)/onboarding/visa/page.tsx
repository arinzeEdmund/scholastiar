import type { Metadata } from "next";

import { visaDefaults } from "@/components/candidate/forms/defaults";
import { VisaForm } from "@/components/candidate/forms/visa-form";
import { StepFrame } from "@/components/candidate/onboarding/step-frame";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Study and visa · Set up your profile" };

export default async function VisaStepPage() {
  const { user } = await requireCandidate();
  const [visa, profile, countries, permitTypes] = await Promise.all([
    repos.candidate.getVisa(user.user_id),
    repos.candidate.getProfile(user.user_id),
    repos.reference.listCountries(),
    repos.candidate.listPermitTypes(),
  ]);
  return (
    <StepFrame step="visa">
      <VisaForm
        mode="onboarding"
        defaults={visaDefaults(visa, profile)}
        countries={countries}
        permitTypes={permitTypes}
      />
    </StepFrame>
  );
}
