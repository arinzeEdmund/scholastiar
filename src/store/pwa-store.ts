"use client";

import { create } from "zustand";

/** Chrome's install event — not in the TS DOM lib. */
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "sch_install_dismissed_at";
const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
/** Show the install prompt only after meaningful engagement (PWA_FIRST_WEB_APP.md). */
export const ENGAGEMENT_THRESHOLD = 2;

interface PwaState {
  installEvent: BeforeInstallPromptEvent | null;
  engagement: number;
  waitingWorker: ServiceWorker | null;
  setInstallEvent: (event: BeforeInstallPromptEvent | null) => void;
  setWaitingWorker: (worker: ServiceWorker | null) => void;
  /** Call after a meaningful action: saving an opportunity, opting into reminders, etc. */
  recordEngagement: () => void;
}

export const usePwaStore = create<PwaState>((set) => ({
  installEvent: null,
  engagement: 0,
  waitingWorker: null,
  setInstallEvent: (installEvent) => set({ installEvent }),
  setWaitingWorker: (waitingWorker) => set({ waitingWorker }),
  recordEngagement: () => set((state) => ({ engagement: state.engagement + 1 })),
}));

export function wasInstallDismissedRecently(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return Boolean(at) && Date.now() - at < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

export function rememberInstallDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // Storage unavailable (private mode); the prompt may reappear next visit.
  }
}
