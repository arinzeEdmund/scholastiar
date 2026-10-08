import type { InAppNotification } from "@/data/types";

// In-app notifications the demo students already have (created through notify() in real use).

function note(
  id: string,
  user_id: string,
  event_key: string,
  title: string,
  body: string,
  href: string | null,
  created_at: string,
  read = false,
): InAppNotification {
  return { id, user_id, event_key, title, body, href, read_at: read ? created_at : null, created_at };
}

const daysAgo = (days: number, hour = 9) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const notificationFixtures: InAppNotification[] = [
  note(
    "ntf-amara-1",
    "user-amara",
    "message.received",
    "New message from Volga Federal Medical University",
    "We've received your enquiry about the MSc Public Health…",
    "/messages/thread-amara-volga",
    daysAgo(0, 8),
  ),
  note(
    "ntf-amara-2",
    "user-amara",
    "deadline.reminder",
    "MSc Public Health closes in 53 days",
    "Deadline 30 Nov 2026.",
    "/dashboard#shortlist",
    daysAgo(1),
  ),
  note(
    "ntf-amara-3",
    "user-amara",
    "matches.new",
    "4 new matches",
    "Including PGCert Healthcare Management in Dubai.",
    "/dashboard#matches",
    daysAgo(3),
  ),
  note(
    "ntf-amara-4",
    "user-amara",
    "message.received",
    "New message from Scholastiar support",
    "Your documents look good — two small things to check…",
    "/messages/thread-amara-support",
    daysAgo(6),
    true,
  ),
  note(
    "ntf-amara-5",
    "user-amara",
    "payment.succeeded",
    "Payment received",
    "Starter is active.",
    "/billing",
    daysAgo(9),
    true,
  ),
  note(
    "ntf-kwame-1",
    "user-kwame",
    "personality.viewed",
    "Your video was watched",
    "Admissions, Moscow Institute of Applied Sciences watched your PersonalityAI CV.",
    "/personality-cv",
    daysAgo(2),
  ),
];
