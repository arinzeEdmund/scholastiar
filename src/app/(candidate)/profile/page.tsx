import {
  Award,
  Briefcase,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Languages,
  Lightbulb,
  Link2,
  MapPin,
  Pencil,
  Plane,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Video,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { StrengthRing } from "@/components/candidate/strength-ring";
import { RouteButton } from "@/components/layout/route-button";
import { Button } from "@/components/ui/button";
import { repos } from "@/data";
import {
  DEGREE_LEVEL,
  DOCUMENT_TYPES,
  EMPLOYMENT_TYPE,
  GOALS,
  LANGUAGE_LEVEL,
  PERMIT_STATUS,
  PROFILE_VISIBILITY,
  SKILL_LEVEL,
  SKILL_TYPE,
  SPONSORSHIP_NEED,
  STUDY_STATUS,
  WORK_MODES,
  formatDay,
  formatRange,
  labelFor,
} from "@/lib/candidate/labels";
import { profileStrength } from "@/lib/candidate/strength";
import { requireCandidate } from "@/lib/guards";
import { initials } from "@/lib/initials";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Your profile" };

function Panel({
  id,
  title,
  icon: Icon,
  editHref,
  editLabel = "Edit",
  children,
  className,
}: {
  id?: string;
  title: string;
  icon: typeof Briefcase;
  editHref?: string;
  editLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 rounded-2xl border bg-card p-5 shadow-xs dark:bg-white/[0.03]", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-semibold text-primary-text">
          <Icon className="size-4 text-green-dark" aria-hidden />
          {title}
        </h2>
        {editHref && (
          <Link
            href={editHref}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-green-dark hover:bg-soft-green/60 dark:hover:bg-green/10"
            aria-label={`${editLabel}: ${title}`}
          >
            <Pencil className="size-3" aria-hidden />
            {editLabel}
          </Link>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Missing({ children, href, action }: { children: ReactNode; href: string; action: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-3.5 text-sm text-secondary-text">
      {children}
      <Button asChild variant="outline" size="sm" className="rounded-lg">
        <Link href={href}>
          <Plus aria-hidden />
          {action}
        </Link>
      </Button>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 text-sm">
      <dt className="text-secondary-text">{label}</dt>
      <dd className={cn("text-right font-medium text-primary-text", !children && "font-normal text-subtle-text")}>
        {children || "Not added"}
      </dd>
    </div>
  );
}

export default async function ProfilePage() {
  const { user } = await requireCandidate();
  const [bundle, countries, permitTypes] = await Promise.all([
    repos.candidate.getBundle(user.user_id),
    repos.reference.listCountries(),
    repos.candidate.listPermitTypes(),
  ]);
  const { profile, visa, education, experience, skills, certifications, preferences, documents } = bundle;
  const strength = profileStrength(bundle);
  const country = (code: string | null) => countries.find((c) => c.iso2 === code)?.name ?? null;
  const countryList = (codes: string[]) => codes.map(country).filter(Boolean).join(", ");
  const permit = permitTypes.find((p) => p.id === visa.post_study_permit_type_id);
  const location = [profile.current_city, country(profile.current_country_code)].filter(Boolean).join(", ");
  const skillsByType = Object.entries(SKILL_TYPE)
    .map(([type, label]) => ({ label, items: skills.filter((s) => s.skill_type === type) }))
    .filter((g) => g.items.length > 0);
  const links = [
    { label: "LinkedIn", url: profile.linkedin_url },
    { label: "Portfolio", url: profile.portfolio_url },
    { label: "Website", url: profile.website_url },
  ].filter((l): l is { label: string; url: string } => Boolean(l.url));

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
        <div className="grain relative h-24 aurora-dark sm:h-28" aria-hidden />
        <div className="relative px-5 pb-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="-mt-10 flex size-20 shrink-0 items-center justify-center rounded-2xl bg-soft-green text-2xl font-bold text-green-dark ring-4 ring-card sm:-mt-12 sm:size-24 sm:text-3xl">
                {initials(user.full_name)}
              </span>
              <div className="min-w-0 pt-3 pb-1">
                <h1 className="text-xl font-bold tracking-tight text-primary-text sm:text-2xl">{user.full_name}</h1>
                <p className="text-sm text-secondary-text">
                  {profile.headline ?? "Add a headline so employers know what you do"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:pb-1">
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/profile/edit">
                  <Pencil aria-hidden />
                  Edit profile
                </Link>
              </Button>
              <RouteButton href="/ai-cv" className="rounded-xl">
                <Sparkles aria-hidden />
                Create a CV
              </RouteButton>
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-secondary-text">
            {location && (
              <li className="flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden />
                {location}
              </li>
            )}
            {profile.nationality_country_code && (
              <li className="flex items-center gap-1.5">
                <Globe className="size-4" aria-hidden />
                {country(profile.nationality_country_code)} passport
              </li>
            )}
            {profile.languages.length > 0 && (
              <li className="flex items-center gap-1.5">
                <Languages className="size-4" aria-hidden />
                {profile.languages.map((l) => l.name).join(", ")}
              </li>
            )}
            {visa.study_status && (
              <li className="flex items-center gap-1.5">
                <GraduationCap className="size-4" aria-hidden />
                {STUDY_STATUS[visa.study_status].label}
                {visa.institution_name ? ` · ${visa.institution_name}` : ""}
              </li>
            )}
          </ul>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-4">
          <Panel title="About" icon={FileText} editHref="/profile/edit#about">
            {profile.professional_summary ? (
              <p className="text-sm leading-relaxed whitespace-pre-line text-primary-text/90">
                {profile.professional_summary}
              </p>
            ) : (
              <Missing href="/profile/edit#about" action="Write a summary">
                A short summary helps the AI write applications that sound like you.
              </Missing>
            )}
          </Panel>

          <Panel
            id="experience"
            title="Experience"
            icon={Briefcase}
            editHref="/profile/edit#experience"
            editLabel="Manage"
          >
            {experience.length ? (
              <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[0.4rem] before:w-px before:bg-border">
                {experience.map((e) => (
                  <li key={e.id} className="relative pl-7">
                    <span
                      className="absolute top-1.5 left-0 size-3.5 rounded-full border-2 border-green bg-card"
                      aria-hidden
                    />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="font-semibold text-primary-text">{e.job_title}</p>
                      <Link
                        href={`/profile/experience/${e.id}`}
                        className="text-xs font-medium text-green-dark hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                    <p className="text-sm text-secondary-text">
                      {e.company_name} · {labelFor(EMPLOYMENT_TYPE, e.employment_type)}
                    </p>
                    <p className="text-xs text-secondary-text">
                      {[formatRange(e.start_date, e.end_date, e.is_current), e.city].filter(Boolean).join(" · ")}
                    </p>
                    {e.achievements.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-primary-text/90">
                        {e.achievements.map((a) => (
                          <li key={a} className="flex gap-2">
                            <span className="mt-2 size-1 shrink-0 rounded-full bg-green" aria-hidden />
                            {a}
                          </li>
                        ))}
                      </ul>
                    )}
                    {e.tools_used.length > 0 && (
                      <p className="mt-2 flex flex-wrap gap-1">
                        {e.tools_used.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-soft px-1.5 py-0.5 text-[0.6875rem] text-secondary-text dark:bg-white/5"
                          >
                            {t}
                          </span>
                        ))}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <Missing href="/profile/experience/new" action="Add experience">
                Jobs, internships, placements and volunteering all count.
              </Missing>
            )}
          </Panel>

          <Panel
            id="education"
            title="Education"
            icon={GraduationCap}
            editHref="/profile/edit#education"
            editLabel="Manage"
          >
            {education.length ? (
              <ul className="space-y-4">
                {education.map((e) => (
                  <li key={e.id} className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-soft-green text-green-dark dark:bg-green/10">
                      <GraduationCap className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-primary-text">{e.qualification_name}</p>
                      <p className="text-sm text-secondary-text">
                        {e.institution_name}
                        {e.country_code ? `, ${country(e.country_code)}` : ""}
                      </p>
                      <p className="text-xs text-secondary-text">
                        {[labelFor(DEGREE_LEVEL, e.degree_level), formatRange(e.start_date, e.end_date, false), e.grade]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {e.description && <p className="mt-1 text-sm text-primary-text/90">{e.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Missing href="/profile/edit#education" action="Add education">
                Add your degrees and the course you&apos;re starting.
              </Missing>
            )}
          </Panel>

          <Panel title="Skills" icon={Sparkles} editHref="/profile/skills">
            {skills.length ? (
              <div className="space-y-4">
                {skillsByType.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-medium text-secondary-text">{group.label}</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((s) => {
                        const level = ["beginner", "intermediate", "advanced", "expert"].indexOf(s.proficiency_level);
                        return (
                          <li
                            key={s.id}
                            className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm text-primary-text dark:bg-white/[0.03]"
                            title={SKILL_LEVEL[s.proficiency_level]}
                          >
                            {s.skill_name}
                            <span className="flex gap-0.5" aria-label={SKILL_LEVEL[s.proficiency_level]}>
                              {[0, 1, 2, 3].map((i) => (
                                <span
                                  key={i}
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    i <= level ? "bg-green" : "bg-neutral-soft dark:bg-white/15",
                                  )}
                                />
                              ))}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                {certifications.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-secondary-text">
                      <Award className="size-3.5" aria-hidden />
                      Certifications
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {certifications.map((c) => (
                        <li key={c.id}>
                          <span className="font-medium text-primary-text">{c.name}</span>
                          <span className="text-secondary-text">
                            {" "}
                            · {c.issuer}
                            {c.issue_date ? ` · ${formatRange(c.issue_date, null, false)}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Missing href="/profile/skills" action="Add skills">
                Add at least five skills with your level.
              </Missing>
            )}
          </Panel>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border bg-card p-5 shadow-xs dark:bg-white/[0.03]">
            <div className="flex items-center gap-4">
              <StrengthRing score={strength.score} size={64} />
              <div>
                <h2 className="font-semibold text-primary-text">Profile strength</h2>
                <p className="text-sm text-secondary-text capitalize">{strength.level}</p>
              </div>
            </div>
            {strength.next.length > 0 && (
              <ul className="mt-4 space-y-2 border-t pt-4">
                {strength.next.slice(0, 3).map((item) => (
                  <li key={item.key}>
                    <Link href={item.href} className="flex gap-2.5 text-sm hover:text-green-dark">
                      <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                      <span>
                        <span className="font-medium text-primary-text">{item.label}</span>
                        <span className="block text-xs text-secondary-text">{item.tip}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Panel title="Visa and mobility" icon={Plane} editHref="/profile/visa">
            <dl className="divide-y">
              <Fact label="Status">{visa.study_status && STUDY_STATUS[visa.study_status].label}</Fact>
              <Fact label="Studying in">{country(visa.study_country_code)}</Fact>
              {visa.study_status !== "graduated" && (
                <Fact label="Term-time hours">
                  {visa.term_time_weekly_hour_limit !== null && `Up to ${visa.term_time_weekly_hour_limit}/week`}
                </Fact>
              )}
              <Fact label="Post-study permit">{permit && `${permit.name}`}</Fact>
              {permit && <Fact label="Permit status">{PERMIT_STATUS[visa.post_study_permit_status]}</Fact>}
              {visa.post_study_permit_expiry_date && (
                <Fact label="Permit ends">{formatDay(visa.post_study_permit_expiry_date)}</Fact>
              )}
              <Fact label="Sponsorship later">{labelFor(SPONSORSHIP_NEED, visa.needs_sponsorship_after_study)}</Fact>
              <Fact label="Target countries">{countryList(visa.target_country_codes)}</Fact>
            </dl>
          </Panel>

          <Panel title="Looking for" icon={SlidersHorizontal} editHref="/profile/preferences">
            {preferences.goals.length ? (
              <div className="space-y-3 text-sm">
                <ul className="flex flex-wrap gap-1.5">
                  {preferences.goals.map((g) => (
                    <li
                      key={g}
                      className="rounded-full bg-soft-green px-2.5 py-0.5 text-xs font-medium text-green-dark dark:bg-green/15"
                    >
                      {GOALS[g].label}
                    </li>
                  ))}
                </ul>
                <dl className="divide-y">
                  <Fact label="Roles">{preferences.target_roles.join(", ")}</Fact>
                  <Fact label="Countries">{countryList(preferences.target_country_codes)}</Fact>
                  {preferences.work_modes.length > 0 && (
                    <Fact label="Work">{preferences.work_modes.map((m) => WORK_MODES[m]).join(", ")}</Fact>
                  )}
                  {preferences.pay_min !== null && (
                    <Fact label="Minimum pay">
                      {new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: preferences.pay_currency,
                        maximumFractionDigits: 2,
                      }).format(preferences.pay_min)}
                      /{preferences.pay_period}
                    </Fact>
                  )}
                </dl>
              </div>
            ) : (
              <Missing href="/profile/preferences" action="Add goals">
                Tell us what you&apos;re looking for.
              </Missing>
            )}
          </Panel>

          <Panel title="Documents" icon={FileText} editHref="/profile/documents" editLabel="Open">
            {documents.length ? (
              <ul className="space-y-2">
                {documents.slice(0, 4).map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-primary-text">{d.file_name}</span>
                    <span className="shrink-0 rounded-md bg-soft px-1.5 py-0.5 text-[0.6875rem] text-secondary-text dark:bg-white/5">
                      {DOCUMENT_TYPES[d.document_type]}
                    </span>
                  </li>
                ))}
                {documents.length > 4 && <li className="text-xs text-secondary-text">+{documents.length - 4} more</li>}
              </ul>
            ) : (
              <Missing href="/profile/documents" action="Upload">
                Upload your CV and transcripts.
              </Missing>
            )}
          </Panel>

          <Panel title="PersonalityAI CV" icon={Video}>
            <p className="text-sm text-secondary-text">
              Not added yet. A one-minute video helps admissions teams meet you.
            </p>
            <RouteButton href="/personality-cv/record" variant="outline" size="sm" className="mt-3 rounded-lg">
              <Video aria-hidden />
              Record
            </RouteButton>
          </Panel>

          <Panel title="Links and visibility" icon={Link2} editHref="/profile/edit#about">
            {links.length > 0 && (
              <ul className="mb-3 space-y-1.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-green-dark hover:underline"
                    >
                      {l.label}
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-sm text-secondary-text">
              Visible to:{" "}
              <span className="font-medium text-primary-text">
                {PROFILE_VISIBILITY[profile.profile_visibility].label}
              </span>
            </p>
            <p className="mt-1 text-xs text-secondary-text">
              Languages:{" "}
              {profile.languages.length
                ? profile.languages.map((l) => `${l.name} (${LANGUAGE_LEVEL[l.level].toLowerCase()})`).join(", ")
                : "none"}
            </p>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
