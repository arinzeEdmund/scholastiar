import { CheckCircle2, Lock } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import portrait from "@/assets/guide/nkechinyere.jpg";
import { StepIndicator } from "@/components/auth/step-indicator";
import { ONBOARDING_STEPS, type OnboardingStep } from "@/data/types/candidate";
import { GUIDE, STEP_GUIDE, STEP_READY } from "@/lib/candidate/guide";
import { ONBOARDING } from "@/lib/candidate/labels";

function GuideAvatar({ size }: { size: number }) {
  return (
    <Image
      src={portrait}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover object-[50%_28%] ring-2 ring-card"
      style={{ width: size, height: size }}
    />
  );
}

/** Nkechinyere's notes for a step: why it matters and what to have ready. */
function StepGuide({ step }: { step: OnboardingStep }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
      <div className="relative bg-linear-to-br from-soft-green/80 to-transparent p-4 dark:from-green/10">
        <div className="flex items-center gap-2.5">
          <GuideAvatar size={36} />
          <div>
            <p className="text-sm font-semibold text-primary-text">{GUIDE.name}</p>
            <p className="text-[0.6875rem] text-secondary-text">{GUIDE.role}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-primary-text">{STEP_GUIDE[step].why}</p>
      </div>
      <div className="border-t p-4">
        <p className="text-[0.6875rem] font-semibold tracking-wide text-secondary-text uppercase">Have these ready</p>
        <ul className="mt-2 space-y-1.5">
          {STEP_READY[step].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-primary-text/90">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-dark" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p className="flex items-center gap-1.5 border-t bg-soft/50 px-4 py-2.5 text-[0.6875rem] text-secondary-text dark:bg-white/[0.02]">
        <Lock className="size-3" aria-hidden />
        Private until you apply · saves every step
      </p>
    </div>
  );
}

/** Progress, title, the step's form and Nkechinyere's side notes. */
export function StepFrame({ step, children, aside }: { step: OnboardingStep; children: ReactNode; aside?: ReactNode }) {
  const meta = ONBOARDING[step];
  return (
    <div className="mx-auto max-w-5xl">
      <div className="max-w-2xl">
        <StepIndicator
          steps={ONBOARDING_STEPS.map((s) => ONBOARDING[s].short)}
          current={ONBOARDING_STEPS.indexOf(step)}
        />
      </div>
      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-10">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[1.75rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2rem]">
                {meta.title}
              </h1>
              <p className="mt-1.5 text-secondary-text">{meta.description}</p>
            </div>
            {aside}
          </div>
          {/* Phones: Nkechinyere's note in one line above the form. */}
          <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-soft-green/60 p-3 text-sm text-primary-text lg:hidden dark:bg-green/10">
            <GuideAvatar size={28} />
            <span>{STEP_GUIDE[step].why}</span>
          </p>
          <div className="mt-7">{children}</div>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <StepGuide step={step} />
          </div>
        </aside>
      </div>
    </div>
  );
}
