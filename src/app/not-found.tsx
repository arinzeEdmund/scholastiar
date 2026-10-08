import { Compass } from "lucide-react";
import type { Metadata } from "next";

import { RouteButton } from "@/components/layout/route-button";
import { StatusPage } from "@/components/states/status-page";
import { getHomeHref } from "@/lib/home";

export const metadata: Metadata = { title: "Page not found" };

export default async function NotFound() {
  const home = await getHomeHref();
  return (
    <StatusPage
      icon={Compass}
      code="404"
      title="We couldn't find that page"
      description="The link may be out of date, or the page may have moved. Your saved opportunities and applications are safe."
      actions={
        <>
          <RouteButton href={home} size="lg">
            Go to your home page
          </RouteButton>
          <RouteButton href="/search" variant="outline" size="lg">
            Search opportunities
          </RouteButton>
        </>
      }
    />
  );
}
