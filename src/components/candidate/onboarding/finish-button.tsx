"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

import { ActionBar, BackLink, BarHint, PrimaryAction } from "@/components/forms/form-footer";
import { finishOnboarding } from "@/lib/actions/candidate";

export function FinishOnboarding({ alreadyFinished }: { alreadyFinished: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <ActionBar>
      <BackLink href="/onboarding/personality-cv" />
      <BarHint>You can edit anything later from your profile</BarHint>
      <PrimaryAction
        type="button"
        pending={pending}
        icon={<Check aria-hidden />}
        label={alreadyFinished ? "Save and go to dashboard" : "Finish set-up"}
        onClick={() => {
          const toastId = toast.loading("Finishing set-up…");
          startTransition(async () => {
            const result = await finishOnboarding();
            if (!result.ok) {
              toast.error(result.error, { id: toastId });
              return;
            }
            toast.success("Your profile is ready", { id: toastId });
            router.push(alreadyFinished ? "/dashboard" : result.data.redirectTo);
            router.refresh();
          });
        }}
      />
    </ActionBar>
  );
}
