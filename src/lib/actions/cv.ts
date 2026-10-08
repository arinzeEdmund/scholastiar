"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos } from "@/data";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { EMPTY_QUERY } from "@/lib/catalogue/query";
import { buildCv, CV_FORMATS, keywordsFrom } from "@/lib/cv/build";
import { getAiFailureSimulated } from "@/lib/dev-settings";
import { getSession } from "@/lib/session";
import { cvGenerateSchema, cvUpdateSchema, type CvGenerateInput } from "@/lib/validation/cv";

// AI CV actions (Phase A: deterministic stand-in for the AI provider, built only from the
// candidate's own profile). Every action only touches the signed-in candidate's CVs.

const fieldErrors = (error: z.ZodError) => z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
const SIGNED_OUT = "Your session has ended. Sign in again to continue.";

async function candidate() {
  const session = await getSession();
  return session?.user.primary_role === "candidate" ? session.user : null;
}

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateCv(input: CvGenerateInput): Promise<ActionResult<{ id: string }>> {
  const user = await candidate();
  if (!user) return fail(SIGNED_OUT);
  const parsed = cvGenerateSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;

  await pause(1500);
  if (await getAiFailureSimulated()) {
    return fail("We couldn't generate your CV right now. Nothing was lost — try again in a moment.");
  }

  const [bundle, countries] = await Promise.all([
    repos.candidate.getBundle(user.user_id),
    repos.reference.listCountries(),
  ]);

  let targetLabel = "General CV";
  let keywords: string[] = [];
  if (d.targetType === "program" && d.targetId) {
    const entry = await repos.catalogue.getProgramEntry(d.targetId);
    if (!entry) return fail("That programme couldn't be found.", { targetId: ["Choose another programme."] });
    targetLabel = entry.program.name;
    keywords = keywordsFrom(`${entry.program.name} ${entry.program.field_name} ${entry.program.description}`);
  } else if (d.targetType === "scholarship" && d.targetId) {
    const result = await repos.catalogue.search({ ...EMPTY_QUERY, tab: "scholarships" });
    const entry = result.entries.find((e) => e.type === "scholarship" && e.scholarship.id === d.targetId);
    if (!entry || entry.type !== "scholarship") return fail("That scholarship couldn't be found.");
    targetLabel = entry.scholarship.name;
    keywords = keywordsFrom(`${entry.scholarship.name} ${entry.scholarship.description}`);
  } else if (d.targetType === "pasted" && d.pasted) {
    keywords = keywordsFrom(d.pasted);
    targetLabel = "Pasted description";
  } else {
    keywords = keywordsFrom([...bundle.preferences.target_roles, ...bundle.preferences.industries].join(" "));
  }

  const countryName = (code: string | null) => countries.find((c) => c.iso2 === code)?.name ?? null;
  const location = [bundle.profile.current_city, countryName(bundle.profile.current_country_code)]
    .filter(Boolean)
    .join(", ");

  const cv = await repos.cvs.create(user.user_id, {
    title: `${targetLabel} — ${CV_FORMATS[d.format].label}`,
    format: d.format,
    tone: d.tone,
    target_type: d.targetType,
    target_id: d.targetId ?? null,
    target_label: targetLabel,
    target_keywords: keywords,
    content: buildCv(bundle, {
      name: user.full_name,
      email: user.email,
      nationality: countryName(bundle.profile.nationality_country_code),
      location: location || null,
      format: d.format,
      tone: d.tone,
      sections: d.sections,
      keywords,
      strengths: d.strengths,
      targetLabel,
    }),
    source: "generated",
  });
  revalidatePath("/ai-cv", "layout");
  return ok({ id: cv.id });
}

export async function saveCv(input: z.infer<typeof cvUpdateSchema>): Promise<ActionResult<{ id: string }>> {
  const user = await candidate();
  if (!user) return fail(SIGNED_OUT);
  const parsed = cvUpdateSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const updated = await repos.cvs.update(user.user_id, parsed.data.id, {
    title: parsed.data.title,
    content: parsed.data.content,
  });
  if (!updated) return fail("This CV no longer exists.");
  revalidatePath("/ai-cv", "layout");
  return ok({ id: updated.id });
}

const idSchema = z.object({ id: z.string().min(1).max(120) });

export async function duplicateCv(input: z.infer<typeof idSchema>): Promise<ActionResult<{ id: string }>> {
  const user = await candidate();
  if (!user) return fail(SIGNED_OUT);
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return fail("This CV no longer exists.");
  const original = await repos.cvs.get(user.user_id, parsed.data.id);
  if (!original) return fail("This CV no longer exists.");
  const copy = await repos.cvs.create(user.user_id, {
    title: `${original.title} (copy)`,
    format: original.format,
    tone: original.tone,
    target_type: original.target_type,
    target_id: original.target_id,
    target_label: original.target_label,
    target_keywords: original.target_keywords,
    content: original.content,
    source: "duplicated",
  });
  revalidatePath("/ai-cv", "layout");
  return ok({ id: copy.id });
}

export async function deleteCv(input: z.infer<typeof idSchema>): Promise<ActionResult<{ redirectTo: string }>> {
  const user = await candidate();
  if (!user) return fail(SIGNED_OUT);
  const parsed = idSchema.safeParse(input);
  if (!parsed.success || !(await repos.cvs.remove(user.user_id, parsed.data.id))) {
    return fail("This CV no longer exists.");
  }
  revalidatePath("/ai-cv", "layout");
  return ok({ redirectTo: "/ai-cv/history" });
}

const WEAK_OPENERS: [RegExp, string][] = [
  [/^(i was )?responsible for (managing|leading)\s+/i, "Led "],
  [/^(i was )?responsible for\s+/i, "Managed "],
  [/^helped (to |with )?/i, "Supported "],
  [/^worked on\s+/i, "Delivered "],
  [/^(i )?did\s+/i, "Carried out "],
  [/^was involved in\s+/i, "Contributed to "],
  [/^in charge of\s+/i, "Oversaw "],
];

const rewriteSchema = z.object({ text: z.string().trim().min(3).max(400), attempt: z.number().int().min(0).max(20) });

/** AI suggestion for one line: stronger opening verb, tighter wording. Never adds facts or numbers. */
export async function suggestRewrite(
  input: z.infer<typeof rewriteSchema>,
): Promise<ActionResult<{ suggestion: string; note: string }>> {
  const user = await candidate();
  if (!user) return fail(SIGNED_OUT);
  const parsed = rewriteSchema.safeParse(input);
  if (!parsed.success) return fail("Write a little more before asking for a suggestion.");
  await pause(800);
  if (await getAiFailureSimulated()) return fail("No suggestion right now — try again in a moment.");

  let text = parsed.data.text.replace(/\s+/g, " ").replace(/\.$/, "");
  let note = "Tightened the wording.";
  for (const [pattern, verb] of WEAK_OPENERS) {
    if (pattern.test(text)) {
      text = text.replace(pattern, verb);
      note = "Starts with a strong action verb now.";
      break;
    }
  }
  text = text
    .replace(/\b(very|really|basically|just)\s+/gi, "")
    .replace(/\bin order to\b/gi, "to")
    .replace(/\butili[sz]ed\b/gi, "used");
  text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!/\d/.test(text) && parsed.data.attempt === 0) {
    note += " If you know a real number for this (people, %, time saved), add it — it makes the line stronger.";
  }
  return ok({ suggestion: text, note });
}
