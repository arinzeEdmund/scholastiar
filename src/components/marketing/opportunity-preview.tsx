import {
  ArrowRight,
  Award,
  BadgeCheck,
  Bookmark,
  GraduationCap,
  CalendarDays,
  Check,
  Clock,
  Hourglass,
  MapPin,
  Sparkles,
} from "lucide-react";

import { StatusBadge } from "@/components/feedback/status-badge";

// Hero product signal: illustrative opportunity cards in a glass frame, lit by the hero glow.
// Static marketing examples with fictional organisations — not live data.

function MiniCard({
  icon: Icon,
  type,
  title,
  provider,
  signal,
  score,
}: {
  icon: typeof Award;
  type: string;
  title: string;
  provider: string;
  signal: string;
  score: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-4 text-left text-primary-text shadow-lg">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-green-dark">
        <Icon className="size-3.5" aria-hidden />
        {type}
      </p>
      <p className="mt-2 text-sm leading-snug font-semibold">{title}</p>
      <p className="text-xs text-secondary-text">{provider}</p>
      <div className="mt-2.5">
        <StatusBadge tone="success">{signal}</StatusBadge>
      </div>
      <p className="mt-auto pt-3 text-xs text-secondary-text">
        Success score <span className="text-sm font-bold text-green-dark">{score}</span>
      </p>
    </div>
  );
}

/** Circular success-score gauge. */
function ScoreRing({ value }: { value: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative size-14 shrink-0">
      <svg viewBox="0 0 64 64" className="size-14 -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="6" className="stroke-soft-green" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-green"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-text">
        {value}%
      </span>
    </div>
  );
}

const CHECKLIST: { label: string; done: boolean }[] = [
  { label: "Personal statement drafted", done: true },
  { label: "Transcripts uploaded", done: true },
  { label: "IELTS 7.0 results added", done: true },
  { label: "Academic reference", done: false },
];

/** Featured example: applying to a master's programme at a UK university. */
function FeaturedCard() {
  const done = CHECKLIST.filter((item) => item.done).length;

  return (
    <div className="overflow-hidden rounded-xl border bg-card text-left text-primary-text shadow-xl">
      {/* Programme */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-soft-green text-sm font-bold text-green-dark ring-1 ring-green/20">
            KU
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-green-dark">University · Master&apos;s</p>
            <p className="mt-0.5 leading-snug font-semibold">MSc Global Public Health</p>
            <p className="text-sm text-secondary-text">
              Kingsbridge University{" "}
              <BadgeCheck className="inline size-3.5 align-[-2px] text-green" aria-label="Verified" />
            </p>
          </div>
          <span className="flex size-8 items-center justify-center rounded-lg border text-green" aria-hidden>
            <Bookmark className="size-3.5 fill-current" />
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <StatusBadge tone="success">Student visa route</StatusBadge>
          <span className="inline-flex h-6 items-center gap-1 rounded-full border px-2 text-xs text-secondary-text">
            <MapPin className="size-3" aria-hidden />
            London, UK
          </span>
          <span className="inline-flex h-6 items-center gap-1 rounded-full border px-2 text-xs text-secondary-text">
            <CalendarDays className="size-3" aria-hidden />
            Sept 2027 intake
          </span>
        </div>

        {/* Score and key facts */}
        <div className="mt-4 flex items-center gap-4 rounded-lg bg-soft p-3">
          <ScoreRing value={88} />
          <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1">
            <div>
              <p className="text-xs text-secondary-text">Effort</p>
              <p className="flex items-center gap-1 text-sm font-semibold whitespace-nowrap">
                <Clock className="size-3.5 text-secondary-text" aria-hidden />
                45 min
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary-text">Deadline</p>
              <p className="flex items-center gap-1 text-sm font-semibold whitespace-nowrap">
                <Hourglass className="size-3.5 text-secondary-text" aria-hidden />
                18 days
              </p>
            </div>
            <p className="col-span-2 text-[0.7rem] text-secondary-text">
              Success score is an estimate, not a guarantee
            </p>
          </div>
        </div>
      </div>

      {/* Readiness */}
      <div className="border-t bg-soft/60 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Sparkles className="size-4 text-green" aria-hidden />
            Application readiness
          </p>
          <p className="text-xs font-medium text-secondary-text tabular-nums">
            {done} of {CHECKLIST.length} ready
          </p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-soft-green">
          <div className="h-full rounded-full bg-green" style={{ width: `${(done / CHECKLIST.length) * 100}%` }} />
        </div>
        <ul className="mt-3 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
          {CHECKLIST.map(({ label, done: isDone }) => (
            <li key={label} className="flex items-center gap-2">
              {isDone ? (
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-green text-white">
                  <Check className="size-2.5" strokeWidth={3} aria-hidden />
                </span>
              ) : (
                <span className="size-4 shrink-0 rounded-full border-2 border-warning" />
              )}
              <span className={isDone ? "text-secondary-text" : "font-medium text-primary-text"}>{label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-end gap-3 sm:justify-between">
          <span className="hidden text-xs text-secondary-text sm:inline">AI-drafted, reviewed by you</span>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-semibold whitespace-nowrap text-primary-foreground">
            Prepare application
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Right-hand hero visual: one centred group — the featured UK university application,
 * with a scholarship and a second university programme side by side beneath it at the same width.
 */
export function OpportunityPreview() {
  return (
    <div
      role="img"
      aria-label="Example: an application to MSc Global Public Health at a UK university with an 88% success score and 3 of 4 documents ready, plus a funded scholarship and an MSc Data Science programme in Germany"
      className="relative mx-auto w-full max-w-120"
    >
      {/* Local glow so the cards sit in light, as in the atmosphere reference. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 bg-[radial-gradient(closest-side,rgb(16_182_91/0.4),transparent)] blur-2xl"
      />
      <div className="relative rounded-2xl border border-white/15 bg-white/5 p-2 backdrop-blur-sm">
        <FeaturedCard />
        <div className="mt-2 hidden grid-cols-2 gap-2 sm:grid">
          <MiniCard
            icon={Award}
            type="Scholarship"
            title="Global Futures Scholarship"
            provider="Fully funded master's, UK"
            signal="Fully funded"
            score="84%"
          />
          <MiniCard
            icon={GraduationCap}
            type="University"
            title="MSc Data Science"
            provider="2 years · Berlin, Germany"
            signal="Taught in English"
            score="79%"
          />
        </div>
      </div>
    </div>
  );
}
