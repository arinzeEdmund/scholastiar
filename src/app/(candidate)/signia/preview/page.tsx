import { Eye, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { SigniaPortfolio } from "@/components/signia/signia-portfolio";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Button } from "@/components/ui/button";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";
import { portfolioOwner } from "@/lib/signia/owner";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Signia preview" };

export default async function SigniaPreviewPage({ searchParams }: PageProps<"/signia/preview">) {
  const { user } = await requireCandidate();
  const audience = (await searchParams).as === "reviewer" ? "reviewer" : "public";
  const result = await safeLoad(() =>
    Promise.all([repos.signia.get(user.user_id), portfolioOwner(user.user_id, audience)]),
  );
  const header = (
    <SubPageHeader
      backHref="/signia"
      backLabel="Signia"
      title="Preview your portfolio"
      description="Exactly what each audience sees. Items set to “Only me” never appear."
    />
  );
  if (!result.ok) {
    return (
      <div className="space-y-6">
        {header}
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }
  const [bundle, owner] = result.data;
  if (!bundle.profile) {
    return (
      <div className="space-y-6">
        {header}
        <EmptyState
          icon={Eye}
          title="Nothing to preview yet"
          description="Choose your handle and headline to start your portfolio."
          action={
            <Button asChild className="rounded-xl">
              <Link href="/signia/builder">Set up Signia</Link>
            </Button>
          }
        />
      </div>
    );
  }
  const live = bundle.profile.public_status === "published" && bundle.profile.discoverability === "public";

  return (
    <div className="space-y-6">
      {header}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Preview as" className="inline-flex rounded-xl border bg-card p-1 dark:bg-white/[0.03]">
          {(
            [
              ["public", "Public page"],
              ["reviewer", "Application reviewers"],
            ] as const
          ).map(([key, label]) => (
            <Link
              key={key}
              href={key === "public" ? "/signia/preview" : "/signia/preview?as=reviewer"}
              aria-current={audience === key ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                audience === key ? "bg-green-action text-white" : "text-secondary-text hover:text-primary-text",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        {live && (
          <Link href={`/s/${bundle.profile.handle}`} className="text-sm font-medium text-green-dark hover:underline">
            Open the live page
          </Link>
        )}
      </div>
      {!live && audience === "public" && (
        <p className="flex items-start gap-2 rounded-xl bg-warning-soft px-3.5 py-3 text-sm text-primary-text dark:bg-warning/10">
          <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          {bundle.profile.public_status !== "published"
            ? "Your portfolio isn't published, so nobody can open the public page yet."
            : "Your portfolio is for applications only, so there's no public page."}
        </p>
      )}
      <div className="rounded-3xl border bg-soft p-4 sm:p-8 dark:bg-white/[0.02]">
        <SigniaPortfolio bundle={bundle} owner={owner} audience={audience} />
      </div>
    </div>
  );
}
