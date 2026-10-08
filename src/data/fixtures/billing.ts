import type {
  PaymentAttempt,
  ComparisonGroup,
  ComparisonValue,
  Plan,
  PlanAudience,
  PlanComparisonRow,
  PlanKey,
  Subscription,
} from "@/data/types";

// Plan catalogue from STRUCTURE/BUILD_GUIDE/PRICING.md (prices decided 2026-10-01).
// Enterprise plans are sales-led and have no price.

interface PlanInput {
  name: string;
  description: string;
  price?: number | null;
  features: string[];
  includes?: PlanKey;
  salesLed?: boolean;
}

function plan(id: PlanKey, audience: PlanAudience, input: PlanInput): Plan {
  return {
    id,
    audience,
    name: input.name,
    description: input.description,
    price: input.price ?? null,
    currency: "USD",
    interval: "month",
    features: input.features,
    includes_plan_id: input.includes ?? null,
    sales_led: input.salesLed ?? false,
    active: true,
  };
}

export const planFixtures: Plan[] = [
  plan("starter", "candidate", {
    name: "Starter",
    description: "Organise your search and prepare applications with AI help.",
    price: 35,
    features: [
      "Save opportunities across every category",
      "Full opportunity details, effort labels and success score explanations",
      "Deadline reminders and a deadline dashboard",
      "AI CV, essay and application answer credits",
      "Multiple tailored CV versions",
      "AI fit analysis for each opportunity",
      "Published Signia portfolio with project proof",
      "Application tracker",
      "Document checklist and readiness checks",
      "Country and mobility recommendations",
      "AI Apply Agent and Apply For Me boards",
    ],
  }),
  plan("pro", "candidate", {
    name: "Pro",
    description: "For heavy applicants who need high-volume preparation and stronger support.",
    price: 79,
    includes: "starter",
    features: [
      "Higher AI generation limits",
      "Priority scoring and readiness checks",
      "Scholarship essay and personal statement support",
      "Interview preparation",
      "Advanced application intelligence",
      "AI Apply Agent queue credits",
      "Apply For Me campaign preparation",
      "Expanded document and Signia media storage",
      "AI-assisted Signia project summaries",
      "Proof and archive workspace",
      "Priority support",
      "Job connections: student jobs and post-study jobs with visa sponsorship (no promise of a job)",
    ],
  }),
  plan("employer_starter", "employer", {
    name: "Employer Starter",
    description: "Hire international students for part-time and campus roles.",
    price: 99,
    features: [
      "Up to 3 active student jobs",
      "Applicant pipeline",
      "Screening questions",
      "Basic AI candidate ranking",
      "Messaging",
      "2 team seats",
    ],
  }),
  plan("employer_pro", "employer", {
    name: "Employer Pro",
    description: "Hire students and sponsor graduates, with AI ranking and analytics.",
    price: 249,
    includes: "employer_starter",
    features: [
      "Up to 15 active jobs",
      "Post-study jobs with visa sponsorship",
      "Full AI ranking with reasons",
      "Work eligibility tools",
      "Signia evidence and limited search",
      "Applicant analytics and employer branding",
      "5 team seats",
    ],
  }),
  plan("employer_enterprise", "employer", {
    name: "Employer Enterprise",
    description: "High-volume hiring with integrations and dedicated support.",
    includes: "employer_pro",
    salesLed: true,
    features: [
      "Unlimited jobs",
      "Advanced Signia search and comparison",
      "Integrations and audit logs",
      "Custom billing and roles",
      "Dedicated support",
    ],
  }),
  plan("provider_verified", "provider", {
    name: "Provider Verified",
    description: "Publish verified opportunities and receive applications.",
    price: 149,
    features: [
      "Verification badge",
      "Up to 10 active opportunities",
      "Receive applications or enquiries",
      "Basic applicant dashboard",
      "2 team seats",
    ],
  }),
  plan("provider_pro", "provider", {
    name: "Provider Pro",
    description: "Unlimited opportunities with AI summaries and analytics.",
    price: 399,
    includes: "provider_verified",
    features: [
      "Unlimited opportunities",
      "AI applicant summaries",
      "Messaging",
      "Analytics",
      "Priority verification",
      "10 team seats",
    ],
  }),
  plan("provider_enterprise", "provider", {
    name: "Provider Enterprise",
    description: "Multiple campuses and teams with custom review flows.",
    includes: "provider_pro",
    salesLed: true,
    features: [
      "Multiple teams or campuses",
      "Bulk opportunity uploads",
      "API and integration support",
      "Custom review flows",
      "Dedicated support",
    ],
  }),
];

function subscription(user_id: string, plan_id: PlanKey): Subscription {
  return {
    id: `sub-${user_id}`,
    plan_id,
    user_id,
    employer_company_id: null,
    status: "active",
    current_period_start: "2026-09-01T00:00:00.000Z",
    current_period_end: "2026-10-31T23:59:59.000Z",
  };
}

export const subscriptionFixtures: Subscription[] = [
  subscription("user-amara", "starter"),
  subscription("user-kwame", "pro"),
  subscription("user-sarah", "employer_pro"),
  subscription("user-james", "employer_pro"),
  subscription("user-lena", "provider_verified"),
];

function paid(
  user_id: string,
  amount: number,
  created_at: string,
  method: PaymentAttempt["method"] = "card",
): PaymentAttempt {
  return {
    id: `payment-${user_id}-${created_at.slice(0, 10)}`,
    user_id,
    subscription_id: `sub-${user_id}`,
    method,
    provider: method === "card" ? "stripe" : method === "crypto" ? "cryptomus" : "paystack",
    provider_reference: `demo_${user_id.slice(5)}_${created_at.slice(5, 7)}`,
    amount,
    currency: "USD",
    status: "succeeded",
    failure_reason: null,
    created_at,
  };
}

/** Earlier monthly payments for the demo students. */
export const paymentAttemptFixtures: PaymentAttempt[] = [
  paid("user-amara", 35, "2026-08-01T09:00:00.000Z", "local"),
  paid("user-amara", 35, "2026-09-01T09:00:00.000Z", "local"),
  paid("user-kwame", 79, "2026-09-01T10:30:00.000Z"),
];

// Applicant plan comparison (PRICING.md → Applicant Plans). Values are what each plan gets.
let comparisonOrder = 0;
function row(
  group: ComparisonGroup,
  label: string,
  description: string,
  starter: ComparisonValue,
  pro: ComparisonValue,
): PlanComparisonRow {
  comparisonOrder += 1;
  return {
    id: `compare-${comparisonOrder}`,
    audience: "candidate",
    group,
    label,
    description,
    values: { starter, pro },
    sort_order: comparisonOrder,
  };
}

export const planComparisonFixtures: PlanComparisonRow[] = [
  row(
    "discover",
    "Save opportunities",
    "Save universities, scholarships, funding and more in one list.",
    "Every category",
    "Every category",
  ),
  row(
    "discover",
    "Full opportunity details",
    "Effort labels, deadlines and the full success score breakdown.",
    true,
    true,
  ),
  row("discover", "Deadline reminders", "Email and app reminders, plus a deadline dashboard.", true, true),
  row(
    "discover",
    "Job connections",
    "Student jobs that fit your visa hours and post-study jobs with visa sponsorship, in your dashboard. A connection to employers, not a promise of a job.",
    false,
    true,
  ),
  row(
    "discover",
    "Country and mobility recommendations",
    "Suggestions based on where you want to study, work and live.",
    true,
    true,
  ),
  row(
    "prepare",
    "AI CVs, essays and answers",
    "Drafted from your real profile, in the format each country expects.",
    "Standard monthly credits",
    "Higher limits",
  ),
  row("prepare", "Tailored CV versions", "Keep a different CV for each kind of application.", "Multiple", "Multiple"),
  row("prepare", "AI fit analysis", "Why an opportunity fits you, and what's missing.", true, true),
  row(
    "prepare",
    "Scholarship essays and personal statements",
    "Help with personal statements and motivation essays.",
    false,
    true,
  ),
  row("prepare", "Interview preparation", "Practice questions and feedback for your upcoming interviews.", false, true),
  row(
    "apply",
    "Application tracker",
    "Every application and status in one place.",
    "Standard",
    "With application intelligence",
  ),
  row(
    "apply",
    "Readiness checks",
    "Which documents and requirements are missing for each opportunity.",
    "Standard",
    "Priority",
  ),
  row("apply", "AI Apply Agent board", "Queue opportunities for the agent to prepare under your rules.", true, true),
  row(
    "apply",
    "AI Apply Agent queue credits",
    "Credits for the agent to prepare and submit applications.",
    false,
    "Included",
  ),
  row("apply", "Apply For Me board", "Hand applications to a verified Forwarder.", true, true),
  row(
    "apply",
    "Apply For Me campaign preparation",
    "We prepare your profile and documents for a Forwarder campaign.",
    false,
    true,
  ),
  row("portfolio", "Published Signia portfolio", "A public page showing your projects and proof of work.", true, true),
  row(
    "portfolio",
    "AI-assisted project summaries",
    "Clear summaries of your Signia projects for reviewers.",
    false,
    true,
  ),
  row(
    "portfolio",
    "Document and media storage",
    "Space for documents, certificates and Signia videos.",
    "Standard",
    "Expanded",
  ),
  row(
    "portfolio",
    "Proof and archive workspace",
    "Keep proof of every submission, organised by application.",
    false,
    true,
  ),
  row("support", "Support", "Help from the Scholastiar team.", "Standard", "Priority"),
  row(
    "support",
    "Human help (Apply For Me)",
    "A verified person applies for you.",
    "Pay per application",
    "Pay per application",
  ),
];
