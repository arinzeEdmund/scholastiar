import { ArrowUpRight, FileText, Film, GraduationCap, ImageIcon, Link2, MapPin, Presentation } from "lucide-react";

import { VideoEmbed } from "@/components/video/video-embed";
import { parseVideoLink } from "@/lib/video-embed";
import type { SigniaBundle } from "@/data/repositories/signia";
import type { SigniaMediaItem, SigniaVisibility } from "@/data/types";
import { flag } from "@/lib/flags";
import { initials } from "@/lib/initials";
import { PLATFORMS, PROJECT_TYPES, SECTION_LABELS } from "@/lib/signia/labels";

export interface PortfolioOwner {
  name: string;
  nationalityCode: string | null;
  nationality: string | null;
  education: string | null;
  /** The PersonalityAI CV video link, when it may be shown here. */
  videoUrl: string | null;
}

const MEDIA_ICONS = {
  video: Film,
  image: ImageIcon,
  document: FileText,
  deck: Presentation,
  certificate: FileText,
  other: FileText,
};

const year = (date: string | null) => (date ? date.slice(0, 4) : null);

/** Only items the audience may see: the public sees public items; reviewers also see application-only ones. */
export function visibleTo(audience: "public" | "reviewer") {
  return (item: { visibility: SigniaVisibility }) =>
    item.visibility === "public" || (audience === "reviewer" && item.visibility === "application_only");
}

function MediaTile({ item }: { item: SigniaMediaItem }) {
  const Icon = MEDIA_ICONS[item.media_type];
  if (parseVideoLink(item.url)) {
    return (
      <li className="col-span-full overflow-hidden rounded-xl border bg-card md:col-span-2 dark:bg-white/[0.03]">
        <VideoEmbed url={item.url} title={item.title} className="rounded-none" />
        <div className="p-3">
          <p className="truncate text-sm font-semibold text-primary-text">{item.title}</p>
          {item.description && <p className="line-clamp-2 text-xs text-secondary-text">{item.description}</p>}
        </div>
      </li>
    );
  }
  return (
    <li className="overflow-hidden rounded-xl border bg-card dark:bg-white/[0.03]">
      <a href={item.url} target="_blank" rel="noopener noreferrer nofollow" className="group block">
        {item.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- platform thumbnail
          <img src={item.thumbnail_url} alt="" className="aspect-video w-full object-cover" />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-soft-green/60 dark:bg-green/10">
            <Icon className="size-8 text-green-dark" aria-hidden />
          </div>
        )}
        <div className="p-3">
          <p className="flex items-center gap-1 truncate text-sm font-semibold text-primary-text group-hover:text-green-dark">
            {item.title}
            <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </p>
          <p className="truncate text-xs text-secondary-text">{item.host_label}</p>
        </div>
      </a>
    </li>
  );
}

/** A Signia portfolio as an audience sees it. Sections follow the owner's order and switches. */
export function SigniaPortfolio({
  bundle,
  owner,
  audience,
}: {
  bundle: SigniaBundle;
  owner: PortfolioOwner;
  audience: "public" | "reviewer";
}) {
  const { profile } = bundle;
  if (!profile) return null;
  const can = visibleTo(audience);
  const projects = bundle.projects.filter(can);
  const media = bundle.media.filter(can);
  const links = bundle.links.filter(can);

  const sections = profile.sections
    .filter((s) => s.visible)
    .map((s) => {
      switch (s.key) {
        case "personality_cv":
          return owner.videoUrl ? (
            <section key={s.key} aria-label={SECTION_LABELS[s.key]}>
              <VideoEmbed url={owner.videoUrl} title={`${owner.name}, video introduction`} className="max-w-2xl" />
            </section>
          ) : null;
        case "overview":
          return profile.summary ? (
            <section key={s.key} aria-labelledby="sg-about">
              <h2 id="sg-about" className="text-lg font-semibold text-primary-text">
                {SECTION_LABELS[s.key]}
              </h2>
              <p className="mt-2 max-w-3xl leading-relaxed whitespace-pre-line text-secondary-text">
                {profile.summary}
              </p>
            </section>
          ) : null;
        case "current_work":
          return profile.current_work_summary ? (
            <section
              key={s.key}
              aria-labelledby="sg-now"
              className="rounded-2xl border border-green/30 bg-soft-green/40 p-5 dark:bg-green/10"
            >
              <h2 id="sg-now" className="text-sm font-semibold tracking-wide text-green-dark uppercase">
                {SECTION_LABELS[s.key]}
              </h2>
              <p className="mt-1.5 text-primary-text">{profile.current_work_summary}</p>
            </section>
          ) : null;
        case "projects":
          return projects.length ? (
            <section key={s.key} aria-labelledby="sg-projects">
              <h2 id="sg-projects" className="text-lg font-semibold text-primary-text">
                {SECTION_LABELS[s.key]}
              </h2>
              <ul className="mt-3 grid gap-4 md:grid-cols-2">
                {projects.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-col rounded-2xl border bg-card p-5 shadow-xs dark:bg-white/[0.03]"
                  >
                    <p className="text-xs font-semibold text-green-dark">
                      {PROJECT_TYPES[p.project_type]}
                      {year(p.start_date) &&
                        ` · ${year(p.start_date)}${p.end_date && year(p.end_date) !== year(p.start_date) ? `–${year(p.end_date)}` : ""}`}
                      {p.status === "in_progress" && " · in progress"}
                    </p>
                    <h3 className="mt-1 font-semibold text-primary-text">{p.title}</h3>
                    <p className="mt-1 text-sm text-secondary-text">{p.summary}</p>
                    <dl className="mt-3 space-y-2 text-sm">
                      {p.role_description && (
                        <div>
                          <dt className="text-xs font-medium text-secondary-text">My role</dt>
                          <dd className="text-primary-text">{p.role_description}</dd>
                        </div>
                      )}
                      {p.outcome && (
                        <div>
                          <dt className="text-xs font-medium text-secondary-text">Result</dt>
                          <dd className="font-medium text-primary-text">{p.outcome}</dd>
                        </div>
                      )}
                    </dl>
                    {p.skills.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {p.skills.map((skill) => (
                          <li
                            key={skill}
                            className="rounded-full bg-neutral-soft px-2 py-0.5 text-xs text-secondary-text dark:bg-white/10"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    )}
                    {p.links.length > 0 && (
                      <ul className="mt-auto flex flex-wrap gap-3 pt-4">
                        {p.links.map((link) => (
                          <li key={link.id}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="inline-flex items-center gap-1 text-sm font-medium text-green-dark hover:underline"
                            >
                              {link.label}
                              <ArrowUpRight className="size-3.5" aria-hidden />
                              <span className="sr-only">(opens in a new tab)</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null;
        case "media":
          return media.length ? (
            <section key={s.key} aria-labelledby="sg-media">
              <h2 id="sg-media" className="text-lg font-semibold text-primary-text">
                {SECTION_LABELS[s.key]}
              </h2>
              <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                {media.map((item) => (
                  <MediaTile key={item.id} item={item} />
                ))}
              </ul>
            </section>
          ) : null;
        case "social_links":
          return links.length ? (
            <section key={s.key} aria-labelledby="sg-links">
              <h2 id="sg-links" className="text-lg font-semibold text-primary-text">
                {SECTION_LABELS[s.key]}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow me"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border bg-card px-3.5 text-sm font-medium text-primary-text hover:border-green/50 dark:bg-white/[0.03]"
                    >
                      <Link2 className="size-3.5 text-green-dark" aria-hidden />
                      {link.label || PLATFORMS[link.platform].label}
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null;
      }
    })
    .filter(Boolean);

  return (
    <div className="space-y-10">
      <header className="grain relative overflow-hidden rounded-3xl aurora-dark p-6 text-white sm:p-10">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-white/10 text-2xl font-bold ring-1 ring-white/20">
            {initials(owner.name)}
          </span>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{owner.name}</h1>
            <p className="mt-1.5 max-w-2xl text-lg text-white/80">{profile.headline}</p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/70">
              {owner.nationality && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" aria-hidden />
                  <span aria-hidden>{flag(owner.nationalityCode)}</span>
                  {owner.nationality}
                </span>
              )}
              {owner.education && (
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="size-3.5" aria-hidden />
                  {owner.education}
                </span>
              )}
            </p>
          </div>
        </div>
      </header>
      {sections.length ? sections : <p className="text-secondary-text">Nothing has been shared here yet.</p>}
      <footer className="border-t pt-5 text-xs text-secondary-text">
        A Signia portfolio on Scholastiar.ai · scholastiar.ai/s/{profile.handle}
      </footer>
    </div>
  );
}
