"use client";

import { Smartphone, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  ENGAGEMENT_THRESHOLD,
  rememberInstallDismissed,
  usePwaStore,
  wasInstallDismissedRecently,
} from "@/store/pwa-store";

/**
 * Non-blocking install card. Appears only when the browser supports install,
 * the visitor has engaged meaningfully, and they haven't dismissed it recently.
 */
export function InstallPrompt() {
  const installEvent = usePwaStore((s) => s.installEvent);
  const engagement = usePwaStore((s) => s.engagement);
  const setInstallEvent = usePwaStore((s) => s.setInstallEvent);
  const [hidden, setHidden] = useState(false);

  if (!installEvent || hidden || engagement < ENGAGEMENT_THRESHOLD || wasInstallDismissedRecently()) return null;

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "dismissed") rememberInstallDismissed();
    setInstallEvent(null);
  }

  function dismiss() {
    rememberInstallDismissed();
    setHidden(true);
  }

  return (
    <div
      role="dialog"
      aria-label="Install Scholastiar.ai"
      className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md rounded-lg border bg-card p-4 shadow-lg lg:right-6 lg:bottom-20 lg:left-auto"
    >
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-soft-green text-green-dark">
          <Smartphone className="size-5" aria-hidden />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary-text">Add Scholastiar.ai to your phone</p>
          <p className="mt-0.5 text-sm text-secondary-text">
            Get deadline alerts and keep saved opportunities one tap away.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={install}>
              Install app
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss}>
              Not now
            </Button>
          </div>
        </div>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="-mt-1 -mr-1"
        >
          <X />
        </Button>
      </div>
    </div>
  );
}
