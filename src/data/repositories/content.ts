import type { Article, ArticleCategory, FaqAudience, FaqItem, Testimonial } from "@/data/types";

export interface ArticleQuery {
  category?: ArticleCategory;
}

export interface ContentSearchResults {
  articles: Article[];
  faqs: FaqItem[];
}

export interface ContentRepository {
  /** Published articles, newest first. */
  listArticles(query?: ArticleQuery): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
  listFaqs(audience?: FaqAudience): Promise<FaqItem[]>;
  listTestimonials(): Promise<Testimonial[]>;
  /** Full-text search over public content. Opportunity results are added by each service stage. */
  search(query: string): Promise<ContentSearchResults>;
}
