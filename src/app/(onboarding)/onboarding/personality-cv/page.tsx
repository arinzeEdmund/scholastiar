import { Clock, Eye, MessageCircle, Video } from "lucide-react";
import type { Metadata } from "next";

import { ContinueBar } from "@/components/candidate/onboarding/continue-bar";
import { StepFrame } from "@/components/candidate/onboarding/step-frame";
import { RouteButton } from "@/components/layout/route-button";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "PersonalityAI CV · Set up your profile" };

const PROMPTS = [
  "Introduce yourself in a sentence or two.",
  "Tell us about something you're proud of and why.",
  "What are you hoping to do next, and where?",
];

const POINTS = [
  { icon: Clock, text: "About 90 seconds, three short prompts" },
  { icon: Eye, text: "Only shared with the universities and panels you apply to" },
  { icon: MessageCircle, text: "Re-record as often as you like" },
];

export default async function PersonalityStepPage() {
  await requireCandidate();
  return (
    <StepFrame step="personality-cv">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
        <div className="grain relative aurora-dark px-5 py-6 text-white sm:px-6">
          <div className="relative flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <Video className="size-6 text-mint" aria-hidden />
            </span>
            <div>
              <p className="text-lg font-semibold">Let admissions teams meet you before the interview</p>
              <p className="mt-0.5 text-sm text-white/70">
                A PersonalityAI CV shows how you communicate — something a CV can&apos;t.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 p-5 sm:grid-cols-[1.2fr_1fr] sm:p-6">
          <div>
            <p className="text-xs font-medium text-secondary-text">You&apos;ll answer</p>
            <ol className="mt-2 space-y-2">
              {PROMPTS.map((prompt, index) => (
                <li key={prompt} className="flex gap-2.5 text-sm text-primary-text">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-soft-green text-[0.6875rem] font-semibold text-green-dark">
                    {index + 1}
                  </span>
                  {prompt}
                </li>
              ))}
            </ol>
          </div>
          <ul className="space-y-2.5 sm:border-l sm:pl-6">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm text-secondary-text">
                <Icon className="size-4 shrink-0 text-green-dark" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-soft/50 px-5 py-3.5 sm:px-6 dark:bg-white/[0.02]">
          <p className="text-xs text-secondary-text">Optional — you can record it any time from your profile.</p>
          <RouteButton href="/personality-cv/record" variant="outline" className="rounded-xl">
            <Video aria-hidden />
            Record now
          </RouteButton>
        </div>
      </div>
      <ContinueBar step="personality-cv" backHref="/onboarding/preferences" label="Do this later" />
    </StepFrame>
  );
}
