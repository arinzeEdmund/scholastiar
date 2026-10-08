import type { Metadata } from "next";

import { Eye, FileLock2, Sparkles, UserCheck } from "lucide-react";

import { LegalPage, type LegalSection, type LegalSummaryPoint } from "@/components/marketing/legal-page";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Scholastiar.ai collects, uses and protects your information.",
};

const SUMMARY: LegalSummaryPoint[] = [
  {
    icon: FileLock2,
    title: "Private by default",
    text: "Your documents stay private unless you submit or publish them.",
  },
  {
    icon: Eye,
    title: "You choose who sees what",
    text: "Organisations only see what you send with an application.",
  },
  {
    icon: Sparkles,
    title: "AI drafts, you decide",
    text: "AI never invents experience, and you review every draft.",
  },
  {
    icon: UserCheck,
    title: "Your data, your rights",
    text: "View, edit, download or delete your data from settings.",
  },
];

const SECTIONS: LegalSection[] = [
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: (
      <>
        <p>We collect the information you give us and information created when you use Scholastiar.ai:</p>
        <ul>
          <li>Account details such as your name, email address and country.</li>
          <li>Profile information such as education, work history, skills, languages, visa status and preferences.</li>
          <li>Documents you upload, such as CVs, certificates, transcripts and reference letters.</li>
          <li>Applications you prepare or submit, and messages you send through the platform.</li>
          <li>Usage information such as pages viewed and features used, to keep the service working and improve it.</li>
        </ul>
        <p>Payments are handled by our payment providers. We do not store your full card details.</p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    heading: "How we use your information",
    body: (
      <ul>
        <li>To match you with opportunities and show how ready you are for each one.</li>
        <li>To prepare CVs, answers and other application materials that you review before use.</li>
        <li>To submit applications only when you have given consent.</li>
        <li>To send the emails and notifications you have chosen to receive.</li>
        <li>To keep the platform secure and prevent fraud and misuse.</li>
      </ul>
    ),
  },
  {
    id: "ai",
    heading: "How AI uses your information",
    body: (
      <>
        <p>
          AI features run on our servers through AI service providers. They use your profile and the opportunity details
          to draft materials. AI is instructed not to invent qualifications, documents, achievements or experience, and
          every draft is shown to you for review and editing before it is used.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    heading: "Who sees your information",
    body: (
      <ul>
        <li>Your documents are private by default.</li>
        <li>
          Employers, universities and other providers only see what you submit to them in an application, or what you
          choose to make public on your Signia portfolio.
        </li>
        <li>
          If you use Apply For Me, the verified Forwarder working on your request sees the information needed for that
          work.
        </li>
        <li>
          Service providers who help us run the platform (such as hosting, email, payments and AI) process data on our
          behalf.
        </li>
        <li>We may disclose information where the law requires it.</li>
      </ul>
    ),
  },
  {
    id: "your-choices",
    heading: "Your choices and rights",
    body: (
      <>
        <p>
          You can view and edit your profile, control what is public, choose which emails you receive, and download or
          delete your data from your settings.
        </p>
        <p>
          Depending on where you live, you may have further rights under data protection law. Contact us to use them.
        </p>
      </>
    ),
  },
  {
    id: "security",
    heading: "Security and retention",
    body: (
      <p>
        We protect your information with access controls and encryption, and restrict access to staff who need it. We
        keep your information while your account is active and for as long as needed to meet legal obligations.
      </p>
    ),
  },
  {
    id: "international",
    heading: "International transfers",
    body: (
      <p>
        Because Scholastiar.ai connects people across borders, your information may be processed in countries other than
        your own, including when you apply to an organisation abroad.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Questions about privacy? Email{" "}
        <a href={`mailto:${SITE.emails.privacy}`} className="text-green-dark underline-offset-4 hover:underline">
          {SITE.emails.privacy}
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="This policy explains what information Scholastiar.ai collects, how we use it, who can see it, and the choices you have."
      lastUpdated="2026-10-01T00:00:00.000Z"
      summary={SUMMARY}
      sections={SECTIONS}
      contactEmail={SITE.emails.privacy}
      related={{
        href: "/terms",
        title: "Terms of service",
        description: "How Scholastiar.ai works and what we expect.",
      }}
    />
  );
}
