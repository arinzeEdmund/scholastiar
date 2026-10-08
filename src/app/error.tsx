"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { StatusPage } from "@/components/states/status-page";
import { Button } from "@/components/ui/button";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      icon={AlertTriangle}
      title="This page didn't load properly"
      description="Nothing you did caused this, and your data is safe. Try loading it again."
      actions={
        <>
          <Button size="lg" onClick={reset}>
            <RotateCw aria-hidden />
            Try again
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/server-error">Get help</Link>
          </Button>
        </>
      }
      footnote={error.digest ? `Reference: ${error.digest}` : undefined}
    />
  );
}
