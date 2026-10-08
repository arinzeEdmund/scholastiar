// PersonalityAI CV — DATABASE/db.md → PersonalityAI CV Tables, SERVICES/96-personality-ai-cv.md.

export type PersonalityVisibility = "applications" | "signia" | "hidden";

/** personality_cv_profiles */
export interface PersonalityCvProfile {
  user_id: string;
  status: "not_started" | "published";
  /** applications: only reviewers of applications it's attached to. signia: also on the public Signia page. */
  visibility: PersonalityVisibility;
  attach_by_default: boolean;
  share_transcript: boolean;
  current_video_id: string | null;
  updated_at: string;
}

/** personality_cv_videos (Phase A keeps metadata only; the file goes to storage in Phase B). */
export interface PersonalityCvVideo {
  id: string;
  user_id: string;
  prompts: string[];
  duration_seconds: number;
  size_bytes: number;
  mime_type: string;
  source: "recorded" | "uploaded";
  file_name: string;
  moderation_status: "approved" | "pending";
  created_at: string;
}

/** personality_cv_views — who watched, from which application. */
export interface PersonalityCvView {
  id: string;
  owner_user_id: string;
  viewer_label: string;
  viewer_type: "university" | "scholarship" | "employer";
  viewed_at: string;
}
