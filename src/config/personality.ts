// PersonalityAI CV prompts (SERVICES/96-personality-ai-cv.md → Guided Prompt Selection), written for
// students applying to universities and scholarships abroad.

export const PERSONALITY_PROMPTS = [
  "Introduce yourself in a sentence or two.",
  "Why this subject, and why now?",
  "Why do you want to study abroad — and why this country?",
  "Tell us about something you're proud of and why.",
  "What do you want to do after you graduate?",
  "How do you handle a new place, language or culture?",
] as const;

export const MAX_PROMPTS = 3;

/**
 * Videos are added by link only — no recording or uploading on Scholastiar (decided 2026-10-08).
 * Students are asked to keep it to one minute.
 */
export const VIDEO_GUIDE_SECONDS = 60;
