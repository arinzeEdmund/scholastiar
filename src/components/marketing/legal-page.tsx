import { AlertTriangle, ArrowRight, type LucideIcon, Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { CopyLinkButton } from "@/components/content/copy-link-button";
import { PrintButton } from "@/components/content/print-button";
import { TableOfContents } from "@/components/content/table-of-contents";

import { formatDate } from "./article-card";

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

export interface LegalSummaryPoint {
  icon: LucideIcon;
  title: string;
  text: string;
}

/**
 * Long-form legal document: at-a-glance summary, sticky contents with scroll-spy,
 * numbered sections with anchor links, contact and related-document cards.
 * Marked as a draft until legal review.
 */
export function LegalPage({
  title,
  intro,
  lastUpdated,
  summary,
  sections,
  contactEmail,
  related,
}: {
  title: string;
  intro: string;
  lastUpdated: string;
  summary: LegalSummaryPoint[];
  sections: LegalSection[];
  contactEmail: string;
  related: { href: string; title: string; description: string };
}) {
  return (
    <div className="pb-16 sm:pb-20">
      <header className="grain-light border-b aurora-light">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16">
          <p className="text-sm font-semibold text-green-dark">Legal</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-secondary-text">{intro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-secondary-text">
            <span>
              Last updated <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
            </span>
            <span aria-hidden>·</span>
            <span>{sections.length} sections</span>
            <span className="ml-auto flex gap-2 print:hidden">
              <CopyLinkButton />
              <PrintButton />
            </span>
          </div>
          <p
            role="note"
            className="mt-6 flex gap-2 rounded-xl border border-warning/30 bg-warning-soft p-4 text-sm text-warning"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            Draft for review. This document has not yet been reviewed by a qualified lawyer and will change before
            launch.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section aria-labelledby="at-a-glance" className="py-10">
          <h2 id="at-a-glance" className="text-sm font-semibold tracking-wider text-secondary-text uppercase">
            At a glance
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map(({ icon: Icon, title: pointTitle, text }) => (
              <li key={pointTitle} className="rounded-xl border bg-card p-5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-soft-green text-green-dark">
                  <Icon className="size-4" aria-hidden />
                </span>
                <p className="mt-3 font-semibold text-primary-text">{pointTitle}</p>
                <p className="mt-1 text-sm text-secondary-text">{text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-secondary-text">
            This summary is for convenience. The full sections below are what apply.
          </p>
        </section>

        <div className="grid gap-12 border-t pt-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-24">
              <TableOfContents items={sections.map((s) => ({ id: s.id, label: s.heading }))} title="Contents" />
            </div>
          </aside>

          <div className="min-w-0 space-y-12">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="group flex items-baseline gap-3 text-xl font-semibold text-primary-text sm:text-2xl">
                  <span className="flex size-7 shrink-0 items-center justify-center self-center rounded-lg bg-soft-green text-xs font-bold text-green-dark tabular-nums">
                    {index + 1}
                  </span>
                  {section.heading}
                  <a
                    href={`#${section.id}`}
                    className="text-base text-subtle-text opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Link to ${section.heading}`}
                  >
                    #
                  </a>
                </h2>
                <div className="mt-4 space-y-3 pl-10 leading-relaxed text-primary-text/90 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul]:marker:text-green">
                  {section.body}
                </div>
              </section>
            ))}

            <div className="grid gap-4 border-t pt-10 sm:grid-cols-2 print:hidden">
              <a
                href={`mailto:${contactEmail}`}
                className="group flex items-start gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-green/60"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-soft-green text-green-dark">
                  <Mail className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-primary-text">Questions about this document?</span>
                  <span className="mt-1 block text-sm break-all text-green-dark">{contactEmail}</span>
                </span>
              </a>
              <Link
                href={related.href}
                className="group flex items-start gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-green/60"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold tracking-wider text-secondary-text uppercase">
                    Related
                  </span>
                  <span className="mt-1 block font-semibold text-primary-text">{related.title}</span>
                  <span className="mt-1 block text-sm text-secondary-text">{related.description}</span>
                </span>
                <ArrowRight
                  className="mt-1 size-4 shrink-0 text-subtle-text transition-transform group-hover:translate-x-0.5 group-hover:text-green-dark"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
