import type { Metadata } from "next";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { PersonalitySettingsForm } from "@/components/personality/settings-form";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = { title: "PersonalityAI CV privacy" };

export default async function PersonalitySettingsPage() {
  const { user } = await requireCandidate();
  const result = await safeLoad(() => repos.personality.get(user.user_id));
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SubPageHeader
        backHref="/personality-cv"
        backLabel="PersonalityAI CV"
        title="Privacy and sharing"
        description="You decide who sees your video. Reviewers are asked to judge motivation and communication — never appearance, accent or background."
      />
      {result.ok ? (
        <PersonalitySettingsForm
          defaults={{
            visibility: result.data.profile.visibility,
            attach_by_default: result.data.profile.attach_by_default,
            share_transcript: result.data.profile.share_transcript,
          }}
        />
      ) : (
        <ErrorState action={<ReloadButton />} />
      )}
    </div>
  );
}
