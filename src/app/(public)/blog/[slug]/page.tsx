import { ArrowLeft, Check, ChevronDown, ExternalLink, Info, Landmark, Sparkles, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyLinkButton } from "@/components/content/copy-link-button";
import { ReadingProgress } from "@/components/content/reading-progress";
import { TableOfContents, type TocItem } from "@/components/content/table-of-contents";
import { StatusBadge } from "@/components/feedback/status-badge";
import { RouteButton } from "@/components/layout/route-button";
import { ArticleCard, formatDate } from "@/components/marketing/article-card";
import { FaqList } from "@/components/marketing/faq-list";
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_ICONS, OPPORTUNITY_CATEGORIES } from "@/config/opportunities";
import { GUIDANCE_DISCLAIMER, SITE } from "@/config/site";
import { repos, type Article } from "@/data";
import { safeLoad } from "@/lib/safe-load";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await safeLoad(() => repos.content.getArticle(slug));
  const article = result.ok ? result.data : null;
  if (!article) return { title: "Guide" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt },
  };
}

function structuredData(article: Article) {
  const data: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      datePublished: article.published_at,
      dateModified: article.last_updated_at,
      author: { "@type": "Organization", name: article.author_name },
      publisher: { "@type": "Organization", name: SITE.name },
      mainEntityOfPage: `${SITE.url}/blog/${article.slug}`,
    },
  ];
  if (article.faq.length > 0) {
    data.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

async function RelatedGuides({ article }: { article: Article }) {
  const result = await safeLoad(() => repos.content.listArticles());
  if (!result.ok) return null;
  const related = result.data
    .filter((a) => a.id !== article.id)
    .map((a) => ({
      a,
      score:
        (a.category === article.category ? 2 : 0) +
        a.opportunity_types.filter((t) => article.opportunity_types.includes(t)).length,
    }))
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map(({ a }) => a);
  if (related.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <h2 id="related-heading" className="text-xl font-semibold text-primary-text">
        Related guides
      </h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-3">
        {related.map((a) => (
          <li key={a.id}>
            <ArticleCard article={a} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = await repos.content.getArticle(slug);
  if (!article) notFound();

  const showDisclaimer = article.category !== "product";
  const CategoryIcon = ARTICLE_CATEGORY_ICONS[article.category];
  const sections = article.sections.map((section) => ({ ...section, id: slugify(section.heading) }));
  const toc: TocItem[] = [
    { id: "short-answer", label: "Short answer" },
    ...sections.map((s) => ({ id: s.id, label: s.heading })),
    ...(article.faq.length > 0 ? [{ id: "faq", label: "Questions" }] : []),
    ...(article.sources.length > 0 ? [{ id: "sources", label: "Sources" }] : []),
  ];
  const opportunityLabels = article.opportunity_types
    .map((type) => OPPORTUNITY_CATEGORIES.find((c) => c.type === type)?.label)
    .filter(Boolean);

  return (
    <article className="pb-16 sm:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(article) }} />
      <ReadingProgress targetId="article-body" />

      <header className="grain-light border-b aurora-light">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 sm:pt-14">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/blog" className="inline-flex items-center gap-1 text-secondary-text hover:text-primary-text">
              <ArrowLeft className="size-4" aria-hidden />
              Guides
            </Link>
            <span className="text-subtle-text" aria-hidden>
              /
            </span>
            <Link
              href={`/blog?category=${article.category}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-soft-green px-2.5 py-0.5 text-xs font-semibold text-green-dark hover:underline"
            >
              <CategoryIcon className="size-3.5" aria-hidden />
              {ARTICLE_CATEGORIES[article.category]}
            </Link>
          </nav>
          <h1 className="mt-5 max-w-4xl text-3xl leading-tight font-bold text-balance text-foreground sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-secondary-text">{article.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-near-black text-xs font-bold text-white dark:bg-soft-green dark:text-green-dark">
                SE
              </span>
              <div className="text-sm">
                <p className="font-medium text-primary-text">{article.author_name}</p>
                <p className="text-secondary-text">
                  Updated <time dateTime={article.last_updated_at}>{formatDate(article.last_updated_at)}</time> ·{" "}
                  {article.reading_minutes} min read
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {article.accuracy_review_required && (
                <StatusBadge tone="warning">Rules change often — check official sources</StatusBadge>
              )}
              <CopyLinkButton />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div id="article-body" className="min-w-0">
          {/* Mobile contents */}
          <details className="group mb-8 rounded-xl border bg-card lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold">
              On this page
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <ol className="space-y-1 border-t px-4 py-3 text-sm">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="block py-1 text-secondary-text hover:text-primary-text">
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          <section id="short-answer" className="scroll-mt-24 rounded-2xl border border-green/30 bg-soft-green/50 p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-green-dark">
              <Sparkles className="size-4" aria-hidden />
              Short answer
            </p>
            <p className="mt-2 text-lg leading-relaxed text-primary-text">{article.short_answer}</p>
            <p className="mt-4 flex items-start gap-2 border-t border-green/20 pt-4 text-sm text-secondary-text">
              <Users className="mt-0.5 size-4 shrink-0 text-green-dark" aria-hidden />
              <span>
                <strong className="font-semibold text-primary-text">Who this is for:</strong> {article.who_its_for}
              </span>
            </p>
          </section>

          <div className="mt-12 space-y-12">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="group flex items-baseline gap-3 text-2xl font-semibold text-primary-text">
                  <span className="text-sm font-semibold text-green-dark tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                  <a
                    href={`#${section.id}`}
                    className="text-subtle-text opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Link to ${section.heading}`}
                  >
                    #
                  </a>
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-lg leading-relaxed text-primary-text/90">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-5 grid gap-2.5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 rounded-xl border bg-card px-4 py-3 text-primary-text/90">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-soft-green text-green-dark">
                          <Check className="size-3" strokeWidth={3} aria-hidden />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <aside className="grain mt-14 overflow-hidden rounded-2xl border border-white/10 aurora-dark text-white">
            <div className="flex flex-col items-start gap-4 beams p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-lg font-semibold">See which opportunities fit you</p>
                <p className="mt-1 text-sm text-white/70">
                  Build your profile once and get matched, with readiness checks for every application.
                </p>
              </div>
              <RouteButton href="/auth/sign-up/candidate" size="lg">
                Get started
              </RouteButton>
            </div>
          </aside>

          {article.faq.length > 0 && (
            <section id="faq" className="mt-14 scroll-mt-24" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-2xl font-semibold text-primary-text">
                Questions people ask
              </h2>
              <div className="mt-4">
                <FaqList items={article.faq.map((f, i) => ({ id: `${article.id}-faq-${i}`, ...f }))} />
              </div>
            </section>
          )}

          {article.sources.length > 0 && (
            <section id="sources" className="mt-14 scroll-mt-24" aria-labelledby="sources-heading">
              <h2 id="sources-heading" className="text-2xl font-semibold text-primary-text">
                Sources
              </h2>
              <p className="mt-1 text-sm text-secondary-text">Official pages to confirm the latest rules.</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {article.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-green/60"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-soft text-secondary-text">
                        <Landmark className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-primary-text">{source.label}</span>
                        <span className="block truncate text-xs text-secondary-text">{domainOf(source.url)}</span>
                      </span>
                      <ExternalLink
                        className="size-4 shrink-0 text-subtle-text group-hover:text-green-dark"
                        aria-hidden
                      />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {showDisclaimer && (
            <p className="mt-10 flex gap-3 rounded-xl border bg-soft p-4 text-sm text-secondary-text">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              {GUIDANCE_DISCLAIMER}
            </p>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <TableOfContents items={toc} />
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs font-semibold tracking-wider text-secondary-text uppercase">Key facts</p>
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-secondary-text">Reading time</dt>
                  <dd className="font-medium text-primary-text">{article.reading_minutes} minutes</dd>
                </div>
                {article.country_tags.length > 0 && (
                  <div>
                    <dt className="text-secondary-text">Countries</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {article.country_tags.map((country) => (
                        <Link
                          key={country}
                          href={`/search?q=${encodeURIComponent(country)}`}
                          className="rounded-full border px-2 py-0.5 text-xs text-secondary-text hover:border-green hover:text-primary-text"
                        >
                          {country}
                        </Link>
                      ))}
                    </dd>
                  </div>
                )}
                {opportunityLabels.length > 0 && (
                  <div>
                    <dt className="text-secondary-text">Relevant to</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {opportunityLabels.map((label) => (
                        <span key={label} className="rounded-full bg-soft-green px-2 py-0.5 text-xs text-green-dark">
                          {label}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RelatedGuides article={article} />
      </div>
    </article>
  );
}
