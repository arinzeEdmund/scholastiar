import "server-only";

import type { CardViewerState } from "@/components/opportunities/opportunity-card";
import { repos } from "@/data";
import type { CandidateBundle } from "@/data/repositories/candidate";
import type { BoardKey, CatalogueEntry } from "@/data/types";
import { getSession } from "@/lib/session";

import { programFit, readinessFor, scholarshipFit, type Fit } from "./fit";
import { entryRef, signUpHref } from "./links";

/** Who is looking at the catalogue: a visitor, or a paying student with their profile. */
export type CatalogueViewer =
  | { kind: "visitor" }
  | {
      kind: "candidate";
      userId: string;
      bundle: CandidateBundle;
      saved: Set<string>;
      boards: Map<string, BoardKey[]>;
    };

const key = (type: string, id: string) => `${type}:${id}`;

export async function getCatalogueViewer(): Promise<CatalogueViewer> {
  const session = await getSession();
  if (!session || session.user.primary_role !== "candidate") return { kind: "visitor" };
  const userId = session.user.user_id;
  const subscription = await repos.billing.getSubscription(userId);
  if (subscription?.status !== "active") return { kind: "visitor" };

  const [bundle, saved, boardItems] = await Promise.all([
    repos.candidate.getBundle(userId),
    repos.opportunities.listSaved(userId),
    repos.opportunities.listBoardItems(userId),
  ]);
  const boards = new Map<string, BoardKey[]>();
  for (const item of boardItems) {
    const k = key(item.opportunity_type, item.opportunity_id);
    boards.set(k, [...(boards.get(k) ?? []), item.board]);
  }
  return {
    kind: "candidate",
    userId,
    bundle,
    saved: new Set(saved.map((s) => key(s.opportunity_type, s.opportunity_id))),
    boards,
  };
}

export function fitFor(entry: CatalogueEntry, viewer: CatalogueViewer): Fit | null {
  if (viewer.kind !== "candidate") return null;
  if (entry.type === "program") return programFit(entry, viewer.bundle);
  if (entry.type === "scholarship") return scholarshipFit(entry, viewer.bundle);
  return null;
}

/** Card state for one entry. `nextPath` is where a visitor returns after signing up. */
export function cardStateFor(entry: CatalogueEntry, viewer: CatalogueViewer, nextPath: string): CardViewerState {
  if (viewer.kind === "visitor") return { signUpHref: signUpHref(nextPath), saved: false, boards: [] };
  const ref = entryRef(entry);
  return {
    saved: viewer.saved.has(key(ref.type, ref.id)),
    boards: viewer.boards.get(key(ref.type, ref.id)) ?? [],
    fit: fitFor(entry, viewer),
    readiness: entry.type === "program" ? readinessFor(entry.requirements, viewer.bundle) : null,
  };
}

/** "Best fit" sort: highest fit first; universities (no score) after scored entries. */
export function sortByFit(entries: CatalogueEntry[], viewer: CatalogueViewer): CatalogueEntry[] {
  if (viewer.kind !== "candidate") return entries;
  const score = (e: CatalogueEntry) => fitFor(e, viewer)?.score ?? -1;
  return [...entries].sort((a, b) => score(b) - score(a));
}
