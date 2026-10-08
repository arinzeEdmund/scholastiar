import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email.").trim().max(254),
  source: z.string().trim().max(60).default("website"),
});

export type NewsletterInput = z.input<typeof newsletterSchema>;

export const CONTACT_TOPICS = {
  applicant_support: "Help with my account or applications",
  employer_sales: "Hiring on Scholastiar.ai",
  partnerships: "Universities, funders and partnerships",
  press: "Press and media",
  other: "Something else",
} as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.email("Enter a valid email.").trim().max(254),
  topic: z.enum(Object.keys(CONTACT_TOPICS) as [keyof typeof CONTACT_TOPICS, ...(keyof typeof CONTACT_TOPICS)[]], {
    error: "Choose what your message is about.",
  }),
  message: z.string().trim().min(20, "Add a little more (20+ characters).").max(4000, "Use 4,000 characters or fewer."),
});

export type ContactInput = z.input<typeof contactSchema>;
