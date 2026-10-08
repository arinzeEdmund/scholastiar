import { Lock } from "lucide-react";
import type { Metadata } from "next";

import { RouteButton } from "@/components/layout/route-button";
import { StatusPage } from "@/components/states/status-page";
import { getHomeHref } from "@/lib/home";

export const metadata: Metadata = { title: "No access" };

export default async function UnauthorizedPage() {
  const home = await getHomeHref();
  return (
    <StatusPage
      icon={Lock}
      code="403"
      title="You don't have access to this page"
      description="This area belongs to a different type of account, or your team hasn't given you access yet. Go back to your workspace or sign in with the right account."
      actions={
        <>
          <RouteButton href={home} size="lg">
            {home === "/" ? "Go to the homepage" : "Back to your workspace"}
          </RouteButton>
          <RouteButton href="/auth/sign-in" variant="outline" size="lg">
            Sign in with another account
          </RouteButton>
        </>
      }
    />
  );
}
