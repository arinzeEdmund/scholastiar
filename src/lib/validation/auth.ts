import { z } from "zod";

import { E164, toE164 } from "@/lib/phone";

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(128, "Use 128 characters or fewer.")
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/\d/, "Include at least one number.");

const email = z.email("Enter a valid email.").trim().max(254);
const fullName = z.string().trim().min(2, "Enter your full name.").max(80, "Use 80 characters or fewer.");
const countryCode = z.string().length(2, "Choose your country.");
const acceptTerms = z.literal(true, { error: "Required" });
/** Optional WhatsApp number for official Scholastiar messages (entering one is the opt-in). */
export const whatsappNumber = z
  .string()
  .trim()
  .max(24)
  .refine((v) => v === "" || E164.test(toE164(v)), "Start with + and your country code.")
  .optional();
const optionalUrl = z
  .string()
  .trim()
  .max(200)
  .refine((v) => v === "" || /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v), "Start with https://");

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});
export type SignInInput = z.input<typeof signInSchema>;

export const HIRING_FOCUS = {
  students: "International students (part-time and campus roles)",
  graduates: "Graduates, with work visa sponsorship",
  both: "Both students and graduates",
} as const;

export const PROVIDER_TYPES = {
  university: "University or college",
  scholarship_funder: "Scholarship funder",
  other: "Other organisation",
} as const;

const candidateSignUp = z.object({
  accountType: z.literal("candidate"),
  fullName,
  email,
  password: passwordSchema,
  countryCode,
  whatsapp: whatsappNumber,
  planId: z.enum(["starter", "pro"], { error: "Choose a plan." }),
  acceptTerms,
});

const employerSignUp = z
  .object({
    accountType: z.literal("employer"),
    fullName,
    jobTitle: z.string().trim().min(2, "Enter your job title.").max(80),
    email,
    password: passwordSchema,
    whatsapp: whatsappNumber,
    companyName: z.string().trim().min(2, "Enter your company name.").max(120),
    companyWebsite: optionalUrl,
    countryCode,
    hiringFocus: z.enum(Object.keys(HIRING_FOCUS) as [keyof typeof HIRING_FOCUS, ...(keyof typeof HIRING_FOCUS)[]], {
      error: "Tell us who you're hiring.",
    }),
    planId: z.enum(["employer_starter", "employer_pro"], { error: "Choose a plan." }),
    acceptTerms,
  })
  .refine((v) => v.hiringFocus === "students" || v.planId === "employer_pro", {
    path: ["planId"],
    message: "Sponsoring graduates' work visas needs Employer Pro.",
  });

const providerSignUp = z.object({
  accountType: z.literal("provider"),
  fullName,
  jobTitle: z.string().trim().min(2, "Enter your job title.").max(80),
  email,
  password: passwordSchema,
  whatsapp: whatsappNumber,
  organizationName: z.string().trim().min(2, "Enter your organisation's name.").max(160),
  organizationType: z.enum(
    Object.keys(PROVIDER_TYPES) as [keyof typeof PROVIDER_TYPES, ...(keyof typeof PROVIDER_TYPES)[]],
    {
      error: "Choose your organisation type.",
    },
  ),
  organizationWebsite: optionalUrl,
  countryCode,
  planId: z.enum(["provider_verified", "provider_pro"], { error: "Choose a plan." }),
  acceptTerms,
});

export const signUpSchema = z.discriminatedUnion("accountType", [candidateSignUp, employerSignUp, providerSignUp]);
export type SignUpInput = z.input<typeof signUpSchema>;
export type CandidateSignUpInput = z.input<typeof candidateSignUp>;
export type EmployerSignUpInput = z.input<typeof employerSignUp>;
export type ProviderSignUpInput = z.input<typeof providerSignUp>;
export const candidateSignUpSchema = candidateSignUp;
export const employerSignUpSchema = employerSignUp;
export const providerSignUpSchema = providerSignUp;

export const forgotPasswordSchema = z.object({ email });
export type ForgotPasswordInput = z.input<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({ token: z.string().min(10), password: passwordSchema, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords don't match." });
export type ResetPasswordInput = z.input<typeof resetPasswordSchema>;

export const cardCheckoutSchema = z.object({
  method: z.literal("card"),
  planId: z.string().min(1),
  cardName: z.string().trim().min(2, "Enter a name."),
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{12,19}$/, "Check the card number.")),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY."),
  cvc: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, "3 or 4 digits."),
  countryCode,
});
export const localCheckoutSchema = z.object({
  method: z.literal("local"),
  planId: z.string().min(1),
  provider: z.enum(["paystack", "flutterwave"], { error: "Choose a payment method." }),
});
export const checkoutSchema = z.discriminatedUnion("method", [cardCheckoutSchema, localCheckoutSchema]);
export type CheckoutInput = z.input<typeof checkoutSchema>;
