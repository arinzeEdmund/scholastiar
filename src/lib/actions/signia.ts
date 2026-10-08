"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { getSession } from "@/lib/session";
import { parseVideoLink, VIDEO_PROVIDERS } from "@/lib/video-embed";
import { mediaLinkFormSchema, type MediaLinkFormInput } from "@/lib/validation/video";
import {
  signiaLinksSchema,
  signiaMediaUpdateSchema,
  signiaProfileSchema,
  signiaProjectSchema,
  type SigniaLinksFormInput,
  type SigniaProfileFormInput,
  type SigniaProjectFormInput,
} from "@/lib/validation/signia";

// Signia actions. Every action only touches the signed-in candidate's own portfolio.

const fieldErrors = (error: z.ZodError) => z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
const SIGNED_OUT = "Your session has ended. Sign in again to continue.";
const RESERVED = new Set([
  "admin",
  "api",
  "app",
  "help",
  "login",
  "new",
  "scholastiar",
  "settings",
  "signia",
  "support",
]);

async function candidateId() {
  const session = await getSession();
  return session?.user.primary_role === "candidate" ? session.user.user_id : null;
}

function refresh() {
  revalidatePath("/signia", "layout");
  revalidatePath("/s/[handle]", "page");
}

export async function saveSigniaProfile(input: SigniaProfileFormInput): Promise<ActionResult<{ handle: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = signiaProfileSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;
  if (RESERVED.has(d.handle) || (await repos.signia.isHandleTaken(d.handle, userId))) {
    return fail("That handle is taken.", { handle: ["That handle is taken — try another."] });
  }
  const profile = await repos.signia.saveProfile(userId, d);
  refresh();
  return ok({ handle: profile.handle });
}

export async function setSigniaPublished(published: boolean): Promise<ActionResult<null>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const { profile } = await repos.signia.get(userId);
  if (!profile) return fail("Set up your handle and headline first.");
  await repos.signia.saveProfile(userId, {
    handle: profile.handle,
    headline: profile.headline,
    summary: profile.summary,
    current_work_summary: profile.current_work_summary,
    discoverability: profile.discoverability,
    sections: profile.sections,
    public_status: published ? "published" : "unpublished",
  });
  refresh();
  return ok(null);
}

export async function saveSigniaProject(
  id: string | null,
  input: SigniaProjectFormInput,
): Promise<ActionResult<{ id: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = signiaProjectSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const project = await repos.signia.saveProject(userId, id, parsed.data);
  if (!project) return fail("That project no longer exists.");
  refresh();
  return ok({ id: project.id });
}

export async function deleteSigniaProject(id: string): Promise<ActionResult<null>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  if (!(await repos.signia.deleteProject(userId, id))) return fail("That project no longer exists.");
  refresh();
  return ok(null);
}

export async function saveSigniaLinks(input: SigniaLinksFormInput): Promise<ActionResult<null>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = signiaLinksSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted links.", fieldErrors(parsed.error));
  await repos.signia.saveSocialLinks(userId, parsed.data.links);
  refresh();
  return ok(null);
}

export async function updateSigniaMedia(input: z.infer<typeof signiaMediaUpdateSchema>): Promise<ActionResult<null>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = signiaMediaUpdateSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const { id, ...update } = parsed.data;
  if (!(await repos.signia.updateMedia(userId, id, update))) return fail("That file no longer exists.");
  refresh();
  return ok(null);
}

export async function deleteSigniaMedia(id: string): Promise<ActionResult<null>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  if (!(await repos.signia.deleteMedia(userId, id))) return fail("That file no longer exists.");
  refresh();
  return ok(null);
}

/** Adds a media item by link (no uploads). Video links play on the portfolio through an embed. */
export async function addSigniaMediaLink(input: MediaLinkFormInput): Promise<ActionResult<{ id: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = mediaLinkFormSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const video = parseVideoLink(parsed.data.url);
  const item = await repos.signia.addMedia(userId, {
    project_id: null,
    media_type: parsed.data.media_type,
    title: parsed.data.title,
    description: "",
    url: video?.url ?? parsed.data.url,
    host_label: video ? VIDEO_PROVIDERS[video.provider] : new URL(parsed.data.url).hostname.replace(/^www\./, ""),
    thumbnail_url: video?.thumbnailUrl ?? null,
    visibility: "public",
  });
  refresh();
  return ok({ id: item.id });
}
