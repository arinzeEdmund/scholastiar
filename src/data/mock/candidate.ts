import "server-only";

import type { MockDb } from "@/data/fixtures";
import { defaultNotificationPreferences } from "@/data/fixtures/candidate";
import type { CandidateRepository } from "@/data/repositories/candidate";
import type { CandidateProfile, CandidateVisaProfile, CareerPreferences, OnboardingSession } from "@/data/types";

import { now, readList, readOne, readSystem, write } from "./store";

const newId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

function emptyProfile(userId: string): CandidateProfile {
  return {
    id: `cand-${userId}`,
    user_id: userId,
    preferred_name: null,
    headline: null,
    professional_summary: null,
    date_of_birth: null,
    nationality_country_code: null,
    current_country_code: null,
    current_city: null,
    phone: null,
    languages: [],
    communication_style: "concise",
    profile_visibility: "employers",
    website_url: null,
    linkedin_url: null,
    portfolio_url: null,
    created_at: now(),
    updated_at: now(),
  };
}

function emptyVisa(userId: string): CandidateVisaProfile {
  return {
    id: `visa-${userId}`,
    user_id: userId,
    passport_country_code: null,
    study_status: null,
    study_country_code: null,
    institution_name: null,
    course_start_date: null,
    course_end_date: null,
    current_visa_status: null,
    term_time_weekly_hour_limit: null,
    holiday_work_allowed: null,
    work_restrictions_notes: null,
    post_study_permit_type_id: null,
    post_study_permit_status: "none",
    post_study_permit_expiry_date: null,
    needs_sponsorship_after_study: null,
    countries_lived_in: [],
    target_country_codes: [],
    relocation_willingness: null,
    updated_at: now(),
  };
}

function emptyPreferences(userId: string): CareerPreferences {
  return {
    id: `pref-${userId}`,
    user_id: userId,
    goals: [],
    target_roles: [],
    industries: [],
    job_tracks: [],
    preferred_student_job_types: [],
    max_weekly_hours: null,
    pay_min: null,
    pay_currency: "GBP",
    pay_period: "hour",
    work_modes: [],
    target_country_codes: [],
    earliest_start_date: null,
    updated_at: now(),
  };
}

function emptySession(userId: string): OnboardingSession {
  return {
    id: `onb-${userId}`,
    user_id: userId,
    current_step: "personal",
    completed_steps: [],
    completed_at: null,
    created_at: now(),
    updated_at: now(),
  };
}

const profileOf = (db: MockDb, userId: string) =>
  db.candidate_profiles.find((p) => p.user_id === userId) ?? emptyProfile(userId);
const visaOf = (db: MockDb, userId: string) =>
  db.candidate_visa_profiles.find((v) => v.user_id === userId) ?? emptyVisa(userId);
const preferencesOf = (db: MockDb, userId: string) =>
  db.career_preferences.find((p) => p.user_id === userId) ?? emptyPreferences(userId);
const sessionOf = (db: MockDb, userId: string) =>
  db.candidate_onboarding_sessions.find((s) => s.user_id === userId) ?? emptySession(userId);
const bySort = <T extends { sort_order: number }>(rows: T[]) => [...rows].sort((a, b) => a.sort_order - b.sort_order);

/** Finds the user's row, creating it from the empty default on first save. */
function ensure<T extends { user_id: string }>(rows: T[], userId: string, empty: (id: string) => T): T {
  let row = rows.find((r) => r.user_id === userId);
  if (!row) {
    row = empty(userId);
    rows.push(row);
  }
  return row;
}

export const mockCandidateRepository: CandidateRepository = {
  getBundle: async (userId) => {
    const [base, documents] = await Promise.all([
      readOne((db) => ({
        profile: profileOf(db, userId),
        visa: visaOf(db, userId),
        education: bySort(db.education_records.filter((e) => e.user_id === userId)),
        experience: bySort(db.work_experiences.filter((e) => e.user_id === userId)),
        skills: db.candidate_skills.filter((s) => s.user_id === userId),
        certifications: db.certifications.filter((c) => c.user_id === userId),
        preferences: preferencesOf(db, userId),
        onboarding: sessionOf(db, userId),
      })),
      readList((db) => db.documents.filter((d) => d.owner_user_id === userId)),
    ]);
    return { ...base, documents };
  },

  getProfile: (userId) => readOne((db) => profileOf(db, userId)),
  updateProfile: (userId, update) =>
    write((db) => Object.assign(ensure(db.candidate_profiles, userId, emptyProfile), update, { updated_at: now() })),

  getVisa: (userId) => readOne((db) => visaOf(db, userId)),
  updateVisa: (userId, update) =>
    write((db) => Object.assign(ensure(db.candidate_visa_profiles, userId, emptyVisa), update, { updated_at: now() })),
  listPermitTypes: () => readSystem((db) => db.post_study_permit_types),

  listEducation: (userId) => readList((db) => bySort(db.education_records.filter((e) => e.user_id === userId))),
  saveEducation: (userId, id, input) =>
    write((db) => {
      const existing = id ? db.education_records.find((e) => e.id === id && e.user_id === userId) : undefined;
      if (existing) return Object.assign(existing, input);
      const record = {
        ...input,
        id: newId("edu"),
        user_id: userId,
        sort_order: db.education_records.filter((e) => e.user_id === userId).length,
      };
      db.education_records.push(record);
      return record;
    }),
  deleteEducation: (userId, id) =>
    write((db) => {
      db.education_records = db.education_records.filter((e) => !(e.id === id && e.user_id === userId));
    }),

  listExperience: (userId) => readList((db) => bySort(db.work_experiences.filter((e) => e.user_id === userId))),
  getExperience: (userId, id) =>
    readOne((db) => db.work_experiences.find((e) => e.id === id && e.user_id === userId) ?? null),
  saveExperience: (userId, id, input) =>
    write((db) => {
      const existing = id ? db.work_experiences.find((e) => e.id === id && e.user_id === userId) : undefined;
      if (existing) return Object.assign(existing, input);
      const record = {
        ...input,
        id: newId("exp"),
        user_id: userId,
        sort_order: db.work_experiences.filter((e) => e.user_id === userId).length,
      };
      db.work_experiences.push(record);
      return record;
    }),
  deleteExperience: (userId, id) =>
    write((db) => {
      db.work_experiences = db.work_experiences.filter((e) => !(e.id === id && e.user_id === userId));
    }),

  listSkills: (userId) => readList((db) => db.candidate_skills.filter((s) => s.user_id === userId)),
  replaceSkills: (userId, skills) =>
    write((db) => {
      const rows = skills.map((s) => ({ ...s, id: newId("skill"), user_id: userId }));
      db.candidate_skills = [...db.candidate_skills.filter((s) => s.user_id !== userId), ...rows];
      return rows;
    }),
  listCertifications: (userId) => readList((db) => db.certifications.filter((c) => c.user_id === userId)),
  replaceCertifications: (userId, certifications) =>
    write((db) => {
      const rows = certifications.map((c) => ({ ...c, id: newId("cert"), user_id: userId }));
      db.certifications = [...db.certifications.filter((c) => c.user_id !== userId), ...rows];
      return rows;
    }),

  getPreferences: (userId) => readOne((db) => preferencesOf(db, userId)),
  updatePreferences: (userId, update) =>
    write((db) =>
      Object.assign(ensure(db.career_preferences, userId, emptyPreferences), update, { updated_at: now() }),
    ),

  getOnboarding: (userId) => readSystem((db) => sessionOf(db, userId)),
  completeOnboardingStep: (userId, step, next) =>
    write((db) => {
      const session = ensure(db.candidate_onboarding_sessions, userId, emptySession);
      if (!session.completed_steps.includes(step)) session.completed_steps.push(step);
      session.current_step = next;
      session.updated_at = now();
      return session;
    }),
  finishOnboarding: (userId) =>
    write((db) => {
      const session = ensure(db.candidate_onboarding_sessions, userId, emptySession);
      if (!session.completed_steps.includes("review")) session.completed_steps.push("review");
      session.completed_at ??= now();
      session.updated_at = now();
      const user = db.user_profiles.find((p) => p.user_id === userId);
      if (user) Object.assign(user, { onboarding_completed: true, updated_at: now() });
      return session;
    }),

  listDocuments: (userId) =>
    readList((db) =>
      db.documents.filter((d) => d.owner_user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at)),
    ),
  getDocument: (userId, id) =>
    readSystem((db) => db.documents.find((d) => d.id === id && d.owner_user_id === userId) ?? null),
  createDocument: (userId, input) =>
    write((db) => {
      const document = { ...input, id: newId("doc"), owner_user_id: userId, created_at: now(), updated_at: now() };
      db.documents.push(document);
      return document;
    }),
  updateDocument: (userId, id, update) =>
    write((db) => {
      const document = db.documents.find((d) => d.id === id && d.owner_user_id === userId);
      if (!document) throw new Error("Document not found");
      return Object.assign(document, update, { updated_at: now() });
    }),
  deleteDocument: (userId, id) =>
    write((db) => {
      db.documents = db.documents.filter((d) => !(d.id === id && d.owner_user_id === userId));
    }),

  getNotificationPreferences: (userId) =>
    readOne((db) => {
      const saved = db.notification_preferences.filter((p) => p.user_id === userId);
      return saved.length > 0 ? saved : defaultNotificationPreferences(userId);
    }),
  saveNotificationPreferences: (userId, preferences) =>
    write((db) => {
      const rows = preferences.map((p) => ({
        ...p,
        id: `np-${userId}-${p.notification_type}-${p.channel}`,
        user_id: userId,
      }));
      db.notification_preferences = [...db.notification_preferences.filter((p) => p.user_id !== userId), ...rows];
      return rows;
    }),

  deleteAllForUser: (userId) =>
    write((db) => {
      db.candidate_profiles = db.candidate_profiles.filter((r) => r.user_id !== userId);
      db.candidate_onboarding_sessions = db.candidate_onboarding_sessions.filter((r) => r.user_id !== userId);
      db.candidate_visa_profiles = db.candidate_visa_profiles.filter((r) => r.user_id !== userId);
      db.education_records = db.education_records.filter((r) => r.user_id !== userId);
      db.work_experiences = db.work_experiences.filter((r) => r.user_id !== userId);
      db.candidate_skills = db.candidate_skills.filter((r) => r.user_id !== userId);
      db.certifications = db.certifications.filter((r) => r.user_id !== userId);
      db.career_preferences = db.career_preferences.filter((r) => r.user_id !== userId);
      db.documents = db.documents.filter((r) => r.owner_user_id !== userId);
      db.notification_preferences = db.notification_preferences.filter((r) => r.user_id !== userId);
    }),
};
