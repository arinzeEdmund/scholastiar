"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { repos, type CandidateSkill, type OnboardingStep } from "@/data";
import { ONBOARDING_STEPS } from "@/data/types/candidate";
import { DOCUMENT_TYPES } from "@/lib/candidate/labels";
import { profileStrength } from "@/lib/candidate/strength";
import { fail, ok, type ActionResult } from "@/lib/actions/result";
import { notify } from "@/lib/messages/notify";
import { toE164 } from "@/lib/phone";
import { getSession } from "@/lib/session";
import {
  aboutSchema,
  documentUpdateSchema,
  educationSchema,
  experienceSchema,
  personalSchema,
  preferencesSchema,
  skillsSchema,
  visaSchema,
  type AboutInput,
  type DocumentUpdateInput,
  type EducationFormInput,
  type ExperienceFormInput,
  type PersonalInput,
  type PreferencesInput,
  type SkillsInput,
  type VisaInput,
} from "@/lib/validation/candidate";

// Candidate onboarding and profile actions. Every action checks the session and only
// ever touches the signed-in candidate's own records.

const fieldErrors = (error: z.ZodError) => z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
const orNull = (value: string | undefined | null) => (value && value.trim() !== "" ? value.trim() : null);
const numOrNull = (value: string | undefined) => (value && value.trim() !== "" ? Number(value) : null);

type Saved = ActionResult<{ redirectTo?: string }>;

async function candidateId(): Promise<string | null> {
  const session = await getSession();
  return session?.user.primary_role === "candidate" ? session.user.user_id : null;
}

const SIGNED_OUT = "Your session has ended. Sign in again to save your changes.";

/** Marks an onboarding step done and returns the next step's address. */
async function advance(userId: string, step: OnboardingStep): Promise<string> {
  const index = ONBOARDING_STEPS.indexOf(step);
  const next = ONBOARDING_STEPS[index + 1] ?? "review";
  await repos.candidate.completeOnboardingStep(userId, step, next);
  return `/onboarding/${next}`;
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function savePersonal(input: PersonalInput, onboarding = false): Promise<Saved> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = personalSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;

  await repos.users.updateProfile(userId, { full_name: d.fullName });
  await repos.candidate.updateProfile(userId, {
    preferred_name: orNull(d.preferredName),
    date_of_birth: orNull(d.dateOfBirth),
    nationality_country_code: d.nationality,
    current_country_code: d.currentCountry,
    current_city: orNull(d.currentCity),
    phone: orNull(d.phone),
    languages: d.languages,
    communication_style: d.communicationStyle,
  });
  if (d.whatsapp || d.whatsappOptIn === false) {
    await repos.messages.setWhatsAppConsent(userId, {
      phoneE164: d.whatsapp ? toE164(d.whatsapp) : "",
      optedIn: d.whatsappOptIn && Boolean(d.whatsapp),
      source: onboarding ? "onboarding" : "settings",
    });
  }
  // Nationality doubles as the passport country until the visa step says otherwise.
  const visa = await repos.candidate.getVisa(userId);
  if (!visa.passport_country_code) await repos.candidate.updateVisa(userId, { passport_country_code: d.nationality });

  refresh();
  return ok({ redirectTo: onboarding ? await advance(userId, "personal") : undefined });
}

export async function saveAbout(input: AboutInput): Promise<Saved> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = aboutSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;

  await repos.candidate.updateProfile(userId, {
    headline: orNull(d.headline),
    professional_summary: orNull(d.summary),
    website_url: orNull(d.websiteUrl),
    linkedin_url: orNull(d.linkedinUrl),
    portfolio_url: orNull(d.portfolioUrl),
    profile_visibility: d.profileVisibility,
  });
  await repos.users.updateProfile(userId, { headline: orNull(d.headline) });
  refresh();
  return ok({});
}

export async function saveVisa(input: VisaInput, onboarding = false): Promise<Saved> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = visaSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;
  const graduated = d.studyStatus === "graduated";

  await repos.candidate.updateVisa(userId, {
    passport_country_code: d.passportCountry,
    study_status: d.studyStatus,
    study_country_code: d.studyCountry,
    institution_name: orNull(d.institution),
    course_start_date: orNull(d.courseStart),
    course_end_date: orNull(d.courseEnd),
    current_visa_status: orNull(d.currentVisaStatus),
    // Study visa work conditions only apply while studying.
    term_time_weekly_hour_limit: graduated ? null : numOrNull(d.termTimeHours),
    holiday_work_allowed: graduated || !d.holidayWork ? null : d.holidayWork === "yes",
    work_restrictions_notes: orNull(d.restrictions),
    post_study_permit_type_id: orNull(d.permitTypeId),
    post_study_permit_status: d.permitStatus,
    post_study_permit_expiry_date: d.permitStatus === "holding" ? orNull(d.permitExpiry) : null,
    needs_sponsorship_after_study: d.needsSponsorship,
    target_country_codes: d.targetCountries,
    countries_lived_in: d.countriesLivedIn,
    relocation_willingness: d.relocation ? d.relocation : null,
  });
  refresh();
  return ok({ redirectTo: onboarding ? await advance(userId, "visa") : undefined });
}

export async function saveEducation(
  id: string | null,
  input: EducationFormInput,
): Promise<ActionResult<{ id: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;

  const record = await repos.candidate.saveEducation(userId, id, {
    institution_name: d.institution,
    country_code: orNull(d.countryCode),
    degree_level: d.degreeLevel,
    qualification_name: d.qualification,
    field_of_study: d.field,
    start_date: orNull(d.startDate),
    end_date: orNull(d.endDate),
    is_current: d.isCurrent,
    grade: orNull(d.grade),
    description: orNull(d.description),
  });
  refresh();
  return ok({ id: record.id });
}

export async function deleteEducation(id: string): Promise<ActionResult<undefined>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  await repos.candidate.deleteEducation(userId, id);
  refresh();
  return ok(undefined);
}

export async function saveExperience(
  id: string | null,
  input: ExperienceFormInput,
): Promise<ActionResult<{ id: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;

  const record = await repos.candidate.saveExperience(userId, id, {
    company_name: d.company,
    job_title: d.title,
    employment_type: d.employmentType,
    country_code: orNull(d.countryCode),
    city: orNull(d.city),
    start_date: d.startDate,
    end_date: d.isCurrent ? null : orNull(d.endDate),
    is_current: d.isCurrent,
    industry: orNull(d.industry),
    responsibilities: orNull(d.responsibilities),
    achievements: d.achievements.map((a) => a.trim()).filter(Boolean),
    tools_used: [...new Set(d.tools.map((t) => t.trim()).filter(Boolean))],
  });
  refresh();
  return ok({ id: record.id });
}

export async function deleteExperience(id: string): Promise<ActionResult<undefined>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  await repos.candidate.deleteExperience(userId, id);
  refresh();
  return ok(undefined);
}

export async function saveSkills(input: SkillsInput, onboarding = false): Promise<Saved> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = skillsSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));

  // Keep one entry per skill name (case-insensitive), last one wins.
  const unique = new Map<string, (typeof parsed.data.skills)[number]>();
  for (const skill of parsed.data.skills) unique.set(skill.name.toLowerCase(), skill);
  await repos.candidate.replaceSkills(
    userId,
    [...unique.values()].map((s): Omit<CandidateSkill, "id" | "user_id"> => ({
      skill_name: s.name,
      skill_type: s.type,
      proficiency_level: s.level,
      years_experience: null,
      source: onboarding ? "onboarding" : "manual",
    })),
  );
  await repos.candidate.replaceCertifications(
    userId,
    parsed.data.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      issue_date: orNull(c.issueDate),
      expiry_date: null,
      credential_url: orNull(c.url),
    })),
  );
  refresh();
  return ok({ redirectTo: onboarding ? await advance(userId, "skills") : undefined });
}

export async function savePreferences(input: PreferencesInput, onboarding = false): Promise<Saved> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = preferencesSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const d = parsed.data;
  const jobTracks = [
    ...(d.goals.includes("student_jobs") ? (["student"] as const) : []),
    ...(d.goals.includes("post_study_jobs") ? (["post_study"] as const) : []),
  ];

  await repos.candidate.updatePreferences(userId, {
    goals: d.goals,
    target_roles: [...new Set(d.targetRoles.map((r) => r.trim()).filter(Boolean))],
    industries: d.industries,
    job_tracks: jobTracks,
    preferred_student_job_types: d.goals.includes("student_jobs") ? d.studentJobTypes : [],
    max_weekly_hours: d.goals.includes("student_jobs") ? numOrNull(d.maxWeeklyHours) : null,
    pay_min: numOrNull(d.payMin),
    pay_currency: d.payCurrency,
    pay_period: d.payPeriod,
    work_modes: d.workModes,
    target_country_codes: d.targetCountries,
    earliest_start_date: orNull(d.earliestStart),
  });
  refresh();
  return ok({ redirectTo: onboarding ? await advance(userId, "preferences") : undefined });
}

/** "Continue" on steps saved item by item (education, experience) or skipped (PersonalityAI CV). */
export async function continueOnboarding(step: OnboardingStep): Promise<ActionResult<{ redirectTo: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  if (!ONBOARDING_STEPS.includes(step) || step === "review") return fail("Unknown step.");
  return ok({ redirectTo: await advance(userId, step) });
}

export async function finishOnboarding(): Promise<ActionResult<{ redirectTo: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const bundle = await repos.candidate.getBundle(userId);
  const missing: string[] = [];
  if (!bundle.profile.nationality_country_code) missing.push("your personal details");
  if (!bundle.visa.study_status) missing.push("your study and visa details");
  if (bundle.preferences.goals.length === 0) missing.push("what you're looking for");
  if (missing.length > 0) return fail(`Add ${missing.join(", ")} before you finish.`);

  await repos.candidate.finishOnboarding(userId);
  await notify("onboarding.completed", { userId }, { score: String(profileStrength(bundle).score) });
  refresh();
  return ok({ redirectTo: "/onboarding/complete" });
}

// Documents — Phase A keeps small files inline (data URL) so preview and download work
// without storage. Phase B uploads to Supabase Storage with signed URLs.

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MOCK_INLINE_LIMIT = 1.5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
]);

export async function uploadDocument(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Choose a file to upload.");
  if (file.size > MAX_FILE_BYTES) return fail("Files can be up to 5 MB.");
  if (!ALLOWED_TYPES.has(file.type)) return fail("Upload a PDF, Word document, image or text file.");

  const parsedType = documentUpdateSchema.shape.documentType.safeParse(formData.get("documentType"));
  const documentType = parsedType.success ? parsedType.data : "other";
  const inline =
    file.size <= MOCK_INLINE_LIMIT
      ? `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`
      : null;

  const document = await repos.candidate.createDocument(userId, {
    file_name: file.name.slice(0, 120),
    mime_type: file.type,
    size_bytes: file.size,
    document_type: documentType,
    visibility: "private",
    tags: [],
    mock_data_url: inline,
  });
  await notify(
    "document.uploaded",
    { userId },
    { fileName: document.file_name, type: DOCUMENT_TYPES[document.document_type] },
  );
  refresh();
  return ok({ id: document.id });
}

export async function updateDocument(id: string, input: DocumentUpdateInput): Promise<ActionResult<undefined>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  const parsed = documentUpdateSchema.safeParse(input);
  if (!parsed.success) return fail("Check the highlighted fields.", fieldErrors(parsed.error));
  const existing = await repos.candidate.getDocument(userId, id);
  if (!existing) return fail("That document no longer exists.");

  await repos.candidate.updateDocument(userId, id, {
    file_name: parsed.data.fileName,
    document_type: parsed.data.documentType,
    visibility: parsed.data.visibility,
    tags: [...new Set(parsed.data.tags.map((t) => t.trim().toLowerCase()).filter(Boolean))],
  });
  refresh();
  return ok(undefined);
}

export async function deleteDocument(id: string): Promise<ActionResult<undefined>> {
  const userId = await candidateId();
  if (!userId) return fail(SIGNED_OUT);
  await repos.candidate.deleteDocument(userId, id);
  refresh();
  return ok(undefined);
}
