import { Building2, GraduationCap, Landmark, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { formatPlanPrice } from "@/components/marketing/plan-card";
import { ErrorState } from "@/components/states/error-state";
import { repos, type PlanAudience } from "@/data";
import { nextStepFor } from "@/lib/auth-flow";
import { safeLoad } from "@/lib/safe-load";
import { getSession } from "@/lib/session";

import { AuthHeading } from "./auth-heading";
import { SignUpWizard } from "./sign-up-wizard";

const COPY: Record<
  PlanAudience,
  { icon: LucideIcon; eyebrow: string; title: string; text: string; salesHref?: string }
> = {
  candidate: {
    icon: GraduationCap,
    eyebrow: "For students and graduates",
    title: "Create your account",
    text: "Tell us about yourself once. We'll match you with study, funding and work opportunities abroad.",
  },
  employer: {
    icon: Building2,
    eyebrow: "For employers",
    title: "Hire with Scholastiar",
    text: "Hire international students and sponsor graduates, with ranked applicants and clear work eligibility.",
    salesHref: "/contact?topic=employer_sales",
  },
  provider: {
    icon: Landmark,
    eyebrow: "For universities and funders",
    title: "Publish your opportunities",
    text: "For universities, colleges and scholarship funders.",
    salesHref: "/contact?topic=partnerships",
  },
};

/** Shared server wrapper for the three sign-up pages. */
export async function SignUpPage({ audience, requestedPlan }: { audience: PlanAudience; requestedPlan?: string }) {
  const session = await getSession();
  if (session) redirect(await nextStepFor(session.user.user_id));

  const [plansResult, countries] = await Promise.all([
    safeLoad(() => repos.billing.listPlans(audience)),
    repos.reference.listCountries(),
  ]);
  const copy = COPY[audience];

  if (!plansResult.ok) {
    return <ErrorState description="Sign-up isn't available right now. Refresh the page to try again." />;
  }
  const selfServe = plansResult.data.filter((p) => !p.sales_led && p.price !== null);
  const names = new Map(plansResult.data.map((p) => [p.id, p.name]));
  const defaultPlanId = selfServe.some((p) => p.id === requestedPlan) ? requestedPlan : undefined;

  return (
    <SignUpWizard
      accountType={audience}
      defaultPlanId={defaultPlanId}
      salesHref={copy.salesHref}
      header={<AuthHeading icon={copy.icon} eyebrow={copy.eyebrow} title={copy.title} description={copy.text} />}
      compactHeader={<AuthHeading compact icon={copy.icon} eyebrow={copy.eyebrow} title={copy.title} />}
      footer={
        <p className="mt-5 text-center text-sm text-secondary-text">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="font-semibold text-green-dark hover:underline">
            Sign in
          </Link>
        </p>
      }
      countries={countries.map(({ iso2, name }) => ({ iso2, name }))}
      plans={selfServe.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: formatPlanPrice(plan) ?? "",
        description: plan.description,
        highlights: plan.features.slice(0, 3),
        featured: plan.id.endsWith("pro"),
        includesName: plan.includes_plan_id ? names.get(plan.includes_plan_id) : undefined,
      }))}
    />
  );
}
