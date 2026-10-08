import type {
  ApplicationRouteRecord,
  ApplyRoute,
  DocumentType,
  ProgramIntake,
  ProgramRequirement,
  Scholarship,
  ScholarshipLink,
  University,
  UniversityProgram,
} from "@/data/types";

// Study catalogue demo data (SERVICES/21-study-catalogue.md). Every institution, programme
// and scholarship here is fictional, in the launch countries: Russia first, then Belarus,
// Kazakhstan, Georgia, Armenia and the UAE. Never replace these with copied listings.

const created = "2026-09-01T09:00:00.000Z";
const verified = "2026-09-15T09:00:00.000Z";
const nextCheck = "2027-09-15";

function university(
  input: Omit<University, "status" | "created_at" | "updated_at" | "last_verified_at" | "official_website"> & {
    last_verified_at?: string;
  },
): University {
  return {
    ...input,
    official_website: `https://${input.slug}.example`,
    last_verified_at: input.last_verified_at ?? verified,
    status: "published",
    created_at: created,
    updated_at: created,
  };
}

export const universityFixtures: University[] = [
  university({
    id: "uni-volga-med",
    slug: "volga-federal-medical-university",
    name: "Volga Federal Medical University",
    short_name: "VF",
    country_iso2: "RU",
    city: "Kazan",
    institution_type: "university",
    description:
      "A medical university on the Volga with English-taught general medicine and dentistry, a teaching hospital and a large international student community.",
    founded_year: 1931,
    international_students: 3200,
    is_partner: true,
    verification_state: "verified",
  }),
  university({
    id: "uni-moscow-applied",
    slug: "moscow-institute-of-applied-sciences",
    name: "Moscow Institute of Applied Sciences",
    short_name: "MI",
    country_iso2: "RU",
    city: "Moscow",
    institution_type: "institute",
    description:
      "An engineering and computing institute in Moscow offering English-taught master's degrees, a Russian language preparatory year and research doctorates.",
    founded_year: 1958,
    international_students: 2100,
    is_partner: true,
    verification_state: "verified",
  }),
  university({
    id: "uni-neva-poly",
    slug: "neva-polytechnic-academy",
    name: "Neva Polytechnic Academy",
    short_name: "NP",
    country_iso2: "RU",
    city: "Saint Petersburg",
    institution_type: "university",
    description:
      "A polytechnic in Saint Petersburg known for architecture, energy and data engineering, with short summer schools for international students.",
    founded_year: 1899,
    international_students: 1500,
    is_partner: false,
    verification_state: "checked",
  }),
  university({
    id: "uni-minsk-tech",
    slug: "minsk-state-technical-university",
    name: "Minsk State Technical University",
    short_name: "MS",
    country_iso2: "BY",
    city: "Minsk",
    institution_type: "university",
    description:
      "A technical university in Minsk with affordable bachelor's degrees in engineering and IT, taught in English and Russian.",
    founded_year: 1920,
    international_students: 1800,
    is_partner: false,
    verification_state: "checked",
  }),
  university({
    id: "uni-steppe",
    slug: "steppe-international-university",
    name: "Steppe International University",
    short_name: "SI",
    country_iso2: "KZ",
    city: "Almaty",
    institution_type: "university",
    description:
      "An English-medium university in Almaty offering business, public policy and online postgraduate diplomas for working professionals.",
    founded_year: 1992,
    international_students: 900,
    is_partner: false,
    verification_state: "checked",
  }),
  university({
    id: "uni-tbilisi-med",
    slug: "caucasus-medical-university",
    name: "Caucasus Medical University",
    short_name: "CM",
    country_iso2: "GE",
    city: "Tbilisi",
    institution_type: "university",
    description:
      "A private medical university in Tbilisi with a six-year English-taught MD programme and a foundation year for science preparation.",
    founded_year: 2002,
    international_students: 2600,
    is_partner: false,
    verification_state: "outdated",
    last_verified_at: "2025-08-01T09:00:00.000Z",
  }),
  university({
    id: "uni-ararat",
    slug: "ararat-university-yerevan",
    name: "Ararat University",
    short_name: "AU",
    country_iso2: "AM",
    city: "Yerevan",
    institution_type: "university",
    description: "A university in Yerevan with diplomas in hospitality and tourism and English language courses.",
    founded_year: 1996,
    international_students: 600,
    is_partner: false,
    verification_state: "checked",
  }),
  university({
    id: "uni-gulf-horizons",
    slug: "gulf-horizons-university",
    name: "Gulf Horizons University",
    short_name: "GH",
    country_iso2: "AE",
    city: "Dubai",
    institution_type: "university",
    description:
      "A university in Dubai with blended master's degrees and part-time study for professionals across the Gulf.",
    founded_year: 2008,
    international_students: 4100,
    is_partner: false,
    verification_state: "verified",
  }),
];

type ProgramInput = Omit<
  UniversityProgram,
  | "status"
  | "created_at"
  | "updated_at"
  | "last_verified_at"
  | "next_check_at"
  | "official_url"
  | "attendance"
  | "verification_state"
  | "entrance_exam_required"
  | "english_tests_accepted"
  | "application_fee_amount"
> &
  Partial<
    Pick<
      UniversityProgram,
      | "attendance"
      | "verification_state"
      | "entrance_exam_required"
      | "english_tests_accepted"
      | "application_fee_amount"
    >
  >;

function program(input: ProgramInput): UniversityProgram {
  const uni = universityFixtures.find((u) => u.id === input.university_id)!;
  return {
    attendance: "full_time",
    entrance_exam_required: false,
    english_tests_accepted: ["IELTS", "TOEFL", "Duolingo"],
    application_fee_amount: null,
    ...input,
    verification_state: input.verification_state ?? uni.verification_state,
    official_url: `${uni.official_website}/programmes/${input.slug}`,
    last_verified_at: uni.last_verified_at,
    next_check_at: nextCheck,
    status: "published",
    created_at: created,
    updated_at: created,
  };
}

export const programFixtures: UniversityProgram[] = [
  program({
    id: "prog-volga-medicine",
    university_id: "uni-volga-med",
    slug: "general-medicine-md",
    name: "General Medicine (MD)",
    level: "medicine",
    award: "MD",
    field_slug: "medicine",
    field_name: "Medicine",
    study_mode: "on_campus",
    duration_months: 72,
    language_of_instruction: "English",
    tuition_amount: 5200,
    tuition_currency: "USD",
    tuition_period: "year",
    minimum_qualification: "secondary",
    entrance_exam_required: true,
    description:
      "Six years of English-taught medicine with clinical rotations in the university hospital from year three. Entrance test in biology and chemistry.",
  }),
  program({
    id: "prog-volga-dentistry",
    university_id: "uni-volga-med",
    slug: "dentistry-dds",
    name: "Dentistry",
    level: "medicine",
    award: "DDS",
    field_slug: "dentistry",
    field_name: "Dentistry",
    study_mode: "on_campus",
    duration_months: 60,
    language_of_instruction: "English",
    tuition_amount: 5600,
    tuition_currency: "USD",
    tuition_period: "year",
    minimum_qualification: "secondary",
    entrance_exam_required: true,
    description: "Five-year dentistry degree taught in English, with a simulation clinic from the first year.",
  }),
  program({
    id: "prog-volga-public-health",
    university_id: "uni-volga-med",
    slug: "msc-public-health",
    name: "MSc Public Health",
    level: "masters",
    award: "MSc",
    field_slug: "public-health",
    field_name: "Public health",
    study_mode: "on_campus",
    duration_months: 24,
    language_of_instruction: "English",
    tuition_amount: 4100,
    tuition_currency: "USD",
    tuition_period: "year",
    minimum_qualification: "bachelors",
    description: "Epidemiology, health systems and global health policy, with a field project in the second year.",
  }),
  program({
    id: "prog-moscow-data",
    university_id: "uni-moscow-applied",
    slug: "msc-data-science",
    name: "MSc Data Science",
    level: "masters",
    award: "MSc",
    field_slug: "data-science",
    field_name: "Data science",
    study_mode: "on_campus",
    duration_months: 24,
    language_of_instruction: "English",
    tuition_amount: 4800,
    tuition_currency: "USD",
    tuition_period: "year",
    minimum_qualification: "bachelors",
    application_fee_amount: 50,
    description: "Machine learning, statistics and data engineering, with an industry thesis in the final semester.",
  }),
  program({
    id: "prog-moscow-prep",
    university_id: "uni-moscow-applied",
    slug: "russian-language-preparatory-year",
    name: "Russian Language Preparatory Year",
    level: "language_course",
    award: "Certificate",
    field_slug: "russian-language",
    field_name: "Russian language",
    study_mode: "on_campus",
    duration_months: 10,
    language_of_instruction: "Russian",
    tuition_amount: 3200,
    tuition_currency: "USD",
    tuition_period: "total",
    minimum_qualification: "secondary",
    english_tests_accepted: [],
    description:
      "A year of Russian language with subject vocabulary for engineering, economics or medicine, preparing you for a Russian-taught degree.",
  }),
  program({
    id: "prog-moscow-phd",
    university_id: "uni-moscow-applied",
    slug: "phd-computer-science",
    name: "PhD Computer Science",
    level: "doctorate",
    award: "PhD",
    field_slug: "computer-science",
    field_name: "Computer science",
    study_mode: "on_campus",
    duration_months: 48,
    language_of_instruction: "English",
    tuition_amount: 5000,
    tuition_currency: "USD",
    tuition_period: "year",
    minimum_qualification: "masters",
    entrance_exam_required: true,
    description:
      "Research doctorate in machine learning, systems or theory, with a supervisor agreed before you apply.",
  }),
  program({
    id: "prog-neva-architecture",
    university_id: "uni-neva-poly",
    slug: "bachelor-architecture",
    name: "BArch Architecture",
    level: "bachelors",
    award: "BArch",
    field_slug: "architecture",
    field_name: "Architecture",
    study_mode: "on_campus",
    duration_months: 60,
    language_of_instruction: "Russian",
    tuition_amount: 380000,
    tuition_currency: "RUB",
    tuition_period: "year",
    minimum_qualification: "secondary",
    english_tests_accepted: [],
    entrance_exam_required: true,
    description: "Five-year architecture degree taught in Russian, with a portfolio review at entry.",
  }),
  program({
    id: "prog-neva-summer",
    university_id: "uni-neva-poly",
    slug: "summer-school-smart-cities",
    name: "Summer School: Smart Cities",
    level: "short_course",
    award: "Certificate",
    field_slug: "urban-planning",
    field_name: "Urban planning",
    study_mode: "on_campus",
    duration_months: 1,
    language_of_instruction: "English",
    tuition_amount: 1200,
    tuition_currency: "USD",
    tuition_period: "total",
    minimum_qualification: "secondary",
    description: "Three weeks in Saint Petersburg on urban data, transport and energy, with site visits.",
  }),
  program({
    id: "prog-minsk-se",
    university_id: "uni-minsk-tech",
    slug: "bsc-software-engineering",
    name: "BSc Software Engineering",
    level: "bachelors",
    award: "BSc",
    field_slug: "software-engineering",
    field_name: "Software engineering",
    study_mode: "on_campus",
    duration_months: 48,
    language_of_instruction: "English",
    tuition_amount: 3900,
    tuition_currency: "USD",
    tuition_period: "year",
    minimum_qualification: "secondary",
    description: "Programming, software design and a year-long team project with partner companies.",
  }),
  program({
    id: "prog-minsk-foundation",
    university_id: "uni-minsk-tech",
    slug: "foundation-engineering",
    name: "Foundation Year in Engineering",
    level: "foundation",
    award: "Foundation certificate",
    field_slug: "engineering",
    field_name: "Engineering",
    study_mode: "on_campus",
    duration_months: 9,
    language_of_instruction: "English",
    tuition_amount: 2400,
    tuition_currency: "USD",
    tuition_period: "total",
    minimum_qualification: "secondary",
    english_tests_accepted: [],
    description: "Maths, physics and academic English to prepare you for an engineering bachelor's degree.",
  }),
  program({
    id: "prog-steppe-pgd",
    university_id: "uni-steppe",
    slug: "pgdip-public-policy",
    name: "PGDip Public Policy",
    level: "postgraduate_diploma",
    award: "PGDip",
    field_slug: "public-policy",
    field_name: "Public policy",
    study_mode: "online",
    attendance: "part_time",
    duration_months: 12,
    language_of_instruction: "English",
    tuition_amount: 3000,
    tuition_currency: "USD",
    tuition_period: "total",
    minimum_qualification: "bachelors",
    description: "Policy analysis and evaluation online, part-time, for people working in government and NGOs.",
  }),
  program({
    id: "prog-steppe-mba",
    university_id: "uni-steppe",
    slug: "mba-global-business",
    name: "MBA Global Business",
    level: "masters",
    award: "MBA",
    field_slug: "business",
    field_name: "Business",
    study_mode: "blended",
    duration_months: 18,
    language_of_instruction: "English",
    tuition_amount: 9500,
    tuition_currency: "USD",
    tuition_period: "total",
    minimum_qualification: "bachelors",
    application_fee_amount: 75,
    description: "Blended MBA with online modules and three residential weeks in Almaty.",
  }),
  program({
    id: "prog-tbilisi-md",
    university_id: "uni-tbilisi-med",
    slug: "doctor-of-medicine",
    name: "Doctor of Medicine (MD)",
    level: "medicine",
    award: "MD",
    field_slug: "medicine",
    field_name: "Medicine",
    study_mode: "on_campus",
    duration_months: 72,
    language_of_instruction: "English",
    tuition_amount: 6500,
    tuition_currency: "USD",
    tuition_period: "year",
    minimum_qualification: "secondary",
    entrance_exam_required: true,
    description: "Six-year English-taught MD with clinical training in partner hospitals in Tbilisi.",
  }),
  program({
    id: "prog-tbilisi-foundation",
    university_id: "uni-tbilisi-med",
    slug: "foundation-medical-sciences",
    name: "Foundation Year in Medical Sciences",
    level: "foundation",
    award: "Foundation certificate",
    field_slug: "medicine",
    field_name: "Medicine",
    study_mode: "on_campus",
    duration_months: 9,
    language_of_instruction: "English",
    tuition_amount: 3500,
    tuition_currency: "USD",
    tuition_period: "total",
    minimum_qualification: "secondary",
    english_tests_accepted: [],
    description: "Biology, chemistry and academic English for students who need to strengthen science before medicine.",
  }),
  program({
    id: "prog-ararat-hospitality",
    university_id: "uni-ararat",
    slug: "diploma-hospitality-management",
    name: "Diploma in Hospitality Management",
    level: "diploma",
    award: "Diploma",
    field_slug: "hospitality",
    field_name: "Hospitality",
    study_mode: "on_campus",
    duration_months: 24,
    language_of_instruction: "English",
    tuition_amount: 2800,
    tuition_currency: "USD",
    tuition_period: "year",
    minimum_qualification: "secondary",
    description: "Hotel operations, tourism and a paid placement with partner hotels in Yerevan.",
  }),
  program({
    id: "prog-ararat-english",
    university_id: "uni-ararat",
    slug: "intensive-english",
    name: "Intensive English (Online)",
    level: "language_course",
    award: "Certificate",
    field_slug: "english-language",
    field_name: "English language",
    study_mode: "online",
    attendance: "part_time",
    duration_months: 3,
    language_of_instruction: "English",
    tuition_amount: 450,
    tuition_currency: "USD",
    tuition_period: "total",
    minimum_qualification: "secondary",
    english_tests_accepted: [],
    description: "Twelve weeks of live online English classes towards IELTS 6.5.",
  }),
  program({
    id: "prog-gulf-msc-ai",
    university_id: "uni-gulf-horizons",
    slug: "msc-artificial-intelligence",
    name: "MSc Artificial Intelligence",
    level: "masters",
    award: "MSc",
    field_slug: "data-science",
    field_name: "Data science",
    study_mode: "blended",
    attendance: "part_time",
    duration_months: 24,
    language_of_instruction: "English",
    tuition_amount: 72000,
    tuition_currency: "AED",
    tuition_period: "total",
    minimum_qualification: "bachelors",
    application_fee_amount: 100,
    description: "Part-time blended master's with evening classes in Dubai and online modules.",
  }),
  program({
    id: "prog-gulf-pgcert",
    university_id: "uni-gulf-horizons",
    slug: "pgcert-healthcare-management",
    name: "PGCert Healthcare Management",
    level: "postgraduate_diploma",
    award: "PGCert",
    field_slug: "public-health",
    field_name: "Public health",
    study_mode: "online",
    attendance: "part_time",
    duration_months: 8,
    language_of_instruction: "English",
    tuition_amount: 18000,
    tuition_currency: "AED",
    tuition_period: "total",
    minimum_qualification: "bachelors",
    description: "Online postgraduate certificate in managing hospitals and health services.",
  }),
];

/** Two intakes a year for degrees; short and language courses run more often. */
export const intakeFixtures: ProgramIntake[] = programFixtures.flatMap((p): ProgramIntake[] => {
  const intake = (month: number, year: number, deadline: string, suffix: string): ProgramIntake => ({
    id: `intake-${p.id}-${suffix}`,
    program_id: p.id,
    intake_month: month,
    intake_year: year,
    application_opens_at: null,
    application_deadline: deadline,
  });
  if (p.level === "short_course") return [intake(7, 2027, "2027-04-30", "jul")];
  if (p.level === "language_course")
    return [intake(1, 2027, "2026-12-01", "jan"), intake(9, 2027, "2027-07-15", "sep")];
  if (p.id === "prog-neva-architecture") return [intake(9, 2026, "2026-08-15", "sep")]; // closed for this intake
  if (p.study_mode !== "on_campus") return [intake(2, 2027, "2026-12-20", "feb"), intake(9, 2027, "2027-07-31", "sep")];
  return [intake(9, 2027, "2027-06-30", "sep"), intake(2, 2027, "2026-11-30", "feb")];
});

const DOCS_BY_LEVEL: Record<UniversityProgram["level"], [string, DocumentType][]> = {
  foundation: [
    ["Passport", "passport"],
    ["School certificate", "certificate"],
  ],
  diploma: [
    ["Passport", "passport"],
    ["School certificate and transcript", "transcript"],
  ],
  bachelors: [
    ["Passport", "passport"],
    ["School certificate and transcript", "transcript"],
    ["Motivation letter", "cover_letter"],
  ],
  medicine: [
    ["Passport", "passport"],
    ["School transcript with biology and chemistry", "transcript"],
    ["Medical certificate", "certificate"],
    ["Motivation letter", "cover_letter"],
  ],
  postgraduate_diploma: [
    ["Passport", "passport"],
    ["Degree transcript", "transcript"],
    ["CV", "cv"],
  ],
  masters: [
    ["Passport", "passport"],
    ["Degree transcript", "transcript"],
    ["CV", "cv"],
    ["Statement of purpose", "cover_letter"],
    ["Academic reference", "reference_letter"],
  ],
  doctorate: [
    ["Passport", "passport"],
    ["Master's transcript", "transcript"],
    ["Academic CV", "cv"],
    ["Research proposal", "work_sample"],
    ["Two academic references", "reference_letter"],
  ],
  language_course: [["Passport", "passport"]],
  short_course: [
    ["Passport", "passport"],
    ["CV", "cv"],
  ],
};

export const requirementFixtures: ProgramRequirement[] = programFixtures.flatMap((p) => {
  const docs = DOCS_BY_LEVEL[p.level].map(([label, type], i): ProgramRequirement => ({
    id: `req-${p.id}-${i}`,
    program_id: p.id,
    requirement_type: "document",
    label,
    details: null,
    document_type: type,
    required: true,
    sort_order: i,
  }));
  const extra: ProgramRequirement[] = [];
  if (p.english_tests_accepted.length > 0) {
    extra.push({
      id: `req-${p.id}-english`,
      program_id: p.id,
      requirement_type: "test",
      label: "English test",
      details: `${p.english_tests_accepted.join(", ")} accepted`,
      document_type: "certificate",
      required: p.language_of_instruction === "English",
      sort_order: 50,
    });
  }
  if (p.entrance_exam_required) {
    extra.push({
      id: `req-${p.id}-exam`,
      program_id: p.id,
      requirement_type: "test",
      label: "Entrance exam",
      details: "Taken online or at the university after you apply",
      document_type: null,
      required: true,
      sort_order: 60,
    });
  }
  return [...docs, ...extra];
});

function scholarship(
  input: Omit<Scholarship, "status" | "created_at" | "updated_at" | "last_verified_at" | "official_url">,
): Scholarship {
  return {
    ...input,
    official_url: `https://${input.slug}.example`,
    last_verified_at: verified,
    status: "published",
    created_at: created,
    updated_at: created,
  };
}

export const scholarshipFixtures: Scholarship[] = [
  scholarship({
    id: "sch-russia-gov",
    slug: "russia-international-quota-scholarship",
    name: "International Quota Scholarship (Russia)",
    funder_name: "Ministry of Education (fictional demo)",
    funder_type: "government",
    host_country_iso2: "RU",
    coverage: ["tuition", "stipend", "accommodation"],
    fully_funded: true,
    amount_summary: "Full tuition, dormitory place and a monthly stipend",
    eligible_nationalities: [],
    eligible_levels: ["bachelors", "medicine", "masters", "doctorate", "language_course"],
    application_deadline: "2027-01-15",
    description:
      "A government quota covering tuition at participating Russian universities, a dormitory place and a monthly stipend, including the preparatory language year.",
    verification_state: "verified",
  }),
  scholarship({
    id: "sch-volga-merit",
    slug: "volga-medical-merit-award",
    name: "Volga Medical Merit Scholarship",
    funder_name: "Volga Federal Medical University",
    funder_type: "university",
    host_country_iso2: "RU",
    coverage: ["tuition"],
    fully_funded: false,
    amount_summary: "30% off tuition for the first two years",
    eligible_nationalities: [],
    eligible_levels: ["medicine"],
    application_deadline: "2027-05-31",
    description: "A tuition discount for medicine and dentistry applicants with strong science grades.",
    verification_state: "verified",
  }),
  scholarship({
    id: "sch-moscow-data",
    slug: "applied-sciences-masters-scholarship",
    name: "Applied Sciences Master's Scholarship",
    funder_name: "Moscow Institute of Applied Sciences",
    funder_type: "university",
    host_country_iso2: "RU",
    coverage: ["tuition", "travel"],
    fully_funded: false,
    amount_summary: "50% tuition and a one-off travel grant",
    eligible_nationalities: [],
    eligible_levels: ["masters", "doctorate"],
    application_deadline: "2027-03-31",
    description: "For master's and PhD applicants in computing and engineering with a strong first degree.",
    verification_state: "verified",
  }),
  scholarship({
    id: "sch-africa-stem",
    slug: "africa-stem-futures-scholarship",
    name: "Africa STEM Futures Scholarship",
    funder_name: "Horizon Learning Foundation (fictional demo)",
    funder_type: "foundation",
    host_country_iso2: "BY",
    coverage: ["tuition", "stipend", "travel", "health_insurance"],
    fully_funded: true,
    amount_summary: "Full tuition, flights, health insurance and $300 a month",
    eligible_nationalities: ["NG", "GH", "KE", "UG", "RW", "TZ", "ET", "CM", "ZA", "ZW"],
    eligible_levels: ["foundation", "bachelors"],
    application_deadline: "2026-12-10",
    description:
      "Funds African students on engineering and software degrees in Belarus, including the foundation year.",
    verification_state: "checked",
  }),
  scholarship({
    id: "sch-gulf-women",
    slug: "gulf-women-in-tech-award",
    name: "Women in Technology Scholarship",
    funder_name: "Gulf Horizons University",
    funder_type: "university",
    host_country_iso2: "AE",
    coverage: ["tuition"],
    fully_funded: false,
    amount_summary: "AED 25,000 off tuition",
    eligible_nationalities: [],
    eligible_levels: ["masters"],
    application_deadline: "2027-05-15",
    description: "For women applying to the MSc Artificial Intelligence.",
    verification_state: "verified",
  }),
];

export const scholarshipLinkFixtures: ScholarshipLink[] = [
  {
    id: "sl-1",
    scholarship_id: "sch-russia-gov",
    link_type: "country",
    program_id: null,
    university_id: null,
    country_iso2: "RU",
  },
  {
    id: "sl-2",
    scholarship_id: "sch-volga-merit",
    link_type: "university",
    program_id: null,
    university_id: "uni-volga-med",
    country_iso2: null,
  },
  {
    id: "sl-3",
    scholarship_id: "sch-moscow-data",
    link_type: "program",
    program_id: "prog-moscow-data",
    university_id: null,
    country_iso2: null,
  },
  {
    id: "sl-4",
    scholarship_id: "sch-moscow-data",
    link_type: "program",
    program_id: "prog-moscow-phd",
    university_id: null,
    country_iso2: null,
  },
  {
    id: "sl-5",
    scholarship_id: "sch-africa-stem",
    link_type: "university",
    program_id: null,
    university_id: "uni-minsk-tech",
    country_iso2: null,
  },
  {
    id: "sl-6",
    scholarship_id: "sch-gulf-women",
    link_type: "program",
    program_id: "prog-gulf-msc-ai",
    university_id: null,
    country_iso2: null,
  },
];

/** Partner universities use the partner route; a few programmes and scholarships are hosted on Scholastiar. */
const HOSTED = new Set(["prog-moscow-prep", "prog-neva-summer", "sch-volga-merit", "sch-africa-stem"]);

function routeFor(targetId: string, partner: boolean): ApplyRoute {
  if (HOSTED.has(targetId)) return "hosted";
  return partner ? "partner" : "official";
}

export const applicationRouteFixtures: ApplicationRouteRecord[] = [
  ...programFixtures.map((p): ApplicationRouteRecord => {
    const route = routeFor(p.id, universityFixtures.find((u) => u.id === p.university_id)!.is_partner);
    return {
      id: `route-${p.id}`,
      target_type: "program",
      target_id: p.id,
      route,
      official_apply_url: route === "official" ? `${p.official_url}/apply` : null,
      active: true,
      updated_at: created,
    };
  }),
  ...scholarshipFixtures.map((s): ApplicationRouteRecord => {
    const route = routeFor(s.id, false);
    return {
      id: `route-${s.id}`,
      target_type: "scholarship",
      target_id: s.id,
      route,
      official_apply_url: route === "official" ? `${s.official_url}/apply` : null,
      active: true,
      updated_at: created,
    };
  }),
];
