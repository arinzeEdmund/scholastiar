"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { getSession } from "@/lib/session";
import { mediaTypeFor } from "@/lib/signia/labels";
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

/** Small images keep an inline preview in Phase A; everything else keeps its details only. */
const INLINE_PREVIEW_LIMIT = 1.5 * 1024 * 1024;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

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

/**
 * Adds a media item. Documents and images (up to 5 MB) are sent as a file; videos send their
 * details only in Phase A (up to 200 MB), and are uploaded to storage in Phase B.
 */
export async function addSigniaMedia(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);

  const file = formData.get("file");
  const name = String(file instanceof File ? file.name : (formData.get("name") ?? "")).slice(0, 160);
  const type = String(file instanceof File ? file.type : (formData.get("type") ?? ""));
  const size = file instanceof File ? file.size : Number(formData.get("size") ?? 0);
  if (!name || !type || !size) return fail("Choose a file to upload.");

  const isVideo = type.startsWith("video/");
  if (isVideo ? size > MAX_VIDEO_BYTES : size > MAX_FILE_BYTES) {
    return fail(isVideo ? "Videos can be up to 200 MB." : "Files can be up to 5 MB.");
  }
  const allowed = isVideo || type.startsWith("image/") || /pdf|word|presentation|powerpoint|text\//.test(type);
  if (!allowed) return fail("Upload a video, image, PDF, Word or slide file.");

  const preview =
    file instanceof File && type.startsWith("image/") && size <= INLINE_PREVIEW_LIMIT
      ? `data:${type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`
      : null;

  const item = await repos.signia.addMedia(userId, {
    project_id: null,
    media_type: mediaTypeFor(type),
    title: name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
    description: "",
    file_name: name,
    mime_type: type,
    size_bytes: size,
    preview_data_url: preview,
    visibility: "public",
  });
  refresh();
  return ok({ id: item.id });
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
