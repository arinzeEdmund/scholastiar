/** ai_generations (the fields Phase A needs: what was generated, for whom, and whether it worked). */
export interface AiGeneration {
  id: string;
  user_id: string;
  generation_type: "cv" | "answer";
  status: "succeeded" | "failed";
  created_at: string;
}
