import {
  ArrowRight,
  Award,
  Briefcase,
  CalendarClock,
  Check,
  ClipboardList,
  GraduationCap,
  Lock,
  Plane,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { StrengthRing } from "@/components/candidate/strength-ring";
import { RouteButton } from "@/components/layout/route-button";
import { OpportunityRow, openDeadline } from "@/components/opportunities/opportunity-row";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Button } from "@/components/ui/button";
import { isRouteReady } from "@/config/routes";
import { repos, type CandidateGoal, type CatalogueEntry } from "@/data";
import { ONBOARDING_STEPS } from "@/data/types/candidate";
import { formatDay, ONBOARDING, SPONSORSHIP_NEED, STUDY_STATUS } from "@/lib/candidate/labels";
import { profileStrength } from "@/lib/candidate/strength";
import { applyHref, entryRef } from "@/lib/catalogue/links";
import { EMPTY_QUERY } from "@/lib/catalogue/query";
import { cardStateFor, fitFor, getCatalogueViewer } from "@/lib/catalogue/viewer";
import { hasJobAccess } from "@/lib/entitlements";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

// The student dashboard answers one question first: "what should I do next?"
// One next step with the whole journey in view, real matches and a deadline-ordered
// shortlist in the main column; visa, profile and explore stay compact on the side.

const EXPLORE: {
  href: string;
  label: string;
  text: string;
  icon: LucideIcon;
  goal?: CandidateGoal;
  pro?: boolean;
}[] = [
  {
    href: "/universities",
    label: "Universities",
    text: "Programmes and admissions",
    icon: GraduationCap,
    goal: "study",
  },
  { href: "/scholarships", label: "Scholarships", text: "Funding for your studies", icon: Award, goal: "funding" },
  {
    href: "/dashboard/jobs",
    label: "Student jobs",
    text: "Openings that fit your visa hours",
    icon: Briefcase,
    goal: "student_jobs",
    pro: true,
  },
  {
    href: "/dashboard/jobs/post-study",
    label: "Post-study jobs with residency",
    text: "Openings with visa sponsorship",
    icon: Plane,
    goal: "post_study_jobs",
    pro: true,
  },
];

const DAY = 24 * 60 * 60 * 1000;
const SHORTLIST_TARGET = 3;

function daysUntil(date: string | null) {
  if (!date) return null;
  return Math.ceil((new Date(`${date}T00:00:00Z`).getTime() - Date.now()) / DAY);
}

function inWords(days: number) {
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  if (days < 45) return `in ${days} days`;
  const months = Math.round(days / 30.4);
  return months < 18 ? `in ${months} months` : `in ${(days / 365).toFixed(1).replace(".0", "")} years`;
}

function greeting(timezone: string) {
  let hour = 12;
  try {
    hour = Number(
      new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: timezone }).format(new Date()),
    );
  } catch {
    // Unknown time zone: fall back to a neutral greeting.
  }
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

const refKey = (entry: CatalogueEntry) => {
  const ref = entryRef(entry);
  return `${ref.type}:${ref.id}`;
};

const nameOf = (entry: CatalogueEntry) =>
  entry.type === "program"
    ? entry.program.name
    : entry.type === "scholarship"
      ? entry.scholarship.name
      : entry.university.name;

function Panel({
  id,
  title,
  description,
  action,
  children,
  className,
}: {
  id?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn("scroll-mt-24 rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={id ? `${id}-title` : undefined} className="text-sm font-semibold text-primary-text">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-xs text-secondary-text">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

const textLink = "shrink-0 text-xs font-medium text-green-dark hover:underline";

type Stage = { key: string; label: string; detail: string };

function Journey({ stages, current }: { stages: Stage[]; current: number }) {
  return (
    <ol className="space-y-1" aria-label="Your journey">
      {stages.map((stage, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={stage.key}
            aria-current={active ? "step" : undefined}
            className={cn("flex items-center gap-3 rounded-xl px-3 py-2", active && "bg-white/10 ring-1 ring-mint/40")}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                done && "bg-mint text-brand-black",
                active && "bg-white text-brand-black",
                !done && !active && "border border-white/25 text-white/60",
              )}
            >
              {done ? <Check className="size-3.5" aria-label="Done" /> : index + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block text-sm font-semibold", done || active ? "text-white" : "text-white/60")}>
                {stage.label}
              </span>
              <span className="block truncate text-xs text-white/60">{stage.detail}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default async function DashboardPage() {
  const { user } = await requireCandidate();
  const [bundle, subscription, countries, permitTypes, catalogue] = await Promise.all([
    repos.candidate.getBundle(user.user_id),
    repos.billing.getSubscription(user.user_id),
    repos.reference.listCountries(),
    repos.candidate.listPermitTypes(),
    safeLoad(() => Promise.all([getCatalogueViewer(), repos.catalogue.search(EMPTY_QUERY)])),
  ]);
  const plan = subscription ? await repos.billing.getPlan(subscription.plan_id) : null;
  const { visa, preferences, onboarding } = bundle;
  const strength = profileStrength(bundle);
  const firstName = user.full_name.split(" ")[0];
  const country = (code: string | null) => countries.find((c) => c.iso2 === code)?.name ?? null;
  const permit = permitTypes.find((p) => p.id === visa.post_study_permit_type_id);
  const finished = Boolean(onboarding.completed_at);
  const stepsDone = onboarding.completed_steps.length;
  const jobAccess = hasJobAccess(plan?.id);
  const upgradeHref = isRouteReady("/billing") ? "/billing" : "/pricing";
  const goals = new Set(preferences.goals);

  // Matches and shortlist come from the study catalogue.
  const viewer = catalogue.ok ? catalogue.data[0] : null;
  const entries = catalogue.ok ? catalogue.data[1].entries : [];
  const savedKeys = viewer?.kind === "candidate" ? viewer.saved : new Set<string>();
  const shortlist = entries
    .filter((e) => savedKeys.has(refKey(e)))
    .sort((a, b) => (openDeadline(a) ?? "9999").localeCompare(openDeadline(b) ?? "9999"));
  const matches = viewer
    ? entries
        .filter((e) => e.type !== "university" && !savedKeys.has(refKey(e)) && openDeadline(e))
        .map((e) => ({ entry: e, score: fitFor(e, viewer)?.score ?? 0 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((m) => m.entry)
    : [];
  const closingSoon = shortlist.filter((e) => {
    const days = daysUntil(openDeadline(e));
    return days !== null && days <= 30;
  }).length;

  // Visa snapshot: the one date that matters most right now.
  const keyDate =
    visa.study_status === "graduated" &&
    visa.post_study_permit_status === "holding" &&
    visa.post_study_permit_expiry_date
      ? { label: `${permit?.name ?? "Your permit"} ends`, date: visa.post_study_permit_expiry_date }
      : visa.study_status === "incoming" && visa.course_start_date
        ? { label: "Your course starts", date: visa.course_start_date }
        : visa.study_status === "studying" && visa.course_end_date
          ? { label: "Your course ends", date: visa.course_end_date }
          : null;
  const keyDays = keyDate ? daysUntil(keyDate.date) : null;
  const showKeyDate = keyDate !== null && keyDays !== null && keyDays >= 0;

  // Journey: where the student is, and the single most useful next step.
  const profileReady = finished && strength.score >= 75;
  const shortlisted = shortlist.length >= SHORTLIST_TARGET;
  const stages: Stage[] = [
    {
      key: "profile",
      label: "Build your profile",
      detail: profileReady ? `${strength.score}/100 — ready` : `${strength.score}/100`,
    },
    { key: "shortlist", label: "Shortlist programmes", detail: `${shortlist.length} of ${SHORTLIST_TARGET} saved` },
    { key: "apply", label: "Apply", detail: "No applications yet" },
    { key: "visa", label: "Get your visa", detail: "Steps unlock with an offer" },
    { key: "arrive", label: "Arrive and settle in", detail: "Pre- and post-arrival checklist" },
  ];
  const current = !profileReady ? 0 : !shortlisted ? 1 : 2;
  const firstToApply = shortlist.find((e) => e.type !== "university" && openDeadline(e));

  let next: { eyebrow: string; title: string; body: string; primary: ReactNode; secondary?: ReactNode };
  if (!finished) {
    next = {
      eyebrow: `Finish setting up · ${stepsDone} of ${ONBOARDING_STEPS.length} steps done`,
      title: `Next: ${ONBOARDING[onboarding.current_step].title}`,
      body: "Your matches, fit scores and application drafts all come from these answers.",
      primary: (
        <Button asChild variant="inverse" size="lg" className="rounded-xl">
          <Link href={`/onboarding/${onboarding.current_step}`}>
            Continue set-up
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      ),
    };
  } else if (!profileReady && strength.next[0]) {
    next = {
      eyebrow: `Profile ${strength.score}/100`,
      title: `Strengthen your profile: ${strength.next[0].label.toLowerCase()}`,
      body: `${strength.next[0].tip} Stronger profiles get better matches and stronger drafts.`,
      primary: (
        <Button asChild variant="inverse" size="lg" className="rounded-xl">
          <Link href={strength.next[0].href}>
            Fix it now
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      ),
    };
  } else if (!shortlisted) {
    next = {
      eyebrow: `Shortlist · ${shortlist.length} of ${SHORTLIST_TARGET} saved`,
      title:
        shortlist.length === 0
          ? `Save ${SHORTLIST_TARGET} programmes that fit you`
          : `Save ${SHORTLIST_TARGET - shortlist.length} more to complete your shortlist`,
      body: "A short list of strong options means you apply sooner and never miss a deadline. Start with your top matches below.",
      primary: (
        <Button asChild variant="inverse" size="lg" className="rounded-xl">
          <a href="#matches">
            See your top matches
            <ArrowRight aria-hidden />
          </a>
        </Button>
      ),
      secondary: (
        <RouteButton href="/programs" variant="outline-inverse" size="lg" className="rounded-xl">
          Browse all programmes
        </RouteButton>
      ),
    };
  } else {
    const days = daysUntil(firstToApply ? openDeadline(firstToApply) : null);
    next = {
      eyebrow: "Apply",
      title: firstToApply ? `Start your application: ${nameOf(firstToApply)}` : "Start your first application",
      body:
        days !== null
          ? `It's the first deadline on your shortlist — it closes ${inWords(days)}. We'll prepare your documents and statement from your profile.`
          : "Pick one from your shortlist — we'll prepare your documents and statement from your profile.",
      primary: firstToApply ? (
        <RouteButton href={applyHref(firstToApply)} variant="inverse" size="lg" className="rounded-xl">
          Start applying
          <ArrowRight aria-hidden />
        </RouteButton>
      ) : (
        <Button asChild variant="inverse" size="lg" className="rounded-xl">
          <a href="#shortlist">Open your shortlist</a>
        </Button>
      ),
      secondary: (
        <Button asChild variant="outline-inverse" size="lg" className="rounded-xl">
          <a href="#shortlist">Review shortlist</a>
        </Button>
      ),
    };
  }

  return (
    <div className="space-y-6">
      {/* Greeting with the one date that matters, and the plan in a quiet chip. */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-secondary-text">
            {new Intl.DateTimeFormat("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              timeZone: user.timezone,
            }).format(new Date())}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-text sm:text-[1.75rem]">
            {greeting(user.timezone)}, {firstName}
          </h1>
          {showKeyDate && keyDate && keyDays !== null && (
            <p className="mt-1 text-sm text-secondary-text">
              {keyDate.label} {inWords(keyDays)} — here&apos;s what to do next.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium text-secondary-text">
            <span className="size-1.5 rounded-full bg-green" aria-hidden />
            {plan?.name ?? "No"} plan
          </span>
          {plan?.id === "starter" && (
            <RouteButton href={upgradeHref} variant="outline" size="sm" className="h-8 rounded-full">
              <Sparkles aria-hidden className="text-green" />
              Compare with Pro
            </RouteButton>
          )}
        </div>
      </header>

      {/* The next step: one action, with the whole journey in view. */}
      <section
        aria-labelledby="next-step"
        className="grain relative overflow-hidden rounded-3xl aurora-dark p-5 text-white sm:p-7"
      >
        <div className="relative grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-wide text-mint uppercase">{next.eyebrow}</p>
            <h2 id="next-step" className="mt-2 text-xl font-bold text-balance sm:text-2xl">
              {next.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/75">{next.body}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {next.primary}
              {next.secondary}
            </div>
          </div>
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm sm:block">
            <Journey stages={stages} current={current} />
          </div>
          {/* Phones: the journey as one compact progress line. */}
          <div
            className="sm:hidden"
            aria-label={`Your journey: step ${current + 1} of ${stages.length}, ${stages[current].label}`}
          >
            <div className="flex gap-1" aria-hidden>
              {stages.map((stage, index) => (
                <span
                  key={stage.key}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    index < current ? "bg-mint" : index === current ? "bg-white" : "bg-white/20",
                  )}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-white/70">
              Step {current + 1} of {stages.length} ·{" "}
              <span className="font-semibold text-white">{stages[current].label}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 *:min-w-0 lg:grid-cols-3">
        {/* Main column: matches, shortlist, applications. */}
        <div className="space-y-6 lg:col-span-2">
          <Panel
            id="matches"
            title="Top matches for you"
            description="Ranked by fit with your profile, studies and goals. Save the ones you like."
            action={
              <RouteButton href="/programs" variant="ghost" size="sm" className="h-7 px-2 text-xs">
                See all
              </RouteButton>
            }
          >
            {!catalogue.ok || !viewer ? (
              <ErrorState title="We couldn't load your matches" className="py-8" action={<ReloadButton />} />
            ) : matches.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="No new matches right now"
                description="New programmes and scholarships appear here as they're added."
                className="border-0 py-6"
              />
            ) : (
              <ul className="-mx-2 divide-y divide-border/60">
                {matches.map((entry) => (
                  <li key={refKey(entry)}>
                    <OpportunityRow entry={entry} viewer={cardStateFor(entry, viewer, "/dashboard")} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            id="shortlist"
            title="Your shortlist"
            description={
              shortlist.length
                ? closingSoon
                  ? `${closingSoon} closing within 30 days — sorted by deadline.`
                  : "Sorted by deadline. We'll remind you before each one closes."
                : "Programmes and scholarships you save, sorted by deadline."
            }
            action={
              <RouteButton href="/saved" variant="ghost" size="sm" className="h-7 px-2 text-xs">
                All saved
              </RouteButton>
            }
          >
            {!catalogue.ok || !viewer ? (
              <ErrorState title="We couldn't load your shortlist" className="py-8" action={<ReloadButton />} />
            ) : shortlist.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="Nothing saved yet"
                description="Tap the bookmark on any match. Its deadline lands here, with reminders before it closes."
                className="border-0 py-6"
              />
            ) : (
              <ul className="-mx-2 divide-y divide-border/60">
                {shortlist.slice(0, 5).map((entry) => (
                  <li key={refKey(entry)}>
                    <OpportunityRow entry={entry} viewer={cardStateFor(entry, viewer, "/dashboard")} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Your applications"
            description="Applied yourself, with AI Apply Agent or through Apply For Me — all tracked here."
            action={
              <RouteButton href="/applications" variant="ghost" size="sm" className="h-7 px-2 text-xs">
                Open tracker
              </RouteButton>
            }
          >
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {["Drafts", "Submitted", "Interviews", "Offers"].map((label) => (
                <div key={label} className="rounded-xl bg-soft px-3 py-2.5 dark:bg-white/[0.04]">
                  <dt className="text-xs text-secondary-text">{label}</dt>
                  <dd className="text-xl font-bold text-primary-text tabular-nums">0</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 flex items-center gap-2 text-xs text-secondary-text">
              <ClipboardList className="size-3.5 shrink-0 text-green-dark" aria-hidden />
              Your first application will appear here as soon as you start one.
            </p>
          </Panel>
        </div>

        {/* Side column: visa, profile, explore. */}
        <div className="space-y-6">
          <Panel
            title="Your visa at a glance"
            action={
              <Link href="/profile/visa" className={textLink}>
                Update
              </Link>
            }
          >
            {visa.study_status ? (
              <div className="space-y-3">
                {showKeyDate && keyDate && keyDays !== null && (
                  <div className="flex items-center gap-3 rounded-xl bg-soft-green/60 px-3 py-2.5 dark:bg-green/10">
                    <CalendarClock className="size-4 shrink-0 text-green-dark" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary-text">
                        {keyDate.label} {inWords(keyDays)}
                      </p>
                      <p className="text-xs text-secondary-text">{formatDay(keyDate.date)}</p>
                    </div>
                  </div>
                )}
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-secondary-text">Status</dt>
                    <dd className="text-right font-medium text-primary-text">
                      {STUDY_STATUS[visa.study_status].label}
                      {visa.study_country_code ? ` · ${country(visa.study_country_code)}` : ""}
                    </dd>
                  </div>
                  {visa.study_status !== "graduated" && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-secondary-text">Term-time work</dt>
                      <dd className="text-right font-medium text-primary-text">
                        {visa.term_time_weekly_hour_limit !== null
                          ? `Up to ${visa.term_time_weekly_hour_limit} hrs/week`
                          : "Not recorded"}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-3">
                    <dt className="text-secondary-text">After you study</dt>
                    <dd className="text-right font-medium text-primary-text">
                      {visa.needs_sponsorship_after_study
                        ? SPONSORSHIP_NEED[visa.needs_sponsorship_after_study].replace("Yes, ", "").replace("No, ", "")
                        : "Not recorded"}
                    </dd>
                  </div>
                </dl>
                <p className="flex gap-1.5 text-[0.6875rem] text-secondary-text">
                  <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
                  From your own visa documents. Guidance, not legal advice.
                </p>
              </div>
            ) : (
              <div className="text-sm">
                <p className="text-secondary-text">
                  Add your study status and visa conditions so your study and relocation guidance fits you.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-3 rounded-lg">
                  <Link href="/profile/visa">Add visa details</Link>
                </Button>
              </div>
            )}
          </Panel>

          <Panel
            title="Your profile"
            action={
              <Link href="/profile" className={textLink}>
                Open
              </Link>
            }
          >
            <div className="flex items-center gap-3">
              <StrengthRing score={strength.score} size={52} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary-text capitalize">{strength.level}</p>
                <p className="text-xs text-secondary-text">
                  {strength.next.length
                    ? `${strength.next.length} ${strength.next.length === 1 ? "thing" : "things"} would raise your fit`
                    : "Every match and draft uses it"}
                </p>
              </div>
            </div>
            {strength.next.length > 0 && (
              <ul className="mt-3 space-y-1 border-t pt-3">
                {strength.next.slice(0, 2).map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-soft dark:hover:bg-white/5"
                    >
                      <span className="truncate font-medium text-primary-text">{item.label}</span>
                      <span className="shrink-0 text-xs font-semibold text-green-dark">
                        +{Math.round(item.weight * (1 - item.progress))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <section
            aria-labelledby="explore"
            className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
          >
            <h2 id="explore" className="text-sm font-semibold text-primary-text">
              Explore opportunities
            </h2>
            <ul className="-mx-2 mt-2">
              {EXPLORE.map(({ href, label, text, icon: Icon, goal, pro }) => {
                const locked = Boolean(pro && !jobAccess);
                const target = locked ? upgradeHref : href;
                const ready = isRouteReady(target);
                const match = Boolean(goal && goals.has(goal) && !locked);
                const body = (
                  <>
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        locked
                          ? "bg-neutral-soft text-secondary-text dark:bg-white/10"
                          : "bg-soft-green text-green-dark dark:bg-green/15",
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-text">
                        <span className="truncate">{label}</span>
                        {pro && (
                          <span className="shrink-0 rounded-full bg-soft-green px-1.5 py-px text-[0.625rem] font-semibold text-green-dark dark:bg-green/15">
                            Pro
                          </span>
                        )}
                        {match && <span className="sr-only">(your goal)</span>}
                      </span>
                      <span className="block truncate text-xs text-secondary-text">
                        {locked ? "Upgrade to Pro to unlock" : text}
                      </span>
                    </span>
                    {locked ? (
                      <Lock className="size-4 shrink-0 text-subtle-text" aria-label="Locked" />
                    ) : ready ? (
                      <ArrowRight className="size-4 shrink-0 text-subtle-text" aria-hidden />
                    ) : (
                      <span className="shrink-0 rounded-full bg-neutral-soft px-1.5 py-px text-[0.625rem] font-semibold tracking-wide text-secondary-text uppercase dark:bg-white/10">
                        Soon
                      </span>
                    )}
                  </>
                );
                const className = "flex items-center gap-3 rounded-xl px-2 py-2 transition-colors";
                return (
                  <li key={href} data-locked={locked || undefined}>
                    {ready ? (
                      <Link
                        href={target}
                        className={cn(className, "hover:bg-soft dark:hover:bg-white/5")}
                        aria-label={locked ? `${label} — part of Pro. Upgrade to unlock.` : undefined}
                      >
                        {body}
                      </Link>
                    ) : (
                      <div className={className}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
