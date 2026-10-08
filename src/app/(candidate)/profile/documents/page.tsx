import type { Metadata } from "next";

import { DocumentVault } from "@/components/candidate/document-vault";
import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Documents" };

export default async function DocumentsPage() {
  const { user } = await requireCandidate();
  const documents = await repos.candidate.listDocuments(user.user_id);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SubPageHeader
        backHref="/profile"
        backLabel="Profile"
        title="Documents"
        description="Your CVs, transcripts, certificates and visa documents in one private place."
      />
      <DocumentVault documents={documents} />
    </div>
  );
}
