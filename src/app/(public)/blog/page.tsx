import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ArticleCard, FeaturedArticleCard } from "@/components/marketing/article-card";
import { GuideFilterBar } from "@/components/marketing/guide-filter-bar";
import { MarketingSection } from "@/components/marketing/section";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ListSkeleton } from "@/components/states/loading-state";
import { Button } from "@/components/ui/button";
import { ARTICLE_CATEGORIES } from "@/config/opportunities";
import { repos, type ArticleCategory } from "@/data";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Guides on working while you study, student CVs, scholarships, documents and applying with Scholastiar.ai.",
};

function parseCategory(value: string | string[] | undefined): ArticleCategory | undefined {
  return typeof value === "string" && value in ARTICLE_CATEGORIES ? (value as ArticleCategory) : undefined;
}

async function ArticleList({ category }: { category?: ArticleCategory }) {
  const result = await safeLoad(() => repos.content.listArticles({ category }));
  if (!result.ok) return <ErrorState description="Guides couldn't load. Refresh the page to try again." />;
  if (result.data.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title={category ? `No ${ARTICLE_CATEGORIES[category].toLowerCase()} guides yet` : "No guides yet"}
        description="New guides are published every week. Subscribe below to get them first."
        action={
          category ? (
            <Button asChild variant="outline">
              <Link href="/blog">See all guides</Link>
            </Button>
          ) : undefined
        }
      />
    );
  }
  // On "All guides", the newest guide leads as a featured card.
  const lead = category ? undefined : result.data[0];
  const rest = category ? result.data : result.data.slice(1);
  return (
    <div className="space-y-6">
      {lead && <FeaturedArticleCard article={lead} />}
      {rest.length > 0 && (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const category = parseCategory((await searchParams).category);
  // Counts for the filter bar; the bar still works without them if loading fails.
  const all = await safeLoad(() => repos.content.listArticles());
  const counts = all.ok
    ? all.data.reduce<Partial<Record<ArticleCategory | "all", number>>>(
        (acc, article) => ({ ...acc, [article.category]: (acc[article.category] ?? 0) + 1 }),
        { all: all.data.length },
      )
    : undefined;
  if (counts) for (const key of Object.keys(ARTICLE_CATEGORIES) as ArticleCategory[]) counts[key] ??= 0;
  const shown = counts?.[category ?? "all"];

  return (
    <>
      <MarketingSection
        headingLevel={1}
        eyebrow="Guides"
        title="Practical guides for moving abroad"
        description="Working while you study, student CVs, scholarships, documents and how to get the most from Scholastiar.ai."
        tone="aurora"
        className="pb-20 sm:pb-24"
      />
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative z-10 -mt-8">
            <GuideFilterBar active={category} counts={counts} />
          </div>
          {shown !== undefined && (
            <p className="mt-5 mb-6 text-sm text-secondary-text" role="status">
              Showing <span className="font-medium text-primary-text">{shown}</span> {shown === 1 ? "guide" : "guides"}
              {category && (
                <>
                  {" "}
                  in <span className="font-medium text-primary-text">{ARTICLE_CATEGORIES[category]}</span>
                </>
              )}
            </p>
          )}
          {shown === undefined && <div className="mb-8" />}
          <Suspense key={category ?? "all"} fallback={<ListSkeleton rows={3} />}>
            <ArticleList category={category} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
