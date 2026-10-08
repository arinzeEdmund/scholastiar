import {
  ArrowRight,
  Building2,
  Clock,
  GraduationCap,
  HelpCircle,
  LifeBuoy,
  Newspaper,
  ShieldAlert,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/marketing/contact-form";
import { FaqList } from "@/components/marketing/faq-list";
import { MarketingSection } from "@/components/marketing/section";
import { SITE } from "@/config/site";
import { repos } from "@/data";
import { safeLoad } from "@/lib/safe-load";
import { CONTACT_TOPICS, type ContactInput } from "@/lib/validation/inbound";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Scholastiar.ai support, sales, partnerships or press.",
};

const ROUTES = [
  {
    href: "/faq",
    icon: HelpCircle,
    title: "Find an answer",
    text: "Most questions are answered in the help centre.",
  },
  {
    href: "/contact?topic=applicant_support#message",
    icon: GraduationCap,
    title: "Applicant support",
    text: "Help with your account, plan or applications.",
  },
  {
    href: "/contact?topic=employer_sales#message",
    icon: Building2,
    title: "Hiring with Scholastiar",
    text: "Hire students or sponsor graduates.",
  },
];

const CHANNELS = [
  { icon: LifeBuoy, label: "Applicant support", email: SITE.emails.support },
  { icon: Building2, label: "Hiring and employer sales", email: SITE.emails.employers },
  { icon: GraduationCap, label: "Universities, funders and partners", email: SITE.emails.partnerships },
  { icon: Newspaper, label: "Press", email: SITE.emails.press },
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const topic = (await searchParams).topic;
  const defaultTopic =
    typeof topic === "string" && topic in CONTACT_TOPICS ? (topic as ContactInput["topic"]) : undefined;
  const faqs = await safeLoad(() => repos.content.listFaqs("applicants"));

  return (
    <>
      <MarketingSection
        headingLevel={1}
        eyebrow="Contact"
        title="Talk to the Scholastiar team"
        description="Choose the fastest route, or send us a message. A person reads every one."
        tone="aurora"
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {ROUTES.map(({ href, icon: Icon, title, text }) => (
            <li key={title}>
              <Link
                href={href}
                className="group flex h-full items-start gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-green/60 hover:shadow-lg hover:shadow-black/5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-soft-green text-green-dark">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 font-semibold text-primary-text">
                    {title}
                    <ArrowRight
                      className="size-4 text-subtle-text transition-transform group-hover:translate-x-0.5 group-hover:text-green-dark"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-1 block text-sm text-secondary-text">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
          <div id="message" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-primary-text">Send us a message</h2>
            <p className="mt-1 mb-6 text-secondary-text">{SITE.responseTime}</p>
            <ContactForm defaultTopic={defaultTopic} />
          </div>

          <aside className="space-y-5 lg:pt-16">
            <div className="rounded-2xl border bg-card p-6">
              <h2 className="font-semibold text-primary-text">Email us directly</h2>
              <ul className="mt-4 space-y-4">
                {CHANNELS.map(({ icon: Icon, label, email }) => (
                  <li key={email} className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-soft text-green-dark">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary-text">{label}</p>
                      <a href={`mailto:${email}`} className="text-sm break-all text-green-dark hover:underline">
                        {email}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-soft p-6">
              <h2 className="flex items-center gap-2 font-semibold text-primary-text">
                <Clock className="size-4 text-green-dark" aria-hidden />
                Before you write
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-secondary-text">
                <li>Use the email address on your Scholastiar account so we can find it.</li>
                <li>Mention the opportunity or application your question is about.</li>
                <li className="flex gap-2 text-primary-text">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                  Never send passwords or full passport details. We will never ask for them.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {faqs.ok && faqs.data.length > 0 && (
        <section className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-2xl font-bold text-primary-text">Common questions</h2>
              <Link href="/faq" className="text-sm font-medium text-green-dark underline-offset-4 hover:underline">
                All answers in the help centre
              </Link>
            </div>
            <div className="mt-5">
              <FaqList items={faqs.data.slice(0, 4)} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
