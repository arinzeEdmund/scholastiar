"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { getSession } from "@/lib/session";

const schema = z.object({ ids: z.array(z.string().max(120)).max(200).nullable() });

/** Marks some (or, with ids: null, all) of the signed-in user's notifications as read. */
export async function markNotificationsRead(input: z.infer<typeof schema>): Promise<ActionResult<null>> {
  const session = await getSession();
  if (!session) return fail("Your session has ended. Sign in again.");
  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail("Those notifications couldn't be found.");
  await repos.messages.markRead(session.user.user_id, parsed.data.ids);
  revalidatePath("/", "layout");
  return ok(null);
}
