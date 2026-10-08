import {
  Award,
  BadgeCheck,
  CalendarClock,
  Clock,
  FileCheck2,
  GraduationCap,
  Hourglass,
  Languages,
  Laptop,
  MapPin,
  School,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/feedback/status-badge";
import { COVERAGE_LABELS, PROGRAM_LEVELS, STUDY_MODES, VERIFICATION_LABELS } from "@/config/catalogue";
import { isRouteReady } from "@/config/routes";
import type {
  BoardKey,
  CatalogueEntry,
  ProgramEntry,
  ScholarshipEntry,
  UniversityEntry,
  VerificationState,
} from "@/data/types";
import { effortLabel, effortMinutes, type Fit, type Readiness } from "@/lib/catalogue/fit";
import { countryName, entryHref, formatDeadline, formatDuration, formatIntake } from "@/lib/catalogue/links";
import { formatMoney, formatTuition } from "@/lib/catalogue/money";
import { flag } from "@/lib/flags";
import { cn } from "@/lib/utils";

import { BoardMenu } from "./board-menu";
import { FitScore, LockedFitScore } from "./fit-score";
import { SaveButton } from "./save-button";

/** What the viewer brings to a card: their saves, boards and fit — or a sign-up link if they're a visitor. */
export interface CardViewerState {
  /** Set for visitors: every personal action leads here. */
  signUpHref?: string;
  saved: boolean;
  boards: BoardKey[];
  fit?: Fit | null;
  readiness?: Readiness | null;
}

const today = () => new Date().toISOString().slice(0, 10);

function Chip({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center gap-1 rounded-full border px-2 text-xs whitespace-nowrap text-secondary-text">
      <Icon className="size-3" aria-hidden />
      {children}
    </span>
  );
}

function Verification({ state }: { state: VerificationState }) {
  if (state === "verified") {
    return (
      <BadgeCheck
        className="inline size-3.5 shrink-0 align-[-2px] text-green"
        aria-label={VERIFICATION_LABELS.verified}
      />
    );
  }
  if (state === "outdated") {
    return (
      <ShieldAlert
        className="inline size-3.5 shrink-0 align-[-2px] text-warning"
        aria-label={VERIFICATION_LABELS.outdated}
      />
    );
  }
  return null;
}

function Title({ entry, children }: { entry: CatalogueEntry; children: ReactNode }) {
  const href = entryHref(entry);
  // Detail pages arrive in U6 (programmes, universities) and U7 (scholarships).
  if (!isRouteReady(href)) return <h3 className="leading-snug font-semibold text-primary-text">{children}</h3>;
  return (
    <h3 className="leading-snug font-semibold text-primary-text">
      <Link href={href} className="after:absolute after:inset-0 hover:text-green-dark focus-visible:outline-none">
        {children}
      </Link>
    </h3>
  );
}

function Logo({ text, className }: { text: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl bg-soft-green text-sm font-bold text-green-dark ring-1 ring-green/20 dark:bg-green/15",
        className,
      )}
      aria-hidden
    >
      {text}
    </span>
  );
}

function Footer({
  viewer,
  entry,
  name,
  effort,
  extra,
}: {
  viewer: CardViewerState;
  entry: CatalogueEntry;
  name: string;
  effort?: string;
  extra?: ReactNode;
}) {
  const ref = entry.type === "program" ? entry.program.id : entry.type === "scholarship" ? entry.scholarship.id : null;
  return (
    <div className="relative mt-auto flex items-center gap-2 border-t px-4 py-2.5 sm:px-5">
      {entry.type !== "university" &&
        (viewer.signUpHref ? (
          <LockedFitScore href={viewer.signUpHref} className="-ml-1" />
        ) : viewer.fit ? (
          <FitScore fit={viewer.fit} className="-ml-1" />
        ) : null)}
      <div className="min-w-0 flex-1 text-right text-xs text-secondary-text">
        {effort && (
          <span className="inline-flex items-center gap-1">
            <Hourglass className="size-3" aria-hidden />
            {effort}
          </span>
        )}
        {extra}
      </div>
      {ref && (
        <BoardMenu
          type={entry.type as "program" | "scholarship"}
          id={ref}
          name={name}
          boards={viewer.boards}
          signUpHref={viewer.signUpHref}
        />
      )}
    </div>
  );
}

function ProgramCard({ entry, viewer }: { entry: ProgramEntry; viewer: CardViewerState }) {
  const { program, university } = entry;
  const next = entry.intakes.find((i) => i.application_deadline >= today());
  const readiness = viewer.readiness;
  return (
    <>
      <div className="relative p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Logo text={university.short_name} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-green-dark">
              {PROGRAM_LEVELS[program.level].label} · {program.award}
            </p>
            <Title entry={entry}>{program.name}</Title>
            <p className="text-sm text-secondary-text">
              {university.name} <Verification state={program.verification_state} />
            </p>
          </div>
          <div className="relative z-10">
            <SaveButton
              type="program"
              id={program.id}
              name={program.name}
              saved={viewer.saved}
              signUpHref={viewer.signUpHref}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip icon={MapPin}>
            <span aria-hidden>{flag(university.country_iso2)}</span> {university.city},{" "}
            {countryName(university.country_iso2)}
          </Chip>
          <Chip icon={program.study_mode === "on_campus" ? School : Laptop}>
            {STUDY_MODES[program.study_mode]}
            {program.attendance === "part_time" && " · part-time"}
          </Chip>
          <Chip icon={Languages}>{program.language_of_instruction}</Chip>
          <Chip icon={Clock}>{formatDuration(program.duration_months)}</Chip>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="flex items-center gap-1 text-xs text-secondary-text">
              <Wallet className="size-3" aria-hidden />
              Tuition
            </dt>
            <dd className="font-semibold text-primary-text">{formatTuition(program)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-xs text-secondary-text">
              <CalendarClock className="size-3" aria-hidden />
              {next ? `${formatIntake(next.intake_month, next.intake_year)} intake` : "Next intake"}
            </dt>
            <dd className={cn("font-semibold", next ? "text-primary-text" : "text-warning")}>
              {next ? `Apply by ${formatDeadline(next.application_deadline)}` : "Closed for this intake"}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.scholarship_count > 0 && (
            <StatusBadge tone="success">
              {entry.scholarship_count} scholarship{entry.scholarship_count === 1 ? "" : "s"} can fund this
            </StatusBadge>
          )}
          {readiness && readiness.total > 0 && (
            <StatusBadge tone={readiness.ready === readiness.total ? "success" : "info"}>
              {readiness.ready} of {readiness.total} documents ready
            </StatusBadge>
          )}
          {program.verification_state === "outdated" && <StatusBadge tone="warning">Due for re-check</StatusBadge>}
        </div>
      </div>
      <Footer
        viewer={viewer}
        entry={entry}
        name={program.name}
        effort={viewer.signUpHref ? undefined : effortLabel(effortMinutes(entry, readiness ?? undefined))}
        extra={viewer.signUpHref ? <span>{entry.requirements.length} entry requirements</span> : undefined}
      />
    </>
  );
}

function UniversityCard({ entry, viewer }: { entry: UniversityEntry; viewer: CardViewerState }) {
  const { university } = entry;
  return (
    <>
      <div className="relative p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Logo text={university.short_name} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-green-dark">
              {university.institution_type === "institute"
                ? "Institute"
                : university.institution_type === "college"
                  ? "College"
                  : "University"}
            </p>
            <Title entry={entry}>
              {university.name} <Verification state={university.verification_state} />
            </Title>
            <p className="text-sm text-secondary-text">
              <span aria-hidden>{flag(university.country_iso2)}</span> {university.city},{" "}
              {countryName(university.country_iso2)}
            </p>
          </div>
          <div className="relative z-10">
            <SaveButton
              type="university"
              id={university.id}
              name={university.name}
              saved={viewer.saved}
              signUpHref={viewer.signUpHref}
            />
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-secondary-text">{university.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.levels.slice(0, 4).map((level) => (
            <Chip key={level} icon={GraduationCap}>
              {PROGRAM_LEVELS[level].label}
            </Chip>
          ))}
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-secondary-text">Tuition from</dt>
            <dd className="font-semibold text-primary-text">
              {entry.tuition_from ? formatMoney(entry.tuition_from.amount, entry.tuition_from.currency) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-secondary-text">Next deadline</dt>
            <dd className="font-semibold text-primary-text">
              {entry.next_deadline ? formatDeadline(entry.next_deadline) : "None open"}
            </dd>
          </div>
        </dl>
      </div>
      <Footer
        viewer={viewer}
        entry={entry}
        name={university.name}
        extra={
          <span className="inline-flex items-center gap-1">
            <FileCheck2 className="size-3" aria-hidden />
            {entry.program_count} programme{entry.program_count === 1 ? "" : "s"}
            {entry.scholarship_count > 0 &&
              ` · ${entry.scholarship_count} scholarship${entry.scholarship_count === 1 ? "" : "s"}`}
          </span>
        }
      />
    </>
  );
}

function ScholarshipCard({ entry, viewer }: { entry: ScholarshipEntry; viewer: CardViewerState }) {
  const { scholarship } = entry;
  const open = scholarship.application_deadline >= today();
  return (
    <>
      <div className="relative p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-soft-green text-green-dark ring-1 ring-green/20 dark:bg-green/15"
            aria-hidden
          >
            <Award className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-green-dark">
              Scholarship · {scholarship.fully_funded ? "Fully funded" : "Partial funding"}
            </p>
            <Title entry={entry}>{scholarship.name}</Title>
            <p className="text-sm text-secondary-text">
              {scholarship.funder_name} <Verification state={scholarship.verification_state} />
            </p>
          </div>
          <div className="relative z-10">
            <SaveButton
              type="scholarship"
              id={scholarship.id}
              name={scholarship.name}
              saved={viewer.saved}
              signUpHref={viewer.signUpHref}
            />
          </div>
        </div>

        <p className="mt-3 text-sm font-medium text-primary-text">{scholarship.amount_summary}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip icon={MapPin}>
            <span aria-hidden>{flag(scholarship.host_country_iso2)}</span> Study in{" "}
            {countryName(scholarship.host_country_iso2)}
          </Chip>
          {scholarship.coverage.map((c) => (
            <Chip key={c} icon={Wallet}>
              {COVERAGE_LABELS[c]}
            </Chip>
          ))}
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-secondary-text">For</dt>
            <dd className="font-semibold text-primary-text">
              {scholarship.eligible_levels
                .map((l) => PROGRAM_LEVELS[l].label)
                .slice(0, 3)
                .join(", ")}
              {scholarship.eligible_levels.length > 3 && " +"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-secondary-text">Deadline</dt>
            <dd className={cn("font-semibold", open ? "text-primary-text" : "text-warning")}>
              {open ? formatDeadline(scholarship.application_deadline) : "Closed for this round"}
            </dd>
          </div>
        </dl>
      </div>
      <Footer
        viewer={viewer}
        entry={entry}
        name={scholarship.name}
        effort={viewer.signUpHref ? undefined : effortLabel(effortMinutes(entry))}
        extra={
          viewer.signUpHref ? (
            <span>
              Funds {entry.program_count} programme{entry.program_count === 1 ? "" : "s"}
            </span>
          ) : undefined
        }
      />
    </>
  );
}

/** The universal opportunity card (PAGES/README.md) for programmes, universities and scholarships. */
export function OpportunityCard({
  entry,
  viewer,
  className,
}: {
  entry: CatalogueEntry;
  viewer: CardViewerState;
  className?: string;
}) {
  return (
    <article
      aria-label={
        entry.type === "program"
          ? entry.program.name
          : entry.type === "university"
            ? entry.university.name
            : entry.scholarship.name
      }
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition-all hover:border-green/40 hover:shadow-lg hover:shadow-black/5 dark:bg-white/[0.03]",
        className,
      )}
    >
      {entry.type === "program" && <ProgramCard entry={entry} viewer={viewer} />}
      {entry.type === "university" && <UniversityCard entry={entry} viewer={viewer} />}
      {entry.type === "scholarship" && <ScholarshipCard entry={entry} viewer={viewer} />}
    </article>
  );
}
