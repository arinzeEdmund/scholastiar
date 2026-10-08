import type { Metadata } from "next";

import { personalDefaults } from "@/components/candidate/forms/defaults";
import { PersonalForm } from "@/components/candidate/forms/personal-form";
import { StepFrame } from "@/components/candidate/onboarding/step-frame";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "About you · Set up your profile" };

export default async function PersonalStepPage() {
  const { user } = await requireCandidate();
  const [profile, countries, consent] = await Promise.all([
    repos.candidate.getProfile(user.user_id),
    repos.reference.listCountries(),
    repos.messages.getWhatsAppConsent(user.user_id),
  ]);
  return (
    <StepFrame step="personal">
      <PersonalForm mode="onboarding" defaults={personalDefaults(user, profile, consent)} countries={countries} />
    </StepFrame>
  );
}
