import "server-only";

import type { BillingRepository } from "@/data/repositories/billing";

import { now, readList, readSystem, write } from "./store";

export const mockBillingRepository: BillingRepository = {
  listPlans: (audience) => readList((db) => db.plans.filter((p) => p.active && (!audience || p.audience === audience))),

  listComparisonRows: (audience) =>
    readList((db) =>
      db.plan_comparison_rows.filter((r) => r.audience === audience).sort((a, b) => a.sort_order - b.sort_order),
    ),

  getPlan: (planId) => readSystem((db) => db.plans.find((p) => p.id === planId) ?? null),

  startSubscription: (userId, planId) =>
    write((db) => {
      const active = db.subscriptions.find((s) => s.user_id === userId && s.status === "active");
      if (active?.plan_id === planId) return active;
      // Replace any earlier unpaid choice; an active plan keeps running until the new one is paid for.
      db.subscriptions = db.subscriptions.filter((s) => !(s.user_id === userId && s.status === "incomplete"));
      const start = new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      const pending = {
        id: `sub-${crypto.randomUUID()}`,
        plan_id: planId,
        user_id: userId,
        employer_company_id: null,
        status: "incomplete" as const,
        current_period_start: start.toISOString(),
        current_period_end: end.toISOString(),
      };
      db.subscriptions.push(pending);
      return pending;
    }),

  recordPayment: (input) =>
    write((db) => {
      const attempt = {
        id: `payment-${crypto.randomUUID()}`,
        user_id: input.userId,
        subscription_id: input.subscriptionId,
        method: input.method,
        provider: input.provider,
        provider_reference: `mock_${crypto.randomUUID().slice(0, 12)}`,
        amount: input.amount,
        currency: input.currency,
        status: input.succeeded ? ("succeeded" as const) : ("failed" as const),
        failure_reason: input.failureReason,
        created_at: now(),
      };
      db.payment_attempts.push(attempt);
      if (input.succeeded) {
        // The paid subscription becomes the user's only subscription.
        db.subscriptions = db.subscriptions.filter((s) => s.user_id !== input.userId || s.id === input.subscriptionId);
        const paid = db.subscriptions.find((s) => s.id === input.subscriptionId);
        if (paid) paid.status = "active";
      }
      return attempt;
    }),

  createCryptoPayment: (input) =>
    write((db) => {
      const row = { ...input, id: `crypto-${crypto.randomUUID()}`, created_at: now(), updated_at: now() };
      db.crypto_payments.push(row);
      return row;
    }),

  getCryptoPayment: (userId, id) =>
    readSystem((db) => db.crypto_payments.find((c) => c.id === id && c.user_id === userId) ?? null),

  updateCryptoPayment: (id, update) =>
    write((db) => {
      const row = db.crypto_payments.find((c) => c.id === id);
      if (!row) throw new Error("Crypto payment not found");
      return Object.assign(row, update, { updated_at: now() });
    }),

  /** The active subscription, or the pending one when nothing is active yet. */
  getSubscription: (userId) =>
    readSystem((db) => {
      const mine = db.subscriptions.filter((s) => s.user_id === userId && s.status !== "canceled");
      return mine.find((s) => s.status === "active") ?? mine.find((s) => s.status === "incomplete") ?? null;
    }),

  getPendingSubscription: (userId) =>
    readSystem((db) => db.subscriptions.find((s) => s.user_id === userId && s.status === "incomplete") ?? null),

  listPayments: (userId) =>
    readList((db) =>
      db.payment_attempts.filter((p) => p.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at)),
    ),

  scheduleDowngrade: (userId, planId) =>
    write((db) => {
      const active = db.subscriptions.find((s) => s.user_id === userId && s.status === "active");
      if (!active) return null;
      active.scheduled_plan_id = planId;
      return active;
    }),

  setPlan: (userId, planId) =>
    write((db) => {
      const existing = db.subscriptions.find((s) => s.user_id === userId);
      if (existing) {
        existing.plan_id = planId;
        existing.status = "active";
        return existing;
      }
      const start = new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      const created = {
        id: `sub-${userId}`,
        plan_id: planId,
        user_id: userId,
        employer_company_id: null,
        status: "active" as const,
        current_period_start: start.toISOString(),
        current_period_end: end.toISOString(),
      };
      db.subscriptions.push(created);
      return created;
    }),

  cancelSubscription: (userId) =>
    write((db) => {
      db.subscriptions = db.subscriptions.filter((s) => s.user_id !== userId);
    }),
};
