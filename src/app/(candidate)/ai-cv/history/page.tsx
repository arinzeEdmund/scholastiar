import { FileText, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { CvListItem } from "@/components/cv/cv-list-item";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Button } from "@/components/ui/button";
import { repos, type CvVersion } from "@/data";
import { formatLabel } from "@/lib/cv/labels";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "All CVs" };

const VIEWS = {
  date: "By date",
  target: "By what it's for",
  format: "By format",
} as const;
type View = keyof typeof VIEWS;

function groupBy(cvs: CvVersion[], view: View): [string, CvVersion[]][] {
  const groups = new Map<string, CvVersion[]>();
  for (const cv of cvs) {
    const key =
      view === "target"
        ? cv.target_label
        : view === "format"
          ? formatLabel(cv)
          : new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(
              new Date(cv.created_at),
            );
    groups.set(key, [...(groups.get(key) ?? []), cv]);
  }
  return [...groups];
}

export default async function CvHistoryPage({ searchParams }: PageProps<"/ai-cv/history">) {
  const { user } = await requireCandidate();
  const params = await searchParams;
  const view: View = typeof params.view === "string" && params.view in VIEWS ? (params.view as View) : "date";
  const result = await safeLoad(() => repos.cvs.list(user.user_id));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SubPageHeader
        backHref="/ai-cv"
        backLabel="AI CV"
        title="All CVs"
        description="Every version is kept, so you always know which CV went with which application."
        actions={
          <Button asChild className="rounded-xl">
            <Link href="/ai-cv/generate">
              <Plus aria-hidden />
              New CV
            </Link>
          </Button>
        }
      />

      <nav aria-label="Group CVs" className="inline-flex rounded-xl border bg-card p-1 dark:bg-white/[0.03]">
        {(Object.entries(VIEWS) as [View, string][]).map(([key, label]) => (
          <Link
            key={key}
            href={key === "date" ? "/ai-cv/history" : `/ai-cv/history?view=${key}`}
            aria-current={key === view ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              key === view ? "bg-green-action text-white" : "text-secondary-text hover:text-primary-text",
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {!result.ok ? (
        <ErrorState title="We couldn't load your CVs" action={<ReloadButton />} />
      ) : result.data.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No CVs yet"
          description="Create a CV tailored to a programme or scholarship you've saved."
          action={
            <Button asChild className="rounded-xl">
              <Link href="/ai-cv/generate">Create a tailored CV</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-5">
          {groupBy(result.data, view).map(([group, cvs]) => (
            <section
              key={group}
              aria-label={group}
              className="rounded-2xl border bg-card p-4 shadow-xs sm:p-5 dark:bg-white/[0.03]"
            >
              <h2 className="flex items-center justify-between text-sm font-semibold text-primary-text">
                {group}
                <span className="text-xs font-normal text-secondary-text">
                  {cvs.length} CV{cvs.length === 1 ? "" : "s"}
                </span>
              </h2>
              <ul className="-mx-2 mt-2 divide-y divide-border/60">
                {cvs.map((cv) => (
                  <li key={cv.id}>
                    <CvListItem cv={cv} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
