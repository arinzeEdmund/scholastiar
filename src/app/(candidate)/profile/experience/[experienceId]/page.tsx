import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { experienceDefaults } from "@/components/candidate/forms/defaults";
import { ExperiencePageForm } from "@/components/candidate/forms/experience-page-form";
import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Experience" };

const TIPS = [
  "Start with what you did: “Led”, “Built”, “Reduced”.",
  "Add a number — people, hours, %, money, time saved.",
  "Finish with the result: what changed because of you.",
  "One achievement per line, one sentence each.",
];

export default async function ExperienceEditorPage({ params }: PageProps<"/profile/experience/[experienceId]">) {
  const { experienceId } = await params;
  const { user } = await requireCandidate();
  const isNew = experienceId === "new";
  const [record, countries] = await Promise.all([
    isNew ? Promise.resolve(null) : repos.candidate.getExperience(user.user_id, experienceId),
    repos.reference.listCountries(),
  ]);
  if (!isNew && !record) notFound();

  return (
    <div className="space-y-6">
      <SubPageHeader
        backHref="/profile#experience"
        backLabel="Profile"
        title={record ? `${record.job_title}` : "Add experience"}
        description={
          record ? record.company_name : "Jobs, internships, placements, national service and volunteering all count."
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="min-w-0 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
          <ExperiencePageForm id={record?.id ?? null} defaults={experienceDefaults(record)} countries={countries} />
        </section>
        <aside className="h-fit rounded-2xl border bg-card p-5 shadow-xs lg:sticky lg:top-24 dark:bg-white/[0.03]">
          <h2 className="font-semibold text-primary-text">Writing strong achievements</h2>
          <ul className="mt-3 space-y-2.5">
            {TIPS.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-secondary-text">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-dark" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-soft-green/60 p-3 text-sm dark:bg-green/10">
            <p className="text-xs font-medium text-green-dark">Example</p>
            <p className="mt-1 text-primary-text">
              “Trained 14 field officers on digital data collection, reducing form errors by 40%.”
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
