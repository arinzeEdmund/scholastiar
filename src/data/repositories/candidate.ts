import type {
  CandidateDocument,
  CandidateProfile,
  CandidateSkill,
  CandidateVisaProfile,
  CareerPreferences,
  Certification,
  EducationRecord,
  NotificationPreference,
  OnboardingSession,
  OnboardingStep,
  PostStudyPermitType,
  WorkExperience,
} from "@/data/types";

type Editable<T> = Omit<T, "id" | "user_id" | "created_at" | "updated_at">;

export type CandidateProfileUpdate = Partial<Editable<CandidateProfile>>;
export type VisaProfileUpdate = Partial<Omit<CandidateVisaProfile, "id" | "user_id" | "updated_at">>;
export type CareerPreferencesUpdate = Partial<Omit<CareerPreferences, "id" | "user_id" | "updated_at">>;
export type EducationInput = Omit<EducationRecord, "id" | "user_id" | "sort_order">;
export type ExperienceInput = Omit<WorkExperience, "id" | "user_id" | "sort_order">;
export type SkillInput = Omit<CandidateSkill, "id" | "user_id">;
export type CertificationInput = Omit<Certification, "id" | "user_id">;
export type DocumentInput = Omit<CandidateDocument, "id" | "owner_user_id" | "created_at" | "updated_at">;
export type DocumentUpdate = Partial<Pick<CandidateDocument, "document_type" | "visibility" | "tags" | "file_name">>;

/** Everything that makes up a candidate's profile, loaded together for overview screens. */
export interface CandidateBundle {
  profile: CandidateProfile;
  visa: CandidateVisaProfile;
  education: EducationRecord[];
  experience: WorkExperience[];
  skills: CandidateSkill[];
  certifications: Certification[];
  preferences: CareerPreferences;
  documents: CandidateDocument[];
  onboarding: OnboardingSession;
}

/**
 * Candidate profile data. Reads never create rows: a candidate without a saved
 * record gets an empty default, and the first save creates it.
 */
export interface CandidateRepository {
  getBundle(userId: string): Promise<CandidateBundle>;

  getProfile(userId: string): Promise<CandidateProfile>;
  updateProfile(userId: string, update: CandidateProfileUpdate): Promise<CandidateProfile>;

  getVisa(userId: string): Promise<CandidateVisaProfile>;
  updateVisa(userId: string, update: VisaProfileUpdate): Promise<CandidateVisaProfile>;
  listPermitTypes(): Promise<PostStudyPermitType[]>;

  listEducation(userId: string): Promise<EducationRecord[]>;
  saveEducation(userId: string, id: string | null, input: EducationInput): Promise<EducationRecord>;
  deleteEducation(userId: string, id: string): Promise<void>;

  listExperience(userId: string): Promise<WorkExperience[]>;
  getExperience(userId: string, id: string): Promise<WorkExperience | null>;
  saveExperience(userId: string, id: string | null, input: ExperienceInput): Promise<WorkExperience>;
  deleteExperience(userId: string, id: string): Promise<void>;

  listSkills(userId: string): Promise<CandidateSkill[]>;
  replaceSkills(userId: string, skills: SkillInput[]): Promise<CandidateSkill[]>;
  listCertifications(userId: string): Promise<Certification[]>;
  replaceCertifications(userId: string, certifications: CertificationInput[]): Promise<Certification[]>;

  getPreferences(userId: string): Promise<CareerPreferences>;
  updatePreferences(userId: string, update: CareerPreferencesUpdate): Promise<CareerPreferences>;

  getOnboarding(userId: string): Promise<OnboardingSession>;
  completeOnboardingStep(userId: string, step: OnboardingStep, next: OnboardingStep): Promise<OnboardingSession>;
  finishOnboarding(userId: string): Promise<OnboardingSession>;

  listDocuments(userId: string): Promise<CandidateDocument[]>;
  getDocument(userId: string, id: string): Promise<CandidateDocument | null>;
  createDocument(userId: string, input: DocumentInput): Promise<CandidateDocument>;
  updateDocument(userId: string, id: string, update: DocumentUpdate): Promise<CandidateDocument>;
  deleteDocument(userId: string, id: string): Promise<void>;

  getNotificationPreferences(userId: string): Promise<NotificationPreference[]>;
  saveNotificationPreferences(
    userId: string,
    preferences: Pick<NotificationPreference, "channel" | "notification_type" | "enabled">[],
  ): Promise<NotificationPreference[]>;

  /** Removes every candidate record for the user (account deletion). */
  deleteAllForUser(userId: string): Promise<void>;
}
