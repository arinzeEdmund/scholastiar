import type { CandidateBundle } from "@/data/repositories/candidate";

export interface StrengthItem {
  key: string;
  label: string;
  /** What to do next, shown when the item isn't done. */
  tip: string;
  weight: number;
  /** 0–1: how much of this item is complete. */
  progress: number;
  href: string;
}

export interface ProfileStrength {
  score: number;
  items: StrengthItem[];
  /** Incomplete items, most valuable first. */
  next: StrengthItem[];
  level: "starting" | "building" | "strong" | "complete";
}

/**
 * Profile strength out of 100. Weights reflect what employers and the AI need most:
 * visa and work conditions, then education and experience. Shared by the dashboard,
 * the profile overview and the onboarding review.
 */
export function profileStrength(
  bundle: Pick<
    CandidateBundle,
    "profile" | "visa" | "education" | "experience" | "skills" | "preferences" | "documents"
  >,
): ProfileStrength {
  const { profile, visa, education, experience, skills, preferences, documents } = bundle;
  const ratio = (parts: boolean[]) => parts.filter(Boolean).length / parts.length;

  const visaParts = [
    Boolean(visa.passport_country_code),
    Boolean(visa.study_status),
    visa.study_status === "graduated"
      ? visa.post_study_permit_status !== "none" || Boolean(visa.current_visa_status)
      : visa.term_time_weekly_hour_limit !== null,
    Boolean(visa.needs_sponsorship_after_study),
    visa.target_country_codes.length > 0,
  ];

  const items: StrengthItem[] = [
    {
      key: "personal",
      label: "Personal details",
      tip: "Add your nationality, where you live, a phone number and your languages.",
      weight: 15,
      progress: ratio([
        Boolean(profile.nationality_country_code),
        Boolean(profile.current_country_code),
        Boolean(profile.phone),
        profile.languages.length > 0,
      ]),
      href: "/profile/edit#personal",
    },
    {
      key: "about",
      label: "Headline and summary",
      tip: "Write a one-line headline and a short summary — the AI uses it in every application.",
      weight: 10,
      progress: ratio([Boolean(profile.headline), (profile.professional_summary?.length ?? 0) >= 80]),
      href: "/profile/edit#about",
    },
    {
      key: "visa",
      label: "Study and visa details",
      tip: "Record your study status, visa work conditions and whether you'll need sponsorship.",
      weight: 20,
      progress: ratio(visaParts),
      href: "/profile/visa",
    },
    {
      key: "education",
      label: "Education",
      tip: "Add at least one qualification.",
      weight: 15,
      progress: education.length > 0 ? 1 : 0,
      href: "/profile/edit#education",
    },
    {
      key: "experience",
      label: "Experience with achievements",
      tip:
        experience.length === 0
          ? "Add a job, internship, placement or volunteering role."
          : "Add at least one measurable achievement to your experience.",
      weight: 15,
      progress: experience.length === 0 ? 0 : experience.some((e) => e.achievements.length > 0) ? 1 : 0.5,
      href: experience.length === 0 ? "/profile/experience/new" : "/profile/edit#experience",
    },
    {
      key: "skills",
      label: "Skills",
      tip: "Add at least five skills with your level.",
      weight: 10,
      progress: Math.min(skills.length / 5, 1),
      href: "/profile/skills",
    },
    {
      key: "preferences",
      label: "Goals and preferences",
      tip: "Tell us what you're looking for and where.",
      weight: 10,
      progress: ratio([preferences.goals.length > 0, preferences.target_country_codes.length > 0]),
      href: "/profile/preferences",
    },
    {
      key: "documents",
      label: "CV uploaded",
      tip: "Upload your current CV so it's ready for applications.",
      weight: 5,
      progress: documents.some((d) => d.document_type === "cv") ? 1 : 0,
      href: "/profile/documents",
    },
  ];

  const score = Math.round(items.reduce((sum, item) => sum + item.weight * item.progress, 0));
  const next = items
    .filter((item) => item.progress < 1)
    .sort((a, b) => b.weight * (1 - b.progress) - a.weight * (1 - a.progress));
  const level = score >= 100 ? "complete" : score >= 75 ? "strong" : score >= 40 ? "building" : "starting";
  return { score, items, next, level };
}
