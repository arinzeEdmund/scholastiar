import type { Metadata } from "next";
import Link from "next/link";

import { BadgeCheck, CreditCard, Scale, ShieldCheck } from "lucide-react";

import { LegalPage, type LegalSection, type LegalSummaryPoint } from "@/components/marketing/legal-page";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms for using Scholastiar.ai.",
};

const SUMMARY: LegalSummaryPoint[] = [
  {
    icon: CreditCard,
    title: "Two monthly plans",
    text: "Starter or Pro, chosen at sign-up, billed monthly in US dollars.",
  },
  {
    icon: Scale,
    title: "No guaranteed outcomes",
    text: "Employers, institutions and authorities make every decision.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing sent without you",
    text: "AI Apply Agent and Apply For Me only act on what you approve.",
  },
  {
    icon: BadgeCheck,
    title: "Verified organisations",
    text: "Employers and providers are checked before they can publish.",
  },
];

const SECTIONS: LegalSection[] = [
  {
    id: "accounts",
    heading: "Your account",
    body: (
      <p>
        You need an account to use Scholastiar.ai beyond its public pages. Keep your sign-in details secure and tell us
        if you think someone else has used your account.
      </p>
    ),
  },
  {
    id: "plans",
    heading: "Plans and billing",
    body: (
      <>
        <p>
          Applicants choose a paid plan when they sign up: Starter or Pro, billed monthly in US dollars. Current prices
          are on the{" "}
          <Link href="/pricing" className="text-green-dark underline-offset-4 hover:underline">
            pricing page
          </Link>
          . You can switch plans from your billing page.
        </p>
        <p>Apply For Me and other human-assisted services are charged separately, as shown before you buy them.</p>
        <p>Cancellation and refund terms: to be confirmed before launch.</p>
      </>
    ),
  },
  {
    id: "no-guarantees",
    heading: "No guaranteed outcomes",
    body: (
      <p>
        Scholastiar.ai helps you find opportunities and prepare applications. Employers, institutions, funders, award
        bodies and immigration authorities make their own decisions. We do not guarantee any job, admission, funding,
        award, visa or migration outcome. Visa and immigration information is general guidance, not legal advice.
      </p>
    ),
  },
  {
    id: "your-content",
    heading: "Your information and AI drafts",
    body: (
      <>
        <p>
          You are responsible for making sure the information and documents you provide are true and yours to share.
          AI-prepared materials are drafts: review them before use, and don&apos;t submit anything that is not accurate.
        </p>
        <p>
          AI Apply Agent and Apply For Me only act on applications you have approved, within the rules and consent you
          give.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    body: (
      <ul>
        <li>Don&apos;t submit false or misleading information or documents.</li>
        <li>Don&apos;t misuse other users&apos; information or contact them for unrelated purposes.</li>
        <li>Don&apos;t post fraudulent opportunities or charge applicants fees to apply.</li>
        <li>Don&apos;t attempt to access accounts or data that aren&apos;t yours.</li>
      </ul>
    ),
  },
  {
    id: "organisations",
    heading: "Employers and providers",
    body: (
      <p>
        Organisations must complete verification before publishing opportunities, keep listings accurate, and use
        applicant information only for the opportunity it was submitted for.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    body: <p>We will tell you about material changes before they take effect.</p>,
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Questions about these terms? Email{" "}
        <a href={`mailto:${SITE.emails.support}`} className="text-green-dark underline-offset-4 hover:underline">
          {SITE.emails.support}
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      intro="These terms explain how Scholastiar.ai works, what you can expect from us, and what we expect from everyone who uses it."
      lastUpdated="2026-10-01T00:00:00.000Z"
      summary={SUMMARY}
      sections={SECTIONS}
      contactEmail={SITE.emails.support}
      related={{ href: "/privacy", title: "Privacy policy", description: "What we collect and how we protect it." }}
    />
  );
}
