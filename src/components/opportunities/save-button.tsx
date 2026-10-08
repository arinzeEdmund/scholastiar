"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import type { SavedOpportunityType } from "@/data/types";
import { setOpportunitySaved } from "@/lib/actions/opportunities";
import { cn } from "@/lib/utils";

/**
 * Save toggle for any opportunity. Visitors get a sign-up link instead. The icon fills
 * immediately; if the save fails it flips back and a toast explains why.
 */
export function SaveButton({
  type,
  id,
  name,
  saved,
  signUpHref,
  className,
}: {
  type: SavedOpportunityType;
  id: string;
  name: string;
  saved: boolean;
  /** Present for visitors: the button links to sign-up. */
  signUpHref?: string;
  className?: string;
}) {
  const [optimistic, setOptimistic] = useOptimistic(saved);
  const [pending, startTransition] = useTransition();
  const classes = cn("size-9 shrink-0 rounded-lg", className);

  if (signUpHref) {
    return (
      <Button asChild variant="outline" size="icon" className={classes}>
        <Link href={signUpHref} aria-label={`Sign up to save ${name}`}>
          <Bookmark aria-hidden />
        </Link>
      </Button>
    );
  }

  function toggle() {
    const next = !optimistic;
    startTransition(async () => {
      setOptimistic(next);
      const result = await setOpportunitySaved({ type, id, saved: next });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(next ? "Saved — we'll remind you before the deadline" : "Removed from saved");
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(classes, optimistic && "border-green/40 text-green-dark")}
      aria-pressed={optimistic}
      aria-label={optimistic ? `Remove ${name} from saved` : `Save ${name}`}
      disabled={pending}
      onClick={toggle}
    >
      <Bookmark className={cn(optimistic && "fill-current")} aria-hidden />
    </Button>
  );
}
