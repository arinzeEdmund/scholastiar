import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { FaqList } from "@/components/marketing/faq-list";
import { formatPlanPrice, PlanCard } from "@/components/marketing/plan-card";
import { PlanComparison } from "@/components/marketing/plan-comparison";
import { MarketingSection } from "@/components/marketing/section";
import { ErrorState } from "@/components/states/error-state";
import { ListSkeleton } from "@/components/states/loading-state";
import { Skeleton } from "@/components/ui/skeleton";
import { repos } from "@/data";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Applicants: Starter $35 or Pro $79 a month. Employers from $99 and universities and funders from $149 a month.",
};

async function ApplicantPlans() {
  const result = await safeLoad(() => repos.billing.listPlans("candidate"));
  if (!result.ok) return <ErrorState description="Plans couldn't load. Refresh the page to try again." />;
  const plans = result.data;
  if (plans.length === 0) return <p className="text-secondary-text">Plans will be published soon.</p>;

  const byId = new Map(plans.map((p) => [p.id, p]));

  return (
    <>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            highlighted={plan.id === "pro"}
            includedPlanName={plan.includes_plan_id ? byId.get(plan.includes_plan_id)?.name : undefined}
            ctaLabel={`Choose ${plan.name}`}
            ctaHref={`/auth/sign-up/candidate?plan=${plan.id}`}
          />
        ))}
      </div>
      <p className="mt-6 text-center text-sm">
        <a href="#compare" className="font-medium text-green-dark underline-offset-4 hover:underline">
          Compare every feature
        </a>
      </p>
    </>
  );
}

async function ComparisonSection() {
  const [plans, rows] = await Promise.all([
    safeLoad(() => repos.billing.listPlans("candidate")),
    safeLoad(() => repos.billing.listComparisonRows("candidate")),
  ]);
  if (!plans.ok || !rows.ok) {
    return <ErrorState description="The plan comparison couldn't load. Refresh the page to try again." />;
  }
  if (plans.data.length === 0 || rows.data.length === 0) return null;

  return (
    <>
      <PlanComparison
        plans={plans.data.map((plan) => ({
          id: plan.id,
          name: plan.name,
          price: formatPlanPrice(plan) ?? "—",
          ctaHref: `/auth/sign-up/candidate?plan=${plan.id}`,
          featured: plan.id === "pro",
        }))}
        rows={rows.data}
      />
      <p className="mt-6 text-sm text-secondary-text">
        Human-assisted help through Apply For Me is available on both plans and charged per application or campaign.
        There is no free applicant plan — you choose Starter or Pro when you sign up, and you can switch later.
      </p>
    </>
  );
}

/** Employer or provider plans: Starter/Verified, Pro (featured) and sales-led Enterprise. */
async function OrganisationPlans({ audience }: { audience: "employer" | "provider" }) {
  const result = await safeLoad(() => repos.billing.listPlans(audience));
  if (!result.ok) return <ErrorState description="Plans couldn't load. Refresh the page to try again." />;
  const plans = result.data;
  if (plans.length === 0) return null;
  const byId = new Map(plans.map((p) => [p.id, p]));
  const signUp = audience === "employer" ? "/auth/sign-up/employer" : "/auth/sign-up/provider";
  const salesTopic = audience === "employer" ? "employer_sales" : "partnerships";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          highlighted={plan.id.endsWith("_pro")}
          includedPlanName={plan.includes_plan_id ? byId.get(plan.includes_plan_id)?.name : undefined}
          ctaLabel={plan.sales_led ? "Talk to sales" : `Choose ${plan.name.replace(/^(Employer|Provider) /, "")}`}
          ctaHref={plan.sales_led ? `/contact?topic=${salesTopic}` : `${signUp}?plan=${plan.id}`}
        />
      ))}
    </div>
  );
}

async function BillingFaq() {
  const result = await safeLoad(() => repos.content.listFaqs("billing"));
  if (!result.ok || result.data.length === 0) return null;
  return <FaqList items={result.data} />;
}

export default function PricingPage() {
  return (
    <>
      <MarketingSection
        headingLevel={1}
        align="center"
        eyebrow="Pricing"
        title="Choose how much support you need"
        description="Two plans for applicants, in US dollars and billed monthly. Both include AI-prepared applications and tracking across every opportunity type."
        tone="aurora"
      >
        <Suspense
          fallback={
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              <Skeleton className="h-[34rem] rounded-xl" />
              <Skeleton className="h-[34rem] rounded-xl" />
            </div>
          }
        >
          <ApplicantPlans />
        </Suspense>
      </MarketingSection>

      <MarketingSection id="compare">
        <div className="mx-auto max-w-5xl">
          <Suspense fallback={<ListSkeleton rows={4} />}>
            <ComparisonSection />
          </Suspense>
        </div>
      </MarketingSection>

      <MarketingSection
        id="employers"
        tone="soft"
        eyebrow="For employers"
        title="Hire students and sponsor graduates"
        description="Pay monthly in US dollars. Post-study jobs with visa sponsorship are included from Employer Pro."
      >
        <Suspense fallback={<ListSkeleton rows={2} />}>
          <OrganisationPlans audience="employer" />
        </Suspense>
      </MarketingSection>

      <MarketingSection
        id="providers"
        eyebrow="For universities and funders"
        title="Publish verified opportunities"
        description="For universities, colleges and scholarship funders."
      >
        <Suspense fallback={<ListSkeleton rows={2} />}>
          <OrganisationPlans audience="provider" />
        </Suspense>
      </MarketingSection>

      <MarketingSection eyebrow="Questions" title="Billing questions">
        <div className="max-w-3xl">
          <Suspense fallback={<ListSkeleton rows={3} />}>
            <BillingFaq />
          </Suspense>
          <p className="mt-6 text-sm text-secondary-text">
            More answers in the{" "}
            <Link href="/faq" className="font-medium text-green-dark underline-offset-4 hover:underline">
              help centre
            </Link>
            .
          </p>
        </div>
      </MarketingSection>
    </>
  );
}
