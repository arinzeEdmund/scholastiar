import type {
  CandidateProfile,
  CandidateSkill,
  CandidateVisaProfile,
  CareerPreferences,
  Certification,
  EducationRecord,
  UserProfile,
  WhatsAppConsent,
  WorkExperience,
} from "@/data/types";
import type {
  AboutInput,
  EducationFormInput,
  ExperienceFormInput,
  PersonalInput,
  PreferencesInput,
  SkillsInput,
  VisaInput,
} from "@/lib/validation/candidate";

// Saved records → form values. Forms work with strings; empty means "not set".

const s = (value: string | number | null | undefined) => (value === null || value === undefined ? "" : String(value));

export function personalDefaults(
  user: UserProfile,
  profile: CandidateProfile,
  consent: WhatsAppConsent | null,
): PersonalInput {
  return {
    fullName: user.full_name,
    preferredName: s(profile.preferred_name),
    dateOfBirth: s(profile.date_of_birth),
    nationality: s(profile.nationality_country_code),
    currentCountry: s(profile.current_country_code ?? user.country_code),
    currentCity: s(profile.current_city),
    phone: s(profile.phone),
    languages: profile.languages.length > 0 ? profile.languages : [{ name: "English", level: "fluent" }],
    communicationStyle: profile.communication_style,
    whatsapp: consent?.phone_e164 ?? "",
    whatsappOptIn: consent?.opted_in ?? false,
  };
}

export function aboutDefaults(profile: CandidateProfile): AboutInput {
  return {
    headline: s(profile.headline),
    summary: s(profile.professional_summary),
    websiteUrl: s(profile.website_url),
    linkedinUrl: s(profile.linkedin_url),
    portfolioUrl: s(profile.portfolio_url),
    profileVisibility: profile.profile_visibility,
  };
}

export function visaDefaults(visa: CandidateVisaProfile, profile: CandidateProfile): VisaInput {
  return {
    passportCountry: s(visa.passport_country_code ?? profile.nationality_country_code),
    // Undefined until chosen, so the tiles start unselected.
    studyStatus: (visa.study_status ?? undefined) as VisaInput["studyStatus"],
    studyCountry: s(visa.study_country_code),
    institution: s(visa.institution_name),
    courseStart: s(visa.course_start_date),
    courseEnd: s(visa.course_end_date),
    currentVisaStatus: s(visa.current_visa_status),
    termTimeHours: s(visa.term_time_weekly_hour_limit),
    holidayWork: visa.holiday_work_allowed === null ? "" : visa.holiday_work_allowed ? "yes" : "no",
    restrictions: s(visa.work_restrictions_notes),
    permitTypeId: s(visa.post_study_permit_type_id),
    permitStatus: visa.post_study_permit_status,
    permitExpiry: s(visa.post_study_permit_expiry_date),
    needsSponsorship: (visa.needs_sponsorship_after_study ?? undefined) as VisaInput["needsSponsorship"],
    targetCountries: visa.target_country_codes,
    countriesLivedIn: visa.countries_lived_in,
    relocation: visa.relocation_willingness ?? "",
  };
}

export function educationDefaults(record?: EducationRecord): EducationFormInput {
  return {
    institution: s(record?.institution_name),
    countryCode: s(record?.country_code),
    degreeLevel: (record?.degree_level ?? undefined) as EducationFormInput["degreeLevel"],
    qualification: s(record?.qualification_name),
    field: s(record?.field_of_study),
    startDate: s(record?.start_date),
    endDate: s(record?.end_date),
    isCurrent: record?.is_current ?? false,
    grade: s(record?.grade),
    description: s(record?.description),
  };
}

export function experienceDefaults(record?: WorkExperience | null): ExperienceFormInput {
  return {
    company: s(record?.company_name),
    title: s(record?.job_title),
    employmentType: record?.employment_type ?? "full_time",
    countryCode: s(record?.country_code),
    city: s(record?.city),
    startDate: s(record?.start_date),
    endDate: s(record?.end_date),
    isCurrent: record?.is_current ?? false,
    industry: s(record?.industry),
    responsibilities: s(record?.responsibilities),
    achievements: record?.achievements.length ? record.achievements : [""],
    tools: record?.tools_used ?? [],
  };
}

export function skillsDefaults(skills: CandidateSkill[], certifications: Certification[]): SkillsInput {
  return {
    skills: skills.map((k) => ({ name: k.skill_name, type: k.skill_type, level: k.proficiency_level })),
    certifications: certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      issueDate: s(c.issue_date),
      url: s(c.credential_url),
    })),
  };
}

export function preferencesDefaults(preferences: CareerPreferences, visa: CandidateVisaProfile): PreferencesInput {
  return {
    goals: preferences.goals,
    targetRoles: preferences.target_roles,
    industries: preferences.industries,
    studentJobTypes: preferences.preferred_student_job_types,
    maxWeeklyHours: s(preferences.max_weekly_hours ?? visa.term_time_weekly_hour_limit),
    payMin: s(preferences.pay_min),
    payCurrency: preferences.pay_currency,
    payPeriod: preferences.pay_period,
    workModes: preferences.work_modes,
    // Start from the visa step's target countries the first time.
    targetCountries: preferences.target_country_codes.length
      ? preferences.target_country_codes
      : visa.target_country_codes,
    earliestStart: s(preferences.earliest_start_date),
  };
}
