import type {
  CandidateGoal,
  CommunicationStyle,
  DegreeLevel,
  DocumentType,
  EmploymentType,
  LanguageLevel,
  NotificationCategory,
  NotificationChannel,
  OnboardingStep,
  PermitStatus,
  ProfileVisibility,
  RelocationWillingness,
  SkillLevel,
  SkillType,
  SponsorshipNeed,
  StudentJobType,
  StudyStatus,
  WorkMode,
} from "@/data/types";

// Display labels for candidate enums. Shared by server pages and client forms.

export const STUDY_STATUS: Record<StudyStatus, { label: string; text: string }> = {
  incoming: { label: "Starting soon", text: "I have an offer or I'm applying to study abroad" },
  studying: { label: "Studying now", text: "I'm currently on a course abroad" },
  graduated: { label: "Graduated", text: "I've finished my course abroad" },
};

export const PERMIT_STATUS: Record<PermitStatus, string> = {
  none: "Not planning one",
  planning: "Planning to apply",
  applying: "Applied, waiting for a decision",
  holding: "I hold this permit",
};

export const SPONSORSHIP_NEED: Record<SponsorshipNeed, string> = {
  yes: "Yes, I'll need sponsorship",
  no: "No, I won't need it",
  unsure: "Not sure yet",
};

export const RELOCATION: Record<RelocationWillingness, string> = {
  yes: "Yes",
  maybe: "For the right role",
  no: "No",
};

export const DEGREE_LEVEL: Record<DegreeLevel, string> = {
  secondary: "Secondary school",
  diploma: "Diploma or certificate",
  bachelors: "Bachelor's degree",
  masters: "Master's degree",
  doctorate: "Doctorate (PhD)",
  professional: "Professional qualification",
  other: "Other",
};

export const EMPLOYMENT_TYPE: Record<EmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  internship: "Internship",
  placement: "Placement or national service",
  volunteer: "Volunteer",
  freelance: "Freelance",
};

export const SKILL_TYPE: Record<SkillType, string> = {
  technical: "Technical",
  tool: "Tool or software",
  domain: "Subject knowledge",
  soft: "People and communication",
  language: "Language",
};

export const SKILL_LEVEL: Record<SkillLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const LANGUAGE_LEVEL: Record<LanguageLevel, string> = {
  basic: "Basic",
  conversational: "Conversational",
  fluent: "Fluent",
  native: "Native",
};

export const COMMUNICATION_STYLE: Record<CommunicationStyle, { label: string; text: string; example: string }> = {
  concise: {
    label: "Direct and concise",
    text: "Short sentences, straight to the point.",
    example: "Cut report preparation from 5 days to 2 by automating data cleaning.",
  },
  warm: {
    label: "Warm and personable",
    text: "Friendly, shows who you are.",
    example: "I love turning messy data into decisions — at Brightpath, I cut our report time from 5 days to 2.",
  },
  formal: {
    label: "Formal and polished",
    text: "Traditional, professional tone.",
    example:
      "In my role at Brightpath, I reduced report preparation time from five days to two through automated data cleaning.",
  },
};

export const PROFILE_VISIBILITY: Record<ProfileVisibility, { label: string; text: string }> = {
  private: { label: "Only me", text: "Nobody else can see your profile." },
  employers: { label: "Employers I apply to", text: "Shared only with organisations you apply to." },
  public: { label: "Verified employers", text: "Verified employers can find you in search." },
};

export const GOALS: Record<CandidateGoal, { label: string; text: string }> = {
  study: { label: "Study abroad", text: "Universities and programmes" },
  funding: { label: "Funding", text: "Scholarships for your studies" },
  student_jobs: { label: "Student jobs", text: "Job connections on Pro, within your visa hours" },
  post_study_jobs: { label: "Post-study jobs with residency", text: "Job connections on Pro, with visa sponsorship" },
};

export const STUDENT_JOB_TYPES: Record<StudentJobType, string> = {
  part_time: "Part-time in term",
  holiday: "Holiday work",
  campus: "Campus jobs",
  internship_placement: "Internships and placements",
};

export const WORK_MODES: Record<WorkMode, string> = {
  on_site: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

export const DOCUMENT_TYPES: Record<DocumentType, string> = {
  cv: "CV",
  cover_letter: "Cover letter",
  transcript: "Transcript",
  certificate: "Certificate",
  passport: "Passport",
  visa: "Visa or permit",
  reference_letter: "Reference letter",
  work_sample: "Work sample",
  other: "Other",
};

/**
 * Notification categories. `locked` channels stay on (security, payment and emergency messages);
 * `never` channels are not used for that category (promotions never go to WhatsApp).
 */
export const NOTIFICATION_CATEGORIES: Record<
  NotificationCategory,
  { label: string; text: string; locked?: NotificationChannel[]; never?: NotificationChannel[] }
> = {
  deadlines: { label: "Deadlines", text: "Reminders before saved opportunities close." },
  application_updates: { label: "Application updates", text: "Status changes on your applications." },
  messages: { label: "Messages", text: "New messages from universities, scholarship panels and our team." },
  new_matches: { label: "New matches", text: "Opportunities that fit your profile." },
  profile_activity: { label: "Profile and documents", text: "Set-up progress, profile and document changes." },
  account_security: {
    label: "Account and security",
    text: "Sign-ins, passwords and verification. Always on.",
    locked: ["email", "whatsapp"],
  },
  billing: {
    label: "Payments",
    text: "Receipts, renewals and failed payments. Always on.",
    locked: ["email", "whatsapp"],
  },
  product_news: { label: "Product news", text: "New features and guides, now and then.", never: ["whatsapp"] },
};

export const NOTIFICATION_CHANNELS: Record<NotificationChannel, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  in_app: "In-app",
  push: "Push",
};

export const INDUSTRY_SUGGESTIONS = [
  "Healthcare",
  "Public health",
  "Technology",
  "Finance",
  "Education",
  "Research",
  "Retail",
  "Hospitality",
  "Engineering",
  "Non-profit",
  "Consulting",
  "Logistics",
  "Energy",
  "Media",
];

export const CURRENCIES = ["GBP", "EUR", "USD", "CAD", "AUD", "AED", "NGN", "GHS", "KES", "INR"];

/** The onboarding interview, in order. */
export const ONBOARDING: Record<
  OnboardingStep,
  { title: string; short: string; description: string; minutes: number }
> = {
  personal: {
    title: "About you",
    short: "About you",
    description: "Who you are, where you live and the languages you speak.",
    minutes: 2,
  },
  visa: {
    title: "Your study and visa situation",
    short: "Visa",
    description: "Your study status, the work conditions on your visa and your plans after graduating.",
    minutes: 2,
  },
  education: {
    title: "Your education",
    short: "Education",
    description: "Where you've studied and what you studied.",
    minutes: 2,
  },
  experience: {
    title: "Your experience",
    short: "Experience",
    description: "Jobs, internships, placements and volunteering — with what you achieved.",
    minutes: 3,
  },
  skills: {
    title: "Your skills",
    short: "Skills",
    description: "What you're good at, and how well.",
    minutes: 1,
  },
  preferences: {
    title: "What you're looking for",
    short: "Goals",
    description: "The opportunities, roles and countries you want.",
    minutes: 1,
  },
  "personality-cv": {
    title: "PersonalityAI CV",
    short: "PersonalityAI",
    description: "A short video introduction employers can watch.",
    minutes: 1,
  },
  review: {
    title: "Review your profile",
    short: "Review",
    description: "Check everything before you start applying.",
    minutes: 1,
  },
};

export function labelFor<T extends string>(map: Record<T, string | { label: string }>, value: T | null | undefined) {
  if (!value) return null;
  const entry = map[value];
  return typeof entry === "string" ? entry : entry.label;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2023-02" or "2023-02-14" → "Feb 2023". */
export function formatMonth(value: string | null | undefined) {
  if (!value) return null;
  const [year, month] = value.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

/** "2026-09-21" → "21 Sep 2026". */
export function formatDay(value: string | null | undefined) {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  return day ? `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}` : formatMonth(value);
}

export function formatRange(start: string | null, end: string | null, isCurrent: boolean) {
  const from = formatMonth(start);
  const to = isCurrent ? "Present" : formatMonth(end);
  if (!from && !to) return null;
  return [from, to].filter(Boolean).join(" – ");
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
