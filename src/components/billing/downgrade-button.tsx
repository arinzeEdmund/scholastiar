"use client";

import { Loader2 } from "lucide-react";
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

/** Pro → Starter at the end of the period, or undo a scheduled downgrade. */
export function DowngradeButton({ scheduled, endsOn }: { scheduled: boolean; endsOn: string }) {
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
            <AlertDialogTitle>Move to Starter on {endsOn}?</AlertDialogTitle>
            <AlertDialogDescription>
              You keep Pro until then. After that, student jobs and post-study jobs lock, and Pro-only help like
              interview preparation and essay support stops. Your profile, CVs and saved items stay.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Stay on Pro</AlertDialogCancel>
            <Button onClick={() => run("starter")} disabled={pending}>
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              Switch at period end
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
