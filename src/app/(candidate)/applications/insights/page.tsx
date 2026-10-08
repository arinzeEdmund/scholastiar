import { BarChart3, CalendarClock, FileWarning, Globe2, Lock, Sparkles, Target, Video } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { DeadlineChip, openDeadline } from "@/components/opportunities/opportunity-row";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Button } from "@/components/ui/button";
import { repos, type CatalogueEntry, type ProgramEntry } from "@/data";
import { readinessFor } from "@/lib/catalogue/fit";
import { countryName, entryRef } from "@/lib/catalogue/links";
import { EMPTY_QUERY } from "@/lib/catalogue/query";
import { fitFor, getCatalogueViewer } from "@/lib/catalogue/viewer";
import { coveragePercent } from "@/lib/cv/labels";
import { hasJobAccess } from "@/lib/entitlements";
import { flag } from "@/lib/flags";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = { title: "Application insights" };

const nameOf = (e: CatalogueEntry) =>
  e.type === "program" ? e.program.name : e.type === "scholarship" ? e.scholarship.name : e.university.name;
const key = (e: CatalogueEntry) => {
  const r = entryRef(e);
  return `${r.type}:${r.id}`;
};
const average = (values: number[]) =>
  values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;

function Panel({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: typeof Target;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={`rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03] ${className ?? ""}`}
    >
      <h2 className="flex items-center gap-2 text-sm font-semibold text-primary-text">
        <Icon className="size-4 text-green-dark" aria-hidden />
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Bar({ label, value }: { label: ReactNode; value: number }) {
  return (
    <li>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-primary-text">{label}</span>
        <span className="shrink-0 font-semibold text-primary-text tabular-nums">{value}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-soft-green dark:bg-white/10" aria-hidden>
        <div className="h-full rounded-full bg-green" style={{ width: `${value}%` }} />
      </div>
    </li>
  );
}

export default async function InsightsPage() {
  const { user } = await requireCandidate();
  const result = await safeLoad(async () => {
    const [viewer, catalogue, cvs, personality, subscription] = await Promise.all([
      getCatalogueViewer(),
      repos.catalogue.search(EMPTY_QUERY),
      repos.cvs.list(user.user_id),
      repos.personality.get(user.user_id),
      repos.billing.getSubscription(user.user_id),
    ]);
    return { viewer, entries: catalogue.entries, cvs, personality, pro: hasJobAccess(subscription?.plan_id) };
  });

  const header = (
    <PageHeader
      eyebrow="Applications"
      title="Application insights"
      description="How ready you are, where you fit best and what to fix first — before and after you apply."
    />
  );
  if (!result.ok || result.data.viewer.kind !== "candidate") {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }
  const { viewer, entries, cvs, personality, pro } = result.data;
  const scored = entries
    .filter((e) => e.type !== "university")
    .map((e) => ({ entry: e, fit: fitFor(e, viewer)?.score ?? 0 }));
  const shortlist = scored.filter((s) => viewer.saved.has(key(s.entry)));

  // Documents missing across shortlisted programmes, most common first.
  const missing = new Map<string, number>();
  for (const { entry } of shortlist) {
    if (entry.type !== "program") continue;
    for (const item of readinessFor((entry as ProgramEntry).requirements, viewer.bundle).items) {
      if (item.status === "missing")
        missing.set(item.requirement.label, (missing.get(item.requirement.label) ?? 0) + 1);
    }
  }
  const topMissing = [...missing].sort((a, b) => b[1] - a[1]).slice(0, 4);

  // Where you fit best: average fit of open programmes per country.
  const byCountry = new Map<string, number[]>();
  for (const { entry, fit } of scored) {
    if (entry.type !== "program" || !openDeadline(entry)) continue;
    const code = entry.university.country_iso2;
    byCountry.set(code, [...(byCountry.get(code) ?? []), fit]);
  }
  const countries = [...byCountry]
    .map(([code, fits]) => ({ code, fit: average(fits) ?? 0 }))
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 4);

  const deadlines = shortlist
    .flatMap((s) => {
      const date = openDeadline(s.entry);
      return date ? [{ entry: s.entry, date }] : [];
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  const shortlistFit = average(shortlist.map((s) => s.fit));
  const cvMatch = average(cvs.map(coveragePercent).filter((v): v is number => v !== null));

  return (
    <div className="space-y-6">
      {header}

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Average fit on your shortlist", value: shortlistFit === null ? "—" : `${shortlistFit}%` },
          { label: "Saved programmes and scholarships", value: String(shortlist.length) },
          {
            label: "Tailored CVs · average key-word match",
            value: cvs.length ? `${cvs.length} · ${cvMatch ?? 0}%` : "0",
          },
          { label: "PersonalityAI CV views", value: personality.video ? String(personality.views.length) : "No video" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-card p-4 dark:bg-white/[0.03]">
            <dt className="text-xs text-secondary-text">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-bold text-primary-text">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 *:min-w-0 lg:grid-cols-2">
        <Panel icon={FileWarning} title="Fix these first">
          {shortlist.length === 0 ? (
            <p className="text-sm text-secondary-text">Save programmes from your dashboard to see what they ask for.</p>
          ) : topMissing.length === 0 ? (
            <p className="text-sm text-secondary-text">Your vault has every document your shortlist asks for.</p>
          ) : (
            <ul className="space-y-2">
              {topMissing.map(([label, count]) => (
                <li key={label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-primary-text">{label}</span>
                  <span className="text-xs text-secondary-text">needed by {count} of your programmes</span>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="outline" size="sm" className="mt-4 rounded-lg">
            <Link href="/profile/documents">Upload documents</Link>
          </Button>
        </Panel>

        <Panel icon={Globe2} title="Where you fit best">
          <ul className="space-y-3">
            {countries.map((c) => (
              <Bar
                key={c.code}
                label={
                  <>
                    <span aria-hidden>{flag(c.code)}</span> {countryName(c.code)}
                  </>
                }
                value={c.fit}
              />
            ))}
          </ul>
          <p className="mt-3 text-xs text-secondary-text">
            Average fit across open programmes. An estimate from your profile, not a prediction of offers.
          </p>
        </Panel>

        <Panel icon={CalendarClock} title="Your next deadlines">
          {deadlines.length === 0 ? (
            <p className="text-sm text-secondary-text">No upcoming deadlines on your shortlist.</p>
          ) : (
            <ul className="space-y-2.5">
              {deadlines.slice(0, 5).map(({ entry, date }) => (
                <li key={key(entry)} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                  <span className="min-w-0 truncate text-sm font-medium text-primary-text">{nameOf(entry)}</span>
                  <DeadlineChip date={date} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel icon={Video} title="How you come across">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between gap-3">
              <span className="text-secondary-text">PersonalityAI CV</span>
              <span className="font-medium text-primary-text">
                {personality.video ? `Recorded · ${personality.views.length} views` : "Not recorded"}
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-secondary-text">Tailored CVs</span>
              <span className="font-medium text-primary-text">{cvs.length}</span>
            </li>
          </ul>
          {!personality.video && (
            <Button asChild variant="outline" size="sm" className="mt-4 rounded-lg">
              <Link href="/personality-cv/record">Record your video</Link>
            </Button>
          )}
        </Panel>
      </div>

      <Panel icon={BarChart3} title="Performance after you apply">
        {pro ? (
          <EmptyState
            icon={Sparkles}
            title="Your results appear after your first applications"
            description="Response rate, interview rate, which CVs and countries work best, and what to change — updated as replies come in."
            className="border-0 py-6"
          />
        ) : (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed p-4 sm:flex-row sm:items-center">
            <Lock className="size-5 shrink-0 text-secondary-text" aria-hidden />
            <p className="flex-1 text-sm text-secondary-text">
              Response rates, interview rates and which CVs and countries work best for you are part of Pro&apos;s
              application intelligence.
            </p>
            <Button asChild size="sm" className="rounded-lg">
              <Link href="/billing">See Pro</Link>
            </Button>
          </div>
        )}
      </Panel>
    </div>
  );
}
