import { ArrowRight, GraduationCap, PartyPopper, Sparkles, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { StrengthRing } from "@/components/candidate/strength-ring";
import { RouteButton } from "@/components/layout/route-button";
import { Button } from "@/components/ui/button";
import { repos } from "@/data";
import { profileStrength } from "@/lib/candidate/strength";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "You're all set" };

export default async function OnboardingCompletePage() {
  const { user } = await requireCandidate();
  const bundle = await repos.candidate.getBundle(user.user_id);
  if (!bundle.onboarding.completed_at) redirect("/onboarding/review");
  const strength = profileStrength(bundle);

  return (
    <div className="mx-auto max-w-2xl pt-4 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-soft-green text-green-dark ring-1 ring-green/20">
        <PartyPopper className="size-8" aria-hidden />
      </span>
      <h1 className="mt-6 text-[2rem] leading-tight font-bold tracking-tight text-balance text-foreground sm:text-[2.5rem]">
        You&apos;re all set, {user.full_name.split(" ")[0]}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-secondary-text">
        Your profile now powers your CV, application answers and your visa guidance.
      </p>

      <div className="mx-auto mt-8 flex max-w-md items-center gap-4 rounded-2xl border bg-card p-4 text-left shadow-xs dark:bg-white/[0.03]">
        <StrengthRing score={strength.score} size={60} />
        <div className="min-w-0">
          <p className="font-semibold text-primary-text">Profile strength: {strength.score}/100</p>
          <p className="text-sm text-secondary-text">
            {strength.next.length ? strength.next[0].tip : "Everything employers look for is in place."}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-md gap-3">
        <Button
          asChild
          size="lg"
          className="h-12 rounded-xl shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_24px_-12px_var(--color-green-action)]"
        >
          <Link href="/dashboard">
            Go to your dashboard
            <ArrowRight aria-hidden />
          </Link>
        </Button>
        <div className="grid gap-3 sm:grid-cols-3">
          <RouteButton href="/universities" variant="outline" className="h-11 rounded-xl">
            <GraduationCap aria-hidden />
            Universities
          </RouteButton>
          <RouteButton href="/ai-cv" variant="outline" className="h-11 rounded-xl">
            <Sparkles aria-hidden />
            Create a CV
          </RouteButton>
          <RouteButton href="/profile" variant="outline" className="h-11 rounded-xl">
            <UserRound aria-hidden />
            Profile
          </RouteButton>
        </div>
      </div>
    </div>
  );
}
