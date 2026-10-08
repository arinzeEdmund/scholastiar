"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

import { usePwaStore } from "@/store/pwa-store";

/** Offers a refresh when a new version of the app has been downloaded. */
export function PWAUpdateToast() {
  const waitingWorker = usePwaStore((s) => s.waitingWorker);

  useEffect(() => {
    if (!waitingWorker) return;
    const id = toast(
      (t) => (
        <span className="flex items-center gap-3 text-sm">
          A new version of Scholastiar.ai is ready.
          <button
            type="button"
            className="font-semibold text-green-dark underline-offset-4 hover:underline"
            onClick={() => {
              waitingWorker.postMessage({ type: "SKIP_WAITING" });
              toast.dismiss(t.id);
            }}
          >
            Refresh
          </button>
        </span>
      ),
      { duration: Infinity, id: "pwa-update" },
    );
    return () => toast.dismiss(id);
  }, [waitingWorker]);

  return null;
}
