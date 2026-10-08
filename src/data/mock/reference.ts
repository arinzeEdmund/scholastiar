import "server-only";

import type { ReferenceRepository } from "@/data/repositories/reference";

import { readSystem } from "./store";

export const mockReferenceRepository: ReferenceRepository = {
  listCountries: () => readSystem((db) => [...db.countries].sort((a, b) => a.name.localeCompare(b.name))),
};
