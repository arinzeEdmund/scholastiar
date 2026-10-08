import type { CatalogueTab } from "@/config/catalogue";
import type { CatalogueEntry, ProgramEntry } from "@/data/types";
import type { CatalogueQuery } from "@/lib/catalogue/query";

export interface CatalogueFacets {
  countries: { code: string; count: number }[];
  fields: { slug: string; name: string; count: number }[];
  languages: { name: string; count: number }[];
}

export interface CatalogueResults {
  /** Entries for the active tab, filtered and sorted (sort "fit" is applied by the caller). */
  entries: CatalogueEntry[];
  /** Matches per tab for the same text and filters. */
  tabCounts: Record<CatalogueTab, number>;
  /** Filter options with counts, from every published listing. */
  facets: CatalogueFacets;
}

/** Public study catalogue — SERVICES/21-study-catalogue.md. Only published listings are returned. */
export interface CatalogueRepository {
  search(query: CatalogueQuery): Promise<CatalogueResults>;
  getProgramEntry(programId: string): Promise<ProgramEntry | null>;
}
