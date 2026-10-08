import type { Metadata } from "next";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { RecordingStudio } from "@/components/personality/recording-studio";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Record your PersonalityAI CV" };

export default async function RecordPage() {
  await requireCandidate();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SubPageHeader
        backHref="/personality-cv"
        backLabel="PersonalityAI CV"
        title="Recording studio"
        description="Choose your prompts, check your camera, record. Nothing is shared until you choose “Use this video”."
      />
      <RecordingStudio />
    </div>
  );
}
