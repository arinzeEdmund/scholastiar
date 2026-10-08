import type {
  CryptoPayment,
  PaymentAttempt,
  PaymentMethod,
  PaymentProvider,
  Plan,
  PlanAudience,
  PlanComparisonRow,
  PlanKey,
  Subscription,
} from "@/data/types";

export interface BillingRepository {
  listPlans(audience?: PlanAudience): Promise<Plan[]>;
  /** Structured feature comparison for the pricing page. */
  listComparisonRows(audience: PlanAudience): Promise<PlanComparisonRow[]>;
  getSubscription(userId: string): Promise<Subscription | null>;
  /** A plan change waiting for payment while the current plan stays active. */
  getPendingSubscription(userId: string): Promise<Subscription | null>;
  /** Payment history, newest first. */
  listPayments(userId: string): Promise<PaymentAttempt[]>;
  /** Schedules (or clears, with null) a downgrade at the end of the current period. */
  scheduleDowngrade(userId: string, planId: PlanKey | null): Promise<Subscription | null>;
  /** Phase A: instant plan switch. Phase B: driven by checkout + payment webhooks. */
  setPlan(userId: string, planId: PlanKey): Promise<Subscription>;
  getPlan(planId: PlanKey): Promise<Plan | null>;
  /** Sign-up and plan changes: a subscription waiting for payment. */
  startSubscription(userId: string, planId: PlanKey): Promise<Subscription>;
  /** Records a payment attempt; a successful one activates the subscription. */
  recordPayment(input: {
    userId: string;
    subscriptionId: string;
    method: PaymentMethod;
    provider: PaymentProvider;
    amount: number;
    currency: string;
    succeeded: boolean;
    failureReason: string | null;
  }): Promise<PaymentAttempt>;
  /** Crypto invoices (Phase B: created at the crypto provider; status updated by its webhooks). */
  createCryptoPayment(input: Omit<CryptoPayment, "id" | "created_at" | "updated_at">): Promise<CryptoPayment>;
  getCryptoPayment(userId: string, id: string): Promise<CryptoPayment | null>;
  updateCryptoPayment(id: string, update: Partial<CryptoPayment>): Promise<CryptoPayment>;
  /** Phase A: instant removal. Phase B: cancellation through the payment provider. */
  cancelSubscription(userId: string): Promise<void>;
}
