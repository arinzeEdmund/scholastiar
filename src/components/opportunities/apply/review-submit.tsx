"use client";

import { CheckCircle2, ExternalLink, Loader2, Send } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { APPLY_ROUTE_LABELS } from "@/config/catalogue";
import type { ApplyRoute } from "@/data/types";

const CONSENT: Record<ApplyRoute, string> = {
  hosted: "I've checked this application and want to submit it.",
  partner: "I've checked this application and agree to Scholastiar submitting it for me.",
  official: "I've checked my documents and statement. I'll finish and submit on the official application page.",
};

const DONE: Record<ApplyRoute, { title: string; body: string }> = {
  hosted: {
    title: "Application submitted",
    body: "We'll show every update in your applications and tell you by email.",
  },
  partner: {
    title: "Sent to Scholastiar",
    body: "We'll submit it within one working day and tell you when the university replies.",
  },
  official: {
    title: "Ready for the official page",
    body: "We'll open the university's application page and ask you in three days whether you submitted.",
  },
};

export interface ReviewLine {
  label: string;
  value: string;
  ok: boolean;
}

/**
 * Final check before applying: what's ready, explicit consent, then the route's action.
 * `onSubmit` returns true when the application was recorded.
 */
export function ReviewSubmit({
  route,
  lines,
  onSubmit,
}: {
  route: ApplyRoute;
  lines: ReviewLine[];
  onSubmit: () => Promise<boolean>;
}) {
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div
        className="flex flex-col items-center gap-2 rounded-xl border border-green/30 bg-soft-green/60 p-6 text-center dark:bg-green/10"
        role="status"
      >
        <CheckCircle2 className="size-8 text-green" aria-hidden />
        <p className="font-semibold text-primary-text">{DONE[route].title}</p>
        <p className="max-w-sm text-sm text-secondary-text">{DONE[route].body}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <dl className="divide-y rounded-xl border">
        {lines.map((line) => (
          <div key={line.label} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
            <dt className="text-secondary-text">{line.label}</dt>
            <dd className={line.ok ? "font-medium text-primary-text" : "font-medium text-warning"}>{line.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-start gap-2.5">
        <Checkbox
          id={`consent-${route}`}
          checked={agreed}
          onCheckedChange={(v) => setAgreed(v === true)}
          className="mt-0.5"
        />
        <Label htmlFor={`consent-${route}`} className="text-sm leading-snug font-normal text-secondary-text">
          {CONSENT[route]}
        </Label>
      </div>
      <Button
        type="button"
        size="lg"
        className="w-full rounded-xl"
        disabled={!agreed || pending}
        onClick={() =>
          startTransition(async () => {
            if (await onSubmit()) setDone(true);
          })
        }
      >
        {pending ? (
          <Loader2 className="animate-spin" aria-hidden />
        ) : route === "official" ? (
          <ExternalLink aria-hidden />
        ) : (
          <Send aria-hidden />
        )}
        {route === "official" ? "Continue to the official page" : APPLY_ROUTE_LABELS[route].button}
      </Button>
    </div>
  );
}
