import type { CandidateBundle } from "@/data/repositories/candidate";
import type { CvContent, CvEntry, CvFormat, CvSectionKey, CvTone } from "@/data/types";

// Builds a CV only from facts in the candidate's profile (SERVICES/93-ai-cv-generation.md →
// Truthfulness Rules). It chooses, orders and formats; it never invents jobs, degrees, skills,
// achievements, dates or employers. Phase B's AI rewrites wording behind the same shape.

export const CV_FORMATS: Record<CvFormat, { label: string; note: string; order: CvSectionKey[]; personal: boolean }> = {
  academic: {
    label: "Academic CV",
    note: "For university and scholarship applications: education first, then experience.",
    order: ["summary", "education", "experience", "skills", "certifications", "languages"],
    personal: true,
  },
  uk_cv: {
    label: "UK CV",
    note: "Two pages, no photo or date of birth, experience before education.",
    order: ["summary", "experience", "education", "skills", "certifications", "languages"],
    personal: false,
  },
  eu_cv: {
    label: "EU CV",
    note: "Europass-style: nationality and languages up front.",
    order: ["summary", "experience", "education", "languages", "skills", "certifications"],
    personal: true,
  },
  us_resume: {
    label: "US resume",
    note: "One page, results first, no personal details.",
    order: ["summary", "experience", "education", "skills", "certifications", "languages"],
    personal: false,
  },
  africa: {
    label: "African regional",
    note: "Common in Nigeria, Ghana and Kenya: personal details and education early.",
    order: ["summary", "education", "experience", "skills", "certifications", "languages"],
    personal: true,
  },
  visa_employment: {
    label: "Visa-conscious",
    note: "For work abroad: experience first, with your languages and mobility clear.",
    order: ["summary", "experience", "skills", "education", "languages", "certifications"],
    personal: true,
  },
};

export const CV_SECTIONS: Record<CvSectionKey, string> = {
  summary: "Profile",
  education: "Education",
  experience: "Experience",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
};

const STOP = new Set(
  "final semester year years programme program course courses students student including include taught weeks months module modules about above after again against also among and are because been before being below between both but can could does doing down during each from further have having here into itself just more most must other over own same should some such than that their them then there these they this those through under until very were what when where which while will with within would your you our for the of to in on at by an a is as or be it we".split(
    " ",
  ),
);

/** Up to 12 meaningful words from a description, most frequent first. */
export function keywordsFrom(text: string): string[] {
  const counts = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z][a-z+#-]{3,}/g) ?? []) {
    if (STOP.has(raw)) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([word]) => word);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function month(date: string | null, format: CvFormat): string {
  if (!date) return "";
  const [year, m] = date.split("-");
  return format === "eu_cv" ? `${m}/${year}` : `${MONTHS[Number(m) - 1]} ${year}`;
}

function range(start: string | null, end: string | null, current: boolean, format: CvFormat) {
  const from = month(start, format);
  const to = current ? "Present" : month(end, format);
  return [from, to].filter(Boolean).join(" – ");
}

const overlap = (text: string, keywords: string[]) =>
  keywords.reduce((n, k) => n + (text.toLowerCase().includes(k) ? 1 : 0), 0);

export interface BuildOptions {
  name: string;
  email: string;
  nationality: string | null;
  location: string | null;
  format: CvFormat;
  tone: CvTone;
  sections: CvSectionKey[];
  keywords: string[];
  /** Skills the student wants up front. */
  strengths: string[];
  targetLabel: string;
}

export function buildCv(bundle: CandidateBundle, options: BuildOptions): CvContent {
  const { profile } = bundle;
  const { format, keywords } = options;

  const education: CvEntry[] = bundle.education.map((e) => ({
    source_id: e.id,
    title: e.qualification_name,
    organisation: e.institution_name,
    location: null,
    dates: range(e.start_date, e.end_date, e.is_current, format),
    bullets: [e.grade ? `Grade: ${e.grade}` : "", e.description ?? ""].filter(Boolean),
  }));

  const experience: CvEntry[] = bundle.experience.map((x) => {
    const lines = [...x.achievements, ...(x.responsibilities ? [x.responsibilities] : [])].filter(Boolean);
    // Most relevant lines first; nothing is added.
    lines.sort((a, b) => overlap(b, keywords) - overlap(a, keywords));
    return {
      source_id: x.id,
      title: x.job_title,
      organisation: x.company_name,
      location: x.city,
      dates: range(x.start_date, x.end_date, x.is_current, format),
      bullets: lines.slice(0, format === "us_resume" ? 3 : 5),
    };
  });
  // Most relevant role first for experience-led formats; otherwise keep the profile order.
  if (format !== "academic" && format !== "africa") {
    experience.sort(
      (a, b) => overlap(b.bullets.join(" ") + b.title, keywords) - overlap(a.bullets.join(" ") + a.title, keywords),
    );
  }

  const skills = [...bundle.skills]
    .sort((a, b) => {
      const strong = (s: string) => (options.strengths.includes(s) ? 2 : 0) + overlap(s, keywords);
      return strong(b.skill_name) - strong(a.skill_name);
    })
    .map((s) => s.skill_name);

  const latestEducation = bundle.education[0];
  const latestRole = bundle.experience[0];
  const facts = [
    latestEducation &&
      `${latestEducation.is_current ? "Studying" : "Holds"} ${latestEducation.qualification_name} at ${latestEducation.institution_name}`,
    latestRole && `experience as ${latestRole.job_title} at ${latestRole.company_name}`,
  ].filter(Boolean);
  const composed = facts.length ? `${facts.join(", with ")}.` : "";
  const base = profile.professional_summary?.trim() || composed;
  const aim =
    options.targetLabel && options.targetLabel !== "General CV" ? ` Applying for ${options.targetLabel}.` : "";
  const summary =
    options.tone === "concise"
      ? `${base.split(". ")[0].replace(/\.$/, "")}.${aim}`
      : options.tone === "formal"
        ? `${base}${aim}`
        : `${base}${aim ? ` Excited to bring this to ${options.targetLabel}.` : ""}`;

  return {
    header: {
      name: options.name,
      headline: profile.headline,
      email: options.email,
      phone: profile.phone,
      location: options.location,
      nationality: CV_FORMATS[format].personal ? options.nationality : null,
      links: [profile.linkedin_url, profile.portfolio_url, profile.website_url].filter((l): l is string => !!l),
    },
    summary: summary.trim(),
    education,
    experience,
    skills,
    certifications: bundle.certifications.map((c) => `${c.name} — ${c.issuer}`),
    languages: profile.languages.map((l) => `${l.name} (${l.level})`),
    section_order: CV_FORMATS[format].order,
    hidden_sections: CV_FORMATS[format].order.filter((s) => !options.sections.includes(s)),
  };
}

/** All CV text in reading order, for checks. */
export function cvText(content: CvContent): string {
  return [
    content.summary,
    ...content.education.flatMap((e) => [e.title, e.organisation, ...e.bullets]),
    ...content.experience.flatMap((e) => [e.title, e.organisation, ...e.bullets]),
    ...content.skills,
    ...content.certifications,
    ...content.languages,
  ].join(" ");
}

export function keywordCoverage(content: CvContent, keywords: string[]) {
  const text = cvText(content).toLowerCase();
  return {
    found: keywords.filter((k) => text.includes(k)),
    missing: keywords.filter((k) => !text.includes(k)),
  };
}

/** Every fact-bearing line of the profile, for checking CV numbers against. */
export function profileSourceText(bundle: CandidateBundle): string {
  return [
    bundle.profile.professional_summary ?? "",
    ...bundle.experience.flatMap((x) => [
      ...x.achievements,
      x.responsibilities ?? "",
      x.start_date ?? "",
      x.end_date ?? "",
    ]),
    ...bundle.education.flatMap((e) => [e.grade ?? "", e.description ?? "", e.start_date ?? "", e.end_date ?? ""]),
  ].join(" ");
}

/**
 * Numbers in the CV that don't appear anywhere in the profile — usually typos or claims
 * the student should double-check. Shown as factual warnings, never auto-removed.
 */
export function numbersNotIn(content: CvContent, source: string): { where: string; value: string }[] {
  const warnings: { where: string; value: string }[] = [];
  const check = (where: string, text: string) => {
    for (const value of text.match(/\d[\d,.]*%?/g) ?? []) {
      if (!source.includes(value.replace(/[.,]$/, ""))) warnings.push({ where, value });
    }
  };
  check("Profile summary", content.summary);
  content.experience.forEach((e) => e.bullets.forEach((b) => check(`${e.title}, ${e.organisation}`, b)));
  content.education.forEach((e) => e.bullets.forEach((b) => check(`${e.title}`, b)));
  return warnings;
}

export function unverifiedNumbers(content: CvContent, bundle: CandidateBundle) {
  return numbersNotIn(content, profileSourceText(bundle));
}
