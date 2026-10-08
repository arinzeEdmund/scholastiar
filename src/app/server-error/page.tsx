import { ServerCrash } from "lucide-react";
import type { Metadata } from "next";

import { RouteButton } from "@/components/layout/route-button";
import { ReloadButton } from "@/components/states/reload-button";
import { StatusPage } from "@/components/states/status-page";

export const metadata: Metadata = { title: "Something went wrong" };

export default function ServerErrorPage() {
  return (
    <StatusPage
      icon={ServerCrash}
      code="500"
      title="Something went wrong on our side"
      description="Nothing you did caused this, and your data is safe. Try again in a moment. If it keeps happening, our support team can help."
      actions={
        <>
          <ReloadButton size="lg" />
          <RouteButton href="/contact" variant="outline" size="lg">
            Contact support
          </RouteButton>
        </>
      }
    />
  );
}
