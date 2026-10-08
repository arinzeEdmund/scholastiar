"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { getSession } from "@/lib/session";
import { messageSchema, type MessageInput } from "@/lib/validation/threads";

// Student messages. Students only post in their own threads and only attach their own documents.

async function candidate() {
  const session = await getSession();
  return session?.user.primary_role === "candidate" ? session.user : null;
}

export async function sendThreadMessage(input: MessageInput): Promise<ActionResult<{ id: string }>> {
  const user = await candidate();
  if (!user) return fail("Your session has ended. Sign in again.");
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) return fail("Check your message.", z.flattenError(parsed.error).fieldErrors);
  const documents = await repos.candidate.listDocuments(user.user_id);
  const attachments = parsed.data.attachmentIds.map((id) => documents.find((d) => d.id === id));
  if (attachments.some((d) => !d)) return fail("One of those documents no longer exists.");

  const message = await repos.threads.send(user.user_id, parsed.data.threadId, {
    body: parsed.data.body,
    author_name: user.full_name,
    attachments: attachments.map((d) => ({ document_id: d!.id, file_name: d!.file_name })),
  });
  if (!message) return fail("This conversation no longer exists.");
  revalidatePath("/messages", "layout");
  return ok({ id: message.id });
}

export async function markThreadRead(threadId: string): Promise<ActionResult<null>> {
  const user = await candidate();
  if (!user) return fail("Your session has ended.");
  await repos.threads.markRead(user.user_id, String(threadId).slice(0, 120));
  revalidatePath("/messages", "layout");
  return ok(null);
}
