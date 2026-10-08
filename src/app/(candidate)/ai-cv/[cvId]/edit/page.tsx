import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { CvEditor } from "@/components/cv/cv-editor";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { repos } from "@/data";
import { profileSourceText } from "@/lib/cv/build";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = { title: "Edit CV" };

export default async function CvEditPage({ params }: PageProps<"/ai-cv/[cvId]/edit">) {
  const { user } = await requireCandidate();
  const { cvId } = await params;
  const result = await safeLoad(() =>
    Promise.all([
      repos.cvs.get(user.user_id, cvId),
      repos.candidate.getBundle(user.user_id),
      repos.reference.listCountries(),
    ]),
  );
  if (!result.ok) {
    return (
      <div className="space-y-6">
        <SubPageHeader backHref="/ai-cv" backLabel="AI CV" title="Edit CV" />
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }
  const [cv, bundle, countries] = result.data;
  if (!cv) notFound();
  const nationality = countries.find((c) => c.iso2 === bundle.profile.nationality_country_code)?.name ?? null;

  return (
    <div className="space-y-6">
      <SubPageHeader
        backHref={`/ai-cv/${cv.id}`}
        backLabel="Back to preview"
        title="Edit CV"
        description="Reword, reorder and choose what to show. Facts like job titles and dates come from your profile, so they stay true everywhere."
      />
      <CvEditor
        cv={cv}
        profileSkills={bundle.skills.map((s) => s.skill_name)}
        nationality={nationality}
        source={profileSourceText(bundle)}
      />
    </div>
  );
}
