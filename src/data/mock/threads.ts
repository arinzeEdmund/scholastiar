import "server-only";

import type { MockDb } from "@/data/fixtures";
import type { ThreadsRepository } from "@/data/repositories/threads";
import type { ThreadMessage, ThreadSummary } from "@/data/types";

import { now, readList, readOne, readSystem, write } from "./store";

const oldestFirst = (a: ThreadMessage, b: ThreadMessage) => a.created_at.localeCompare(b.created_at);

function summaries(db: MockDb, userId: string): ThreadSummary[] {
  return db.message_threads
    .filter((t) => t.user_id === userId)
    .map((thread) => {
      const messages = db.thread_messages.filter((m) => m.thread_id === thread.id).sort(oldestFirst);
      return {
        ...thread,
        last_message:
          messages.filter((m) => m.kind === "text" || m.kind === "interview_invite").at(-1) ?? messages.at(-1) ?? null,
        unread: messages.filter((m) => m.sender !== "student" && !m.read_at).length,
        has_interview: messages.some((m) => m.kind === "interview_invite"),
      };
    })
    .sort((a, b) => b.last_message_at.localeCompare(a.last_message_at));
}

export const mockThreadsRepository: ThreadsRepository = {
  list: (userId) => readList((db) => summaries(db, userId)),

  get: (userId, threadId) =>
    readOne((db) => {
      const thread = db.message_threads.find((t) => t.id === threadId && t.user_id === userId);
      if (!thread) return null;
      return { thread, messages: db.thread_messages.filter((m) => m.thread_id === threadId).sort(oldestFirst) };
    }),

  markRead: (userId, threadId) =>
    write((db) => {
      if (!db.message_threads.some((t) => t.id === threadId && t.user_id === userId)) return;
      const at = now();
      db.thread_messages.forEach((m) => {
        if (m.thread_id === threadId && m.sender !== "student" && !m.read_at) m.read_at = at;
      });
    }),

  send: (userId, threadId, input) =>
    write((db) => {
      const thread = db.message_threads.find((t) => t.id === threadId && t.user_id === userId);
      if (!thread) return null;
      const message: ThreadMessage = {
        id: `m-${crypto.randomUUID()}`,
        thread_id: threadId,
        sender: "student",
        author_name: input.author_name,
        body: input.body,
        kind: "text",
        meta: null,
        attachments: input.attachments,
        read_at: now(),
        created_at: now(),
      };
      db.thread_messages.push(message);
      thread.last_message_at = message.created_at;
      return message;
    }),

  countUnread: (userId) => readSystem((db) => summaries(db, userId).reduce((n, t) => n + t.unread, 0)),
};
