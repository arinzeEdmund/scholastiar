// Shaped after STRUCTURE/DATABASE/db.md → Billing Tables (plans, subscriptions).
// Plan catalogue follows STRUCTURE/BUILD_GUIDE/PRICING.md.

export type PlanAudience = "candidate" | "employer" | "provider";

export type PlanKey =
  | "starter"
  | "pro"
  | "employer_starter"
  | "employer_pro"
  | "employer_enterprise"
  | "provider_verified"
  | "provider_pro"
  | "provider_enterprise";

export interface Plan {
  id: PlanKey;
  audience: PlanAudience;
  name: string;
  /** One-line purpose shown on pricing cards. */
  description: string;
  /** Monthly price in `currency`. Null where PRICING.md has no final price yet (employer/provider plans). */
  price: number | null;
  currency: string;
  interval: "month" | "year" | null;
  /** Plan features in display order. For plans that build on a lower tier, only the additions. */
  features: string[];
  /** The lower plan this one includes ("Everything in Starter, plus…"). */
  includes_plan_id: PlanKey | null;
  /** Sales-led plans have no self-serve checkout ("Talk to sales"). */
  sales_led: boolean;
  active: boolean;
}

/** A cell in the plan comparison: included, not included, or a specific value ("Unlimited"). */
export type ComparisonValue = boolean | string;

export type ComparisonGroup = "discover" | "prepare" | "apply" | "portfolio" | "support";

/** plan_comparison_rows — structured feature matrix for the pricing page. */
export interface PlanComparisonRow {
  id: string;
  audience: PlanAudience;
  group: ComparisonGroup;
  label: string;
  description: string;
  values: Partial<Record<PlanKey, ComparisonValue>>;
  sort_order: number;
}

/** `incomplete`: chosen at sign-up but not yet paid; the account is sent back to checkout. */
export type SubscriptionStatus = "incomplete" | "active" | "past_due" | "canceled";

export interface Subscription {
  id: string;
  plan_id: PlanKey;
  user_id: string;
  employer_company_id: string | null;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  /** A downgrade waiting for the end of the paid period (no refund, no charge). */
  scheduled_plan_id?: PlanKey | null;
}

export type PaymentProvider = "stripe" | "paystack" | "flutterwave" | "cryptomus";
export type PaymentMethod = "card" | "local" | "crypto";

/** payment_attempts — card details are never stored. */
export interface PaymentAttempt {
  id: string;
  user_id: string;
  subscription_id: string;
  method: PaymentMethod;
  provider: PaymentProvider;
  provider_reference: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed";
  failure_reason: string | null;
  created_at: string;
}

export type CryptoPaymentStatus = "awaiting_payment" | "confirming" | "paid" | "underpaid" | "expired";

/** crypto_payments — a crypto invoice for a checkout (Cryptomus first; provider-agnostic). */
export interface CryptoPayment {
  id: string;
  user_id: string;
  subscription_id: string;
  provider: "cryptomus";
  provider_invoice_id: string;
  asset: string;
  network: string;
  amount_crypto: string;
  amount_usd: number;
  quote_rate: number;
  quote_expires_at: string;
  pay_address: string;
  received_crypto: string;
  tx_hash: string | null;
  confirmations: number;
  status: CryptoPaymentStatus;
  payment_attempt_id: string | null;
  created_at: string;
  updated_at: string;
}
