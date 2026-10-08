import type { BoardItem, BoardKey, SavedOpportunity, SavedOpportunityType } from "@/data/types";

export interface OpportunityRef {
  type: SavedOpportunityType;
  id: string;
}

/** Saves and board items for every opportunity type (saved_opportunities, *_board_items). */
export interface OpportunitiesRepository {
  listSaved(userId: string): Promise<SavedOpportunity[]>;
  /** Returns whether the item is saved afterwards. */
  setSaved(userId: string, ref: OpportunityRef, saved: boolean): Promise<boolean>;
  listBoardItems(userId: string): Promise<BoardItem[]>;
  /** Returns whether the item is on the board afterwards. */
  setOnBoard(userId: string, board: BoardKey, ref: OpportunityRef, on: boolean): Promise<boolean>;
}
