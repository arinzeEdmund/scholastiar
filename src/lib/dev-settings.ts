import "server-only";

import { cookies } from "next/headers";

// Phase A dev controls, stored in cookies so Server Components and server
// actions see the same value. Only meaningful when DATA_SOURCE=mock.

export const DEV_COOKIES = {
  session: "sch_mock_session",
  viewState: "sch_view_state",
  aiFailure: "sch_ai_failure",
} as const;

export const VIEW_STATES = ["live", "loading", "empty", "error"] as const;
export type ViewState = (typeof VIEW_STATES)[number];

export async function getViewState(): Promise<ViewState> {
  const value = (await cookies()).get(DEV_COOKIES.viewState)?.value;
  return VIEW_STATES.includes(value as ViewState) ? (value as ViewState) : "live";
}

export async function getAiFailureSimulated(): Promise<boolean> {
  return (await cookies()).get(DEV_COOKIES.aiFailure)?.value === "1";
}
