import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SigniaPortfolio } from "@/components/signia/signia-portfolio";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { repos } from "@/data";
import { safeLoad } from "@/lib/safe-load";
import { portfolioOwner } from "@/lib/signia/owner";

// Public Signia portfolio. Only published, public portfolios exist here; private and
// application-only items are never sent to the page.

async function load(handle: string) {
  const bundle = await repos.signia.getByHandle(handle);
  if (!bundle?.profile || bundle.profile.public_status !== "published" || bundle.profile.discoverability !== "public") {
    return null;
  }
  return { bundle, owner: await portfolioOwner(bundle.userId, "public") };
}

export async function generateMetadata({ params }: PageProps<"/s/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const result = await safeLoad(() => load(handle));
  if (!result.ok || !result.data) return { title: "Signia portfolio", robots: { index: false } };
  const { bundle, owner } = result.data;
  return {
    title: `${owner.name} — Signia portfolio`,
    description: bundle.profile!.headline,
  };
}

export default async function PublicSigniaPage({ params }: PageProps<"/s/[handle]">) {
  const { handle } = await params;
  const result = await safeLoad(() => load(handle));
  if (!result.ok) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <ErrorState title="We couldn't load this portfolio" action={<ReloadButton />} />
      </div>
    );
  }
  if (!result.data) notFound();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <SigniaPortfolio bundle={result.data.bundle} owner={result.data.owner} audience="public" />
    </div>
  );
}
