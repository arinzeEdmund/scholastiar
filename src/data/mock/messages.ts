import "server-only";

import { defaultNotificationPreferences } from "@/data/fixtures/candidate";
import type { MessagesRepository } from "@/data/repositories/messages";

import { now, readList, readSystem, write } from "./store";

export const mockMessagesRepository: MessagesRepository = {
  getWhatsAppConsent: (userId) => readSystem((db) => db.whatsapp_consents.find((c) => c.user_id === userId) ?? null),

  setWhatsAppConsent: (userId, input) =>
    write((db) => {
      let consent = db.whatsapp_consents.find((c) => c.user_id === userId);
      if (!consent) {
        consent = {
          id: `wa-${userId}`,
          user_id: userId,
          phone_e164: input.phoneE164,
          opted_in: false,
          opted_in_at: null,
          opted_out_at: null,
          source: input.source,
          updated_at: now(),
        };
        db.whatsapp_consents.push(consent);
      }
      const wasOptedIn = consent.opted_in;
      Object.assign(consent, {
        phone_e164: input.phoneE164,
        opted_in: input.optedIn,
        source: input.source,
        updated_at: now(),
        opted_in_at: input.optedIn && !wasOptedIn ? now() : consent.opted_in_at,
        opted_out_at: !input.optedIn && wasOptedIn ? now() : consent.opted_out_at,
      });
      return consent;
    }),

  getPreferencesForSending: (userId) =>
    readSystem((db) => {
      const saved = db.notification_preferences.filter((p) => p.user_id === userId);
      // Fill categories or channels added after the user last saved.
      return defaultNotificationPreferences(userId).map(
        (d) => saved.find((p) => p.channel === d.channel && p.notification_type === d.notification_type) ?? d,
      );
    }),

  createInApp: (input) =>
    write((db) => {
      const row = { ...input, id: `ntf-${crypto.randomUUID()}`, read_at: null, created_at: now() };
      db.notifications.push(row);
      return row;
    }),

  countUnread: (userId) =>
    readSystem((db) => db.notifications.filter((n) => n.user_id === userId && !n.read_at).length),

  listInApp: (userId) =>
    readList((db) =>
      db.notifications.filter((n) => n.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at)),
    ),

  markRead: (userId, ids) =>
    write((db) => {
      const at = now();
      db.notifications.forEach((n) => {
        if (n.user_id === userId && !n.read_at && (ids === null || ids.includes(n.id))) n.read_at = at;
      });
    }),

  logDeliveries: (rows) =>
    write((db) => {
      const created = now();
      db.notification_delivery_logs.push(
        ...rows.map((r) => ({ ...r, id: `dlv-${crypto.randomUUID()}`, created_at: created })),
      );
      // Keep the demo outbox small.
      if (db.notification_delivery_logs.length > 500)
        db.notification_delivery_logs.splice(0, db.notification_delivery_logs.length - 500);
    }),

  listDeliveries: (limit = 200) => readSystem((db) => [...db.notification_delivery_logs].reverse().slice(0, limit)),

  clearDeliveries: () =>
    write((db) => {
      db.notification_delivery_logs = [];
    }),

  deleteAllForUser: (userId) =>
    write((db) => {
      db.whatsapp_consents = db.whatsapp_consents.filter((c) => c.user_id !== userId);
      db.notifications = db.notifications.filter((n) => n.user_id !== userId);
    }),
};
