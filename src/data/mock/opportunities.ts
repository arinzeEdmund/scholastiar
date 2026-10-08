import "server-only";

import type { OpportunitiesRepository, OpportunityRef } from "@/data/repositories/opportunities";
import type { BoardItem, SavedOpportunity } from "@/data/types";

import { now, readSystem, write } from "./store";

const same = (ref: OpportunityRef) => (row: { opportunity_type: string; opportunity_id: string }) =>
  row.opportunity_type === ref.type && row.opportunity_id === ref.id;

// Saves and board membership are system lookups for card state, so they ignore the
// dev screen-state switch; the Saved and board screens read them through their own lists.
export const mockOpportunitiesRepository: OpportunitiesRepository = {
  listSaved: (userId) => readSystem((db) => db.saved_opportunities.filter((s) => s.user_id === userId)),

  setSaved: (userId, ref, saved) =>
    write((db) => {
      const existing = db.saved_opportunities.find((s) => s.user_id === userId && same(ref)(s));
      if (saved && !existing) {
        const row: SavedOpportunity = {
          id: `saved-${crypto.randomUUID()}`,
          user_id: userId,
          opportunity_type: ref.type,
          opportunity_id: ref.id,
          status: "saved",
          created_at: now(),
        };
        db.saved_opportunities.push(row);
      }
      if (!saved && existing) db.saved_opportunities = db.saved_opportunities.filter((s) => s !== existing);
      return saved;
    }),

  listBoardItems: (userId) => readSystem((db) => db.board_items.filter((b) => b.user_id === userId)),

  setOnBoard: (userId, board, ref, on) =>
    write((db) => {
      const existing = db.board_items.find((b) => b.user_id === userId && b.board === board && same(ref)(b));
      if (on && !existing) {
        const row: BoardItem = {
          id: `board-${crypto.randomUUID()}`,
          board,
          user_id: userId,
          opportunity_type: ref.type,
          opportunity_id: ref.id,
          status: board === "ai_apply_agent" ? "due" : "open",
          created_at: now(),
        };
        db.board_items.push(row);
      }
      if (!on && existing) db.board_items = db.board_items.filter((b) => b !== existing);
      return on;
    }),
};
