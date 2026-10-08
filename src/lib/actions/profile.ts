"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { getSession } from "@/lib/session";
import { profileBasicsSchema, type ProfileBasicsInput } from "@/lib/validation/profile";

export async function updateProfileBasics(
  input: ProfileBasicsInput,
): Promise<ActionResult<{ full_name: string; headline: string | null }>> {
  const session = await getSession();
  if (!session) return fail("Sign in to update your profile.");

  const parsed = profileBasicsSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Check the highlighted fields.", z.flattenError(parsed.error).fieldErrors);
  }

  const updated = await repos.users.updateProfile(session.user.user_id, {
    full_name: parsed.data.full_name,
    headline: parsed.data.headline || null,
  });
  revalidatePath("/", "layout");
  return ok({ full_name: updated.full_name, headline: updated.headline });
}
