/**
 * DATA_SOURCE selects the data layer implementation.
 * Phase A (UI build) defaults to "mock"; Phase B switches domains to "supabase".
 */
export const dataSource = (process.env.DATA_SOURCE ?? "mock") as "mock" | "supabase";

export const isMock = dataSource === "mock";

/** Simulated network latency for mock reads, so loading states are real. */
export const mockLatencyMs = Number(process.env.MOCK_LATENCY_MS ?? 150);
