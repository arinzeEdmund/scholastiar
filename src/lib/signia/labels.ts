import type {
  SigniaMediaType,
  SigniaProfile,
  SigniaProjectType,
  SigniaSectionKey,
  SigniaVisibility,
  SocialPlatform,
} from "@/data/types";

export const SECTION_LABELS: Record<SigniaSectionKey, string> = {
  personality_cv: "Video introduction",
  overview: "About me",
  current_work: "What I'm working on",
  projects: "Projects",
  media: "Media and documents",
  social_links: "Links",
};

export const PROJECT_TYPES: Record<SigniaProjectType, string> = {
  project: "Project",
  research: "Research",
  startup: "Startup",
  open_source: "Open source",
  case_study: "Case study",
  writing: "Writing",
  volunteering: "Volunteering",
  other: "Other",
};

export const MEDIA_TYPES: Record<SigniaMediaType, string> = {
  video: "Video",
  image: "Image",
  document: "Document",
  deck: "Slides",
  certificate: "Certificate",
  other: "Other",
};

export const VISIBILITY_LABELS: Record<SigniaVisibility, { label: string; note: string }> = {
  public: { label: "Public", note: "On your public page" },
  application_only: { label: "Applications only", note: "Only reviewers of your applications" },
  private: { label: "Only me", note: "Hidden from everyone else" },
};

export const PLATFORMS: Record<SocialPlatform, { label: string; host?: string }> = {
  linkedin: { label: "LinkedIn", host: "linkedin.com" },
  github: { label: "GitHub", host: "github" },
  x: { label: "X (Twitter)", host: "x.com" },
  instagram: { label: "Instagram", host: "instagram.com" },
  youtube: { label: "YouTube", host: "youtube.com" },
  tiktok: { label: "TikTok", host: "tiktok.com" },
  behance: { label: "Behance", host: "behance.net" },
  medium: { label: "Medium", host: "medium.com" },
  researchgate: { label: "ResearchGate", host: "researchgate.net" },
  orcid: { label: "ORCID", host: "orcid.org" },
  google_scholar: { label: "Google Scholar", host: "scholar.google" },
  website: { label: "Personal website" },
  other: { label: "Other" },
};

export function mediaTypeFor(mime: string): SigniaMediaType {
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";
  if (mime.includes("presentation") || mime.includes("powerpoint")) return "deck";
  if (mime === "application/pdf" || mime.includes("word") || mime.startsWith("text/")) return "document";
  return "other";
}

/** Section order for a new portfolio: the video introduction and About first, then proof. */
export const DEFAULT_SIGNIA_SECTIONS: SigniaProfile["sections"] = [
  { key: "personality_cv", visible: true },
  { key: "overview", visible: true },
  { key: "projects", visible: true },
  { key: "current_work", visible: true },
  { key: "media", visible: true },
  { key: "social_links", visible: true },
];
