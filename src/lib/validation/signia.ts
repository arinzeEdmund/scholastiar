import { z } from "zod";

const SECTION_KEYS = ["personality_cv", "overview", "current_work", "projects", "media", "social_links"] as const;
const VISIBILITY = ["public", "application_only", "private"] as const;

const url = z
  .string()
  .trim()
  .url("Enter a full link, starting with https://")
  .refine((v) => /^https?:\/\//.test(v), "Use a link starting with https://");

export const signiaProfileSchema = z.object({
  handle: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Use at least 3 characters.")
    .max(30, "Keep it under 30 characters.")
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "Letters, numbers and hyphens only."),
  headline: z.string().trim().min(5, "Add a short headline.").max(120, "Keep it under 120 characters."),
  summary: z.string().trim().max(1200, "Keep it under 1,200 characters."),
  current_work_summary: z.string().trim().max(600, "Keep it under 600 characters."),
  public_status: z.enum(["draft", "published", "unpublished"]),
  discoverability: z.enum(["public", "application_only"]),
  sections: z.array(z.object({ key: z.enum(SECTION_KEYS), visible: z.boolean() })).length(SECTION_KEYS.length),
});
export type SigniaProfileFormInput = z.infer<typeof signiaProfileSchema>;

export const signiaProjectSchema = z.object({
  title: z.string().trim().min(3, "Give it a title.").max(120),
  summary: z.string().trim().min(10, "Add a one-line summary.").max(240),
  role_description: z.string().trim().max(400),
  problem_statement: z.string().trim().max(800),
  approach: z.string().trim().max(1200),
  outcome: z.string().trim().max(800),
  status: z.enum(["in_progress", "completed"]),
  project_type: z.enum([
    "project",
    "research",
    "startup",
    "open_source",
    "case_study",
    "writing",
    "volunteering",
    "other",
  ]),
  skills: z.array(z.string().trim().min(1).max(60)).max(12, "Up to 12 skills."),
  links: z
    .array(
      z.object({
        id: z.string(),
        link_type: z.enum(["github", "demo", "paper", "video", "article", "dataset", "other"]),
        label: z.string().trim().min(1, "Add a label.").max(80),
        url,
      }),
    )
    .max(8, "Up to 8 links."),
  visibility: z.enum(VISIBILITY),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
});
export type SigniaProjectFormInput = z.infer<typeof signiaProjectSchema>;

export const signiaLinksSchema = z.object({
  links: z
    .array(
      z.object({
        id: z.string(),
        platform: z.enum([
          "linkedin",
          "github",
          "x",
          "instagram",
          "youtube",
          "tiktok",
          "behance",
          "medium",
          "researchgate",
          "orcid",
          "google_scholar",
          "website",
          "other",
        ]),
        label: z.string().trim().min(1, "Add a label.").max(60),
        url,
        visibility: z.enum(VISIBILITY),
      }),
    )
    .max(15, "Up to 15 links."),
});
export type SigniaLinksFormInput = z.infer<typeof signiaLinksSchema>;

export const signiaMediaUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2, "Add a title.").max(120),
  description: z.string().trim().max(400),
  visibility: z.enum(VISIBILITY),
  project_id: z.string().nullable(),
});
