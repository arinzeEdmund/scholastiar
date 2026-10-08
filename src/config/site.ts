/** Public site details. Contact addresses are placeholders until confirmed (see PROGRESS_TRACKER open questions). */
export const SITE = {
  name: "Scholastiar.ai",
  url: process.env.APP_URL ?? "http://localhost:3000",
  tagline: "Study, funding and relocation support for people building a life across borders.",
  emails: {
    support: "support@scholastiar.ai",
    employers: "employers@scholastiar.ai",
    partnerships: "partners@scholastiar.ai",
    press: "press@scholastiar.ai",
    privacy: "privacy@scholastiar.ai",
  },
  responseTime: "We reply within two working days.",
} as const;

/**
 * Social media accounts shown in the footer. Empty until real accounts exist —
 * TODO before launch: add each account here (see PROGRESS_TRACKER open questions).
 */
export const SOCIAL_LINKS: { platform: string; url: string }[] = [];

/** Destination shortcuts in the footer; each opens search for that country. */
export const POPULAR_DESTINATIONS = [
  "United Kingdom",
  "Canada",
  "Germany",
  "Australia",
  "Ireland",
  "Netherlands",
  "United States",
  "United Arab Emirates",
] as const;

/** Visa, immigration and funding content disclaimer (PUBLISHING_INTELLIGENCE_ENGINE.md). */
export const GUIDANCE_DISCLAIMER =
  "This guide is for general planning and application education. Immigration rules and opportunity requirements can change. Always confirm final requirements with the official program, employer, university, embassy, or authorized advisor.";
