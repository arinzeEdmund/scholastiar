"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Check, Loader2, Lock, Monitor, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { PasswordInput } from "@/components/auth/password-input";
import { BoxField, boxControl, boxControlProps, FormAlert } from "@/components/forms/box-field";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { useTheme } from "@/components/theme/theme-provider";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { changePassword, deleteAccount, updateAccount } from "@/lib/actions/settings";
import type { ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";
import {
  accountSchema,
  changePasswordSchema,
  type AccountInput,
  type ChangePasswordInput,
} from "@/lib/validation/candidate";

export function AccountForm({
  defaults,
  email,
  timezones,
}: {
  defaults: AccountInput;
  email: string;
  timezones: string[];
}) {
  const router = useRouter();
  const form = useForm<AccountInput>({ resolver: zodResolver(accountSchema), defaultValues: defaults });
  const { errors } = form.formState;
  const { pending, run } = useFormAction(form.setError);

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        run(
          () => updateAccount(values),
          { loading: "Saving…", success: "Account updated" },
          () => router.refresh(),
        ),
      )}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <BoxField id="account-name" label="Full name" error={errors.fullName?.message}>
          <Input
            {...boxControlProps("account-name", errors.fullName?.message)}
            className={boxControl}
            autoComplete="name"
            {...form.register("fullName")}
          />
        </BoxField>
        <BoxField id="account-email" label="Email" aside={<Lock className="size-3 text-subtle-text" aria-hidden />}>
          <Input
            id="account-email"
            value={email}
            readOnly
            className={cn(boxControl, "text-secondary-text")}
            aria-describedby="account-email-note"
          />
        </BoxField>
        <BoxField id="account-timezone" label="Time zone" error={errors.timezone?.message} className="sm:col-span-2">
          <Controller
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  {...boxControlProps("account-timezone", errors.timezone?.message)}
                  className={boxControl}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </BoxField>
      </div>
      <p id="account-email-note" className="mt-2 px-1 text-xs text-secondary-text">
        Deadlines and reminders use your time zone. To change your email, contact support.
      </p>
      <FormFooter pending={pending} submitLabel="Save changes" sticky={false} />
    </form>
  );
}

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });
  const { errors } = form.formState;
  const { pending, run } = useFormAction(form.setError);

  const field = (name: keyof ChangePasswordInput, label: string, autoComplete: string) => (
    <BoxField id={`pw-${name}`} label={label} error={errors[name]?.message}>
      <PasswordInput
        {...boxControlProps(`pw-${name}`, errors[name]?.message)}
        className={boxControl}
        autoComplete={autoComplete}
        {...form.register(name)}
      />
    </BoxField>
  );

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        run(
          () => changePassword(values),
          { loading: "Updating password…", success: "Password changed" },
          () => form.reset(),
        ),
      )}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {field("currentPassword", "Current password", "current-password")}
        {field("newPassword", "New password", "new-password")}
        {field("confirmPassword", "Confirm new password", "new-password")}
      </div>
      <p className="mt-2 px-1 text-xs text-secondary-text">At least 8 characters, with a letter and a number.</p>
      <FormFooter pending={pending} submitLabel="Change password" sticky={false} />
    </form>
  );
}

const THEMES: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Match my device", icon: Monitor },
];

export function AppearancePicker() {
  const { theme, setTheme } = useTheme();
  return (
    <div role="radiogroup" aria-label="Appearance" className="grid gap-3 sm:grid-cols-3">
      {THEMES.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(value)}
            className={cn(
              "overflow-hidden rounded-xl border border-input bg-card text-left shadow-xs transition-all hover:border-green/50 dark:bg-white/[0.03]",
              active && "border-green-action shadow-[0_0_0_3px_rgb(16_182_91/0.15)]",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "flex h-16 items-end gap-1.5 p-2.5",
                value === "light" && "bg-[#f6f7f6]",
                value === "dark" && "bg-[#0d0f0e]",
                value === "system" && "bg-linear-to-r from-[#f6f7f6] from-50% to-[#0d0f0e] to-50%",
              )}
            >
              <span className={cn("h-6 w-10 rounded-md", value === "dark" ? "bg-white/10" : "bg-white shadow-sm")} />
              <span className="h-3 w-6 rounded-sm bg-[#10b65b]" />
            </span>
            <span className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-primary-text">
              <span className="flex items-center gap-2">
                <Icon className="size-4 text-secondary-text" aria-hidden />
                {label}
              </span>
              {active && <Check className="size-4 text-green-dark" strokeWidth={3} aria-hidden />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function DeleteAccount({ email }: { email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const matches = typed.trim().toLowerCase() === email.toLowerCase();

  return (
    <>
      <Button type="button" variant="destructive" className="w-full rounded-xl sm:w-auto" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (pending) return;
          setOpen(next);
          setTyped("");
          setError(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-danger" aria-hidden />
              Delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your profile, documents and settings, and cancels your plan. It can&apos;t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <FormAlert>{error}</FormAlert>}
          <BoxField id="delete-confirm" label={`Type ${email} to confirm`}>
            <Input
              id="delete-confirm"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              className={boxControl}
            />
          </BoxField>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep my account</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={!matches || pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await deleteAccount(typed);
                  if (!result.ok) {
                    setError(result.error);
                    return;
                  }
                  toast.success("Your account has been deleted");
                  router.push(result.data.redirectTo);
                  router.refresh();
                })
              }
            >
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              Delete permanently
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
