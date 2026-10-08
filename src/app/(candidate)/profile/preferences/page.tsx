import type { Metadata } from "next";

import { preferencesDefaults } from "@/components/candidate/forms/defaults";
import { PreferencesForm } from "@/components/candidate/forms/preferences-form";
import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Goals and preferences" };

export default async function PreferencesPage() {
  const { user } = await requireCandidate();
  const [preferences, visa, countries] = await Promise.all([
    repos.candidate.getPreferences(user.user_id),
    repos.candidate.getVisa(user.user_id),
    repos.reference.listCountries(),
  ]);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SubPageHeader
        backHref="/profile"
        backLabel="Profile"
        title="Goals and preferences"
        description="What you're looking for. Recommendations and alerts follow these."
      />
      <section className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <PreferencesForm
          mode="profile"
          defaults={preferencesDefaults(preferences, visa)}
          countries={countries}
          visaHourLimit={visa.study_status === "graduated" ? null : visa.term_time_weekly_hour_limit}
        />
      </section>
    </div>
  );
}
