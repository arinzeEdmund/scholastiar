// Public content and inbound messages. Shaped after
// STRUCTURE/DATABASE/db.md → Publishing And Public Content Tables.

export type ArticleCategory = "opportunities" | "immigration" | "readiness" | "product" | "insights";

export type OpportunityType = "jobs" | "universities" | "scholarships";

export interface ArticleSection {
  heading: string;
  /** Paragraphs of plain text. */
  paragraphs: string[];
  /** Optional bullet list shown after the paragraphs. */
  bullets?: string[];
}

export interface ArticleSource {
  label: string;
  url: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** articles — canonical blog/guide content (PUBLISHING_INTELLIGENCE_ENGINE.md → Article Template). */
export interface Article {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  excerpt: string;
  /** "Short answer" shown near the top for search and AI answer engines. */
  short_answer: string;
  who_its_for: string;
  sections: ArticleSection[];
  faq: FaqEntry[];
  sources: ArticleSource[];
  country_tags: string[];
  opportunity_types: OpportunityType[];
  author_name: string;
  reading_minutes: number;
  status: "draft" | "published";
  /** Sensitive immigration/visa content needs accuracy review before publishing. */
  accuracy_review_required: boolean;
  published_at: string;
  last_updated_at: string;
}

export type FaqAudience = "applicants" | "employers" | "billing";

/** faq_items — public help questions. */
export interface FaqItem {
  id: string;
  audience: FaqAudience;
  question: string;
  answer: string;
  sort_order: number;
}

/** testimonials — public quotes. Must be real and consented before launch. */
export interface Testimonial {
  id: string;
  quote: string;
  person_name: string;
  person_context: string;
  is_placeholder: boolean;
}

/** newsletter_subscriptions — weekly opportunity digest sign-ups. */
export interface NewsletterSubscription {
  id: string;
  email: string;
  source: string;
  status: "subscribed" | "unsubscribed";
  created_at: string;
}

export type ContactTopic = "applicant_support" | "employer_sales" | "partnerships" | "press" | "other";

/** contact_messages — messages from the public contact form. */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
  status: "new" | "in_progress" | "closed";
  created_at: string;
}
