import {
  CATALOGUE_SORTS,
  CATALOGUE_TABS,
  STUDY_MODES,
  type CatalogueSort,
  type CatalogueTab,
} from "@/config/catalogue";
import type { StudyMode } from "@/data/types";

// Catalogue search state lives in the URL so results can be shared, bookmarked and indexed.

export interface CatalogueQuery {
  tab: CatalogueTab;
  q: string;
  countries: string[];
  fields: string[];
  modes: StudyMode[];
  languages: string[];
  maxTuitionUsd: number | null;
  fundedOnly: boolean;
  verifiedOnly: boolean;
  openOnly: boolean;
  sort: CatalogueSort;
}

export const EMPTY_QUERY: CatalogueQuery = {
  tab: "all",
  q: "",
  countries: [],
  fields: [],
  modes: [],
  languages: [],
  maxTuitionUsd: null,
  fundedOnly: false,
  verifiedOnly: false,
  openOnly: false,
  sort: "relevance",
};

type Params = Record<string, string | string[] | undefined> | URLSearchParams;

function read(params: Params, key: string): string | undefined {
  if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

const list = (value: string | undefined) => (value ? value.split(",").filter(Boolean) : []);

export function parseCatalogueQuery(params: Params): CatalogueQuery {
  const tab = read(params, "tab");
  const sort = read(params, "sort");
  const max = Number(read(params, "max"));
  return {
    tab: CATALOGUE_TABS.includes(tab as CatalogueTab) ? (tab as CatalogueTab) : "all",
    q: (read(params, "q") ?? "").trim().slice(0, 100),
    countries: list(read(params, "country")).map((c) => c.toUpperCase()),
    fields: list(read(params, "field")),
    modes: list(read(params, "mode")).filter((m): m is StudyMode => m in STUDY_MODES),
    languages: list(read(params, "lang")),
    maxTuitionUsd: Number.isFinite(max) && max > 0 ? max : null,
    fundedOnly: read(params, "funded") === "1",
    verifiedOnly: read(params, "verified") === "1",
    openOnly: read(params, "open") === "1",
    sort: sort && sort in CATALOGUE_SORTS ? (sort as CatalogueSort) : "relevance",
  };
}

/** Builds the query string for a catalogue state, leaving out defaults. */
export function catalogueSearch(query: CatalogueQuery): string {
  const params = new URLSearchParams();
  if (query.tab !== "all") params.set("tab", query.tab);
  if (query.q) params.set("q", query.q);
  if (query.countries.length) params.set("country", query.countries.join(","));
  if (query.fields.length) params.set("field", query.fields.join(","));
  if (query.modes.length) params.set("mode", query.modes.join(","));
  if (query.languages.length) params.set("lang", query.languages.join(","));
  if (query.maxTuitionUsd) params.set("max", String(query.maxTuitionUsd));
  if (query.fundedOnly) params.set("funded", "1");
  if (query.verifiedOnly) params.set("verified", "1");
  if (query.openOnly) params.set("open", "1");
  if (query.sort !== "relevance") params.set("sort", query.sort);
  const search = params.toString();
  return search ? `?${search}` : "";
}

/** Number of filters in use (tab, text and sort are not filters). */
export function activeFilterCount(query: CatalogueQuery): number {
  return (
    query.countries.length +
    query.fields.length +
    query.modes.length +
    query.languages.length +
    (query.maxTuitionUsd ? 1 : 0) +
    (query.fundedOnly ? 1 : 0) +
    (query.verifiedOnly ? 1 : 0) +
    (query.openOnly ? 1 : 0)
  );
}
