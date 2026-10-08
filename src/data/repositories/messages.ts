import type { DeliveryLog, InAppNotification, NotificationPreference, WhatsAppConsent } from "@/data/types";

/** Messaging infrastructure: WhatsApp consent, in-app notifications and delivery logs. */
export interface MessagesRepository {
  getWhatsAppConsent(userId: string): Promise<WhatsAppConsent | null>;
  setWhatsAppConsent(
    userId: string,
    input: { phoneE164: string; optedIn: boolean; source: WhatsAppConsent["source"] },
  ): Promise<WhatsAppConsent>;
  /** System read used when sending — never affected by dev screen states. */
  getPreferencesForSending(userId: string): Promise<NotificationPreference[]>;
  createInApp(input: Omit<InAppNotification, "id" | "read_at" | "created_at">): Promise<InAppNotification>;
  countUnread(userId: string): Promise<number>;
  /** In-app notifications, newest first. */
  listInApp(userId: string): Promise<InAppNotification[]>;
  /** Marks the given notifications read, or all of them when ids is null. */
  markRead(userId: string, ids: string[] | null): Promise<void>;
  logDeliveries(rows: Omit<DeliveryLog, "id" | "created_at">[]): Promise<void>;
  /** Phase A dev outbox: newest first. */
  listDeliveries(limit?: number): Promise<DeliveryLog[]>;
  clearDeliveries(): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}
