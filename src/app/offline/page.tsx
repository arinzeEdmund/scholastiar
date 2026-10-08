import { WifiOff } from "lucide-react";
import type { Metadata } from "next";

import { ReloadButton } from "@/components/states/reload-button";
import { StatusPage } from "@/components/states/status-page";

export const metadata: Metadata = { title: "You're offline" };

// Static on purpose: the service worker pre-caches this page as the offline fallback.
export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <StatusPage
      icon={WifiOff}
      title="You're offline"
      description="Pages you opened recently may still be available. Searching, applying, payments and messages need a connection, so nothing is sent until you're back online."
      actions={<ReloadButton size="lg">Try again</ReloadButton>}
    />
  );
}
