import type { Metadata } from "next";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { SigniaLinksForm } from "@/components/signia/links-form";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = { title: "Signia links" };

export default async function SigniaLinksPage() {
  const { user } = await requireCandidate();
  const result = await safeLoad(() => repos.signia.get(user.user_id));
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SubPageHeader
        backHref="/signia"
        backLabel="Signia"
        title="Links"
        description="Your professional profiles in one place, in the order you choose."
      />
      {result.ok ? (
        <SigniaLinksForm
          defaults={{
            links: result.data.links.map((l) => ({
              id: l.id,
              platform: l.platform,
              label: l.label,
              url: l.url,
              visibility: l.visibility,
            })),
          }}
        />
      ) : (
        <ErrorState action={<ReloadButton />} />
      )}
    </div>
  );
}
