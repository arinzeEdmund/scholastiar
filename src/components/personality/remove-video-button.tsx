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
import { removePersonalityVideo } from "@/lib/actions/personality";

export function RemoveVideoButton() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  function remove() {
    startTransition(async () => {
      const result = await removePersonalityVideo();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      toast.success("Video removed");
    });
  }
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="rounded-xl text-secondary-text hover:text-danger"
        onClick={() => setOpen(true)}
      >
        <Trash2 aria-hidden />
        Remove
      </Button>
      <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove your video?</AlertDialogTitle>
            <AlertDialogDescription>
              Nobody will be able to watch it, and it won&apos;t be attached to new applications. You can record a new
              one any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep it</AlertDialogCancel>
            <Button variant="destructive" onClick={remove} disabled={pending}>
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              Remove video
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
