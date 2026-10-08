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
/** Seconds of recording allowed in total. */
export const MAX_RECORDING_SECONDS = 120;
export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;
