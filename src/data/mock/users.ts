import "server-only";

import type { UsersRepository } from "@/data/repositories/users";

import { now, readList, readSystem, write } from "./store";

export const mockUsersRepository: UsersRepository = {
  listProfiles: () => readList((db) => db.user_profiles),

  getProfile: (userId) => readSystem((db) => db.user_profiles.find((p) => p.user_id === userId) ?? null),

  getRoles: (userId) => readSystem((db) => db.user_roles.filter((r) => r.user_id === userId).map((r) => r.role)),

  updateProfile: (userId, update) =>
    write((db) => {
      const profile = db.user_profiles.find((p) => p.user_id === userId);
      if (!profile) throw new Error("Profile not found");
      Object.assign(profile, update, { updated_at: now() });
      return profile;
    }),

  createProfile: (input) =>
    write((db) => {
      const profile = {
        id: `profile-${input.userId}`,
        user_id: input.userId,
        full_name: input.fullName,
        email: input.email.trim().toLowerCase(),
        avatar_url: null,
        headline: input.headline,
        primary_role: input.primaryRole,
        organization_name: input.organizationName,
        country_code: input.countryCode,
        timezone: "UTC",
        locale: "en",
        onboarding_completed: false,
        created_at: now(),
        updated_at: now(),
      };
      db.user_profiles.push(profile);
      return profile;
    }),

  deleteUser: (userId) =>
    write((db) => {
      db.user_profiles = db.user_profiles.filter((p) => p.user_id !== userId);
      db.user_roles = db.user_roles.filter((r) => r.user_id !== userId);
    }),

  addRole: (userId, role) =>
    write((db) => {
      if (!db.user_roles.some((r) => r.user_id === userId && r.role === role)) {
        db.user_roles.push({
          id: `role-${userId}-${role}`,
          user_id: userId,
          role,
          granted_by: null,
          created_at: now(),
        });
      }
    }),
};
