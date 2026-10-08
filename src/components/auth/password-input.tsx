"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState, type ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Password field with a show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<ComponentProps<typeof Input>, "type">>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <div className="relative">
        <Input ref={ref} type={visible ? "text" : "password"} className={cn("pr-11", className)} {...props} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-secondary-text hover:text-primary-text"
        >
          {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </div>
    );
  },
);

const LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;

export function passwordScore(password: string): number {
  if (password.length < 8) return 0;
  let score = 1;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

/** Inline strength meter for a BoxField's label row: four short bars and a word (never colour alone). */
export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = passwordScore(password);
  const tone = score <= 1 ? "bg-danger" : score === 2 ? "bg-warning" : "bg-green";
  return (
    <span className="flex items-center gap-1.5" aria-live="polite">
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={cn("h-1 w-3.5 rounded-full", segment <= score ? tone : "bg-neutral-soft dark:bg-white/10")}
          />
        ))}
      </span>
      <span className="text-[0.6875rem] font-medium text-secondary-text">
        <span className="sr-only">Password strength: </span>
        {LABELS[score]}
      </span>
    </span>
  );
}
