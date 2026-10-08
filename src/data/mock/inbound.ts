import "server-only";

import type { ContactRepository, NewsletterRepository } from "@/data/repositories/inbound";

import { now, write } from "./store";

export const mockNewsletterRepository: NewsletterRepository = {
  subscribe: (email, source) =>
    write((db) => {
      const normalized = email.trim().toLowerCase();
      const existing = db.newsletter_subscriptions.find((s) => s.email === normalized);
      if (existing) {
        const alreadySubscribed = existing.status === "subscribed";
        existing.status = "subscribed";
        return { subscription: existing, alreadySubscribed };
      }
      const subscription = {
        id: `newsletter-${crypto.randomUUID()}`,
        email: normalized,
        source,
        status: "subscribed" as const,
        created_at: now(),
      };
      db.newsletter_subscriptions.push(subscription);
      return { subscription, alreadySubscribed: false };
    }),
};

export const mockContactRepository: ContactRepository = {
  createMessage: (input) =>
    write((db) => {
      const message = { id: `contact-${crypto.randomUUID()}`, ...input, status: "new" as const, created_at: now() };
      db.contact_messages.push(message);
      return message;
    }),
};
