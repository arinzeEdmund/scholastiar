"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { MAX_PROMPTS, MAX_RECORDING_SECONDS, MAX_UPLOAD_BYTES, PERSONALITY_PROMPTS } from "@/config/personality";
import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { getSession } from "@/lib/session";

// PersonalityAI CV actions. Phase A stores the video's metadata; Phase B uploads the file
// to storage behind the same action. Only the signed-in candidate's own video is touched.

const SIGNED_OUT = "Your session has ended. Sign in again to continue.";

async function candidateId() {
  const session = await getSession();
  return session?.user.primary_role === "candidate" ? session.user.user_id : null;
}

const videoSchema = z.object({
  prompts: z
    .array(z.enum(PERSONALITY_PROMPTS))
    .min(1, "Choose at least one prompt.")
    .max(MAX_PROMPTS, `Choose up to ${MAX_PROMPTS} prompts.`),
  duration_seconds: z
    .number()
    .min(3, "That video is too short.")
    .max(MAX_RECORDING_SECONDS + 60, "Keep it under three minutes."),
  size_bytes: z.number().int().positive().max(MAX_UPLOAD_BYTES, "Videos can be up to 200 MB."),
  mime_type: z.string().regex(/^video\//, "Choose a video file."),
  source: z.enum(["recorded", "uploaded"]),
  file_name: z.string().min(1).max(200),
});

export async function savePersonalityVideo(input: z.infer<typeof videoSchema>): Promise<ActionResult<{ id: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = videoSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "That video couldn't be saved.");
  const video = await repos.personality.saveVideo(userId, parsed.data);
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
