import {
  AlertCircle,
  Award,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Compass,
  GraduationCap,
  Pencil,
  Plane,
  Sparkles,
  UserRound,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { FinishOnboarding } from "@/components/candidate/onboarding/finish-button";
import { StepFrame } from "@/components/candidate/onboarding/step-frame";
import { StrengthRing } from "@/components/candidate/strength-ring";
import { repos } from "@/data";
import type { OnboardingStep } from "@/data/types";
import { flag } from "@/lib/flags";
import {
  COMMUNICATION_STYLE,
  DEGREE_LEVEL,
  EMPLOYMENT_TYPE,
  GOALS,
  LANGUAGE_LEVEL,
  PERMIT_STATUS,
  SKILL_LEVEL,
  SPONSORSHIP_NEED,
  STUDY_STATUS,
  formatRange,
  labelFor,
} from "@/lib/candidate/labels";
import { profileStrength, type StrengthItem } from "@/lib/candidate/strength";
import { requireCandidate } from "@/lib/guards";
import { initials } from "@/lib/initials";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Review · Set up your profile" };

type Status = "done" | "missing" | "optional";

const STATUS_META: Record<Status, { label: string; className: string }> = {
  done: { label: "Complete", className: "bg-soft-green text-green-dark dark:bg-green/15" },
  missing: { label: "Needs attention", className: "bg-warning-soft text-warning" },
  optional: { label: "Optional", className: "bg-neutral-soft text-secondary-text dark:bg-white/10" },
};

function ReviewCard({
  icon: Icon,
  title,
  step,
  status,
  fix,
  children,
}: {
  icon: LucideIcon;
  title: string;
  step: OnboardingStep;
  status: Status;
  fix?: StrengthItem;
  children?: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`review-${step}`}
      className="overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]"
    >
      <div className="flex items-center gap-3 border-b px-4 py-3 sm:px-5">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            status === "done" ? "bg-green-action text-white" : "bg-soft-green text-green-dark dark:bg-green/10",
          )}
        >
          <Icon className="size-[1.1rem]" aria-hidden />
        </span>
        <h2 id={`review-${step}`} className="min-w-0 flex-1 font-semibold text-primary-text">
          {title}
        </h2>
        <span
          className={cn(
            "hidden rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold sm:inline",
            STATUS_META[status].className,
          )}
        >
          {STATUS_META[status].label}
        </span>
        <Link
          href={`/onboarding/${step}`}
          className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium text-primary-text transition-colors hover:border-green/50 hover:text-green-dark"
          aria-label={`Edit ${title.toLowerCase()}`}
        >
          <Pencil className="size-3" aria-hidden />
          Edit
        </Link>
      </div>
      {children && <div className="p-4 sm:p-5">{children}</div>}
      {fix && (
        <Link
          href={`/onboarding/${step}`}
          className="group flex items-center gap-3 border-t bg-warning-soft/50 px-4 py-2.5 text-sm transition-colors hover:bg-warning-soft sm:px-5 dark:bg-warning/10"
        >
          <AlertCircle className="size-4 shrink-0 text-warning" aria-hidden />
          <span className="min-w-0 flex-1 text-primary-text">{fix.tip}</span>
          <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-[0.6875rem] font-bold text-green-dark shadow-xs dark:bg-white/10">
            +{Math.round(fix.weight * (1 - fix.progress))} pts
          </span>
        </Link>
      )}
    </section>
  );
}

/** Small labelled value tile. */
function Fact({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="rounded-xl bg-soft px-3 py-2.5 dark:bg-white/[0.04]">
      <p className="text-[0.6875rem] text-secondary-text">{label}</p>
      <p className={cn("mt-0.5 text-sm font-semibold", value ? "text-primary-text" : "font-normal text-subtle-text")}>
        {value || "Not added"}
      </p>
      {sub && <p className="text-[0.6875rem] text-secondary-text">{sub}</p>}
    </div>
  );
}

function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "green"
          ? "bg-soft-green text-green-dark dark:bg-green/15"
          : "border bg-background text-primary-text dark:bg-white/[0.03]",
      )}
    >
      {children}
    </span>
  );
}

export default async function ReviewStepPage() {
  const { user } = await requireCandidate();
  const [bundle, countries, permitTypes] = await Promise.all([
    repos.candidate.getBundle(user.user_id),
    repos.reference.listCountries(),
    repos.candidate.listPermitTypes(),
  ]);
  const { profile, visa, education, experience, skills, certifications, preferences } = bundle;
  const strength = profileStrength(bundle);
  const fixFor = (key: string) => strength.next.find((i) => i.key === key);
  const country = (code: string | null) => countries.find((c) => c.iso2 === code)?.name ?? null;
  const permit = permitTypes.find((p) => p.id === visa.post_study_permit_type_id);
  const levelIndex = (level: string) => ["beginner", "intermediate", "advanced", "expert"].indexOf(level);

  const sections: { step: OnboardingStep; label: string; status: Status }[] = [
    { step: "personal", label: "About you", status: profile.nationality_country_code ? "done" : "missing" },
    { step: "visa", label: "Study and visa", status: visa.study_status ? "done" : "missing" },
    { step: "education", label: "Education", status: education.length ? "done" : "missing" },
    { step: "experience", label: "Experience", status: experience.length ? "done" : "missing" },
    { step: "skills", label: "Skills", status: skills.length >= 5 ? "done" : "missing" },
    { step: "preferences", label: "Goals", status: preferences.goals.length ? "done" : "missing" },
    { step: "personality-cv", label: "PersonalityAI", status: "optional" },
  ];
  const doneCount = sections.filter((s) => s.status === "done").length;
  const required = sections.filter((s) => s.status !== "optional").length;

  return (
    <StepFrame step="review">
      {/* Summary */}
      <section className="grain relative overflow-hidden rounded-3xl aurora-dark p-5 text-white sm:p-6">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/10 p-1.5 ring-1 ring-white/15">
              <StrengthRing score={strength.score} size={84} className="[&_span]:text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-mint uppercase">Profile strength</p>
              <p className="text-2xl font-bold tracking-tight capitalize">{strength.level}</p>
              <p className="text-sm text-white/70">
                {doneCount} of {required} sections complete
              </p>
            </div>
          </div>
          <ol className="flex flex-1 flex-wrap gap-1.5 sm:justify-end" aria-label="Sections">
            {sections.map((s) => (
              <li key={s.step}>
                <a
                  href={`#review-${s.step}`}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium ring-1 transition-colors",
                    s.status === "done"
                      ? "bg-mint/15 text-mint ring-mint/30 hover:bg-mint/25"
                      : s.status === "missing"
                        ? "bg-amber-400/15 text-amber-200 ring-amber-300/30 hover:bg-amber-400/25"
                        : "bg-white/5 text-white/60 ring-white/15 hover:bg-white/10",
                  )}
                >
                  {s.status === "done" ? (
                    <CheckCircle2 className="size-3" aria-hidden />
                  ) : s.status === "missing" ? (
                    <AlertCircle className="size-3" aria-hidden />
                  ) : null}
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
        {strength.next.length > 0 && (
          <p className="relative mt-4 border-t border-white/10 pt-3 text-sm text-white/75">
            <span className="font-semibold text-white">Biggest gain:</span> {strength.next[0].tip}{" "}
            <span className="font-semibold text-mint">
              +{Math.round(strength.next[0].weight * (1 - strength.next[0].progress))} pts
            </span>
          </p>
        )}
      </section>

      <div className="mt-4 space-y-4">
        <ReviewCard
          icon={UserRound}
          title="About you"
          step="personal"
          status={sections[0].status}
          fix={fixFor("personal")}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-soft-green text-lg font-bold text-green-dark dark:bg-green/15">
              {initials(user.full_name)}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-primary-text">{user.full_name}</p>
              <p className="text-sm text-secondary-text">
                {profile.nationality_country_code && (
                  <>
                    <span aria-hidden>{flag(profile.nationality_country_code)}</span>{" "}
                    {country(profile.nationality_country_code)} passport
                  </>
                )}
                {profile.current_country_code && (
                  <>
                    {" "}
                    · Lives in{" "}
                    {[profile.current_city, country(profile.current_country_code)].filter(Boolean).join(", ")}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {profile.languages.map((l) => (
              <Chip key={l.name}>
                {l.name}
                <span className="flex gap-0.5" aria-label={LANGUAGE_LEVEL[l.level]}>
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "size-1.5 rounded-full",
                        i <= ["basic", "conversational", "fluent", "native"].indexOf(l.level)
                          ? "bg-green"
                          : "bg-neutral-soft dark:bg-white/15",
                      )}
                    />
                  ))}
                </span>
              </Chip>
            ))}
            <Chip tone="green">
              <Sparkles className="size-3" aria-hidden />
              {COMMUNICATION_STYLE[profile.communication_style].label}
            </Chip>
          </div>
        </ReviewCard>

        <ReviewCard icon={Plane} title="Study and visa" step="visa" status={sections[1].status} fix={fixFor("visa")}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Fact
              label="Status"
              value={labelFor(STUDY_STATUS, visa.study_status)}
              sub={
                visa.study_country_code
                  ? `${flag(visa.study_country_code)} ${country(visa.study_country_code)}`
                  : undefined
              }
            />
            {visa.study_status !== "graduated" ? (
              <Fact
                label="Term-time work"
                value={
                  visa.term_time_weekly_hour_limit !== null ? `${visa.term_time_weekly_hour_limit} hrs/week` : null
                }
                sub={
                  visa.holiday_work_allowed === null
                    ? undefined
                    : visa.holiday_work_allowed
                      ? "Full-time in holidays"
                      : "No holiday work"
                }
              />
            ) : (
              <Fact label="Permit status" value={PERMIT_STATUS[visa.post_study_permit_status]} />
            )}
            <Fact label="Post-study permit" value={permit?.name} />
            <Fact
              label="Sponsorship later"
              value={labelFor(SPONSORSHIP_NEED, visa.needs_sponsorship_after_study)
                ?.replace("Yes, I'll need sponsorship", "Needed")
                .replace("No, I won't need it", "Not needed")}
            />
          </div>
          {visa.institution_name && (
            <p className="mt-3 flex items-center gap-2 text-sm text-secondary-text">
              <GraduationCap className="size-4 text-green-dark" aria-hidden />
              {visa.institution_name}
              {visa.course_start_date && visa.course_end_date && (
                <span className="inline-flex items-center gap-1">
                  · <CalendarClock className="size-3.5" aria-hidden />
                  {formatRange(visa.course_start_date, visa.course_end_date, false)}
                </span>
              )}
            </p>
          )}
          {visa.target_country_codes.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-secondary-text">Aiming for</span>
              {visa.target_country_codes.map((c) => (
                <Chip key={c}>
                  <span aria-hidden>{flag(c)}</span>
                  {country(c)}
                </Chip>
              ))}
            </div>
          )}
        </ReviewCard>

        <ReviewCard
          icon={GraduationCap}
          title="Education"
          step="education"
          status={sections[2].status}
          fix={fixFor("education")}
        >
          {education.length ? (
            <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[0.3rem] before:w-px before:bg-border">
              {education.map((e) => (
                <li key={e.id} className="relative pl-6">
                  <span
                    className="absolute top-1.5 left-0 size-2.5 rounded-full border-2 border-green bg-card"
                    aria-hidden
                  />
                  <p className="text-sm font-semibold text-primary-text">{e.qualification_name}</p>
                  <p className="text-xs text-secondary-text">
                    {[
                      e.institution_name,
                      labelFor(DEGREE_LEVEL, e.degree_level),
                      formatRange(e.start_date, e.end_date, false),
                      e.grade,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </li>
              ))}
            </ol>
          ) : null}
        </ReviewCard>

        <ReviewCard
          icon={Briefcase}
          title="Experience"
          step="experience"
          status={sections[3].status}
          fix={fixFor("experience")}
        >
          {experience.length ? (
            <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[0.3rem] before:w-px before:bg-border">
              {experience.map((e) => (
                <li key={e.id} className="relative pl-6">
                  <span
                    className="absolute top-1.5 left-0 size-2.5 rounded-full border-2 border-green bg-card"
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="text-sm font-semibold text-primary-text">{e.job_title}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[0.625rem] font-semibold",
                        e.achievements.length
                          ? "bg-soft-green text-green-dark dark:bg-green/15"
                          : "bg-warning-soft text-warning",
                      )}
                    >
                      {e.achievements.length} {e.achievements.length === 1 ? "achievement" : "achievements"}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-text">
                    {[
                      e.company_name,
                      labelFor(EMPLOYMENT_TYPE, e.employment_type),
                      formatRange(e.start_date, e.end_date, e.is_current),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {e.achievements[0] && <p className="mt-1 text-sm text-primary-text/90">“{e.achievements[0]}”</p>}
                </li>
              ))}
            </ol>
          ) : null}
        </ReviewCard>

        <ReviewCard icon={Award} title="Skills" step="skills" status={sections[4].status} fix={fixFor("skills")}>
          {skills.length ? (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <Chip key={s.id}>
                  {s.skill_name}
                  <span className="flex gap-0.5" aria-label={SKILL_LEVEL[s.proficiency_level]}>
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          "size-1.5 rounded-full",
                          i <= levelIndex(s.proficiency_level) ? "bg-green" : "bg-neutral-soft dark:bg-white/15",
                        )}
                      />
                    ))}
                  </span>
                </Chip>
              ))}
              {certifications.map((c) => (
                <Chip key={c.id} tone="green">
                  <Award className="size-3" aria-hidden />
                  {c.name}
                </Chip>
              ))}
            </div>
          ) : null}
        </ReviewCard>

        <ReviewCard
          icon={Compass}
          title="What you're looking for"
          step="preferences"
          status={sections[5].status}
          fix={fixFor("preferences")}
        >
          {preferences.goals.length ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {preferences.goals.map((g) => (
                  <Chip key={g} tone="green">
                    <CheckCircle2 className="size-3" aria-hidden />
                    {GOALS[g].label}
                  </Chip>
                ))}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Fact label="Roles" value={preferences.target_roles.join(", ") || null} />
                <Fact
                  label="Countries"
                  value={preferences.target_country_codes.map((c) => `${flag(c)} ${country(c)}`).join("  ") || null}
                />
              </div>
            </div>
          ) : null}
        </ReviewCard>

        <ReviewCard icon={Video} title="PersonalityAI CV" step="personality-cv" status="optional">
          <div className="flex items-center gap-3 rounded-xl border border-dashed px-3.5 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-soft text-secondary-text dark:bg-white/5">
              <Video className="size-4" aria-hidden />
            </span>
            <p className="text-sm text-secondary-text">
              Not added yet. A one-minute video helps admissions teams meet you — add it any time from your profile.
            </p>
          </div>
        </ReviewCard>
      </div>

      <FinishOnboarding alreadyFinished={Boolean(bundle.onboarding.completed_at)} />
    </StepFrame>
  );
}
