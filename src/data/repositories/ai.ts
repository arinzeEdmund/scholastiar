import type { AiGeneration } from "@/data/types";

/** AI generation log, used for plan allowances (Phase B adds prompts, models and token usage). */
export interface AiRepository {
  record(userId: string, type: AiGeneration["generation_type"], status: AiGeneration["status"]): Promise<void>;
  /** Successful generations of a type since a date. System read. */
  countSince(userId: string, type: AiGeneration["generation_type"], since: string): Promise<number>;
}
