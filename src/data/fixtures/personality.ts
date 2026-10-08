import { PERSONALITY_PROMPTS } from "@/config/personality";
import type { PersonalityCvProfile, PersonalityCvVideo, PersonalityCvView } from "@/data/types";

// Kwame has published a PersonalityAI CV that admissions teams have watched; Amara hasn't recorded one yet.

export const personalityProfileFixtures: PersonalityCvProfile[] = [
  {
    user_id: "user-kwame",
    status: "published",
    visibility: "applications",
    attach_by_default: true,
    share_transcript: false,
    current_video_id: "pvideo-kwame-1",
    updated_at: "2026-09-28T12:00:00.000Z",
  },
];

export const personalityVideoFixtures: PersonalityCvVideo[] = [
  {
    id: "pvideo-kwame-1",
    user_id: "user-kwame",
    prompts: [PERSONALITY_PROMPTS[0], PERSONALITY_PROMPTS[2], PERSONALITY_PROMPTS[4]],
    // Vimeo's public sample video stands in for Kwame's own recording in the demo.
    video_url: "https://vimeo.com/76979871",
    provider_label: "Vimeo",
    moderation_status: "approved",
    created_at: "2026-09-28T12:00:00.000Z",
  },
];

export const personalityViewFixtures: PersonalityCvView[] = [
  {
    id: "pview-1",
    owner_user_id: "user-kwame",
    viewer_label: "Admissions, Moscow Institute of Applied Sciences",
    viewer_type: "university",
    viewed_at: "2026-10-05T09:12:00.000Z",
  },
  {
    id: "pview-2",
    owner_user_id: "user-kwame",
    viewer_label: "Selection panel, Applied Sciences Master's Scholarship",
    viewer_type: "scholarship",
    viewed_at: "2026-10-03T14:40:00.000Z",
  },
  {
    id: "pview-3",
    owner_user_id: "user-kwame",
    viewer_label: "Admissions, Gulf Horizons University",
    viewer_type: "university",
    viewed_at: "2026-09-30T16:05:00.000Z",
  },
];
