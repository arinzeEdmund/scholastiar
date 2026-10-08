import { AlertTriangle, CheckCircle2, Paperclip, ShieldCheck, Target } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { CvActions } from "@/components/cv/cv-actions";
import { CvDocument } from "@/components/cv/cv-document";
import { RouteButton } from "@/components/layout/route-button";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { repos } from "@/data";
import { keywordCoverage, unverifiedNumbers } from "@/lib/cv/build";
import { formatCvDate, formatLabel } from "@/lib/cv/labels";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = { title: "CV" };

export default async function CvPreviewPage({ params }: PageProps<"/ai-cv/[cvId]">) {
  const { user } = await requireCandidate();
  const { cvId } = await params;
  const result = await safeLoad(() =>
    Promise.all([repos.cvs.get(user.user_id, cvId), repos.candidate.getBundle(user.user_id)]),
  );
  if (!result.ok) {
    return (
      <div className="space-y-6">
        <SubPageHeader backHref="/ai-cv" backLabel="AI CV" title="CV" />
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }
  const [cv, bundle] = result.data;
  if (!cv) notFound();

  const coverage = keywordCoverage(cv.content, cv.target_keywords);
  const warnings = unverifiedNumbers(cv.content, bundle);

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <SubPageHeader
          backHref="/ai-cv/history"
          backLabel="All CVs"
          title={cv.title}
          description={`${formatLabel(cv)} · created ${formatCvDate(cv.created_at)}${cv.edited_at ? ` · edited ${formatCvDate(cv.edited_at)}` : ""}`}
          actions={<CvActions id={cv.id} title={cv.title} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="overflow-x-auto rounded-2xl bg-neutral-soft p-3 sm:p-6 dark:bg-white/[0.03]">
          <CvDocument content={cv.content} format={cv.format} />
        </div>

        <aside className="space-y-4 print:hidden" aria-label="CV checks">
          <section className="rounded-2xl border bg-card p-4 dark:bg-white/[0.03]">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-primary-text">
              <Target className="size-4 text-green-dark" aria-hidden />
              Tailored for
            </h2>
            <p className="mt-1 text-sm text-primary-text">{cv.target_label}</p>
            {cv.target_keywords.length > 0 && (
              <>
                <p className="mt-3 text-xs text-secondary-text">
                  Uses {coverage.found.length} of {cv.target_keywords.length} key words from the{" "}
                  {cv.target_type === "pasted" ? "description" : cv.target_type}
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {coverage.found.map((k) => (
                    <li
                      key={k}
                      className="rounded-full bg-soft-green px-2 py-0.5 text-xs font-medium text-green-dark dark:bg-green/15"
                    >
                      {k}
                    </li>
                  ))}
                  {coverage.missing.map((k) => (
                    <li key={k} className="rounded-full border border-dashed px-2 py-0.5 text-xs text-secondary-text">
                      {k}
                    </li>
                  ))}
                </ul>
                {coverage.missing.length > 0 && (
                  <p className="mt-2 text-xs text-secondary-text">
                    Dashed words aren&apos;t in your CV yet. Add them in the editor only where they&apos;re true for
                    you.
                  </p>
                )}
              </>
            )}
          </section>

          <section className="rounded-2xl border bg-card p-4 dark:bg-white/[0.03]">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-primary-text">
              <ShieldCheck className="size-4 text-green-dark" aria-hidden />
              Fact check
            </h2>
            {warnings.length === 0 ? (
              <p className="mt-2 flex items-start gap-2 text-sm text-secondary-text">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green" aria-hidden />
                Every number in this CV matches your profile.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-secondary-text">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                    <span>
                      <span className="font-semibold text-primary-text">{w.value}</span> in {w.where} isn&apos;t in your
                      profile. Make sure it&apos;s true before you use this CV.
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border bg-card p-4 dark:bg-white/[0.03]">
            <h2 className="text-sm font-semibold text-primary-text">Use it</h2>
            <p className="mt-1 text-xs text-secondary-text">
              Attach this CV when you apply. It&apos;s saved as its own version, so later edits don&apos;t change what
              you&apos;ve sent.
            </p>
            <RouteButton href="/applications" variant="outline" size="sm" className="mt-3 w-full rounded-lg">
              <Paperclip aria-hidden />
              Attach to an application
            </RouteButton>
          </section>
        </aside>
      </div>
    </div>
  );
}
