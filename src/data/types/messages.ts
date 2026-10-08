// Shaped after STRUCTURE/DATABASE/db.md → Notifications Tables (notifications, whatsapp_consents,
// notification_delivery_logs). Every platform event sends email + WhatsApp (opted-in users) + in-app.

export type DeliveryChannel = "email" | "whatsapp" | "in_app";

/** whatsapp_consents — WhatsApp requires each user's opt-in before we message them. */
export interface WhatsAppConsent {
  id: string;
  user_id: string;
  phone_e164: string;
  opted_in: boolean;
  opted_in_at: string | null;
  opted_out_at: string | null;
  source: "sign_up" | "onboarding" | "settings";
  updated_at: string;
}

/** notifications — in-app notifications. */
export interface InAppNotification {
  id: string;
  user_id: string;
  event_key: string;
  title: string;
  body: string;
  href: string | null;
  read_at: string | null;
  created_at: string;
}

/**
 * notification_delivery_logs (Phase A outbox) — what was sent, or why it was skipped.
 * In Phase B the same rows record provider delivery status.
 */
export interface DeliveryLog {
  id: string;
  event_key: string;
  user_id: string | null;
  channel: DeliveryChannel;
  recipient: string;
  subject: string | null;
  body: string;
  link: { label: string; href: string } | null;
  whatsapp_template: string | null;
  status: "sent" | "skipped";
  skip_reason: string | null;
  created_at: string;
}
