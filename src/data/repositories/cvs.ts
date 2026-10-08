import type { CvContent, CvVersion } from "@/data/types";

export type NewCv = Omit<CvVersion, "id" | "user_id" | "created_at" | "updated_at" | "edited_at">;

/** cv_versions — the student's generated and edited CVs. */
export interface CvRepository {
  list(userId: string): Promise<CvVersion[]>;
  get(userId: string, id: string): Promise<CvVersion | null>;
  create(userId: string, input: NewCv): Promise<CvVersion>;
  update(userId: string, id: string, update: { title?: string; content?: CvContent }): Promise<CvVersion | null>;
  remove(userId: string, id: string): Promise<boolean>;
  /** AI-generated CVs created since a date (duplicates don't count). System read. */
  countGeneratedSince(userId: string, since: string): Promise<number>;
}
