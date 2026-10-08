import {
  BadgeCheck,
  BarChart3,
  Bot,
  ClipboardList,
  FileCheck2,
  Handshake,
  ListChecks,
  MessageSquare,
  Search,
  Sparkles,
  UserRound,
  Video,
} from "lucide-react";
import type { Metadata } from "next";

import { RouteButton } from "@/components/layout/route-button";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarketingSection } from "@/components/marketing/section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "How it works",
  description: "How applicants and employers use Scholastiar.ai, step by step.",
};

const APPLICANT_STEPS = [
  {
    icon: UserRound,
    title: "Sign up and choose your plan",
    body: "Pick Starter or Pro, then a guided interview builds your profile: experience, education, skills, languages, documents and where you want to go.",
  },
  {
    icon: Search,
    title: "Discover opportunities that fit",
    body: "Universities and scholarships, filtered by your eligibility and visa conditions. Each card shows a success score, effort and deadline.",
  },
  {
    icon: FileCheck2,
    title: "Check your readiness",
    body: "See exactly which documents and requirements are missing for each opportunity, and fix them once for every application.",
  },
  {
    icon: Sparkles,
    title: "Prepare with AI",
    body: "Generate a CV in the right format for the country and role, and draft answers to application questions — from your real experience. Review and edit everything.",
  },
  {
    icon: Bot,
    title: "Apply your way",
    body: "Submit yourself, queue opportunities for AI Apply Agent under your rules, or hand them to a verified Forwarder through Apply For Me.",
  },
  {
    icon: ClipboardList,
    title: "Track and respond",
    body: "Follow every status, message employers and providers in one inbox, and get reminders before deadlines.",
  },
];

const EMPLOYER_STEPS = [
  {
    icon: BadgeCheck,
    title: "Set up and verify your company",
    body: "Create your company profile and complete verification so your roles can be published.",
  },
  {
    icon: ListChecks,
    title: "Post a role",
    body: "Describe the student job (hours, pay, location and whether it fits study visa work conditions) and add screening questions. Every new role is reviewed before it goes live.",
  },
  {
    icon: BarChart3,
    title: "Review a ranked shortlist",
    body: "Applicants are ranked on fit, with an AI summary explaining why — and each student's visa work conditions on their profile.",
  },
  {
    icon: Video,
    title: "Meet candidates beyond the CV",
    body: "PersonalityAI CV videos and Signia portfolios show communication and real work before the first interview.",
  },
  {
    icon: MessageSquare,
    title: "Message, interview and hire",
    body: "Move candidates through your pipeline, invite them to interview and send offers — all in one workspace.",
  },
];

function StepList({ steps }: { steps: typeof APPLICANT_STEPS }) {
  return (
    <ol className="relative space-y-4 border-l-2 border-soft-green pl-8">
      {steps.map(({ icon: Icon, title, body }, index) => (
        <li key={title} className="relative rounded-lg border bg-card p-6">
          <span className="absolute top-6 -left-[3.05rem] flex size-9 items-center justify-center rounded-full border-4 border-background bg-green-action text-sm font-bold text-white">
            {index + 1}
          </span>
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-green" aria-hidden />
            <h3 className="text-lg font-semibold text-primary-text">{title}</h3>
          </div>
          <p className="mt-2 text-secondary-text">{body}</p>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <MarketingSection
        headingLevel={1}
        eyebrow="How it works"
        title="One profile. Every application."
        description="Scholastiar.ai does the repetitive work of finding, preparing and tracking applications abroad, while you stay in control of every decision."
        tone="aurora"
      />

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Tabs defaultValue="applicants">
            <TabsList className="mb-8 w-full sm:w-auto">
              <TabsTrigger value="applicants">For applicants</TabsTrigger>
              <TabsTrigger value="employers">For employers</TabsTrigger>
            </TabsList>
            <TabsContent value="applicants">
              <StepList steps={APPLICANT_STEPS} />
            </TabsContent>
            <TabsContent value="employers">
              <StepList steps={EMPLOYER_STEPS} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <MarketingSection tone="soft" eyebrow="Also on Scholastiar" title="Universities, funders and migration support">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <Handshake className="size-6 text-green" aria-hidden />
            <h3 className="mt-4 text-lg font-semibold">Opportunity providers</h3>
            <p className="mt-2 text-secondary-text">
              Universities and scholarship funders publish verified opportunities and receive prepared, complete
              applications.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <BadgeCheck className="size-6 text-green" aria-hidden />
            <h3 className="mt-4 text-lg font-semibold">Migration agencies</h3>
            <p className="mt-2 text-secondary-text">
              Scholastiar offices and verified partner agencies offer document checks, visa guidance appointments and
              relocation planning.
            </p>
          </div>
        </div>
      </MarketingSection>

      <CtaBand
        title="Ready to start?"
        description="Choose a plan, build your profile once and see opportunities that fit."
        actions={
          <>
            <RouteButton href="/auth/sign-up/candidate" size="lg">
              Get started
            </RouteButton>
            <RouteButton href="/pricing" size="lg" variant="outline-inverse">
              See pricing
            </RouteButton>
          </>
        }
      />
    </>
  );
}
