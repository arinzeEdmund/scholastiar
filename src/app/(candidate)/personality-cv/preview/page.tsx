import { GraduationCap, Info, MapPin, Video } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { VideoPoster } from "@/components/personality/video-poster";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Button } from "@/components/ui/button";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { flag } from "@/lib/flags";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = { title: "Reviewer preview" };

export default async function PersonalityPreviewPage() {
  const { user } = await requireCandidate();
  const result = await safeLoad(() =>
    Promise.all([
      repos.personality.get(user.user_id),
      repos.candidate.getBundle(user.user_id),
      repos.reference.listCountries(),
    ]),
  );
  const header = (
    <SubPageHeader
      backHref="/personality-cv"
      backLabel="PersonalityAI CV"
      title="How reviewers see it"
      description="This is what an admissions team or scholarship panel sees when they open your application."
    />
  );
  if (!result.ok) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        {header}
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }
  const [{ profile, video }, bundle, countries] = result.data;
  const country = (code: string | null) => countries.find((c) => c.iso2 === code)?.name;
  const latest = bundle.education[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {header}
      {!video ? (
        <EmptyState
          icon={Video}
          title="Nothing to preview yet"
          description="Record your PersonalityAI CV first — it takes about two minutes."
          action={
            <Button asChild className="rounded-xl">
              <Link href="/personality-cv/record">Start recording</Link>
            </Button>
          }
        />
      ) : (
        <>
          {profile.visibility === "hidden" && (
            <p className="flex items-start gap-2 rounded-xl bg-warning-soft px-3.5 py-3 text-sm text-primary-text dark:bg-warning/10">
              <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              Your video is hidden, so reviewers won&apos;t see it until you change your privacy settings.
            </p>
          )}
          <article
            aria-label="Reviewer view"
            className="overflow-hidden rounded-2xl border bg-card shadow-lg dark:bg-white/[0.03]"
          >
            <div className="flex items-center gap-2 border-b bg-soft px-4 py-2.5 text-xs text-secondary-text dark:bg-white/[0.04]">
              <GraduationCap className="size-3.5 text-green-dark" aria-hidden />
              Reviewer view · application to MSc Public Health, Volga Federal Medical University (example)
            </div>
            <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1.3fr_1fr]">
              <VideoPoster name={user.full_name} seconds={video.duration_seconds} />
              <div>
                <p className="text-lg font-semibold text-primary-text">{user.full_name}</p>
                {bundle.profile.headline && <p className="text-sm text-secondary-text">{bundle.profile.headline}</p>}
                <p className="mt-2 flex items-center gap-1.5 text-sm text-secondary-text">
                  <MapPin className="size-3.5" aria-hidden />
                  <span aria-hidden>{flag(bundle.profile.nationality_country_code)}</span>
                  {country(bundle.profile.nationality_country_code) ?? "Nationality not added"}
                </p>
                {latest && (
                  <p className="mt-1 text-sm text-secondary-text">
                    {latest.qualification_name}, {latest.institution_name}
                  </p>
                )}
                <p className="mt-4 text-xs font-medium text-secondary-text">Answers</p>
                <ol className="mt-1.5 space-y-1">
                  {video.prompts.map((prompt, i) => (
                    <li key={prompt} className="text-sm text-primary-text">
                      <span className="font-semibold text-green-dark">{i + 1}.</span> {prompt}
                    </li>
                  ))}
                </ol>
                {profile.share_transcript && (
                  <p className="mt-3 text-xs text-secondary-text">A written transcript is shown under the video.</p>
                )}
              </div>
            </div>
            <p className="border-t px-5 py-3 text-xs text-secondary-text sm:px-6">
              Reviewers are asked to judge motivation and communication only — never appearance, accent or background.
            </p>
          </article>
          <p className="text-center text-xs text-secondary-text">
            In this preview the video shows as a cover. Stored playback for reviewers arrives with secure video storage.
          </p>
        </>
      )}
    </div>
  );
}
