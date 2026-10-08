// Conversations — DATABASE/db.md → Messaging Tables, SERVICES/99-messaging-communication.md.
// Students talk to admissions offices, scholarship panels, employers (Pro) and Scholastiar support.

export type CounterpartType = "university" | "scholarship" | "scholastiar" | "employer";

/** message_threads */
export interface MessageThread {
  id: string;
  user_id: string;
  counterpart_name: string;
  counterpart_type: CounterpartType;
  counterpart_initials: string;
  counterpart_verified: boolean;
  subject: string;
  /** What the conversation is about, shown as context. */
  context_label: string | null;
  last_message_at: string;
  created_at: string;
}

export interface MessageAttachment {
  document_id: string;
  file_name: string;
}

/** messages */
export interface ThreadMessage {
  id: string;
  thread_id: string;
  sender: "student" | "counterpart" | "system";
  author_name: string;
  body: string;
  kind: "text" | "interview_invite" | "status_update";
  /** interview_invite: starts_at, duration_minutes, mode, location; status_update: status. */
  meta: Record<string, string> | null;
  attachments: MessageAttachment[];
  read_at: string | null;
  created_at: string;
}

export interface ThreadSummary extends MessageThread {
  last_message: ThreadMessage | null;
  unread: number;
  has_interview: boolean;
}
