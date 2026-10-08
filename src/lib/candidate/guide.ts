import type { OnboardingStep } from "@/data/types";

// Nkechinyere — the onboarding guide. Her lines for the onboarding welcome screen.
// Keep them short, warm and honest: guidance, never promises.

export const GUIDE = {
  name: "Nkechinyere",
  role: "Your onboarding guide",
};

/**
 * Welcome video. Drop the recording at `public/guide/nkechinyere-welcome.mp4`; the card plays it
 * with captions from `public/guide/nkechinyere-welcome.vtt` (generated from WELCOME_SCRIPT by
 * scripts/guide-captions.py). Until the file exists the card shows "coming soon" and the transcript.
 * The video is the same for everyone, so it doesn't use the student's name.
 */
export const WELCOME_VIDEO = {
  src: "/guide/nkechinyere-welcome.mp4",
  captions: "/guide/nkechinyere-welcome.vtt",
};

/**
 * Exactly what Nkechinyere says in the welcome video — word for word the three messages in her
 * welcome chat (the video says "Hi" because one recording plays for every student).
 */
export const WELCOME_SCRIPT = [
  "Hi, I'm Nkechinyere. I'll guide you through setting up your Scholastiar profile.",
  "It's a short interview — 8 steps, about 13 minutes — and you only do it once. Everything saves as you go.",
  "Please take your time with it: your answers become your CV, your application drafts and your visa guidance. The more complete and honest you are, the stronger every application gets.",
];

/** What each step asks, and why it matters — in her voice. */
export const STEP_GUIDE: Record<OnboardingStep, { ask: string; why: string }> = {
  personal: {
    ask: "Your nationality, where you live, your languages — and the tone you want your applications to have.",
    why: "Employers filter by language and location, and your tone shapes every answer I help you draft.",
  },
  visa: {
    ask: "Where you are in your studies, the work conditions on your visa and your plans after graduating.",
    why: "This shapes your visa and relocation guidance — and, on Pro, which jobs fit your visa hours.",
  },
  education: {
    ask: "Your degrees, diplomas and the course you're starting or studying now.",
    why: "Universities, funders and employers check this first — it needs to be exact.",
  },
  experience: {
    ask: "Jobs, internships, placements and volunteering — plus one or two things you achieved in each.",
    why: "Achievements with numbers are what make an application stand out. I'll coach you as you write.",
  },
  skills: {
    ask: "What you're good at, and honestly how well.",
    why: "Real levels build trust. Employers notice when everything is rated “expert”.",
  },
  preferences: {
    ask: "What you want — study, funding, student jobs or post-study jobs — and where.",
    why: "So you only see opportunities that genuinely fit you.",
  },
  "personality-cv": {
    ask: "An optional 90-second video introducing yourself.",
    why: "It lets employers meet you before the interview. You can record it any time.",
  },
  review: {
    ask: "A quick look at everything together.",
    why: "Fix anything now, before your first application goes out.",
  },
};

/** What to have ready for each step — shown in the step's side panel. */
export const STEP_READY: Record<OnboardingStep, string[]> = {
  personal: ["Your passport, for your exact name and nationality", "Your WhatsApp number"],
  visa: [
    "Your visa, residence permit or offer letter",
    "Your course start and end dates",
    "Your post-study permit, if you have one",
  ],
  education: ["Certificates or transcripts", "Start and finish dates, and grades"],
  experience: ["Dates for each role", "One or two results you're proud of — with numbers"],
  skills: ["Nothing — just be honest about your level"],
  preferences: ["The roles and countries you're aiming for", "Your minimum pay, if you have one"],
  "personality-cv": ["A quiet spot and about 90 seconds"],
  review: ["A minute to check everything"],
};

export interface GuideQuestion {
  id: "why" | "steps" | "pause" | "privacy" | "documents";
  question: string;
  answer: string;
}

export const GUIDE_QUESTIONS: GuideQuestion[] = [
  {
    id: "why",
    question: "Why should I do it properly?",
    answer:
      "Because everything else is built from it. Your answers become your CV, the drafts for your application questions and your visa guidance. Vague answers make vague applications — real numbers and accurate visa details are what get you shortlisted, and keep your plans within what your visa allows.",
  },
  {
    id: "steps",
    question: "What will you ask me?",
    answer:
      "Who you are, your study and visa situation, your education, your experience and what you achieved, your skills, and what you're looking for. There's an optional video, then a quick review. I've laid out every step below — open any of them to see more.",
  },
  {
    id: "pause",
    question: "Can I stop halfway?",
    answer:
      "Yes. Each step saves when you continue, and “Save and exit” takes you to your dashboard. When you come back, I'll pick up exactly where you left off.",
  },
  {
    id: "privacy",
    question: "Who sees my answers?",
    answer:
      "Only you, until you apply. Organisations see your profile when you send them an application, and your documents stay private unless you choose to use them.",
  },
  {
    id: "documents",
    question: "What should I have ready?",
    answer:
      "Your visa or permit details if you have them, the dates of your courses and jobs, and your CV if you have one. Nothing is required to start — you can fill gaps later.",
  },
];
