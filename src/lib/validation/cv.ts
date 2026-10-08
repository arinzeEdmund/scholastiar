import { z } from "zod";

const FORMATS = ["academic", "uk_cv", "eu_cv", "us_resume", "africa", "visa_employment"] as const;
const SECTIONS = ["summary", "education", "experience", "skills", "certifications", "languages"] as const;

export const cvGenerateSchema = z
  .object({
    targetType: z.enum(["program", "scholarship", "pasted", "general"]),
    targetId: z.string().max(120).optional(),
    pasted: z.string().max(8000).optional(),
    format: z.enum(FORMATS),
    tone: z.enum(["concise", "warm", "formal"]),
    sections: z.array(z.enum(SECTIONS)).min(2, "Keep at least two sections."),
    strengths: z.array(z.string().max(80)).max(3, "Pick up to three strengths."),
  })
  .superRefine((value, ctx) => {
    if ((value.targetType === "program" || value.targetType === "scholarship") && !value.targetId) {
      ctx.addIssue({ code: "custom", path: ["targetId"], message: "Choose what this CV is for." });
    }
    if (value.targetType === "pasted" && (value.pasted?.trim().length ?? 0) < 80) {
      ctx.addIssue({ code: "custom", path: ["pasted"], message: "Paste at least a few sentences." });
    }
  });

export type CvGenerateInput = z.infer<typeof cvGenerateSchema>;

const entrySchema = z.object({
  source_id: z.string(),
  title: z.string().trim().min(1, "Add a title.").max(160),
  organisation: z.string().trim().max(160),
  location: z.string().max(120).nullable(),
  dates: z.string().max(60),
  bullets: z.array(z.string().trim().max(400)),
});

export const cvContentSchema = z.object({
  header: z.object({
    name: z.string().trim().min(2).max(120),
    headline: z.string().max(160).nullable(),
    email: z.string().email(),
    phone: z.string().max(40).nullable(),
    location: z.string().max(120).nullable(),
    nationality: z.string().max(80).nullable(),
    links: z.array(z.string().max(300)),
  }),
  summary: z.string().trim().max(1200, "Keep the profile under 1,200 characters."),
  education: z.array(entrySchema),
  experience: z.array(entrySchema),
  skills: z.array(z.string().trim().min(1).max(80)),
  certifications: z.array(z.string().max(200)),
  languages: z.array(z.string().max(80)),
  section_order: z.array(z.enum(SECTIONS)),
  hidden_sections: z.array(z.enum(SECTIONS)),
});

export const cvUpdateSchema = z.object({
  id: z.string().min(1).max(120),
  title: z.string().trim().min(2, "Give this CV a name.").max(120),
  content: cvContentSchema,
});
