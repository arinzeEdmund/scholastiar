import type {
  CandidateDocument,
  CandidateProfile,
  CandidateSkill,
  CandidateVisaProfile,
  CareerPreferences,
  Certification,
  EducationRecord,
  NotificationPreference,
  OnboardingSession,
  PostStudyPermitType,
  WorkExperience,
} from "@/data/types";

// Candidate demo data (STRUCTURE/BUILD_GUIDE/SEED_DATA.md → Candidates): one complete profile
// (Amara, incoming student) and one part-way through onboarding (Kwame, graduate on a
// post-study permit). Fictional people and institutions only.

const at = "2026-09-02T10:00:00.000Z";

/** Reference list for the visa step. Official sources must be reviewed before launch. */
export const postStudyPermitTypeFixtures: PostStudyPermitType[] = [
  {
    id: "psp-gb-graduate",
    country_code: "GB",
    name: "Graduate route",
    official_url: "https://www.gov.uk/graduate-visa",
    reviewed_at: "2026-09-01",
  },
  {
    id: "psp-ca-pgwp",
    country_code: "CA",
    name: "Post-Graduation Work Permit (PGWP)",
    official_url:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html",
    reviewed_at: "2026-09-01",
  },
  {
    id: "psp-au-485",
    country_code: "AU",
    name: "Temporary Graduate visa (subclass 485)",
    official_url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485",
    reviewed_at: "2026-09-01",
  },
  {
    id: "psp-ie-1g",
    country_code: "IE",
    name: "Stamp 1G (Third Level Graduate Programme)",
    official_url: null,
    reviewed_at: "2026-09-01",
  },
  {
    id: "psp-de-jobseeker",
    country_code: "DE",
    name: "Residence permit to look for work after graduating",
    official_url: null,
    reviewed_at: "2026-09-01",
  },
  {
    id: "psp-nl-orientation",
    country_code: "NL",
    name: "Orientation year (zoekjaar)",
    official_url: null,
    reviewed_at: "2026-09-01",
  },
];

function candidate(userId: string, p: Partial<CandidateProfile>): CandidateProfile {
  return {
    id: `cand-${userId}`,
    user_id: userId,
    preferred_name: null,
    headline: null,
    professional_summary: null,
    date_of_birth: null,
    nationality_country_code: null,
    current_country_code: null,
    current_city: null,
    phone: null,
    languages: [],
    communication_style: "concise",
    profile_visibility: "employers",
    website_url: null,
    linkedin_url: null,
    portfolio_url: null,
    created_at: at,
    updated_at: at,
    ...p,
  };
}

export const candidateProfileFixtures: CandidateProfile[] = [
  candidate("user-amara", {
    preferred_name: "Amara",
    headline: "MSc Global Public Health student in London · Research and data",
    professional_summary:
      "Microbiology graduate with two years in community health research. I clean and analyse survey data, write clear reports for programme teams, and enjoy turning messy field data into decisions. Now studying an MSc in Global Public Health in London and looking for part-time research or data roles alongside my studies.",
    date_of_birth: "2000-04-14",
    nationality_country_code: "NG",
    current_country_code: "GB",
    current_city: "London",
    phone: "+234 801 555 0142",
    languages: [
      { name: "English", level: "fluent" },
      { name: "Yoruba", level: "native" },
      { name: "French", level: "basic" },
    ],
    communication_style: "warm",
    linkedin_url: "https://www.linkedin.com/in/amara-okafor-demo",
  }),
  candidate("user-kwame", {
    preferred_name: "Kwame",
    headline: "MSc Data Science graduate · Graduate route",
    date_of_birth: "1998-11-02",
    nationality_country_code: "GH",
    current_country_code: "GB",
    current_city: "Manchester",
    phone: "+44 7700 900461",
    languages: [
      { name: "English", level: "fluent" },
      { name: "Twi", level: "native" },
    ],
  }),
];

export const onboardingSessionFixtures: OnboardingSession[] = [
  {
    id: "onb-user-amara",
    user_id: "user-amara",
    current_step: "review",
    completed_steps: [
      "personal",
      "visa",
      "education",
      "experience",
      "skills",
      "preferences",
      "personality-cv",
      "review",
    ],
    completed_at: at,
    created_at: at,
    updated_at: at,
  },
  {
    id: "onb-user-kwame",
    user_id: "user-kwame",
    current_step: "education",
    completed_steps: ["personal", "visa"],
    completed_at: null,
    created_at: at,
    updated_at: at,
  },
];

export const visaProfileFixtures: CandidateVisaProfile[] = [
  {
    id: "visa-user-amara",
    user_id: "user-amara",
    passport_country_code: "NG",
    study_status: "studying",
    study_country_code: "GB",
    institution_name: "Kingsbridge University",
    course_start_date: "2026-09-21",
    course_end_date: "2027-09-30",
    current_visa_status: "Student visa",
    term_time_weekly_hour_limit: 20,
    holiday_work_allowed: true,
    work_restrictions_notes: "No self-employment. Full-time work allowed only during official vacations.",
    post_study_permit_type_id: "psp-gb-graduate",
    post_study_permit_status: "planning",
    post_study_permit_expiry_date: null,
    needs_sponsorship_after_study: "yes",
    countries_lived_in: ["NG", "GH"],
    target_country_codes: ["GB", "IE", "CA"],
    relocation_willingness: "yes",
    updated_at: at,
  },
  {
    id: "visa-user-kwame",
    user_id: "user-kwame",
    passport_country_code: "GH",
    study_status: "graduated",
    study_country_code: "GB",
    institution_name: "Northgate University",
    course_start_date: "2024-09-23",
    course_end_date: "2025-09-30",
    current_visa_status: "Graduate route",
    term_time_weekly_hour_limit: null,
    holiday_work_allowed: null,
    work_restrictions_notes: null,
    post_study_permit_type_id: "psp-gb-graduate",
    post_study_permit_status: "holding",
    post_study_permit_expiry_date: "2027-11-30",
    needs_sponsorship_after_study: "yes",
    countries_lived_in: ["GH", "GB"],
    target_country_codes: ["GB"],
    relocation_willingness: "maybe",
    updated_at: at,
  },
];

export const educationFixtures: EducationRecord[] = [
  {
    id: "edu-amara-msc",
    user_id: "user-amara",
    institution_name: "Kingsbridge University",
    country_code: "GB",
    degree_level: "masters",
    qualification_name: "MSc Global Public Health",
    field_of_study: "Public health",
    start_date: "2026-09",
    end_date: "2027-09",
    is_current: true,
    grade: null,
    description: "Modules include epidemiology, health systems and data for decision-making.",
    sort_order: 0,
  },
  {
    id: "edu-amara-bsc",
    user_id: "user-amara",
    institution_name: "Eko City University",
    country_code: "NG",
    degree_level: "bachelors",
    qualification_name: "BSc Microbiology",
    field_of_study: "Microbiology",
    start_date: "2017-10",
    end_date: "2022-07",
    is_current: false,
    grade: "Second Class Upper (2:1)",
    description: "Final-year project on antibiotic resistance patterns in community clinics.",
    sort_order: 1,
  },
];

export const workExperienceFixtures: WorkExperience[] = [
  {
    id: "exp-amara-brightpath",
    user_id: "user-amara",
    company_name: "Brightpath Health Initiative",
    job_title: "Research and Data Assistant",
    country_code: "NG",
    city: "Lagos",
    employment_type: "full_time",
    start_date: "2023-02",
    end_date: "2026-08",
    is_current: false,
    responsibilities:
      "Supported community health surveys across 12 clinics: designed data collection forms, cleaned survey data and produced monthly reports for programme managers.",
    achievements: [
      "Cut monthly report preparation from 5 days to 2 by building reusable cleaning scripts",
      "Trained 14 field officers on digital data collection, reducing form errors by 40%",
    ],
    tools_used: ["Excel", "SPSS", "KoboToolbox", "Python"],
    industry: "Public health",
    sort_order: 0,
  },
  {
    id: "exp-amara-nysc",
    user_id: "user-amara",
    company_name: "Lagoon Community Clinic",
    job_title: "Laboratory Intern (National Service)",
    country_code: "NG",
    city: "Lagos",
    employment_type: "placement",
    start_date: "2022-08",
    end_date: "2023-01",
    is_current: false,
    responsibilities: "Prepared samples and recorded results for routine microbiology tests.",
    achievements: ["Reorganised the sample log, halving the time to trace results"],
    tools_used: ["Lab information system"],
    industry: "Healthcare",
    sort_order: 1,
  },
];

let skillIndex = 0;
function skill(
  userId: string,
  name: string,
  type: CandidateSkill["skill_type"],
  level: CandidateSkill["proficiency_level"],
  years: number | null,
): CandidateSkill {
  skillIndex += 1;
  return {
    id: `skill-${skillIndex}`,
    user_id: userId,
    skill_name: name,
    skill_type: type,
    proficiency_level: level,
    years_experience: years,
    source: "onboarding",
  };
}

export const skillFixtures: CandidateSkill[] = [
  skill("user-amara", "Data cleaning", "technical", "advanced", 3),
  skill("user-amara", "Survey design", "domain", "advanced", 3),
  skill("user-amara", "Statistical analysis", "technical", "intermediate", 2),
  skill("user-amara", "Python", "tool", "beginner", 1),
  skill("user-amara", "SPSS", "tool", "advanced", 3),
  skill("user-amara", "Report writing", "soft", "advanced", 3),
  skill("user-amara", "Training and facilitation", "soft", "intermediate", 2),
];

export const certificationFixtures: Certification[] = [
  {
    id: "cert-amara-1",
    user_id: "user-amara",
    name: "Introduction to Epidemiology",
    issuer: "Open Health Academy",
    issue_date: "2024-05",
    expiry_date: null,
    credential_url: null,
  },
];

export const careerPreferenceFixtures: CareerPreferences[] = [
  {
    id: "pref-user-amara",
    user_id: "user-amara",
    goals: ["study", "funding", "student_jobs", "post_study_jobs"],
    target_roles: ["Research assistant", "Data assistant", "Public health analyst"],
    industries: ["Healthcare", "Public health", "Non-profit", "Research"],
    job_tracks: ["student", "post_study"],
    preferred_student_job_types: ["part_time", "campus"],
    max_weekly_hours: 20,
    pay_min: 12,
    pay_currency: "GBP",
    pay_period: "hour",
    work_modes: ["on_site", "hybrid"],
    target_country_codes: ["GB", "IE", "CA"],
    earliest_start_date: "2026-10",
    updated_at: at,
  },
];

export const documentFixtures: CandidateDocument[] = [
  {
    id: "doc-amara-cv",
    owner_user_id: "user-amara",
    file_name: "Amara-Okafor-CV.pdf",
    mime_type: "application/pdf",
    size_bytes: 184_320,
    document_type: "cv",
    visibility: "applications",
    tags: ["research", "2026"],
    mock_data_url: null,
    created_at: at,
    updated_at: at,
  },
  {
    id: "doc-amara-transcript",
    owner_user_id: "user-amara",
    file_name: "BSc-Transcript.pdf",
    mime_type: "application/pdf",
    size_bytes: 412_000,
    document_type: "transcript",
    visibility: "private",
    tags: [],
    mock_data_url: null,
    created_at: at,
    updated_at: at,
  },
];

/**
 * Defaults for any user without saved preferences: email, WhatsApp and in-app on for everything
 * (WhatsApp only reaches users who opted in), push off, product news never by WhatsApp or email.
 */
export function defaultNotificationPreferences(userId: string): NotificationPreference[] {
  const categories = [
    "deadlines",
    "application_updates",
    "messages",
    "new_matches",
    "profile_activity",
    "account_security",
    "billing",
    "product_news",
  ] as const;
  const channels = ["email", "whatsapp", "in_app", "push"] as const;
  return categories.flatMap((category) =>
    channels.map((channel) => ({
      id: `np-${userId}-${category}-${channel}`,
      user_id: userId,
      channel,
      notification_type: category,
      enabled: channel !== "push" && !(category === "product_news" && channel !== "in_app"),
    })),
  );
}
