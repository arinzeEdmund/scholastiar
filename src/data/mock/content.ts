import "server-only";

import type { ContentRepository } from "@/data/repositories/content";
import type { Article, FaqItem } from "@/data/types";

import { readList, readOne } from "./store";

const byNewest = (a: Article, b: Article) => b.published_at.localeCompare(a.published_at);

function matches(text: string, terms: string[]) {
  const haystack = text.toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function articleText(article: Article) {
  return [
    article.title,
    article.excerpt,
    article.short_answer,
    ...article.country_tags,
    ...article.opportunity_types,
    ...article.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]),
  ].join(" ");
}

export const mockContentRepository: ContentRepository = {
  listArticles: (query) =>
    readList((db) =>
      db.articles
        .filter((a) => a.status === "published" && (!query?.category || a.category === query.category))
        .sort(byNewest),
    ),

  getArticle: (slug) => readOne((db) => db.articles.find((a) => a.slug === slug && a.status === "published") ?? null),

  listFaqs: (audience) =>
    readList((db) =>
      db.faq_items.filter((f) => !audience || f.audience === audience).sort((a, b) => a.sort_order - b.sort_order),
    ),

  listTestimonials: () => readList((db) => db.testimonials),

  search: async (query) => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return { articles: [], faqs: [] };
    const [articles, faqs] = await Promise.all([
      readList((db) =>
        db.articles.filter((a) => a.status === "published" && matches(articleText(a), terms)).sort(byNewest),
      ),
      readList((db) => db.faq_items.filter((f: FaqItem) => matches(`${f.question} ${f.answer}`, terms))),
    ]);
    return { articles, faqs };
  },
};
