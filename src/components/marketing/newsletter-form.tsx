"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/actions/inbound";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation/inbound";
import { usePwaStore } from "@/store/pwa-store";
import { cn } from "@/lib/utils";

/** Weekly opportunity digest sign-up (PUBLISHING_INTELLIGENCE_ENGINE.md → subscriber funnel). */
export function NewsletterForm({ source, tone = "light" }: { source: string; tone?: "light" | "dark" }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const recordEngagement = usePwaStore((s) => s.recordEngagement);
  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", source },
  });
  const error = form.formState.errors.email?.message;
  const dark = tone === "dark";

  function onSubmit(values: NewsletterInput) {
    const toastId = toast.loading("Subscribing…");
    startTransition(async () => {
      const result = await subscribeToNewsletter(values);
      if (!result.ok) {
        const message = result.fieldErrors?.email?.[0];
        if (message) form.setError("email", { message });
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success(result.data.alreadySubscribed ? "You're already subscribed" : "Subscribed — see you next week", {
        id: toastId,
      });
      recordEngagement();
      setDone(true);
    });
  }

  if (done) {
    return (
      <p
        role="status"
        className={cn("flex items-center gap-2 text-sm font-medium", dark ? "text-white" : "text-green-dark")}
      >
        <CheckCircle2 className="size-5 text-green" aria-hidden />
        You&apos;re on the list. The weekly digest arrives every Monday.
      </p>
    );
  }

  const inputId = `newsletter-email-${source}`;
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="w-full max-w-md">
      <label htmlFor={inputId} className={cn("text-sm font-medium", dark ? "text-white" : "text-primary-text")}>
        Weekly opportunity digest
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Input
          id={inputId}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
          {...form.register("email")}
        />
        <Button type="submit" disabled={pending} className="shrink-0">
          {pending && <Loader2 className="animate-spin" aria-hidden />}
          Subscribe
        </Button>
      </div>
      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className={cn("mt-2 text-sm", dark ? "text-red-300" : "text-destructive")}
        >
          {error}
        </p>
      ) : (
        <p id={`${inputId}-hint`} className={cn("mt-2 text-xs", dark ? "text-white/60" : "text-secondary-text")}>
          New scholarships, programmes and deadlines. Unsubscribe any time.
        </p>
      )}
    </form>
  );
}
