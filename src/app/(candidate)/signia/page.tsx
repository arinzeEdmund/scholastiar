import { ArrowRight, Eye, FolderPlus, Images, Link2, PenSquare, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { StrengthRing } from "@/components/candidate/strength-ring";
import { CopyLinkButton } from "@/components/content/copy-link-button";
import { PageHeader } from "@/components/layout/page-header";
import { PublishToggle } from "@/components/signia/publish-toggle";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Button } from "@/components/ui/button";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";
import { signiaCompleteness } from "@/lib/signia/completeness";
import { PROJECT_TYPES, VISIBILITY_LABELS } from "@/lib/signia/labels";

export const metadata: Metadata = { title: "Signia" };

export default async function SigniaHomePage() {
  const { user } = await requireCandidate();
  const result = await safeLoad(() =>
    Promise.all([
      repos.signia.get(user.user_id),
      repos.personality.get(user.user_id),
      repos.candidate.getBundle(user.user_id),
    ]),
  );
  const header = (
    <PageHeader
      eyebrow="Signia"
      title="Show the work behind your CV"
      description="Projects, research, media and links in one portfolio. Admissions teams and scholarship panels see proof, not just claims."
      actions={
        <>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/signia/preview">
              <Eye aria-hidden />
              Preview
            </Link>
          </Button>
          <Button asChild className="rounded-xl">
            <Link href="/signia/projects/new">
              <FolderPlus aria-hidden />
              Add a project
            </Link>
          </Button>
        </>
      }
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
  const [signia, personality, bundle] = result.data;
  const { profile, projects, media, links } = signia;
  const completeness = signiaCompleteness(signia, Boolean(personality.video));
  const proven = new Set(projects.flatMap((p) => p.skills.map((s) => s.toLowerCase())));
  const skills = bundle.skills.map((s) => ({ name: s.skill_name, proven: proven.has(s.skill_name.toLowerCase()) }));

  if (!profile) {
    return (
      <div className="space-y-6">
        {header}
        <section className="grain relative overflow-hidden rounded-3xl aurora-dark p-6 text-white sm:p-10">
          <div className="relative max-w-2xl">
            <Sparkles className="size-8 text-mint" aria-hidden />
            <h2 className="mt-4 text-2xl font-bold">Start your portfolio in two minutes</h2>
            <p className="mt-2 text-white/75">
              Pick a handle for your page, write one line about yourself, then add your first project. You choose
              what&apos;s public, what only reviewers see, and what stays private.
            </p>
            <Button asChild variant="inverse" size="lg" className="mt-6 rounded-xl">
              <Link href="/signia/builder">
                Set up Signia
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const live = profile.public_status === "published" && profile.discoverability === "public";

  return (
    <div className="space-y-6">
      {header}
      <div className="grid gap-6 *:min-w-0 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section
            aria-labelledby="sg-status"
            className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="sg-status" className="min-w-0 text-sm font-semibold break-all text-primary-text">
                scholastiar.ai/s/{profile.handle}
              </h2>
              <PublishToggle published={profile.public_status === "published"} />
            </div>
            <p className="mt-1 text-sm text-secondary-text">
              {live
                ? "Anyone with the link can open your page. Share it in applications, emails and on LinkedIn."
                : profile.public_status === "published"
                  ? "Published for application reviewers only — there's no public page."
                  : "Not published yet. Only you can see it."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {live && (
                <>
                  <Button asChild variant="outline" size="sm" className="rounded-lg">
                    <Link href={`/s/${profile.handle}`}>Open public page</Link>
                  </Button>
                  <CopyLinkButton path={`/s/${profile.handle}`} label="Copy page link" />
                </>
              )}
              <Button asChild variant="outline" size="sm" className="rounded-lg">
                <Link href="/signia/builder">
                  <PenSquare aria-hidden />
                  Edit page
                </Link>
              </Button>
            </div>
          </section>

          <section
            aria-labelledby="sg-projects"
            className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="sg-projects" className="text-sm font-semibold text-primary-text">
                Projects · {projects.length}
              </h2>
              <Link href="/signia/projects/new" className="text-xs font-medium text-green-dark hover:underline">
                Add a project
              </Link>
            </div>
            {projects.length === 0 ? (
              <p className="mt-2 text-sm text-secondary-text">
                Coursework, research, volunteering, a club you ran — anything you can show. Start with what you&apos;re
                proudest of.
              </p>
            ) : (
              <ul className="-mx-2 mt-2 divide-y divide-border/60">
                {projects.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/signia/projects/${p.id}`}
                      className="group flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-soft dark:hover:bg-white/[0.04]"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.6875rem] font-semibold text-green-dark">
                          {PROJECT_TYPES[p.project_type]} · {VISIBILITY_LABELS[p.visibility].label}
                        </span>
                        <span className="block truncate text-sm font-semibold text-primary-text group-hover:text-green-dark">
                          {p.title}
                        </span>
                        <span className="block truncate text-xs text-secondary-text">{p.outcome || p.summary}</span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-subtle-text" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/signia/media"
              className="group rounded-2xl border bg-card p-4 shadow-xs transition-colors hover:border-green/40 sm:p-5 dark:bg-white/[0.03]"
            >
              <Images className="size-5 text-green-dark" aria-hidden />
              <p className="mt-2 font-semibold text-primary-text">Media and documents</p>
              <p className="text-sm text-secondary-text">
                {media.length} item{media.length === 1 ? "" : "s"} — posters, papers, slides, videos
              </p>
            </Link>
            <Link
              href="/signia/social-links"
              className="group rounded-2xl border bg-card p-4 shadow-xs transition-colors hover:border-green/40 sm:p-5 dark:bg-white/[0.03]"
            >
              <Link2 className="size-5 text-green-dark" aria-hidden />
              <p className="mt-2 font-semibold text-primary-text">Links</p>
              <p className="text-sm text-secondary-text">
                {links.length} link{links.length === 1 ? "" : "s"} — LinkedIn, GitHub, research profiles
              </p>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <section
            aria-labelledby="sg-complete"
            className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
          >
            <h2 id="sg-complete" className="text-sm font-semibold text-primary-text">
              Portfolio strength
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <StrengthRing score={completeness.score} size={56} />
              <p className="text-sm text-secondary-text">
                {completeness.next.length
                  ? `${completeness.next.length} ${completeness.next.length === 1 ? "step" : "steps"} would make it stronger`
                  : "Everything is in place"}
              </p>
            </div>
            {completeness.next.length > 0 && (
              <ul className="-mx-2 mt-3 space-y-0.5 border-t pt-3">
                {completeness.next.slice(0, 3).map((step) => (
                  <li key={step.key}>
                    <Link
                      href={step.href}
                      className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-soft dark:hover:bg-white/5"
                    >
                      <span className="text-primary-text">{step.label}</span>
                      <span className="shrink-0 text-xs font-semibold text-green-dark">+{step.weight}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section
            aria-labelledby="sg-skills"
            className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
          >
            <h2 id="sg-skills" className="text-sm font-semibold text-primary-text">
              Skills with proof
            </h2>
            <p className="mt-0.5 text-xs text-secondary-text">A skill is proven when a project shows it.</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <li
                  key={s.name}
                  className={
                    s.proven
                      ? "rounded-full bg-soft-green px-2 py-0.5 text-xs font-medium text-green-dark dark:bg-green/15"
                      : "rounded-full border border-dashed px-2 py-0.5 text-xs text-secondary-text"
                  }
                >
                  {s.name}
                  <span className="sr-only">{s.proven ? " (proven by a project)" : " (no proof yet)"}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
