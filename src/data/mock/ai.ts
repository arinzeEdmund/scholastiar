import "server-only";

import type { AiRepository } from "@/data/repositories/ai";

import { now, readSystem, write } from "./store";

export const mockAiRepository: AiRepository = {
  record: (userId, type, status) =>
    write((db) => {
      db.ai_generations.push({
        id: `aigen-${crypto.randomUUID()}`,
        user_id: userId,
        generation_type: type,
        status,
        created_at: now(),
      });
    }),

  countSince: (userId, type, since) =>
    readSystem(
      (db) =>
        db.ai_generations.filter(
          (g) =>
            g.user_id === userId && g.generation_type === type && g.status === "succeeded" && g.created_at >= since,
        ).length,
    ),
};
