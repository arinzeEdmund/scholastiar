"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FlaskConical, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { BoxField, boxControl, boxControlProps, FormAlert } from "@/components/forms/box-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/actions/auth";
import { signInSchema, type SignInInput } from "@/lib/validation/auth";

import { authCta } from "./auth-heading";
import { PasswordInput } from "./password-input";

export interface DemoAccount {
  name: string;
  email: string;
  surface: string;
}

export function SignInForm({ demo }: { demo?: { password: string; accounts: DemoAccount[] } }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors } = form.formState;

  function onSubmit(values: SignInInput) {
    setFormError(null);
    const toastId = toast.loading("Signing in…");
    startTransition(async () => {
      const result = await signIn(values);
      if (!result.ok) {
        setFormError(result.error);
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success("Signed in", { id: toastId });
      router.push(result.data.redirectTo);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-4">
          {formError && <FormAlert>{formError}</FormAlert>}
          <BoxField id="email" label="Email" error={errors.email?.message}>
            <Input
              {...boxControlProps("email", errors.email?.message)}
              className={boxControl}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...form.register("email")}
            />
          </BoxField>
          <div>
            <BoxField id="password" label="Password" error={errors.password?.message}>
              <PasswordInput
                {...boxControlProps("password", errors.password?.message)}
                className={boxControl}
                autoComplete="current-password"
                {...form.register("password")}
              />
            </BoxField>
            <div className="mt-2 flex justify-end">
              <Link href="/auth/forgot-password" className="text-xs font-medium text-green-dark hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button type="submit" size="lg" className={authCta} disabled={pending}>
            {pending && <Loader2 className="animate-spin" aria-hidden />}
            Sign in
          </Button>
        </FieldGroup>
      </form>

      {demo && (
        <div className="rounded-2xl border border-dashed border-info/40 bg-info-soft/70 p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-info">
            <FlaskConical className="size-4" aria-hidden />
            Demo accounts (mock mode only)
          </p>
          <p className="mt-1 text-xs text-secondary-text">
            Every demo account uses the password <code className="font-mono font-semibold">{demo.password}</code>.
          </p>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {demo.accounts.map((account) => (
              <li key={account.email}>
                <button
                  type="button"
                  onClick={() => {
                    form.setValue("email", account.email, { shouldValidate: true });
                    form.setValue("password", demo.password, { shouldValidate: true });
                  }}
                  className="w-full rounded-lg border bg-card px-2.5 py-1.5 text-left text-xs hover:border-info/50"
                >
                  <span className="block font-medium text-primary-text">{account.name}</span>
                  <span className="text-secondary-text">{account.surface}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
