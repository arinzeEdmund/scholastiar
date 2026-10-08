// AI CV — DATABASE/db.md → AI CV Tables, SERVICES/93-ai-cv-generation.md.
// Content is structured so every line can be traced back to the candidate's profile.

/** Regional formats (SERVICES/93-ai-cv-generation.md → Regional Format Selection) plus an academic CV for study applications. */
export type CvFormat = "academic" | "uk_cv" | "eu_cv" | "us_resume" | "africa" | "visa_employment";

export type CvTone = "concise" | "warm" | "formal";

export type CvTargetType = "program" | "scholarship" | "pasted" | "general";

export type CvSectionKey = "summary" | "education" | "experience" | "skills" | "certifications" | "languages";

export interface CvEntry {
  /** The profile record this entry came from (education or experience id). */
  source_id: string;
  title: string;
  organisation: string;
  location: string | null;
  dates: string;
  bullets: string[];
}

export interface CvContent {
  header: {
    name: string;
    headline: string | null;
    email: string;
    phone: string | null;
    location: string | null;
    /** EU and African formats commonly show these; others leave them out. */
    nationality: string | null;
    links: string[];
  };
  summary: string;
  education: CvEntry[];
  experience: CvEntry[];
  skills: string[];
  certifications: string[];
  languages: string[];
  section_order: CvSectionKey[];
  hidden_sections: CvSectionKey[];
}

/** cv_versions */
export interface CvVersion {
  id: string;
  user_id: string;
  title: string;
  format: CvFormat;
  tone: CvTone;
  target_type: CvTargetType;
  /** Programme or scholarship id when the CV targets a catalogue listing. */
  target_id: string | null;
  target_label: string;
  /** Keywords taken from the target, used for the keyword check. */
  target_keywords: string[];
  content: CvContent;
  source: "generated" | "duplicated";
  /** Bumped on every manual edit. */
  edited_at: string | null;
  created_at: string;
  updated_at: string;
}
