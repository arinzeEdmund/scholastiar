"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/actions/auth";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth";

import { authCta } from "./auth-heading";
import { DevInbox } from "./dev-inbox";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState<{ email: string; devLink?: string } | null>(null);
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const error = form.formState.errors.email?.message;

  function onSubmit(values: ForgotPasswordInput) {
    const toastId = toast.loading("Sending reset link…");
    startTransition(async () => {
      const result = await requestPasswordReset(values);
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success("Check your email", { id: toastId });
      setSent({ email: values.email, devLink: result.data.devLink });
    });
  }

  if (sent) {
    return (
      <div className="space-y-5" role="status">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-xs dark:bg-white/[0.03]">
          <div aria-hidden className="absolute -top-16 -right-16 size-40 rounded-full bg-green/10 blur-2xl" />
          <span className="relative flex size-11 items-center justify-center rounded-xl bg-soft-green text-green-dark ring-1 ring-green/20">
            <MailCheck className="size-5" aria-hidden />
          </span>
          <h2 className="relative mt-4 text-lg font-semibold text-primary-text">Check your email</h2>
          <p className="relative mt-1 text-sm leading-relaxed text-secondary-text">
            If an account exists for <strong className="font-semibold text-primary-text">{sent.email}</strong>,
            we&apos;ve sent a link to choose a new password.
          </p>
          <p className="relative mt-4 flex items-center gap-1.5 text-xs text-secondary-text">
            <Clock className="size-3.5" aria-hidden />
            The link works once and expires in 1 hour.
          </p>
        </div>
        {sent.devLink && <DevInbox href={sent.devLink} label="Open the password reset link" />}
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-1.5 font-medium text-secondary-text hover:text-primary-text"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to sign in
          </Link>
          <button type="button" onClick={() => setSent(null)} className="font-medium text-green-dark hover:underline">
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-4">
        <BoxField id="email" label="Email" error={error}>
          <Input
            {...boxControlProps("email", error)}
            className={boxControl}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
        </BoxField>
        <Button type="submit" size="lg" className={authCta} disabled={pending}>
          {pending && <Loader2 className="animate-spin" aria-hidden />}
          Send reset link
        </Button>
        <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-secondary-text">
          <ShieldCheck className="mt-px size-4 shrink-0 text-green-dark" aria-hidden />
          For your security we never say whether an email has an account. Reset links work once and expire after an
          hour.
        </p>
      </FieldGroup>
    </form>
  );
}
