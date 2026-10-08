"use client";

import { AlertTriangle, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { draftStatement } from "@/lib/actions/drafts";

type State = { kind: "idle" } | { kind: "result"; facts: string[] } | { kind: "failed"; message: string };

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

/**
 * AI statement of purpose for one programme: generate, edit, regenerate, and a clear failure
 * state. The draft is written only from the student's profile and is always theirs to edit.
 */
export function StatementDrafter({ programId, onChange }: { programId: string; onChange?: (text: string) => void }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [text, setText] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [pending, startTransition] = useTransition();

  function generate(nextAttempt: number) {
    startTransition(async () => {
      const result = await draftStatement({ programId, attempt: nextAttempt });
      if (!result.ok) {
        setState({ kind: "failed", message: result.error });
        toast.error("Draft not ready");
        return;
      }
      setAttempt(nextAttempt);
      setText(result.data.text);
      onChange?.(result.data.text);
      setState({ kind: "result", facts: result.data.facts });
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor={`statement-${programId}`} className="text-sm font-semibold text-primary-text">
          Statement of purpose
        </Label>
        {state.kind === "result" && (
          <Button type="button" variant="outline" size="sm" onClick={() => generate(attempt + 1)} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : <RotateCcw aria-hidden />}
            Try another version
          </Button>
        )}
      </div>

      {state.kind === "idle" && !pending && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center">
          <span className="flex size-10 items-center justify-center rounded-xl bg-soft-green text-green-dark dark:bg-green/15">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <p className="max-w-sm text-sm text-secondary-text">
            We&apos;ll draft it from your profile — your studies, experience and goals. Nothing is invented, and you
            edit every word before it&apos;s used.
          </p>
          <Button type="button" onClick={() => generate(0)}>
            <Sparkles aria-hidden />
            Draft with AI
          </Button>
        </div>
      )}

      {pending && state.kind !== "result" && (
        <div className="space-y-2 rounded-xl border p-4" role="status" aria-live="polite">
          <p className="flex items-center gap-2 text-sm text-secondary-text">
            <Loader2 className="size-4 animate-spin text-green" aria-hidden />
            Writing from your profile…
          </p>
          <div className="h-3 w-full animate-pulse rounded bg-neutral-soft dark:bg-white/10" />
          <div className="h-3 w-11/12 animate-pulse rounded bg-neutral-soft dark:bg-white/10" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-neutral-soft dark:bg-white/10" />
        </div>
      )}

      {state.kind === "failed" && !pending && (
        <div
          className="flex flex-col gap-3 rounded-xl border border-warning/40 bg-warning-soft/50 p-4 sm:flex-row sm:items-center"
          role="alert"
        >
          <AlertTriangle className="size-5 shrink-0 text-warning" aria-hidden />
          <p className="flex-1 text-sm text-primary-text">{state.message}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => generate(attempt)}>
            <RotateCcw aria-hidden />
            Try again
          </Button>
        </div>
      )}

      {state.kind === "result" && (
        <>
          <Textarea
            id={`statement-${programId}`}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onChange?.(e.target.value);
            }}
            rows={8}
            className="rounded-xl"
            aria-describedby={`statement-${programId}-meta`}
          />
          <div
            id={`statement-${programId}-meta`}
            className="flex flex-wrap justify-between gap-2 text-xs text-secondary-text"
          >
            <span>
              {state.facts.length > 0
                ? `Built from: ${state.facts.join(" · ")}`
                : "Add education and experience for a stronger draft"}
            </span>
            <span className="tabular-nums">{words(text)} words</span>
          </div>
        </>
      )}
    </div>
  );
}
