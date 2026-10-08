import type { Metadata } from "next";

import { visaDefaults } from "@/components/candidate/forms/defaults";
import { VisaForm } from "@/components/candidate/forms/visa-form";
import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Visa and mobility" };

export default async function VisaPage() {
  const { user } = await requireCandidate();
  const [visa, profile, countries, permitTypes] = await Promise.all([
    repos.candidate.getVisa(user.user_id),
    repos.candidate.getProfile(user.user_id),
    repos.reference.listCountries(),
    repos.candidate.listPermitTypes(),
  ]);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SubPageHeader
        backHref="/profile"
        backLabel="Profile"
        title="Visa and mobility"
        description="Your study status, the work conditions on your visa and your plans after graduating. We use these for your visa guidance and, on Pro, to label jobs."
      />
      <section className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <VisaForm
          mode="profile"
          defaults={visaDefaults(visa, profile)}
          countries={countries}
          permitTypes={permitTypes}
        />
      </section>
    </div>
  );
}
