"use client";

import { useEffect } from "react";

import { usePwaStore, type BeforeInstallPromptEvent } from "@/store/pwa-store";

/**
 * Registers /sw.js (production builds only — a caching worker during
 * development hides changes) and wires install + update events into the PWA store.
 */
export function ServiceWorkerRegistration() {
  const setInstallEvent = usePwaStore((s) => s.setInstallEvent);
  const setWaitingWorker = usePwaStore((s) => s.setWaitingWorker);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstallEvent(null);
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then((registration) => {
          if (registration.waiting && navigator.serviceWorker.controller) setWaitingWorker(registration.waiting);
          registration.addEventListener("updatefound", () => {
            const worker = registration.installing;
            worker?.addEventListener("statechange", () => {
              if (worker.state === "installed" && navigator.serviceWorker.controller) setWaitingWorker(worker);
            });
          });
        })
        .catch(() => {
          // Registration failure only disables offline support; the app keeps working.
        });

      // Reload only when an update replaces an existing worker (after the user accepts the
      // update toast) — never on first install, when the worker simply takes control.
      const hadController = Boolean(navigator.serviceWorker.controller);
      let reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!hadController || reloaded) return;
        reloaded = true;
        window.location.reload();
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [setInstallEvent, setWaitingWorker]);

  return null;
}
