import type { PersonalityCvProfile, PersonalityCvVideo, PersonalityCvView } from "@/data/types";

export type NewPersonalityVideo = Omit<PersonalityCvVideo, "id" | "user_id" | "created_at" | "moderation_status">;

export interface PersonalityBundle {
  profile: PersonalityCvProfile;
  video: PersonalityCvVideo | null;
  views: PersonalityCvView[];
}

/** PersonalityAI CV profile, current video and who has watched it. */
export interface PersonalityRepository {
  get(userId: string): Promise<PersonalityBundle>;
  /** Saves a new video and makes it the current one. */
  saveVideo(userId: string, input: NewPersonalityVideo): Promise<PersonalityCvVideo>;
  updateSettings(
    userId: string,
    update: Pick<PersonalityCvProfile, "visibility" | "attach_by_default" | "share_transcript">,
  ): Promise<PersonalityCvProfile>;
  removeVideo(userId: string): Promise<void>;
}
