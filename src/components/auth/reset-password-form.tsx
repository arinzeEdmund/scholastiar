"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { BoxField, boxControl, boxControlProps, FormAlert } from "@/components/forms/box-field";
import { FieldGroup } from "@/components/ui/field";
import { resetPassword } from "@/lib/actions/auth";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/auth";

import { authCta } from "./auth-heading";
import { PasswordInput, PasswordStrength } from "./password-input";

export function ResetPasswordForm({ token }: { token: string }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });
  const { errors } = form.formState;
  const password = useWatch({ control: form.control, name: "password" }) ?? "";

  function onSubmit(values: ResetPasswordInput) {
    setFormError(null);
    const toastId = toast.loading("Updating your password…");
    startTransition(async () => {
      const result = await resetPassword(values);
      if (!result.ok) {
        setFormError(result.error);
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success("Password updated", { id: toastId });
      setDone(true);
    });
  }

  if (done) {
    return (
      <div role="status" className="rounded-2xl border bg-card p-6 shadow-xs dark:bg-white/[0.03]">
        <span className="flex size-11 items-center justify-center rounded-xl bg-soft-green text-green-dark ring-1 ring-green/20">
          <CheckCircle2 className="size-5" aria-hidden />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-primary-text">Your password has been changed</h2>
        <p className="mt-1 text-sm text-secondary-text">Sign in with your new password to continue.</p>
        <Button asChild size="lg" className={`${authCta} mt-6`}>
          <Link href="/auth/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-4">
        {formError && (
          <FormAlert>
            {formError}{" "}
            <Link href="/auth/forgot-password" className="font-medium underline">
              Request a new link
            </Link>
          </FormAlert>
        )}
        <BoxField
          id="password"
          label="New password"
          error={errors.password?.message}
          aside={<PasswordStrength password={password} />}
        >
          <PasswordInput
            {...boxControlProps("password", errors.password?.message)}
            className={boxControl}
            autoComplete="new-password"
            placeholder="8+ characters, with a letter and a number"
            {...form.register("password")}
          />
        </BoxField>
        <BoxField id="confirmPassword" label="Confirm new password" error={errors.confirmPassword?.message}>
          <PasswordInput
            {...boxControlProps("confirmPassword", errors.confirmPassword?.message)}
            className={boxControl}
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
        </BoxField>
        <Button type="submit" size="lg" className={authCta} disabled={pending}>
          {pending && <Loader2 className="animate-spin" aria-hidden />}
          Update password
        </Button>
      </FieldGroup>
    </form>
  );
}
