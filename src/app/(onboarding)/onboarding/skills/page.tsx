import type { Metadata } from "next";

import { skillsDefaults } from "@/components/candidate/forms/defaults";
import { SkillsForm } from "@/components/candidate/forms/skills-form";
import { StepFrame } from "@/components/candidate/onboarding/step-frame";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Skills · Set up your profile" };

export default async function SkillsStepPage() {
  const { user } = await requireCandidate();
  const [skills, certifications] = await Promise.all([
    repos.candidate.listSkills(user.user_id),
    repos.candidate.listCertifications(user.user_id),
  ]);
  return (
    <StepFrame step="skills">
      <SkillsForm mode="onboarding" defaults={skillsDefaults(skills, certifications)} />
    </StepFrame>
  );
}
