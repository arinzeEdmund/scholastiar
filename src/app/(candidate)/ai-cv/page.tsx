import {
  ArrowRight,
  ClipboardPaste,
  FileText,
  History,
  Lightbulb,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CvListItem } from "@/components/cv/cv-list-item";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Button } from "@/components/ui/button";
import { PROGRAM_LEVELS } from "@/config/catalogue";
import { repos, type CatalogueEntry } from "@/data";
import { profileStrength } from "@/lib/candidate/strength";
import { entryRef } from "@/lib/catalogue/links";
import { EMPTY_QUERY } from "@/lib/catalogue/query";
import { CV_FORMATS } from "@/lib/cv/build";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = { title: "AI CV" };

const CV_STRENGTH_KEYS = new Set(["about", "education", "experience", "skills"]);

function targetParam(entry: CatalogueEntry) {
  const ref = entryRef(entry);
  return `${ref.type}:${ref.id}`;
}

export default async function AiCvHomePage() {
  const { user } = await requireCandidate();
  const [result, bundle, saved] = await Promise.all([
    safeLoad(() => Promise.all([repos.cvs.list(user.user_id), repos.catalogue.search(EMPTY_QUERY)])),
    repos.candidate.getBundle(user.user_id),
    repos.opportunities.listSaved(user.user_id),
  ]);
  const gaps = profileStrength(bundle).next.filter((item) => CV_STRENGTH_KEYS.has(item.key));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI CV"
        title="CVs tailored to every application"
        description="Built from your profile and shaped for each programme, scholarship and country. Nothing is invented — you edit and approve every line."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/ai-cv/history">
                <History aria-hidden />
                All CVs
              </Link>
            </Button>
            <Button asChild className="rounded-xl">
              <Link href="/ai-cv/generate">
                <Plus aria-hidden />
                Create a tailored CV
              </Link>
            </Button>
          </>
        }
      />

      {!result.ok ? (
        <ErrorState title="We couldn't load your CVs" action={<ReloadButton />} />
      ) : (
        (() => {
          const [cvs, catalogue] = result.data;
          const savedKeys = new Set(saved.map((s) => `${s.opportunity_type}:${s.opportunity_id}`));
          const shortlist = catalogue.entries.filter((e) => e.type !== "university" && savedKeys.has(targetParam(e)));
          return (
            <div className="grid gap-6 *:min-w-0 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <section
                  aria-labelledby="quick-start"
                  className="grain relative overflow-hidden rounded-3xl aurora-dark p-5 text-white sm:p-7"
                >
                  <div className="relative">
                    <p className="text-xs font-semibold tracking-wide text-mint uppercase">Quick start</p>
                    <h2 id="quick-start" className="mt-2 text-xl font-bold sm:text-2xl">
                      Tailor a CV for your shortlist
                    </h2>
                    <p className="mt-1.5 max-w-xl text-sm text-white/75">
                      We pick your most relevant experience, order it for the programme and format it the way that
                      country expects.
                    </p>
                    {shortlist.length > 0 ? (
                      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                        {shortlist.slice(0, 4).map((entry) => {
                          const name =
                            entry.type === "program"
                              ? entry.program.name
                              : entry.type === "scholarship"
                                ? entry.scholarship.name
                                : "";
                          const kind =
                            entry.type === "program" ? PROGRAM_LEVELS[entry.program.level].label : "Scholarship";
                          return (
                            <li key={targetParam(entry)}>
                              <Link
                                href={`/ai-cv/generate?target=${targetParam(entry)}`}
                                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 backdrop-blur-sm transition-colors hover:border-mint/40 hover:bg-white/10"
                              >
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[0.6875rem] font-semibold text-mint">{kind}</span>
                                  <span className="block truncate text-sm font-semibold">{name}</span>
                                </span>
                                <ArrowRight
                                  className="size-4 shrink-0 text-white/60 transition-transform group-hover:translate-x-0.5"
                                  aria-hidden
                                />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="mt-5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-white/75">
                        Save programmes from your dashboard matches and they&apos;ll appear here, one tap from a
                        tailored CV.
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild variant="inverse" className="rounded-xl">
                        <Link href="/ai-cv/generate?target=pasted">
                          <ClipboardPaste aria-hidden />
                          Paste a description
                        </Link>
                      </Button>
                      <Button asChild variant="outline-inverse" className="rounded-xl">
                        <Link href="/ai-cv/generate?target=general">
                          <Sparkles aria-hidden />
                          General CV
                        </Link>
                      </Button>
                    </div>
                  </div>
                </section>

                <section
                  aria-labelledby="recent"
                  className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 id="recent" className="text-sm font-semibold text-primary-text">
                      Recent CVs
                    </h2>
                    {cvs.length > 0 && (
                      <Link href="/ai-cv/history" className="text-xs font-medium text-green-dark hover:underline">
                        See all {cvs.length}
                      </Link>
                    )}
                  </div>
                  {cvs.length === 0 ? (
                    <EmptyState
                      icon={FileText}
                      title="No tailored CVs yet"
                      description="Create one for a programme you've saved — it takes about a minute."
                      action={
                        <Button asChild className="rounded-xl">
                          <Link href="/ai-cv/generate">Create a tailored CV</Link>
                        </Button>
                      }
                      className="mt-3 border-0 py-8"
                    />
                  ) : (
                    <ul className="-mx-2 mt-2 divide-y divide-border/60">
                      {cvs.slice(0, 4).map((cv) => (
                        <li key={cv.id}>
                          <CvListItem cv={cv} />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              <div className="space-y-6">
                <section
                  aria-labelledby="gaps"
                  className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
                >
                  <h2 id="gaps" className="flex items-center gap-2 text-sm font-semibold text-primary-text">
                    <Lightbulb className="size-4 text-green-dark" aria-hidden />
                    Make every CV stronger
                  </h2>
                  {gaps.length === 0 ? (
                    <p className="mt-2 text-sm text-secondary-text">
                      Your profile has what a strong CV needs. Keep achievements up to date as you go.
                    </p>
                  ) : (
                    <ul className="-mx-2 mt-2 space-y-0.5">
                      {gaps.slice(0, 3).map((item) => (
                        <li key={item.key}>
                          <Link
                            href={item.href}
                            className="block rounded-lg px-2 py-2 hover:bg-soft dark:hover:bg-white/5"
                          >
                            <span className="block text-sm font-medium text-primary-text">{item.label}</span>
                            <span className="block text-xs text-secondary-text">{item.tip}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button asChild variant="outline" size="sm" className="mt-3 w-full rounded-lg">
                    <Link href="/profile/documents">
                      <Upload aria-hidden />
                      Upload an existing CV
                    </Link>
                  </Button>
                </section>

                <section
                  aria-labelledby="formats"
                  className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
                >
                  <h2 id="formats" className="text-sm font-semibold text-primary-text">
                    Formats we write in
                  </h2>
                  <ul className="mt-3 space-y-2.5">
                    {Object.values(CV_FORMATS).map((f) => (
                      <li key={f.label}>
                        <p className="text-sm font-medium text-primary-text">{f.label}</p>
                        <p className="text-xs text-secondary-text">{f.note}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex gap-1.5 border-t pt-3 text-xs text-secondary-text">
                    <ShieldCheck className="size-3.5 shrink-0 text-green-dark" aria-hidden />
                    We never add jobs, degrees, skills, dates or results you haven&apos;t given us.
                  </p>
                </section>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
}
