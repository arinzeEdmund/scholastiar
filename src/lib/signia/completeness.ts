import type { SigniaBundle } from "@/data/repositories/signia";

export interface CompletenessStep {
  key: string;
  label: string;
  done: boolean;
  weight: number;
  href: string;
}

/** How complete a Signia portfolio is (0–100) and the steps that would raise it. */
export function signiaCompleteness(bundle: SigniaBundle, hasPersonalityVideo: boolean) {
  const { profile, projects, media, links } = bundle;
  const steps: CompletenessStep[] = [
    {
      key: "basics",
      label: "Choose your handle and headline",
      done: Boolean(profile?.handle && profile.headline),
      weight: 10,
      href: "/signia/builder",
    },
    {
      key: "summary",
      label: "Write a short About me",
      done: (profile?.summary.trim().length ?? 0) >= 80,
      weight: 15,
      href: "/signia/builder",
    },
    {
      key: "project",
      label: "Add your first project",
      done: projects.length >= 1,
      weight: 25,
      href: "/signia/projects/new",
    },
    {
      key: "proof",
      label: "Show a result and a link on a project",
      done: projects.some((p) => p.outcome.trim() && p.links.length > 0),
      weight: 15,
      href: projects[0] ? `/signia/projects/${projects[0].id}` : "/signia/projects/new",
    },
    {
      key: "media",
      label: "Upload a document, image or video",
      done: media.length >= 1,
      weight: 10,
      href: "/signia/media",
    },
    {
      key: "links",
      label: "Add two professional links",
      done: links.length >= 2,
      weight: 10,
      href: "/signia/social-links",
    },
    {
      key: "video",
      label: "Add your PersonalityAI CV video",
      done: hasPersonalityVideo,
      weight: 15,
      href: "/personality-cv/record",
    },
  ];
  const score = steps.reduce((sum, s) => sum + (s.done ? s.weight : 0), 0);
  return { score, steps, next: steps.filter((s) => !s.done) };
}
