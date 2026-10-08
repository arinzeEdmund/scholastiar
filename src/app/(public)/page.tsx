import {
  ArrowRight,
  BadgeCheck,
  Bot,
  FileText,
  Globe2,
  Handshake,
  Lock,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { RouteButton } from "@/components/layout/route-button";
import { ArticleCard } from "@/components/marketing/article-card";
import { CategoryGrid } from "@/components/marketing/category-grid";
import { CtaBand } from "@/components/marketing/cta-band";
import { OpportunityPreview } from "@/components/marketing/opportunity-preview";
import { PlanCard } from "@/components/marketing/plan-card";
import { MarketingSection } from "@/components/marketing/section";
import { ErrorState } from "@/components/states/error-state";
import { ListSkeleton } from "@/components/states/loading-state";
import { Skeleton } from "@/components/ui/skeleton";
import { repos } from "@/data";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = {
  title: { absolute: "Scholastiar.ai — Study, funding and relocation abroad" },
  description:
    "Find universities and scholarships abroad that fit you, prepare every application from one profile, and get ready to move.",
};

const STEPS = [
  {
    icon: UserRound,
    title: "Build your profile once",
    body: "A guided interview captures your experience, documents, languages and where you want to go.",
  },
  {
    icon: Search,
    title: "See what fits",
    body: "Matches account for your eligibility, visa conditions and deadlines, with a success score you can understand.",
  },
  {
    icon: Sparkles,
    title: "Prepare with AI",
    body: "Tailored CVs and answers written from your real experience, in the format each country expects. You edit and approve.",
  },
  {
    icon: Send,
    title: "Apply and track",
    body: "Apply yourself, queue it for AI Apply Agent, or hand it to Apply For Me — then follow every status in one place.",
  },
];

const APPLY_WAYS = [
  {
    icon: FileText,
    title: "Apply yourself",
    body: "Use your tailored CV and drafted answers, review them, and submit when you're happy.",
  },
  {
    icon: Bot,
    title: "AI Apply Agent",
    body: "Set your rules and approve a queue. The agent prepares and submits where portals allow, with proof of each submission.",
  },
  {
    icon: Handshake,
    title: "Apply For Me",
    body: "A verified Scholastiar Forwarder handles the application with you, with milestones and proof of submission.",
  },
];

const TRUST = [
  {
    icon: Globe2,
    title: "Visa guidance at every step",
    body: "Your study visa, permit dates and the rules for your destination stay in view, from your first application to settling in.",
  },
  {
    icon: BadgeCheck,
    title: "Verified employers and providers",
    body: "Organisations are checked before their listings go live, and verified ones are clearly labelled.",
  },
  {
    icon: Scale,
    title: "Honest guidance",
    body: "We never promise a visa, admission, job or award. Scores are estimates, and decisions stay with the people who make them.",
  },
  {
    icon: Lock,
    title: "Your data stays yours",
    body: "Documents are private by default. Nothing is shared or submitted without your consent.",
  },
];

async function PlansPreview() {
  const result = await safeLoad(() => repos.billing.listPlans("candidate"));
  if (!result.ok) return <ErrorState description="Plans couldn't load. See all plans on the pricing page." />;
  const plans = result.data;
  if (plans.length === 0) return null;
  const names = new Map(plans.map((p) => [p.id, p.name]));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          highlighted={plan.id === "pro"}
          includedPlanName={plan.includes_plan_id ? names.get(plan.includes_plan_id) : undefined}
          ctaLabel={`Choose ${plan.name}`}
          ctaHref={`/auth/sign-up/candidate?plan=${plan.id}`}
          featureLimit={5}
        />
      ))}
    </div>
  );
}

async function LatestGuides() {
  const result = await safeLoad(() => repos.content.listArticles());
  if (!result.ok) return <ErrorState description="Guides couldn't load. Try the blog instead." />;
  const articles = result.data.slice(0, 3);
  if (articles.length === 0) return <p className="text-secondary-text">New guides are on their way.</p>;
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {articles.map((article) => (
        <li key={article.id}>
          <ArticleCard article={article} />
        </li>
      ))}
    </ul>
  );
}

async function Testimonials() {
  const result = await safeLoad(() => repos.content.listTestimonials());
  if (!result.ok || result.data.length === 0) return null;
  return (
    <MarketingSection eyebrow="In their words" title="Less repeating yourself. More applying.">
      <ul className="grid gap-4 md:grid-cols-3">
        {result.data.map((t) => (
          <li key={t.id}>
            <figure className="flex h-full flex-col rounded-lg border bg-card p-6">
              <blockquote className="flex-1 text-primary-text">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-primary-text">{t.person_name}</span>
                <span className="block text-secondary-text">{t.person_context}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </MarketingSection>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="grain overflow-hidden aurora-dark text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-12">
          <div>
            <p className="text-sm font-semibold text-mint">For people building a life across borders</p>
            <h1 className="mt-4 text-4xl font-bold text-balance sm:text-5xl xl:text-6xl">
              Study and funding abroad. <span className="text-gradient-mint">Explain yourself once.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              Scholastiar.ai finds universities and scholarships abroad that fit you, then prepares every application
              from the profile you build once.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <RouteButton href="/auth/sign-up/candidate" size="lg">
                Get started
                <ArrowRight aria-hidden />
              </RouteButton>
              <RouteButton href="/how-it-works" size="lg" variant="outline-inverse">
                See how it works
              </RouteButton>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-mint" aria-hidden />
                Visa guidance at every step
              </li>
              <li className="flex items-center gap-1.5">
                <BadgeCheck className="size-4 text-mint" aria-hidden />
                Verified employers
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="size-4 text-mint" aria-hidden />
                Nothing sent without your approval
              </li>
            </ul>
          </div>
          <OpportunityPreview />
        </div>
      </section>

      <MarketingSection
        eyebrow="One platform"
        title="Every kind of opportunity, in one place"
        description="Each one is treated as a path abroad — with the visa, funding and relocation details you need to decide."
      >
        <CategoryGrid />
      </MarketingSection>

      <MarketingSection
        tone="aurora"
        eyebrow="How it works"
        title="From profile to submitted application"
        description={
          <>
            The platform does the repetitive work.{" "}
            <Link href="/how-it-works" className="font-medium text-green-dark underline-offset-4 hover:underline">
              See the full walkthrough
            </Link>
          </>
        }
      >
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="rounded-lg border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-soft-green text-green-dark">
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-semibold text-green-dark">Step {index + 1}</p>
              <h3 className="mt-1 font-semibold text-primary-text">{title}</h3>
              <p className="mt-2 text-sm text-secondary-text">{body}</p>
            </li>
          ))}
        </ol>
      </MarketingSection>

      <MarketingSection
        eyebrow="Three ways to apply"
        title="Do it yourself, automate it, or hand it over"
        description={
          <>
            Choose per opportunity.{" "}
            <Link
              href="/blog/self-apply-ai-apply-agent-or-apply-for-me"
              className="font-medium text-green-dark underline-offset-4 hover:underline"
            >
              Which should you use?
            </Link>
          </>
        }
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {APPLY_WAYS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-lg border bg-card p-6">
              <Icon className="size-6 text-green" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-primary-text">{title}</h3>
              <p className="mt-2 text-sm text-secondary-text">{body}</p>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection tone="dark" eyebrow="Built for crossing borders" title="Clear about what matters when you move">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <Icon className="size-6 text-mint" aria-hidden />
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/70">{body}</p>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection>
        {/* The one solid green panel on the page (ux_ui_base.md → Atmosphere). */}
        <div className="grain overflow-hidden rounded-2xl bg-green-deep text-white">
          <div className="grid items-center gap-8 beams p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-sm font-semibold text-mint">For employers</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Hire international students without the screening backlog
              </h2>
              <p className="mt-3 text-white/80">
                Ranked student applicants with reasons, visa work conditions on every profile, video introductions and
                evidence of real work — in one hiring workspace.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
              <RouteButton href="/for-employers" size="lg" variant="inverse">
                Hire with Scholastiar
              </RouteButton>
              <RouteButton href="/contact?topic=employer_sales" size="lg" variant="outline-inverse">
                Talk to our team
              </RouteButton>
            </div>
          </div>
        </div>
      </MarketingSection>

      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      <MarketingSection
        tone="aurora"
        eyebrow="Pricing"
        title="Two plans. Choose how much support you need."
        description={
          <>
            Prices in US dollars, billed monthly.{" "}
            <Link href="/pricing" className="font-medium text-green-dark underline-offset-4 hover:underline">
              Compare plans in full
            </Link>
          </>
        }
      >
        <Suspense
          fallback={
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-96 rounded-xl" />
              <Skeleton className="h-96 rounded-xl" />
            </div>
          }
        >
          <PlansPreview />
        </Suspense>
      </MarketingSection>

      <MarketingSection
        eyebrow="Guides"
        title="Practical guides for moving abroad"
        description={
          <Link href="/blog" className="font-medium text-green-dark underline-offset-4 hover:underline">
            Browse all guides
          </Link>
        }
      >
        <Suspense fallback={<ListSkeleton rows={3} />}>
          <LatestGuides />
        </Suspense>
      </MarketingSection>

      <CtaBand
        title="Start with a profile that works for every application"
        description="Tell us about yourself once. We'll match you with opportunities abroad and help you apply."
        actions={
          <>
            <RouteButton href="/auth/sign-up/candidate" size="lg">
              Get started
            </RouteButton>
            <RouteButton href="/how-it-works" size="lg" variant="outline-inverse">
              How it works
            </RouteButton>
          </>
        }
      />
    </>
  );
}
