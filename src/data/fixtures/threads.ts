import type { MessageThread, ThreadMessage } from "@/data/types";

// Demo conversations. Organisations are the fictional catalogue institutions.

const at = (daysAgo: number, hour: number, minute = 0) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
};
const inDays = (days: number, hour: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const threadFixtures: MessageThread[] = [
  {
    id: "thread-amara-volga",
    user_id: "user-amara",
    counterpart_name: "Volga Federal Medical University",
    counterpart_type: "university",
    counterpart_initials: "VF",
    counterpart_verified: true,
    subject: "MSc Public Health — your enquiry",
    context_label: "MSc Public Health · February 2027 intake",
    last_message_at: at(0, 8),
    created_at: at(2, 14),
  },
  {
    id: "thread-amara-scholarship",
    user_id: "user-amara",
    counterpart_name: "Applied Sciences Master's Scholarship",
    counterpart_type: "scholarship",
    counterpart_initials: "AS",
    counterpart_verified: true,
    subject: "Interview invitation",
    context_label: "Applied Sciences Master's Scholarship",
    last_message_at: at(4, 11),
    created_at: at(4, 11),
  },
  {
    id: "thread-amara-support",
    user_id: "user-amara",
    counterpart_name: "Scholastiar support",
    counterpart_type: "scholastiar",
    counterpart_initials: "SC",
    counterpart_verified: true,
    subject: "Document check for your applications",
    context_label: null,
    last_message_at: at(6, 15),
    created_at: at(7, 10),
  },
  {
    id: "thread-kwame-moscow",
    user_id: "user-kwame",
    counterpart_name: "Moscow Institute of Applied Sciences",
    counterpart_type: "university",
    counterpart_initials: "MI",
    counterpart_verified: true,
    subject: "PhD Computer Science — supervisor match",
    context_label: "PhD Computer Science",
    last_message_at: at(1, 10),
    created_at: at(3, 9),
  },
];

function msg(
  id: string,
  thread_id: string,
  sender: ThreadMessage["sender"],
  author_name: string,
  body: string,
  created_at: string,
  read: boolean,
  extra: Partial<ThreadMessage> = {},
): ThreadMessage {
  return {
    id,
    thread_id,
    sender,
    author_name,
    body,
    kind: "text",
    meta: null,
    attachments: [],
    read_at: read ? created_at : null,
    created_at,
    ...extra,
  };
}

export const threadMessageFixtures: ThreadMessage[] = [
  msg(
    "m-volga-1",
    "thread-amara-volga",
    "student",
    "Amara Okafor",
    "Hello, I'd like to apply for the MSc Public Health starting in February. Do you accept a UK master's in progress, and do my Nigerian transcripts need to be translated?",
    at(2, 14),
    true,
  ),
  msg(
    "m-volga-2",
    "thread-amara-volga",
    "counterpart",
    "Irina Sokolova, International admissions",
    "Thank you for your interest, Amara. Yes — you can apply with your current studies in progress. English transcripts don't need translation, but they must be certified. Please send a scan of your BSc transcript so we can check it before you submit.",
    at(0, 8),
    false,
  ),
  msg("m-volga-3", "thread-amara-volga", "system", "Scholastiar", "Application status updated", at(0, 8, 5), false, {
    kind: "status_update",
    meta: { status: "Documents requested" },
  }),

  msg(
    "m-sch-1",
    "thread-amara-scholarship",
    "counterpart",
    "Selection panel",
    "Congratulations — you've been shortlisted for an interview for the Applied Sciences Master's Scholarship. Please confirm the time below or ask for another slot.",
    at(4, 11),
    true,
    {
      kind: "interview_invite",
      meta: { starts_at: inDays(12, 9), duration_minutes: "30", mode: "Video call", location: "Link sent on the day" },
    },
  ),

  msg(
    "m-sup-1",
    "thread-amara-support",
    "counterpart",
    "Tolu, Scholastiar support",
    "Hi Amara, I checked the documents in your vault for your shortlisted applications. Your CV and transcript look good. Two small things: your passport scan is missing, and the academic reference should be on letterhead.",
    at(7, 10),
    true,
  ),
  msg(
    "m-sup-2",
    "thread-amara-support",
    "student",
    "Amara Okafor",
    "Thank you! I'll upload the passport scan this week and ask my supervisor for a letterhead version.",
    at(6, 15),
    true,
  ),

  msg(
    "m-kwame-1",
    "thread-kwame-moscow",
    "student",
    "Kwame Mensah",
    "Good morning. I'm interested in the PhD in Computer Science, focusing on machine learning for energy systems. Could you suggest a supervisor?",
    at(3, 9),
    true,
  ),
  msg(
    "m-kwame-2",
    "thread-kwame-moscow",
    "counterpart",
    "Dr Pavel Orlov, Graduate school",
    "Dr Elena Volkova leads our energy informatics group and is taking students for September. Please send a two-page research proposal and we'll forward it to her.",
    at(1, 10),
    false,
  ),
];
