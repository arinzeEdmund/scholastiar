import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";

import { OnboardingWelcome } from "@/components/candidate/onboarding/onboarding-welcome";
import { repos } from "@/data";
import { ONBOARDING_STEPS } from "@/data/types/candidate";
import { WELCOME_VIDEO } from "@/lib/candidate/guide";
import { ONBOARDING } from "@/lib/candidate/labels";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Set up your profile" };

/** Whether the welcome video has been added, and its length from the captions file. */
function welcomeVideo() {
  const publicDir = path.join(process.cwd(), "public");
  const available = existsSync(path.join(publicDir, WELCOME_VIDEO.src));
  let seconds = 30;
  try {
    const ends = [
      ...readFileSync(path.join(publicDir, WELCOME_VIDEO.captions), "utf8").matchAll(/--> (\d+):(\d+):(\d+)/g),
    ];
    const last = ends.at(-1);
    if (last) seconds = Number(last[1]) * 3600 + Number(last[2]) * 60 + Number(last[3]) + 1;
  } catch {
    // No captions file: keep the default.
  }
  return { available, duration: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` };
}

export default async function OnboardingStartPage() {
  const { user } = await requireCandidate();
  const session = await repos.candidate.getOnboarding(user.user_id);
  const stage = session.completed_at ? "finished" : session.completed_steps.length > 0 ? "started" : "new";
  const video = welcomeVideo();
  const minutes = ONBOARDING_STEPS.reduce((sum, step) => sum + ONBOARDING[step].minutes, 0);

  return (
    <OnboardingWelcome
      firstName={user.full_name.split(" ")[0]}
      stage={stage}
      completedSteps={session.completed_steps}
      currentStep={session.completed_at ? "review" : session.current_step}
      minutes={minutes}
      videoAvailable={video.available}
      videoDuration={video.duration}
    />
  );
}
