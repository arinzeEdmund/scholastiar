"use client";

import { Loader2, Trash2 } from "lucide-react";
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
import type { ActionResult } from "@/lib/actions/result";

/** Icon button that asks before deleting, then runs the action with toast feedback. */
export function ConfirmDelete({
  label,
  title,
  description,
  action,
  onDone,
  successMessage = "Deleted",
}: {
  /** Accessible name for the trigger, e.g. "Delete MSc Global Public Health". */
  label: string;
  title: string;
  description: string;
  action: () => Promise<ActionResult<unknown>>;
  onDone?: () => void;
  successMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm() {
    const toastId = toast.loading("Deleting…");
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success(successMessage, { id: toastId });
      setOpen(false);
      onDone?.();
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-secondary-text hover:text-danger"
        onClick={() => setOpen(true)}
        aria-label={label}
      >
        <Trash2 className="size-4" aria-hidden />
      </Button>
      <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep it</AlertDialogCancel>
            <Button variant="destructive" onClick={confirm} disabled={pending}>
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
