"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { MAX_PROMPTS, PERSONALITY_PROMPTS } from "@/config/personality";
import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { getSession } from "@/lib/session";
import { parseVideoLink, VIDEO_LINK_HELP, VIDEO_PROVIDERS } from "@/lib/video-embed";

// PersonalityAI CV actions. Videos are added by link and embedded. Only the signed-in candidate's
// own video is touched.

const SIGNED_OUT = "Your session has ended. Sign in again to continue.";

async function candidateId() {
  const session = await getSession();
  return session?.user.primary_role === "candidate" ? session.user.user_id : null;
}

const promptsSchema = z
  .array(z.enum(PERSONALITY_PROMPTS))
  .min(1, "Choose at least one prompt.")
  .max(MAX_PROMPTS, `Choose up to ${MAX_PROMPTS} prompts.`);

const linkSchema = z.object({
  prompts: promptsSchema,
  url: z
    .string()
    .trim()
    .max(500)
    .refine((v) => parseVideoLink(v) !== null, VIDEO_LINK_HELP),
});

/** Uses a video hosted elsewhere; we play it through the platform's embed player. */
export async function savePersonalityVideoLink(
  input: z.infer<typeof linkSchema>,
): Promise<ActionResult<{ id: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = linkSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? VIDEO_LINK_HELP);
  const link = parseVideoLink(parsed.data.url)!;
  const video = await repos.personality.saveVideo(userId, {
    prompts: parsed.data.prompts,
    video_url: link.url,
    provider_label: VIDEO_PROVIDERS[link.provider],
  });
  revalidatePath("/personality-cv", "layout");
  return ok({ id: video.id });
}

const settingsSchema = z.object({
  visibility: z.enum(["applications", "signia", "hidden"]),
  attach_by_default: z.boolean(),
  share_transcript: z.boolean(),
});

export type PersonalitySettingsInput = z.infer<typeof settingsSchema>;

export async function updatePersonalitySettings(input: PersonalitySettingsInput): Promise<ActionResult<null>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return fail("Check your choices and try again.");
  await repos.personality.updateSettings(userId, parsed.data);
  revalidatePath("/personality-cv", "layout");
  return ok(null);
}

export async function removePersonalityVideo(): Promise<ActionResult<null>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  await repos.personality.removeVideo(userId);
  revalidatePath("/personality-cv", "layout");
  return ok(null);
}
