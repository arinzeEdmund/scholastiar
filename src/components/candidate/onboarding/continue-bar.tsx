"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTransition } from "react";

import { FormFooter } from "@/components/forms/form-footer";
import type { OnboardingStep } from "@/data/types";
import { continueOnboarding } from "@/lib/actions/candidate";

/** Footer for steps saved item by item (education, experience) or optional (PersonalityAI CV). */
export function ContinueBar({
  step,
  backHref,
  label = "Continue",
}: {
  step: OnboardingStep;
  backHref: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await continueOnboarding(step);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          router.push(result.data.redirectTo);
        });
      }}
    >
      <FormFooter pending={pending} submitLabel={label} continueArrow backHref={backHref} />
    </form>
  );
}
