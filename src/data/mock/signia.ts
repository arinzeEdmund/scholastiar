import "server-only";

import type { MockDb } from "@/data/fixtures";
import type { SigniaBundle, SigniaRepository } from "@/data/repositories/signia";
import type { SigniaMediaItem, SigniaProject } from "@/data/types";

import { now, readOne, readSystem, write } from "./store";

function bundleOf(db: MockDb, userId: string): SigniaBundle {
  return {
    profile: db.signia_profiles.find((p) => p.user_id === userId) ?? null,
    projects: db.signia_projects.filter((p) => p.user_id === userId).sort((a, b) => a.order_index - b.order_index),
    media: db.signia_media.filter((m) => m.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at)),
    links: db.signia_social_links.filter((l) => l.user_id === userId).sort((a, b) => a.order_index - b.order_index),
  };
}

export const mockSigniaRepository: SigniaRepository = {
  get: (userId) => readOne((db) => bundleOf(db, userId)),

  getByHandle: (handle) =>
    readOne((db) => {
      const profile = db.signia_profiles.find((p) => p.handle === handle.toLowerCase());
      return profile ? { ...bundleOf(db, profile.user_id), userId: profile.user_id } : null;
    }),

  isHandleTaken: (handle, exceptUserId) =>
    readSystem((db) => db.signia_profiles.some((p) => p.handle === handle && p.user_id !== exceptUserId)),

  saveProfile: (userId, input) =>
    write((db) => {
      let profile = db.signia_profiles.find((p) => p.user_id === userId);
      const publishing = input.public_status === "published" && profile?.public_status !== "published";
      if (!profile) {
        profile = { ...input, user_id: userId, published_at: null, updated_at: now() };
        db.signia_profiles.push(profile);
      } else {
        Object.assign(profile, input, { updated_at: now() });
      }
      if (publishing) profile.published_at = now();
      return profile;
    }),

  saveProject: (userId, id, input) =>
    write((db) => {
      if (id) {
        const project = db.signia_projects.find((p) => p.id === id && p.user_id === userId);
        if (!project) return null;
        Object.assign(project, input, { updated_at: now() });
        return project;
      }
      const project: SigniaProject = {
        ...input,
        id: `sproj-${crypto.randomUUID()}`,
        user_id: userId,
        order_index: db.signia_projects.filter((p) => p.user_id === userId).length,
        created_at: now(),
        updated_at: now(),
      };
      db.signia_projects.push(project);
      return project;
    }),

  deleteProject: (userId, id) =>
    write((db) => {
      const before = db.signia_projects.length;
      db.signia_projects = db.signia_projects.filter((p) => !(p.id === id && p.user_id === userId));
      db.signia_media.forEach((m) => {
        if (m.project_id === id && m.user_id === userId) m.project_id = null;
      });
      return db.signia_projects.length < before;
    }),

  addMedia: (userId, input) =>
    write((db) => {
      const item: SigniaMediaItem = {
        ...input,
        id: `smedia-${crypto.randomUUID()}`,
        user_id: userId,
        created_at: now(),
      };
      db.signia_media.push(item);
      return item;
    }),

  updateMedia: (userId, id, update) =>
    write((db) => {
      const item = db.signia_media.find((m) => m.id === id && m.user_id === userId);
      if (!item) return null;
      Object.assign(item, update);
      return item;
    }),

  deleteMedia: (userId, id) =>
    write((db) => {
      const before = db.signia_media.length;
      db.signia_media = db.signia_media.filter((m) => !(m.id === id && m.user_id === userId));
      return db.signia_media.length < before;
    }),

  saveSocialLinks: (userId, links) =>
    write((db) => {
      db.signia_social_links = [
        ...db.signia_social_links.filter((l) => l.user_id !== userId),
        ...links.map((l, i) => ({ ...l, user_id: userId, order_index: i })),
      ];
      return db.signia_social_links.filter((l) => l.user_id === userId);
    }),
};
