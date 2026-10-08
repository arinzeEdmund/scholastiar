import "server-only";

import type { MockDb } from "@/data/fixtures";
import type { PersonalityRepository } from "@/data/repositories/personality";
import type { PersonalityCvProfile, PersonalityCvVideo } from "@/data/types";

import { now, readOne, write } from "./store";

function emptyProfile(userId: string): PersonalityCvProfile {
  return {
    user_id: userId,
    status: "not_started",
    visibility: "applications",
    attach_by_default: true,
    share_transcript: false,
    current_video_id: null,
    updated_at: now(),
  };
}

function profileIn(db: MockDb, userId: string) {
  let profile = db.personality_cv_profiles.find((p) => p.user_id === userId);
  if (!profile) {
    profile = emptyProfile(userId);
    db.personality_cv_profiles.push(profile);
  }
  return profile;
}

export const mockPersonalityRepository: PersonalityRepository = {
  get: (userId) =>
    readOne((db) => {
      const profile = db.personality_cv_profiles.find((p) => p.user_id === userId) ?? emptyProfile(userId);
      return {
        profile,
        video: db.personality_cv_videos.find((v) => v.id === profile.current_video_id) ?? null,
        views: db.personality_cv_views
          .filter((v) => v.owner_user_id === userId)
          .sort((a, b) => b.viewed_at.localeCompare(a.viewed_at)),
      };
    }),

  saveVideo: (userId, input) =>
    write((db) => {
      const video: PersonalityCvVideo = {
        ...input,
        id: `pvideo-${crypto.randomUUID()}`,
        user_id: userId,
        moderation_status: "approved",
        created_at: now(),
      };
      db.personality_cv_videos.push(video);
      const profile = profileIn(db, userId);
      profile.current_video_id = video.id;
      profile.status = "published";
      profile.updated_at = now();
      return video;
    }),

  updateSettings: (userId, update) =>
    write((db) => {
      const profile = profileIn(db, userId);
      Object.assign(profile, update, { updated_at: now() });
      return profile;
    }),

  removeVideo: (userId) =>
    write((db) => {
      const profile = profileIn(db, userId);
      profile.current_video_id = null;
      profile.status = "not_started";
      profile.updated_at = now();
    }),
};
