import "server-only";

import { repos, type DeliveryLog, type NotificationChannel } from "@/data";
import { NOTIFICATION_CATEGORIES } from "@/lib/candidate/labels";

import { CATALOGUE, type EventDefinition, type EventKey, type MessageVars } from "./catalogue";

// Sends one platform event on every channel: email, WhatsApp (official Scholastiar account,
// opted-in users only) and in-app. Phase A records each delivery in the outbox
// (notification_delivery_logs); Phase B hands the same messages to the email and WhatsApp providers.
// Never throws: a messaging problem must not break the action that triggered it.

type Recipient = { userId: string } | { email: string };

export async function notify(event: EventKey, to: Recipient, vars: MessageVars = {}): Promise<void> {
  try {
    const def: EventDefinition = CATALOGUE[event];
    const rows: Omit<DeliveryLog, "id" | "created_at">[] = [];

    // Visitors without an account: email only.
    if ("email" in to) {
      if (def.email) {
        const m = def.email(vars);
        rows.push({
          event_key: event,
          user_id: null,
          channel: "email",
          recipient: to.email,
          subject: m.subject,
          body: m.body,
          link: m.link ?? null,
          whatsapp_template: null,
          status: "sent",
          skip_reason: null,
        });
      }
      await repos.messages.logDeliveries(rows);
      return;
    }

    const profile = await repos.users.getProfile(to.userId);
    if (!profile) return;
    const [consent, preferences] = await Promise.all([
      repos.messages.getWhatsAppConsent(to.userId),
      repos.messages.getPreferencesForSending(to.userId),
    ]);
    const filled: MessageVars = { firstName: profile.full_name.split(" ")[0], email: profile.email, ...vars };
    const category = def.category;
    const rules = category ? NOTIFICATION_CATEGORIES[category] : undefined;
    const allowed = (channel: NotificationChannel): string | null => {
      if (!category) return null;
      if (rules?.never?.includes(channel)) return "Never sent on this channel";
      if (rules?.locked?.includes(channel)) return null;
      const pref = preferences.find((p) => p.channel === channel && p.notification_type === category);
      return pref && !pref.enabled ? "Turned off in notification settings" : null;
    };

    if (def.email) {
      const m = def.email(filled);
      const skip = allowed("email");
      rows.push({
        event_key: event,
        user_id: to.userId,
        channel: "email",
        recipient: profile.email,
        subject: m.subject,
        body: m.body,
        link: m.link ?? null,
        whatsapp_template: null,
        status: skip ? "skipped" : "sent",
        skip_reason: skip,
      });
    }

    if (def.whatsapp) {
      const m = def.whatsapp(filled);
      const skip = !consent?.opted_in ? "No WhatsApp opt-in" : allowed("whatsapp");
      rows.push({
        event_key: event,
        user_id: to.userId,
        channel: "whatsapp",
        recipient: consent?.phone_e164 ?? "—",
        subject: null,
        body: m.body,
        link: m.link ?? null,
        whatsapp_template: m.template,
        status: skip ? "skipped" : "sent",
        skip_reason: skip,
      });
    }

    if (def.inApp) {
      const m = def.inApp(filled);
      const skip = allowed("in_app");
      if (!skip)
        await repos.messages.createInApp({
          user_id: to.userId,
          event_key: event,
          title: m.title,
          body: m.body,
          href: m.href ?? null,
        });
      rows.push({
        event_key: event,
        user_id: to.userId,
        channel: "in_app",
        recipient: profile.full_name,
        subject: m.title,
        body: m.body,
        link: m.href ? { label: "Open", href: m.href } : null,
        whatsapp_template: null,
        status: skip ? "skipped" : "sent",
        skip_reason: skip,
      });
    }

    await repos.messages.logDeliveries(rows);
  } catch (error) {
    console.error(`[notify] ${event} failed`, error);
  }
}
