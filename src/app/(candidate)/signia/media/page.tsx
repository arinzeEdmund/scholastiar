import type { Metadata } from "next";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { MediaLibrary } from "@/components/signia/media-library";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = { title: "Signia media" };

export default async function SigniaMediaPage() {
  const { user } = await requireCandidate();
  const result = await safeLoad(() => repos.signia.get(user.user_id));
  return (
    <div className="space-y-6">
      <SubPageHeader
        backHref="/signia"
        backLabel="Signia"
        title="Media and documents"
        description="Posters, papers, slides, certificates and videos that prove your work. Link each one to a project."
      />
      {result.ok ? (
        <MediaLibrary
          items={result.data.media}
          projects={result.data.projects.map((p) => ({ id: p.id, title: p.title }))}
        />
      ) : (
        <ErrorState action={<ReloadButton />} />
      )}
    </div>
  );
}
