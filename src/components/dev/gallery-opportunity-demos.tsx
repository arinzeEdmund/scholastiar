"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { ReviewSubmit } from "@/components/opportunities/apply/review-submit";
import { StatementDrafter } from "@/components/opportunities/apply/statement-drafter";
import type { ApplyRoute } from "@/data/types";

/**
 * Statement and review steps wired together. In the gallery, submitting shows the
 * confirmation state only: applications are recorded from U6 Universities onwards.
 */
export function ApplyWorkspaceDemo({
  programId,
  route,
  signedIn,
  documentsReady,
  documentsOk,
}: {
  programId: string;
  route: ApplyRoute;
  signedIn: boolean;
  documentsReady: string;
  documentsOk: boolean;
}) {
  const [statement, setStatement] = useState("");
  const words = statement.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {signedIn ? (
        <StatementDrafter programId={programId} onChange={setStatement} />
      ) : (
        <p className="rounded-xl border border-dashed p-4 text-sm text-secondary-text">
          Sign in as a student (dev panel → persona) to try AI drafting. Use the dev panel&apos;s “Simulate AI failure”
          to see the failure state.
        </p>
      )}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-primary-text">Review and apply</h3>
        <ReviewSubmit
          route={route}
          lines={[
            { label: "Documents", value: `${documentsReady} ready`, ok: documentsOk },
            {
              label: "Statement of purpose",
              value: words ? `${words} words` : "Not written yet",
              ok: words >= 80,
            },
            { label: "Profile", value: "Used for every answer", ok: true },
          ]}
          onSubmit={async () => {
            toast.success("Preview only — applications are recorded from U6");
            return true;
          }}
        />
      </div>
    </div>
  );
}
