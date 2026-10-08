import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";

import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_ICONS } from "@/config/opportunities";
import type { Article } from "@/data/types";

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
}

/** Guide card: category chip, title, excerpt, meta. The whole card is the link. */
export function ArticleCard({ article }: { article: Article }) {
  const Icon = ARTICLE_CATEGORY_ICONS[article.category];
  return (
    <article className="group relative flex h-full flex-col rounded-xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-green/60 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/40">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-soft-green px-2.5 py-1 text-xs font-semibold text-green-dark">
          <Icon className="size-3.5" aria-hidden />
          {ARTICLE_CATEGORIES[article.category]}
        </span>
        <ArrowUpRight
          className="size-4 text-subtle-text transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-green-dark"
          aria-hidden
        />
      </div>
      <h3 className="mt-4 text-lg leading-snug font-semibold text-primary-text">
        <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0 after:rounded-xl">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-secondary-text">{article.excerpt}</p>
      <p className="mt-5 flex items-center gap-3 border-t pt-4 text-xs text-secondary-text">
        <span>Updated {formatDate(article.last_updated_at)}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3" aria-hidden />
          {article.reading_minutes} min read
        </span>
      </p>
    </article>
  );
}

/** Lead guide on the guides page: a dark atmosphere card with the short answer. */
export function FeaturedArticleCard({ article }: { article: Article }) {
  const Icon = ARTICLE_CATEGORY_ICONS[article.category];
  return (
    <article className="group grain relative overflow-hidden rounded-2xl border border-white/10 aurora-dark text-white">
      <div className="grid gap-8 beams p-7 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-mint/15 px-2.5 py-1 text-xs font-semibold text-mint">Latest guide</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/80">
              <Icon className="size-3.5" aria-hidden />
              {ARTICLE_CATEGORIES[article.category]}
            </span>
          </div>
          <h2 className="mt-5 text-2xl leading-tight font-bold text-balance sm:text-3xl">
            <Link href={`/blog/${article.slug}`} className="after:absolute after:inset-0">
              {article.title}
            </Link>
          </h2>
          <p className="mt-3 max-w-xl text-white/75">{article.excerpt}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-wider text-mint uppercase">Short answer</p>
          <p className="mt-2 line-clamp-4 text-sm text-white/85">{article.short_answer}</p>
          <p className="mt-4 flex items-center justify-between gap-3 text-xs text-white/60">
            <span>
              {article.reading_minutes} min read · Updated {formatDate(article.last_updated_at)}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-white transition-transform group-hover:translate-x-0.5">
              Read guide
              <ArrowRight className="size-3.5" aria-hidden />
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}
