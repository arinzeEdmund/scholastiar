import type { Metadata } from "next";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { SigniaProfileForm } from "@/components/signia/profile-form";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";
import { DEFAULT_SIGNIA_SECTIONS } from "@/lib/signia/labels";

export const metadata: Metadata = { title: "Edit your Signia page" };

function suggestHandle(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 30);
}

export default async function SigniaBuilderPage() {
  const { user } = await requireCandidate();
  const result = await safeLoad(() =>
    Promise.all([repos.signia.get(user.user_id), repos.candidate.getProfile(user.user_id)]),
  );
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SubPageHeader
        backHref="/signia"
        backLabel="Signia"
        title="Edit your page"
        description="Your handle, introduction, audience and the order of your sections."
      />
      {!result.ok ? (
        <ErrorState action={<ReloadButton />} />
      ) : (
        (() => {
          const [{ profile }, candidate] = result.data;
          return (
            <SigniaProfileForm
              defaults={
                profile
                  ? {
                      handle: profile.handle,
                      headline: profile.headline,
                      summary: profile.summary,
                      current_work_summary: profile.current_work_summary,
                      public_status: profile.public_status,
                      discoverability: profile.discoverability,
                      sections: profile.sections,
                    }
                  : {
                      handle: suggestHandle(user.full_name),
                      headline: candidate.headline ?? "",
                      summary: candidate.professional_summary ?? "",
                      current_work_summary: "",
                      public_status: "draft",
                      discoverability: "public",
                      sections: DEFAULT_SIGNIA_SECTIONS,
                    }
              }
            />
          );
        })()
      )}
    </div>
  );
}
