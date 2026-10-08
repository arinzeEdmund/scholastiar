import type { MessageThread, ThreadMessage, ThreadSummary } from "@/data/types";

/** Student conversations with institutions, panels and Scholastiar support. */
export interface ThreadsRepository {
  list(userId: string): Promise<ThreadSummary[]>;
  get(userId: string, threadId: string): Promise<{ thread: MessageThread; messages: ThreadMessage[] } | null>;
  markRead(userId: string, threadId: string): Promise<void>;
  send(
    userId: string,
    threadId: string,
    input: Pick<ThreadMessage, "body" | "attachments" | "author_name">,
  ): Promise<ThreadMessage | null>;
  countUnread(userId: string): Promise<number>;
}
