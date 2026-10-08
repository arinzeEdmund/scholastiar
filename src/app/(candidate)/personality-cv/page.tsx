import {
  Building2,
  Clock,
  Eye,
  GraduationCap,
  MessageCircle,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Video,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { RouteButton } from "@/components/layout/route-button";
import { RemoveVideoButton } from "@/components/personality/remove-video-button";
import { VideoEmbed } from "@/components/video/video-embed";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Button } from "@/components/ui/button";
import { PERSONALITY_PROMPTS } from "@/config/personality";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = { title: "PersonalityAI CV" };

const VISIBILITY = {
  applications: "Only reviewers of applications you attach it to",
  signia: "Reviewers, plus anyone who opens your Signia page",
  hidden: "Hidden — nobody can watch it",
} as const;

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(iso));

export default async function PersonalityHomePage() {
  const { user } = await requireCandidate();
  const result = await safeLoad(() => repos.personality.get(user.user_id));

  const header = (
    <PageHeader
      eyebrow="PersonalityAI CV"
      title="Let them meet you before the interview"
      description="A short video in your own words. Admissions teams and scholarship panels see how you communicate — something no document shows."
    />
  );
  if (!result.ok) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }
  const { profile, video, views } = result.data;

  if (!video) {
    return (
      <div className="space-y-6">
        {header}
        <section className="grain relative overflow-hidden rounded-3xl aurora-dark p-5 text-white sm:p-8">
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <Video className="size-6 text-mint" aria-hidden />
              </span>
              <h2 className="mt-4 text-2xl font-bold">Add your video introduction</h2>
              <p className="mt-2 max-w-lg text-sm text-white/75">
                Pick up to three prompts, record a one-minute video on Loom, Tella or your phone, then paste the link.
                YouTube, Vimeo and Google Drive links work too.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild variant="inverse" size="lg" className="rounded-xl">
                  <Link href="/personality-cv/record">
                    <Video aria-hidden />
                    Add your video
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-wide text-mint uppercase">Prompts you can choose</p>
              <ul className="mt-3 space-y-2">
                {PERSONALITY_PROMPTS.slice(0, 4).map((prompt) => (
                  <li key={prompt} className="flex gap-2 text-sm text-white/85">
                    <MessageCircle className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <ul className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, title: "Short", text: "One minute at most, across up to three prompts." },
            { icon: ShieldCheck, title: "Private", text: "Only reviewers of applications you attach it to can watch." },
            {
              icon: GraduationCap,
              title: "Fair",
              text: "Reviewers judge motivation and communication, not looks or accent.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border bg-card p-4 dark:bg-white/[0.03]">
              <Icon className="size-5 text-green-dark" aria-hidden />
              <p className="mt-2 font-semibold text-primary-text">{title}</p>
              <p className="text-sm text-secondary-text">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      <div className="grid gap-6 *:min-w-0 lg:grid-cols-3">
        <section
          aria-labelledby="your-video"
          className="space-y-4 rounded-2xl border bg-card p-4 shadow-xs sm:p-5 lg:col-span-2 dark:bg-white/[0.03]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="your-video" className="text-sm font-semibold text-primary-text">
              Your video
            </h2>
            <span className="rounded-full bg-soft-green px-2 py-0.5 text-xs font-semibold text-green-dark dark:bg-green/15">
              Published · {when(video.created_at)}
            </span>
          </div>
          <VideoEmbed url={video.video_url} title="Your PersonalityAI CV" />
          <p className="text-xs text-secondary-text">Plays from {video.provider_label}.</p>
          <div>
            <p className="text-xs font-medium text-secondary-text">You answered</p>
            <ol className="mt-1.5 space-y-1">
              {video.prompts.map((prompt, i) => (
                <li key={prompt} className="flex gap-2 text-sm text-primary-text">
                  <span className="font-semibold text-green-dark">{i + 1}.</span>
                  {prompt}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button asChild className="rounded-xl">
              <Link href="/personality-cv/preview">
                <Eye aria-hidden />
                See it as a reviewer
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/personality-cv/record">
                <RotateCcw aria-hidden />
                Change video
              </Link>
            </Button>
            <RemoveVideoButton />
          </div>
        </section>

        <div className="space-y-6">
          <section
            aria-labelledby="views"
            className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
          >
            <h2 id="views" className="text-sm font-semibold text-primary-text">
              Watched {views.length} {views.length === 1 ? "time" : "times"}
            </h2>
            {views.length === 0 ? (
              <p className="mt-2 text-sm text-secondary-text">
                When a university or scholarship panel watches it from your application, you&apos;ll see it here.
              </p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {views.slice(0, 5).map((view) => (
                  <li key={view.id} className="flex items-start gap-2.5 text-sm">
                    {view.viewer_type === "employer" ? (
                      <Building2 className="mt-0.5 size-4 shrink-0 text-green-dark" aria-hidden />
                    ) : (
                      <GraduationCap className="mt-0.5 size-4 shrink-0 text-green-dark" aria-hidden />
                    )}
                    <span className="min-w-0 flex-1 text-primary-text">{view.viewer_label}</span>
                    <span className="shrink-0 text-xs text-secondary-text">{when(view.viewed_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section
            aria-labelledby="who"
            className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 id="who" className="text-sm font-semibold text-primary-text">
                Who can watch
              </h2>
              <Link
                href="/personality-cv/settings"
                className="inline-flex items-center gap-1 text-xs font-medium text-green-dark hover:underline"
              >
                <Settings2 className="size-3.5" aria-hidden />
                Change
              </Link>
            </div>
            <p className="mt-1.5 text-sm text-secondary-text">{VISIBILITY[profile.visibility]}</p>
            <p className="mt-1 text-xs text-secondary-text">
              {profile.attach_by_default
                ? "Attached to new applications automatically."
                : "You choose per application."}
            </p>
          </section>

          <section className="rounded-2xl border border-green/30 bg-soft-green/40 p-4 sm:p-5 dark:bg-green/10">
            <h2 className="text-sm font-semibold text-primary-text">Turn it into your Signia page</h2>
            <p className="mt-1 text-sm text-secondary-text">
              Use this video as your introduction, then add projects, documents and links as proof of your work.
            </p>
            <RouteButton href="/signia" size="sm" className="mt-3 rounded-lg">
              Continue to Signia
            </RouteButton>
          </section>
        </div>
      </div>
    </div>
  );
}
