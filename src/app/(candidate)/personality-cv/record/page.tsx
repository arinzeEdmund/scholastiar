import type { Metadata } from "next";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { VideoLinkStudio } from "@/components/personality/video-link-studio";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Add your PersonalityAI CV" };

export default async function AddVideoPage() {
  await requireCandidate();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SubPageHeader
        backHref="/personality-cv"
        backLabel="PersonalityAI CV"
        title="Add your video"
        description="Choose the prompts you answer, then paste the link to your one-minute video. Nothing is shared until you choose “Use this video”."
      />
      <VideoLinkStudio />
    </div>
  );
}
