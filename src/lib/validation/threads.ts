import { z } from "zod";

export const messageSchema = z.object({
  threadId: z.string().min(1).max(120),
  body: z.string().trim().min(1, "Write a message first.").max(2000, "Keep it under 2,000 characters."),
  attachmentIds: z.array(z.string().max(120)).max(5, "Attach up to 5 documents."),
});
export type MessageInput = z.infer<typeof messageSchema>;
