import { z } from "zod";

import { passwordSchema, whatsappNumber } from "./auth";

// Form schemas for candidate onboarding, profile and settings. Fields stay as the strings
// the inputs produce; server actions convert them (numbers, nulls) before saving.
// Error messages are short: they show inside the field box.

const text = (max: number) => z.string().trim().max(max, `Use ${max} characters or fewer.`);
const optionalText = (max: number) => text(max).optional().or(z.literal(""));
const required = (message: string, max = 120) =>
  z.string().trim().min(1, message).max(max, `Use ${max} characters or fewer.`);
const country = z.string().length(2, "Choose a country.");
const optionalCountry = z.string().length(2).optional().or(z.literal(""));
const month = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Use the month picker.")
  .optional()
  .or(z.literal(""));
const day = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker.")
  .optional()
  .or(z.literal(""));
const url = z
  .string()
  .trim()
  .max(200)
  .refine((v) => v === "" || /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v), "Start with https://")
  .optional();
const numberText = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d+(\.\d+)?$/.test(v) && Number(v) >= min && Number(v) <= max), message)
    .optional();

const languageLevel = z.enum(["basic", "conversational", "fluent", "native"]);

export const personalSchema = z
  .object({
    fullName: required("Enter your full name.", 80).refine((v) => v.length >= 2, "Enter your full name."),
    preferredName: optionalText(40),
    dateOfBirth: day,
    nationality: country,
    currentCountry: country,
    currentCity: optionalText(80),
    phone: z
      .string()
      .trim()
      .refine((v) => v === "" || /^\+?[\d\s()-]{7,20}$/.test(v), "Check the number.")
      .optional(),
    languages: z
      .array(z.object({ name: required("Add a language.", 40), level: languageLevel }))
      .min(1, "Add at least one language.")
      .max(10),
    communicationStyle: z.enum(["concise", "warm", "formal"]),
    whatsapp: whatsappNumber,
    whatsappOptIn: z.boolean(),
  })
  .refine((v) => !v.whatsappOptIn || Boolean(v.whatsapp), { path: ["whatsapp"], message: "Add your WhatsApp number." });
export type PersonalInput = z.input<typeof personalSchema>;

export const aboutSchema = z.object({
  headline: optionalText(120),
  summary: optionalText(1200),
  websiteUrl: url,
  linkedinUrl: url,
  portfolioUrl: url,
  profileVisibility: z.enum(["private", "employers", "public"]),
});
export type AboutInput = z.input<typeof aboutSchema>;

export const visaSchema = z
  .object({
    passportCountry: country,
    studyStatus: z.enum(["incoming", "studying", "graduated"], { error: "Choose one." }),
    studyCountry: country,
    institution: optionalText(120),
    courseStart: day,
    courseEnd: day,
    currentVisaStatus: optionalText(80),
    termTimeHours: numberText(0, 60, "0 to 60."),
    holidayWork: z.enum(["yes", "no", ""]).optional(),
    restrictions: optionalText(400),
    permitTypeId: z.string().optional(),
    permitStatus: z.enum(["none", "planning", "applying", "holding"]),
    permitExpiry: day,
    needsSponsorship: z.enum(["yes", "no", "unsure"], { error: "Choose one." }),
    targetCountries: z.array(z.string().length(2)).min(1, "Add at least one country.").max(10),
    countriesLivedIn: z.array(z.string().length(2)).max(15),
    relocation: z.enum(["yes", "maybe", "no", ""]).optional(),
  })
  .refine((v) => !v.courseStart || !v.courseEnd || v.courseEnd >= v.courseStart, {
    path: ["courseEnd"],
    message: "Ends before it starts.",
  })
  .refine((v) => v.permitStatus !== "holding" || Boolean(v.permitExpiry), {
    path: ["permitExpiry"],
    message: "Add the expiry date.",
  });
export type VisaInput = z.input<typeof visaSchema>;

export const educationSchema = z
  .object({
    institution: required("Enter the institution."),
    countryCode: optionalCountry,
    degreeLevel: z.enum(["secondary", "diploma", "bachelors", "masters", "doctorate", "professional", "other"], {
      error: "Choose a level.",
    }),
    qualification: required("Enter the qualification."),
    field: required("Enter the subject."),
    startDate: month,
    endDate: month,
    isCurrent: z.boolean(),
    grade: optionalText(60),
    description: optionalText(600),
  })
  .refine((v) => v.isCurrent || !v.startDate || !v.endDate || v.endDate >= v.startDate, {
    path: ["endDate"],
    message: "Ends before it starts.",
  });
export type EducationFormInput = z.input<typeof educationSchema>;

export const experienceSchema = z
  .object({
    company: required("Enter the organisation."),
    title: required("Enter your role."),
    employmentType: z.enum(["full_time", "part_time", "internship", "placement", "volunteer", "freelance"]),
    countryCode: optionalCountry,
    city: optionalText(80),
    startDate: z.string().regex(/^\d{4}-\d{2}$/, "Add a start month."),
    endDate: month,
    isCurrent: z.boolean(),
    industry: optionalText(60),
    responsibilities: optionalText(1200),
    achievements: z.array(text(300)).max(8),
    tools: z.array(text(40)).max(20),
  })
  .refine((v) => v.isCurrent || Boolean(v.endDate), { path: ["endDate"], message: "Add an end month." })
  .refine((v) => v.isCurrent || !v.endDate || v.endDate >= v.startDate, {
    path: ["endDate"],
    message: "Ends before it starts.",
  });
export type ExperienceFormInput = z.input<typeof experienceSchema>;

export const skillsSchema = z.object({
  skills: z
    .array(
      z.object({
        name: required("Name the skill.", 60),
        type: z.enum(["technical", "tool", "soft", "language", "domain"]),
        level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
      }),
    )
    .max(50, "Up to 50 skills."),
  certifications: z
    .array(
      z.object({
        name: required("Name it.", 120),
        issuer: required("Add the issuer.", 120),
        issueDate: month,
        url: url,
      }),
    )
    .max(20),
});
export type SkillsInput = z.input<typeof skillsSchema>;

export const preferencesSchema = z.object({
  goals: z.array(z.enum(["study", "funding", "student_jobs", "post_study_jobs"])).min(1, "Choose at least one."),
  targetRoles: z.array(text(60)).max(10),
  industries: z.array(text(60)).max(12),
  studentJobTypes: z.array(z.enum(["part_time", "holiday", "campus", "internship_placement"])),
  maxWeeklyHours: numberText(1, 60, "1 to 60."),
  payMin: numberText(0, 1_000_000, "Check the amount."),
  payCurrency: z.string().length(3),
  payPeriod: z.enum(["hour", "year"]),
  workModes: z.array(z.enum(["on_site", "hybrid", "remote"])),
  targetCountries: z.array(z.string().length(2)).min(1, "Add at least one country.").max(10),
  earliestStart: month,
});
export type PreferencesInput = z.input<typeof preferencesSchema>;

export const documentUpdateSchema = z.object({
  fileName: required("Name the file.", 120),
  documentType: z.enum([
    "cv",
    "cover_letter",
    "transcript",
    "certificate",
    "passport",
    "visa",
    "reference_letter",
    "work_sample",
    "other",
  ]),
  visibility: z.enum(["private", "applications"]),
  tags: z.array(text(30)).max(8),
});
export type DocumentUpdateInput = z.input<typeof documentUpdateSchema>;

export const accountSchema = z.object({
  fullName: required("Enter your full name.", 80),
  timezone: required("Choose a time zone.", 60),
});
export type AccountInput = z.input<typeof accountSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { path: ["confirmPassword"], message: "Doesn't match." });
export type ChangePasswordInput = z.input<typeof changePasswordSchema>;

export const notificationPreferencesSchema = z.array(
  z.object({
    channel: z.enum(["email", "whatsapp", "in_app", "push"]),
    notification_type: z.enum([
      "deadlines",
      "application_updates",
      "messages",
      "new_matches",
      "profile_activity",
      "account_security",
      "billing",
      "product_news",
    ]),
    enabled: z.boolean(),
  }),
);
