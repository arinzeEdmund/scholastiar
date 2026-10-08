"use client";

import { WifiOff } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function useOnline() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}

/** Explains what still works while offline (ux_ui_base.md → Mobile Rules). */
export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-near-black px-4 py-2 text-center text-sm text-white"
    >
      <WifiOff className="size-4 shrink-0" aria-hidden />
      You&apos;re offline. You can keep reading; applying, payments and messages wait until you reconnect.
    </div>
  );
}
