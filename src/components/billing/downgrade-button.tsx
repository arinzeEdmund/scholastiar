"use client";

import { BriefcaseBusiness, FileText, Loader2, MailWarning, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { scheduleDowngrade } from "@/lib/actions/billing";
import { STARTER_MONTHLY_AI_ANSWERS } from "@/lib/entitlements";

/** Pro → Starter at the end of the period, or undo a scheduled downgrade. */
export function DowngradeButton({
  scheduled,
  endsOn,
  cvsThisMonth,
  starterCvLimit,
}: {
  scheduled: boolean;
  endsOn: string;
  cvsThisMonth: number;
  starterCvLimit: number;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function run(planId: "starter" | null) {
    startTransition(async () => {
      const result = await scheduleDowngrade({ planId });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      toast.success(planId ? `You'll move to Starter on ${endsOn}` : "You're staying on Pro");
    });
  }

  if (scheduled) {
    return (
      <Button type="button" className="w-full rounded-xl" onClick={() => run(null)} disabled={pending}>
        {pending && <Loader2 className="animate-spin" aria-hidden />}
        Keep Pro
      </Button>
    );
  }

  return (
    <>
      <Button type="button" variant="outline" className="w-full rounded-xl" onClick={() => setOpen(true)}>
        Switch to Starter
      </Button>
      <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Before you move to Starter on {endsOn}</AlertDialogTitle>
            <AlertDialogDescription>
              You keep everything in Pro until then. After that, this changes:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ul className="space-y-2.5 text-sm">
            <li className="flex gap-2.5">
              <BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              <span>
                <strong className="text-primary-text">The job section turns off.</strong>{" "}
                <span className="text-secondary-text">
                  Student jobs and post-study jobs with residency lock, and you can&apos;t apply to new openings.
                </span>
              </span>
            </li>
            <li className="flex gap-2.5">
              <MailWarning className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              <span>
                <strong className="text-primary-text">Job applications you&apos;ve sent stop updating here.</strong>{" "}
                <span className="text-secondary-text">
                  You won&apos;t see status changes or messages in the app — employers&apos; replies reach you by email
                  only.
                </span>
              </span>
            </li>
            <li className="flex gap-2.5">
              <FileText className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              <span>
                <strong className="text-primary-text">
                  Tailored CVs drop to {starterCvLimit} a month, and AI essays and answers to{" "}
                  {STARTER_MONTHLY_AI_ANSWERS}.
                </strong>{" "}
                <span className="text-secondary-text">You&apos;ve made {cvsThisMonth} this month.</span>
              </span>
            </li>
            <li className="flex gap-2.5">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              <span className="text-secondary-text">
                Interview preparation, scholarship essay support, application intelligence and priority support end.
              </span>
            </li>
          </ul>
          <p className="rounded-xl bg-soft-green/60 px-3 py-2.5 text-sm text-primary-text dark:bg-green/10">
            Your profile, CVs, Signia portfolio and saved programmes stay exactly as they are.
          </p>
          <AlertDialogFooter>
            <Button variant="ghost" onClick={() => run("starter")} disabled={pending}>
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              Switch at period end
            </Button>
            <AlertDialogCancel
              disabled={pending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            >
              Keep Pro
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
