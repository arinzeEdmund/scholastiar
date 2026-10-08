import type { Country } from "@/data/types";

export interface ReferenceRepository {
  listCountries(): Promise<Country[]>;
}
