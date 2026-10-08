import "server-only";

import type { CvRepository } from "@/data/repositories/cvs";
import type { CvVersion } from "@/data/types";

import { now, readList, readOne, write } from "./store";

const newest = (a: CvVersion, b: CvVersion) => b.created_at.localeCompare(a.created_at);

export const mockCvRepository: CvRepository = {
  list: (userId) => readList((db) => db.cv_versions.filter((c) => c.user_id === userId).sort(newest)),

  get: (userId, id) => readOne((db) => db.cv_versions.find((c) => c.user_id === userId && c.id === id) ?? null),

  create: (userId, input) =>
    write((db) => {
      const row: CvVersion = {
        ...input,
        id: `cv-${crypto.randomUUID()}`,
        user_id: userId,
        edited_at: null,
        created_at: now(),
        updated_at: now(),
      };
      db.cv_versions.push(row);
      return row;
    }),

  update: (userId, id, update) =>
    write((db) => {
      const row = db.cv_versions.find((c) => c.user_id === userId && c.id === id);
      if (!row) return null;
      if (update.title !== undefined) row.title = update.title;
      if (update.content) {
        row.content = update.content;
        row.edited_at = now();
      }
      row.updated_at = now();
      return row;
    }),

  remove: (userId, id) =>
    write((db) => {
      const before = db.cv_versions.length;
      db.cv_versions = db.cv_versions.filter((c) => !(c.user_id === userId && c.id === id));
      return db.cv_versions.length < before;
    }),
};
