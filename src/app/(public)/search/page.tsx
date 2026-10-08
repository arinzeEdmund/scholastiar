import { ArrowRight, ArrowUpRight, HelpCircle, Search as SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Highlight } from "@/components/content/highlight";
import { SearchBox } from "@/components/content/search-box";
import { formatDate } from "@/components/marketing/article-card";
import { CategoryGrid } from "@/components/marketing/category-grid";
import { MarketingSection } from "@/components/marketing/section";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ListSkeleton } from "@/components/states/loading-state";
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_ICONS, OPPORTUNITY_CATEGORIES } from "@/config/opportunities";
import { isRouteReady } from "@/config/routes";
import { repos } from "@/data";
import { safeLoad } from "@/lib/safe-load";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Scholastiar.ai guides, help and opportunity types.",
  robots: { index: false },
};

const SUGGESTIONS = ["scholarships", "universities", "student visa", "CV", "documents"];

const TABS = [
  { id: "all", label: "All" },
  { id: "guides", label: "Guides" },
  { id: "help", label: "Help centre" },
  { id: "types", label: "Opportunity types" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function SuggestionChips() {
  return (
    <ul className="flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map((s) => (
        <li key={s}>
          <Link
            href={`/search?q=${encodeURIComponent(s)}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-card px-3 text-sm text-secondary-text hover:border-green hover:text-primary-text"
          >
            <SearchIcon className="size-3.5" aria-hidden />
            {s}
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function Results({ query, tab }: { query: string; tab: TabId }) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const types = OPPORTUNITY_CATEGORIES.filter((c) =>
    terms.some((term) => `${c.label} ${c.type} ${c.description}`.toLowerCase().includes(term)),
  );
  const result = await safeLoad(() => repos.content.search(query));
  if (!result.ok) return <ErrorState description="Search isn't working right now. Try again in a moment." />;
  const { articles, faqs } = result.data;
  const counts: Record<TabId, number> = {
    all: articles.length + faqs.length + types.length,
    guides: articles.length,
    help: faqs.length,
    types: types.length,
  };

  if (counts.all === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={SearchIcon}
          title={`No results for “${query}”`}
          description="Try a broader word, a country, or an opportunity type such as universities or scholarships."
        />
        <SuggestionChips />
      </div>
    );
  }

  const show = (id: Exclude<TabId, "all">) => (tab === "all" || tab === id) && counts[id] > 0;
  const tabHref = (id: TabId) => `/search?q=${encodeURIComponent(query)}${id === "all" ? "" : `&type=${id}`}`;

  return (
    <div>
      <nav aria-label="Result types" className="border-b">
        <ul className="-mb-px flex scrollbar-none gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {TABS.map(({ id, label }) => {
            const active = tab === id;
            return (
              <li key={id} className="shrink-0">
                <Link
                  href={tabHref(id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 border-b-2 px-3 text-sm font-medium whitespace-nowrap transition-colors",
                    active
                      ? "border-green text-primary-text"
                      : "border-transparent text-secondary-text hover:text-primary-text",
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-px text-xs tabular-nums",
                      active ? "bg-soft-green text-green-dark" : "bg-neutral-soft text-secondary-text",
                    )}
                  >
                    {counts[id]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <p role="status" className="mt-5 text-sm text-secondary-text">
        {counts[tab]} {counts[tab] === 1 ? "result" : "results"} for{" "}
        <span className="font-medium text-primary-text">“{query}”</span>
      </p>

      <div className="mt-6 space-y-10">
        {show("types") && (
          <section aria-labelledby="results-types">
            <h2 id="results-types" className="text-sm font-semibold tracking-wider text-secondary-text uppercase">
              Opportunity types
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {types.map(({ type, label, description, href, icon: Icon }) => {
                const ready = isRouteReady(href);
                const inner = (
                  <>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-soft-green text-green-dark">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-primary-text">
                        <Highlight text={label} terms={terms} />
                      </span>
                      <span className="block text-sm text-secondary-text">
                        <Highlight text={description} terms={terms} />
                      </span>
                    </span>
                    {ready ? (
                      <ArrowRight className="size-4 text-secondary-text" aria-hidden />
                    ) : (
                      <span className="text-xs font-semibold text-secondary-text uppercase">Soon</span>
                    )}
                  </>
                );
                return (
                  <li key={type}>
                    {ready ? (
                      <Link
                        href={href}
                        className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:border-green/60"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-xl border bg-card p-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {show("guides") && (
          <section aria-labelledby="results-guides">
            <h2 id="results-guides" className="text-sm font-semibold tracking-wider text-secondary-text uppercase">
              Guides
            </h2>
            <ul className="mt-3 divide-y rounded-xl border bg-card">
              {articles.map((article) => {
                const Icon = ARTICLE_CATEGORY_ICONS[article.category];
                return (
                  <li key={article.id}>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="group flex gap-4 p-5 transition-colors hover:bg-soft"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-soft-green text-green-dark">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-primary-text group-hover:text-green-dark">
                          <Highlight text={article.title} terms={terms} />
                        </span>
                        <span className="mt-1 line-clamp-2 block text-sm text-secondary-text">
                          <Highlight text={article.excerpt} terms={terms} />
                        </span>
                        <span className="mt-2 block text-xs text-secondary-text">
                          {ARTICLE_CATEGORIES[article.category]} · {article.reading_minutes} min read · Updated{" "}
                          {formatDate(article.last_updated_at)}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-subtle-text group-hover:text-green-dark"
                        aria-hidden
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {show("help") && (
          <section aria-labelledby="results-help">
            <h2 id="results-help" className="text-sm font-semibold tracking-wider text-secondary-text uppercase">
              Help centre
            </h2>
            <ul className="mt-3 divide-y rounded-xl border bg-card">
              {faqs.map((faq) => (
                <li key={faq.id}>
                  <Link href={`/faq#${faq.audience}`} className="group flex gap-4 p-5 transition-colors hover:bg-soft">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-soft text-secondary-text">
                      <HelpCircle className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-primary-text group-hover:text-green-dark">
                        <Highlight text={faq.question} terms={terms} />
                      </span>
                      <span className="mt-1 line-clamp-2 block text-sm text-secondary-text">
                        <Highlight text={faq.answer} terms={terms} />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

async function StartState() {
  const [articles, faqs] = await Promise.all([
    safeLoad(() => repos.content.listArticles()),
    safeLoad(() => repos.content.listFaqs("applicants")),
  ]);
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-sm font-semibold tracking-wider text-secondary-text uppercase">
          Browse by opportunity type
        </h2>
        <div className="mt-4">
          <CategoryGrid compact />
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        {articles.ok && articles.data.length > 0 && (
          <section aria-labelledby="popular-guides">
            <h2 id="popular-guides" className="text-sm font-semibold tracking-wider text-secondary-text uppercase">
              Popular guides
            </h2>
            <ul className="mt-3 divide-y rounded-xl border bg-card">
              {articles.data.slice(0, 4).map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="flex items-center justify-between gap-3 p-4 text-sm font-medium text-primary-text hover:bg-soft hover:text-green-dark"
                  >
                    {article.title}
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {faqs.ok && faqs.data.length > 0 && (
          <section aria-labelledby="common-questions">
            <h2 id="common-questions" className="text-sm font-semibold tracking-wider text-secondary-text uppercase">
              Common questions
            </h2>
            <ul className="mt-3 divide-y rounded-xl border bg-card">
              {faqs.data.slice(0, 4).map((faq) => (
                <li key={faq.id}>
                  <Link
                    href={`/faq#${faq.audience}`}
                    className="flex items-center justify-between gap-3 p-4 text-sm font-medium text-primary-text hover:bg-soft hover:text-green-dark"
                  >
                    {faq.question}
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const tab: TabId = TABS.some((t) => t.id === params.type) ? (params.type as TabId) : "all";

  return (
    <>
      <MarketingSection
        headingLevel={1}
        align="center"
        eyebrow="Search"
        title={query ? "Search results" : "What are you looking for?"}
        tone="aurora"
      >
        <div className="mx-auto max-w-2xl space-y-4">
          <SearchBox defaultValue={query} autoFocus={!query} />
          {!query && <SuggestionChips />}
        </div>
      </MarketingSection>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {query ? (
            <Suspense key={`${query}-${tab}`} fallback={<ListSkeleton rows={3} />}>
              <Results query={query} tab={tab} />
            </Suspense>
          ) : (
            <Suspense fallback={<ListSkeleton rows={3} />}>
              <StartState />
            </Suspense>
          )}
        </div>
      </section>
    </>
  );
}
