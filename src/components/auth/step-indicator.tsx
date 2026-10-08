import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/** Segmented progress through a multi-step flow: "Step 2 of 5 · Your company", then one bar per step. */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  const complete = current >= steps.length;
  const next = steps[current + 1];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-xs">
        <p className="text-secondary-text">
          {complete ? (
            <span className="inline-flex items-center gap-1 font-semibold text-green-dark">
              <Check className="size-3.5" strokeWidth={3} aria-hidden />
              All steps complete
            </span>
          ) : (
            <>
              <span className="font-semibold text-green-dark">Step {current + 1}</span> of {steps.length}
              <span className="mx-1.5 text-subtle-text" aria-hidden>
                ·
              </span>
              <span className="font-medium text-primary-text">{steps[current]}</span>
            </>
          )}
        </p>
        {!complete && next && <p className="hidden text-secondary-text sm:block">Next: {next}</p>}
      </div>
      <ol className="mt-2.5 flex gap-1.5" aria-label="Progress">
        {steps.map((step, index) => (
          <li key={step} className="flex-1" aria-current={index === current ? "step" : undefined}>
            <span className="sr-only">
              {step}
              {index < current ? " (completed)" : index === current ? " (current)" : ""}
            </span>
            <span
              aria-hidden
              className={cn(
                "block h-1.5 rounded-full transition-colors",
                index < current && "bg-green",
                index === current && "bg-linear-to-r from-green-action to-green shadow-[0_0_14px_-2px] shadow-green/60",
                index > current && "bg-neutral-soft dark:bg-white/10",
              )}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

const SIGN_UP_STEP_TITLES: Record<string, string[]> = {
  candidate: ["Your account", "Your plan"],
  employer: ["Your account", "Your company", "Your plan"],
  provider: ["Your account", "Your organisation", "Your plan"],
};

/** Full sign-up journey for a role, so checkout and verification continue the wizard's steps. */
export function signUpSteps(role: string): string[] {
  return [...(SIGN_UP_STEP_TITLES[role] ?? SIGN_UP_STEP_TITLES.candidate), "Payment", "Verify email"];
}
