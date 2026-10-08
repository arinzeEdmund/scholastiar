import { ArrowLeft, LayoutTemplate } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader, PageSection } from "@/components/layout/page-header";
import { RouteButton } from "@/components/layout/route-button";
import { SurfaceShell } from "@/components/layout/surface-shell";
import { EmptyState } from "@/components/states/empty-state";
import { Button } from "@/components/ui/button";
import { devListProfiles } from "@/data/mock/dev";
import { SURFACES, type ShellKey } from "@/config/personas";
import { routeStage } from "@/config/routes";
import { getSession } from "@/lib/session";

const SHELL_KEYS: ShellKey[] = ["public", "candidate", "employer", "provider", "forwarder", "office", "admin"];

export async function generateMetadata({ params }: PageProps<"/dev/shells/[shell]">): Promise<Metadata> {
  const { shell } = await params;
  return { title: `${shell} shell preview` };
}

export default async function ShellPreview({ params }: PageProps<"/dev/shells/[shell]">) {
  const { shell } = await params;
  if (!SHELL_KEYS.includes(shell as ShellKey)) notFound();
  const key = shell as ShellKey;

  // Prefer the signed-in persona if it belongs to this shell; otherwise use a sample persona.
  const session = await getSession();
  const profiles = await devListProfiles();
  const user =
    key === "public"
      ? null
      : session && SURFACES[session.user.primary_role].shell === key
        ? session.user
        : (profiles.find((p) => SURFACES[p.primary_role].shell === key) ?? null);

  const home = user ? SURFACES[user.primary_role].home : "/";
  const stage = routeStage(home);

  return (
    <SurfaceShell shell={key} user={user}>
      <div className={key === "public" ? "mx-auto max-w-7xl px-4 py-12 sm:px-6" : undefined}>
        <PageHeader
          eyebrow="Shell preview"
          title={user ? `${SURFACES[user.primary_role].label} workspace` : "Public website"}
          description={
            user
              ? `Previewing as ${user.full_name}${user.organization_name ? ` · ${user.organization_name}` : ""}. Greyed-out navigation items are built in later stages.`
              : "The frame for every public page. Greyed-out navigation items are built in later stages."
          }
          actions={
            <Button asChild variant="outline">
              <Link href="/dev">
                <ArrowLeft aria-hidden />
                Build status
              </Link>
            </Button>
          }
        />
        <PageSection className="mt-8">
          <EmptyState
            icon={LayoutTemplate}
            title="Screens for this area aren't built yet"
            description={
              stage
                ? `The first screen here (${home}) is built in stage ${stage}.`
                : "Screens for this area are built in a later stage."
            }
            action={<RouteButton href={home}>Open {home}</RouteButton>}
          />
        </PageSection>
      </div>
    </SurfaceShell>
  );
}
