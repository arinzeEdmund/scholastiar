import { SearchX } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/feedback/status-badge";
import {
  ActiveFilterChips,
  CatalogueSearchBox,
  FilterPanel,
  FilterSheetButton,
  SortSelect,
} from "@/components/opportunities/catalogue-controls";
import { CategoryTabs } from "@/components/opportunities/category-tabs";
import { LockedPreviews } from "@/components/opportunities/locked-previews";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { ApplyRouteAction } from "@/components/opportunities/apply/apply-route-action";
import { ApplySteps } from "@/components/opportunities/apply/apply-steps";
import { RequirementsChecklist } from "@/components/opportunities/apply/requirements-checklist";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { tabLabel } from "@/config/catalogue";
import { repos } from "@/data";
import type { ApplyRoute, CatalogueEntry, ProgramEntry } from "@/data/types";
import { readinessFor } from "@/lib/catalogue/fit";
import { applyHref, countryName, signUpHref } from "@/lib/catalogue/links";
import { catalogueSearch, EMPTY_QUERY, type CatalogueQuery } from "@/lib/catalogue/query";
import { cardStateFor, getCatalogueViewer, sortByFit } from "@/lib/catalogue/viewer";
import { safeLoad } from "@/lib/safe-load";

import { ApplyWorkspaceDemo } from "./gallery-opportunity-demos";

const BASE = "/dev/gallery";
const HASH = "#opportunity-card";

const keyOf = (e: CatalogueEntry) =>
  e.type === "program" ? e.program.id : e.type === "university" ? e.university.id : e.scholarship.id;

/** Live catalogue: URL-driven tabs, search, filters and sort over the mock data layer. */
export async function CatalogueExplorer({ query }: { query: CatalogueQuery }) {
  // The viewer's profile is screen data too, so it loads inside safeLoad with the results.
  const result = await safeLoad(() => Promise.all([getCatalogueViewer(), repos.catalogue.search(query)]));
  if (!result.ok) {
    return <ErrorState title="We couldn't load programmes" action={<ReloadButton />} />;
  }
  const [viewer, data] = result.data;
  const { tabCounts, facets } = data;
  const entries = query.sort === "fit" ? sortByFit(data.entries, viewer) : data.entries;
  const here = `${BASE}${catalogueSearch(query)}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-secondary-text">
        Viewing as
        <StatusBadge tone={viewer.kind === "candidate" ? "success" : "info"}>
          {viewer.kind === "candidate"
            ? "signed-in student (fit, saves and boards are live)"
            : "visitor (sign-up prompts)"}
        </StatusBadge>
        <span>— switch persona in the dev panel.</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <CatalogueSearchBox key={query.q} query={query} hash={HASH} />
        <div className="flex gap-2">
          <div className="lg:hidden">
            <FilterSheetButton query={query} facets={facets} hash={HASH} />
          </div>
          <SortSelect query={query} canSortByFit={viewer.kind === "candidate"} hash={HASH} />
        </div>
      </div>

      <CategoryTabs query={query} counts={tabCounts} basePath={BASE} hash={HASH} />
      <ActiveFilterChips query={query} facets={facets} hash={HASH} />

      <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
        <div className="hidden lg:block">
          <FilterPanel query={query} facets={facets} hash={HASH} />
        </div>
        <div>
          <p className="mb-3 text-sm text-secondary-text" aria-live="polite">
            {entries.length} {entries.length === 1 ? "result" : "results"} in {tabLabel(query.tab)}
          </p>
          {entries.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Nothing matches yet"
              description="Try a broader word, remove a filter, or look in another category."
              action={
                <Link
                  href={`${BASE}${HASH}`}
                  scroll={false}
                  className="text-sm font-medium text-green-dark hover:underline"
                >
                  Clear search and filters
                </Link>
              }
            />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {entries.map((entry) => (
                <li key={keyOf(entry)}>
                  <OpportunityCard entry={entry} viewer={cardStateFor(entry, viewer, here)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/** Visitor view of one card per type, plus the locked sign-up previews. */
export async function VisitorCards() {
  const result = await safeLoad(() => repos.catalogue.search(EMPTY_QUERY));
  if (!result.ok) return <ErrorState action={<ReloadButton />} />;
  const pick = (type: CatalogueEntry["type"]) => result.data.entries.find((e) => e.type === type);
  const samples = [pick("program"), pick("university"), pick("scholarship")].filter((e): e is CatalogueEntry => !!e);
  if (samples.length === 0)
    return <EmptyState title="No listings" description="The catalogue is empty in this screen state." />;
  const program = samples.find((e): e is ProgramEntry => e.type === "program");
  const visitor = { kind: "visitor" } as const;

  return (
    <div className="space-y-4">
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {samples.map((entry) => (
          <li key={keyOf(entry)}>
            <OpportunityCard entry={entry} viewer={cardStateFor(entry, visitor, BASE)} />
          </li>
        ))}
      </ul>
      {program && (
        <LockedPreviews
          signUpHref={signUpHref(BASE)}
          documentCount={program.requirements.filter((r) => r.requirement_type === "document").length}
          scholarshipCount={program.scholarship_count}
          countryName={countryName(program.university.country_iso2)}
        />
      )}
    </div>
  );
}

const ROUTE_EXAMPLES: { route: ApplyRoute; title: string }[] = [
  { route: "hosted", title: "Hosted on Scholastiar" },
  { route: "partner", title: "Partner (we submit)" },
  { route: "official", title: "Official page" },
];

/** Apply workspace parts for one programme, using the signed-in student's real vault. */
export async function ApplyWorkspaceSection() {
  const result = await safeLoad(() =>
    Promise.all([getCatalogueViewer(), repos.catalogue.search({ ...EMPTY_QUERY, tab: "masters" })]),
  );
  if (!result.ok) return <ErrorState action={<ReloadButton />} />;
  const [viewer, data] = result.data;
  const entry = data.entries.find((e): e is ProgramEntry => e.type === "program");
  if (!entry)
    return <EmptyState title="No programme to apply to" description="The catalogue is empty in this screen state." />;

  const bundle = viewer.kind === "candidate" ? viewer.bundle : null;
  const readiness = readinessFor(entry.requirements, bundle);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-primary-text">Apply button by route</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-4 dark:bg-white/[0.03]">
            <p className="mb-3 text-xs font-semibold text-secondary-text uppercase">Visitor</p>
            <ApplyRouteAction route={entry.route} applyHref={applyHref(entry)} signUpHref={signUpHref(BASE)} />
          </div>
          {ROUTE_EXAMPLES.map(({ route, title }) => (
            <div key={route} className="rounded-xl border bg-card p-4 dark:bg-white/[0.03]">
              <p className="mb-3 text-xs font-semibold text-secondary-text uppercase">{title}</p>
              <ApplyRouteAction route={route} applyHref={applyHref(entry)} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4 sm:p-6 dark:bg-white/[0.03]">
        <p className="text-xs font-semibold text-green-dark">Applying to</p>
        <p className="font-semibold text-primary-text">
          {entry.program.name} · {entry.university.name}
        </p>
        <div className="mt-4">
          <ApplySteps route={entry.route} current={2} />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-primary-text">Requirements and documents</h3>
            <RequirementsChecklist readiness={readiness} />
            {!bundle && (
              <p className="mt-2 text-xs text-secondary-text">
                Sign in as a student to see readiness from a real vault.
              </p>
            )}
          </div>
          <ApplyWorkspaceDemo
            programId={entry.program.id}
            route={entry.route}
            signedIn={viewer.kind === "candidate"}
            documentsReady={`${readiness.ready} of ${readiness.total}`}
            documentsOk={readiness.ready === readiness.total}
          />
        </div>
      </div>
    </div>
  );
}
