import "server-only";

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { createSeed, type MockDb } from "@/data/fixtures";
import { getViewState } from "@/lib/dev-settings";
import { mockLatencyMs } from "@/lib/env";

// In-memory mock database for Phase A. Persists to a gitignored JSON file in
// development so state survives restarts. Kept on globalThis so hot reloads
// don't wipe it.

const STORE_FILE = path.join(process.cwd(), ".mock-db", "db.json");

const globalStore = globalThis as unknown as { __scholastiarMockDb?: MockDb };

function loadFromDisk(): MockDb {
  const seed = createSeed();
  try {
    const saved = JSON.parse(readFileSync(STORE_FILE, "utf8")) as Partial<MockDb>;
    // Collections added by later stages are merged in from the seed.
    return { ...seed, ...saved };
  } catch {
    return seed;
  }
}

function db(): MockDb {
  globalStore.__scholastiarMockDb ??= loadFromDisk();
  return globalStore.__scholastiarMockDb;
}

function persist() {
  try {
    mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    writeFileSync(STORE_FILE, JSON.stringify(db(), null, 2));
  } catch {
    // Read-only filesystems (e.g. preview deployments) keep state in memory only.
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockDataError extends Error {
  constructor(message = "The demo data source returned an error.") {
    super(message);
    this.name = "MockDataError";
  }
}

/** Read for system lookups (session, roles). Ignores the dev view-state switch. */
export async function readSystem<T>(select: (db: MockDb) => T): Promise<T> {
  return structuredClone(select(db()));
}

/** Read a single record for a screen. Honours the "loading" and "error" view states. */
export async function readOne<T>(select: (db: MockDb) => T): Promise<T> {
  const viewState = await getViewState();
  await sleep(viewState === "loading" ? 8000 : mockLatencyMs);
  if (viewState === "error") throw new MockDataError();
  return structuredClone(select(db()));
}

/** Read a list for a screen. Honours "loading", "empty" and "error" view states. */
export async function readList<T>(select: (db: MockDb) => T[]): Promise<T[]> {
  const viewState = await getViewState();
  await sleep(viewState === "loading" ? 8000 : mockLatencyMs);
  if (viewState === "error") throw new MockDataError();
  if (viewState === "empty") return [];
  return structuredClone(select(db()));
}

/** Mutate the store and persist it. */
export async function write<T>(mutate: (db: MockDb) => T): Promise<T> {
  await sleep(mockLatencyMs);
  const result = mutate(db());
  persist();
  return structuredClone(result);
}

export function resetStore() {
  globalStore.__scholastiarMockDb = createSeed();
  persist();
}

export const now = () => new Date().toISOString();
