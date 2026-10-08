import type { ContactMessage, ContactTopic, NewsletterSubscription } from "@/data/types";

export interface NewsletterRepository {
  /** Idempotent: subscribing an existing address re-activates it. */
  subscribe(
    email: string,
    source: string,
  ): Promise<{ subscription: NewsletterSubscription; alreadySubscribed: boolean }>;
}

export interface ContactRepository {
  createMessage(input: { name: string; email: string; topic: ContactTopic; message: string }): Promise<ContactMessage>;
}
