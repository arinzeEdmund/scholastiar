import type { Metadata } from "next";

import { skillsDefaults } from "@/components/candidate/forms/defaults";
import { SkillsForm } from "@/components/candidate/forms/skills-form";
import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Skills and certifications" };

export default async function SkillsPage() {
  const { user } = await requireCandidate();
  const [skills, certifications] = await Promise.all([
    repos.candidate.listSkills(user.user_id),
    repos.candidate.listCertifications(user.user_id),
  ]);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SubPageHeader
        backHref="/profile"
        backLabel="Profile"
        title="Skills and certifications"
        description="Rate each skill honestly — employers trust profiles that don't rate everything as expert."
      />
      <section className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <SkillsForm mode="profile" defaults={skillsDefaults(skills, certifications)} />
      </section>
    </div>
  );
}
