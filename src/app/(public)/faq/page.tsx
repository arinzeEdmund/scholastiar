import {
  ArrowRight,
  BookOpen,
  Building2,
  CreditCard,
  GraduationCap,
  HelpCircle,
  Mail,
  MessageSquare,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SearchBox } from "@/components/content/search-box";
import { TableOfContents } from "@/components/content/table-of-contents";
import { RouteButton } from "@/components/layout/route-button";
import { FaqList } from "@/components/marketing/faq-list";
import { MarketingSection } from "@/components/marketing/section";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { SITE } from "@/config/site";
import { repos, type FaqAudience } from "@/data";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = {
  title: "Help centre",
  description: "Answers for applicants and employers about Scholastiar.ai, visas, privacy and billing.",
};

const TOPICS: { id: FaqAudience; label: string; description: string; icon: typeof GraduationCap }[] = [
  {
    id: "applicants",
    label: "Students and graduates",
    description: "Applying, visas, job connections and your data",
    icon: GraduationCap,
  },
  { id: "employers", label: "Employers", description: "Hiring students and sponsoring graduates", icon: Building2 },
  {
    id: "billing",
    label: "Plans and billing",
    description: "Starter, Pro, payments and switching plans",
    icon: CreditCard,
  },
];

const POPULAR = ["student visa", "find a job", "free plan", "documents"];

export default async function FaqPage() {
  const result = await safeLoad(() => repos.content.listFaqs());

  let body: React.ReactNode;
  if (!result.ok) {
    body = <ErrorState description="Answers couldn't load. Refresh the page to try again." />;
  } else if (result.data.length === 0) {
    body = (
      <EmptyState
        icon={HelpCircle}
        title="No answers published yet"
        description="Our team can answer your question directly."
        action={<RouteButton href="/contact">Contact us</RouteButton>}
      />
    );
  } else {
    const faqs = result.data;
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    }).replace(/</g, "\\u003c");
    const topics = TOPICS.map((topic) => ({ ...topic, items: faqs.filter((f) => f.audience === topic.id) })).filter(
      (topic) => topic.items.length > 0,
    );

    body = (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <ul className="grid gap-4 md:grid-cols-3">
          {topics.map(({ id, label, description, icon: Icon, items }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-green/60 hover:shadow-lg hover:shadow-black/5"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-soft-green text-green-dark">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="mt-4 font-semibold text-primary-text">{label}</span>
                <span className="mt-1 flex-1 text-sm text-secondary-text">{description}</span>
                <span className="mt-4 flex items-center justify-between text-xs text-secondary-text">
                  {items.length} {items.length === 1 ? "answer" : "answers"}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:text-green-dark"
                    aria-hidden
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents title="Topics" items={topics.map(({ id, label }) => ({ id, label }))} />
            </div>
          </aside>
          <div className="space-y-12">
            {topics.map(({ id, label, icon: Icon, items }) => (
              <section key={id} id={id} className="scroll-mt-24" aria-labelledby={`${id}-heading`}>
                <h2 id={`${id}-heading`} className="flex items-center gap-2.5 text-xl font-semibold text-primary-text">
                  <Icon className="size-5 text-green" aria-hidden />
                  {label}
                  <span className="rounded-full bg-neutral-soft px-2 py-0.5 text-xs font-medium text-secondary-text">
                    {items.length}
                  </span>
                </h2>
                <div className="mt-4">
                  <FaqList items={items} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MarketingSection
        headingLevel={1}
        align="center"
        eyebrow="Help centre"
        title="How can we help?"
        description="Answers about applying abroad, visas, your data and plans."
        tone="aurora"
      >
        <div className="mx-auto max-w-2xl">
          <SearchBox placeholder="Search answers and guides…" />
          <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-secondary-text">
            Popular:
            {POPULAR.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border bg-card px-3 py-1 hover:border-green hover:text-primary-text"
              >
                {term}
              </Link>
            ))}
          </p>
        </div>
      </MarketingSection>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">{body}</div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grain overflow-hidden rounded-2xl border border-white/10 aurora-dark text-white">
            <div className="beams p-7 sm:p-10">
              <h2 className="text-2xl font-bold">Still need help?</h2>
              <p className="mt-1 text-white/70">Our team reads every message. {SITE.responseTime}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { href: "/contact", icon: MessageSquare, title: "Send a message", text: "Use the contact form" },
                  {
                    href: `mailto:${SITE.emails.support}`,
                    icon: Mail,
                    title: "Email support",
                    text: SITE.emails.support,
                  },
                  { href: "/blog", icon: BookOpen, title: "Read the guides", text: "Step-by-step help" },
                ].map(({ href, icon: Icon, title, text }) => (
                  <li key={title}>
                    <a
                      href={href}
                      className="flex h-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                    >
                      <Icon className="size-5 shrink-0 text-mint" aria-hidden />
                      <span className="min-w-0">
                        <span className="block font-medium">{title}</span>
                        <span className="block truncate text-sm text-white/65">{text}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
