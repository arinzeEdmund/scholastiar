import { Gauge } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { EmptyState } from "@/components/states/empty-state";
import { Button } from "@/components/ui/button";
import { CvGenerateForm, type TargetOption } from "@/components/cv/cv-generate-form";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { PROGRAM_LEVELS } from "@/config/catalogue";
import { repos, type CvFormat } from "@/data";
import { EMPTY_QUERY } from "@/lib/catalogue/query";
import { aiCvMonthlyLimit, monthStart } from "@/lib/entitlements";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";
import type { CvGenerateInput } from "@/lib/validation/cv";

export const metadata: Metadata = { title: "Create a tailored CV" };

export default async function CvGeneratePage({ searchParams }: PageProps<"/ai-cv/generate">) {
  const { user } = await requireCandidate();
  const params = await searchParams;
  const [result, bundle, saved, subscription, used] = await Promise.all([
    safeLoad(() => repos.catalogue.search(EMPTY_QUERY)),
    repos.candidate.getBundle(user.user_id),
    repos.opportunities.listSaved(user.user_id),
    repos.billing.getSubscription(user.user_id),
    repos.cvs.countGeneratedSince(user.user_id, monthStart()),
  ]);
  const limit = aiCvMonthlyLimit(subscription?.plan_id);

  const header = (
    <SubPageHeader
      backHref="/ai-cv"
      backLabel="AI CV"
      title="Create a tailored CV"
      description="Choose what it's for and how it should look. We build it from your profile in about a minute — you review every line before using it."
    />
  );
  if (limit !== null && used >= limit) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {header}
        <EmptyState
          icon={Gauge}
          title={`You've used all ${limit} tailored CVs this month`}
          description="Your allowance resets on the 1st. Until then you can edit or duplicate any CV you already have — or move to Pro for unlimited tailored CVs."
          action={
            <Button asChild className="rounded-xl">
              <Link href="/billing">See Pro</Link>
            </Button>
          }
          secondaryAction={
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/ai-cv/history">Open your CVs</Link>
            </Button>
          }
        />
      </div>
    );
  }
  if (!result.ok) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {header}
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }

  const savedIds = new Set(saved.map((s) => s.opportunity_id));
  const programs: TargetOption[] = [];
  const scholarships: TargetOption[] = [];
  for (const entry of result.data.entries) {
    if (entry.type === "program") {
      programs.push({
        value: entry.program.id,
        label: entry.program.name,
        detail: `${PROGRAM_LEVELS[entry.program.level].label}, ${entry.university.name}`,
        saved: savedIds.has(entry.program.id),
      });
    } else if (entry.type === "scholarship") {
      scholarships.push({
        value: entry.scholarship.id,
        label: entry.scholarship.name,
        detail: entry.scholarship.funder_name,
        saved: savedIds.has(entry.scholarship.id),
      });
    }
  }

  // ?target=program:<id> | scholarship:<id> | pasted | general (from the AI CV home quick start).
  const raw = typeof params.target === "string" ? params.target : "";
  const [kind, id] = raw.split(":");
  const known = (list: TargetOption[]) => list.some((o) => o.value === id);
  const targetType: CvGenerateInput["targetType"] =
    kind === "program" && known(programs)
      ? "program"
      : kind === "scholarship" && known(scholarships)
        ? "scholarship"
        : kind === "pasted" || kind === "general"
          ? kind
          : "program";
  // Study targets default to the academic CV; the student can switch.
  const format: CvFormat = targetType === "general" ? "uk_cv" : "academic";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {header}
      <CvGenerateForm
        programs={programs}
        scholarships={scholarships}
        skills={bundle.skills.map((s) => s.skill_name)}
        defaults={{
          targetType,
          targetId: targetType === "program" || targetType === "scholarship" ? id : undefined,
          tone: bundle.profile.communication_style,
          format,
        }}
      />
    </div>
  );
}
