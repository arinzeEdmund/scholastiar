// Signia — DATABASE/db.md → Signia Tables, SERVICES/107-signia.md. A student's proof-of-work
// portfolio: projects, media and links behind their CV, shared on a public page they control.

export type SigniaVisibility = "public" | "application_only" | "private";

export type SigniaSectionKey = "personality_cv" | "overview" | "current_work" | "projects" | "media" | "social_links";

export interface SigniaSectionSetting {
  key: SigniaSectionKey;
  visible: boolean;
}

/** signia_profiles (+ visibility settings) */
export interface SigniaProfile {
  user_id: string;
  handle: string;
  headline: string;
  summary: string;
  current_work_summary: string;
  public_status: "draft" | "published" | "unpublished";
  /** public: anyone with the link. application_only: reviewers of applications only. */
  discoverability: "public" | "application_only";
  sections: SigniaSectionSetting[];
  published_at: string | null;
  updated_at: string;
}

export type SigniaProjectType =
  "project" | "research" | "startup" | "open_source" | "case_study" | "writing" | "volunteering" | "other";

export interface SigniaProjectLink {
  id: string;
  link_type: "github" | "demo" | "paper" | "video" | "article" | "dataset" | "other";
  label: string;
  url: string;
}

/** signia_projects (+ links) */
export interface SigniaProject {
  id: string;
  user_id: string;
  title: string;
  summary: string;
  role_description: string;
  problem_statement: string;
  approach: string;
  outcome: string;
  status: "in_progress" | "completed";
  project_type: SigniaProjectType;
  skills: string[];
  links: SigniaProjectLink[];
  visibility: SigniaVisibility;
  start_date: string | null;
  end_date: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type SigniaMediaType = "video" | "image" | "document" | "deck" | "certificate" | "other";

/** signia_media_items — added by link only (decided 2026-10-08); video links play through an embed. */
export interface SigniaMediaItem {
  id: string;
  user_id: string;
  project_id: string | null;
  media_type: SigniaMediaType;
  title: string;
  description: string;
  url: string;
  /** Where it lives, e.g. "YouTube" or "drive.google.com". */
  host_label: string;
  thumbnail_url: string | null;
  visibility: SigniaVisibility;
  created_at: string;
}

export type SocialPlatform =
  | "linkedin"
  | "github"
  | "x"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "behance"
  | "medium"
  | "researchgate"
  | "orcid"
  | "google_scholar"
  | "website"
  | "other";

/** signia_social_links */
export interface SigniaSocialLink {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  visibility: SigniaVisibility;
  order_index: number;
}
