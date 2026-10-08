"use client";

import { RotateCw } from "lucide-react";
import { useEffect } from "react";

import { ErrorState } from "@/components/states/error-state";
import { Button } from "@/components/ui/button";

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <ErrorState
        title="This page didn't load properly"
        description="Nothing you did caused this. Try loading it again."
        action={
          <Button onClick={reset}>
            <RotateCw aria-hidden />
            Try again
          </Button>
        }
      />
    </div>
  );
}
