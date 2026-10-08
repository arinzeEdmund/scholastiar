import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Classes for a bare control (Input, PasswordInput, SelectTrigger) placed inside a BoxField:
 * the box draws the border and focus ring, so the control itself is borderless.
 */
export const boxControl =
  "h-auto w-full rounded-none border-0 bg-transparent px-3.5 pt-0.5 pb-2.5 text-[0.95rem] shadow-none outline-none placeholder:text-subtle-text/80 focus-visible:border-0 focus-visible:ring-0 aria-invalid:border-0 aria-invalid:ring-0 md:text-[0.95rem] dark:bg-transparent dark:hover:bg-transparent dark:aria-invalid:ring-0 data-[size=default]:h-auto";

/** Accessibility props linking a control to its BoxField label and error. */
export function boxControlProps(id: string, error?: string) {
  return { id, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined };
}

/**
 * Contained form field: the label sits inside the box, and a validation error appears
 * as a small icon and short message inside the box — the label and border never turn red.
 */
export function BoxField({
  id,
  label,
  error,
  hint,
  children,
  className,
  bare = false,
  aside,
}: {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
  /** No border of its own — for cells inside a BoxGroup. */
  bare?: boolean;
  /** Small status shown on the label row when there is no error (e.g. password strength). */
  aside?: ReactNode;
}) {
  return (
    <div className={className}>
      <div
        data-invalid={error ? "true" : undefined}
        className={
          bare
            ? "group/box min-w-0"
            : "group/box rounded-xl border border-input bg-card shadow-xs transition-[border-color,box-shadow] focus-within:border-green-action focus-within:ring-4 focus-within:ring-green/15 hover:border-subtle-text/50 focus-within:hover:border-green-action dark:bg-white/[0.03]"
        }
      >
        <div className="flex min-h-4 items-center justify-between gap-3 px-3.5 pt-2.5">
          <label
            htmlFor={id}
            className="shrink-0 text-xs font-medium text-secondary-text transition-colors group-focus-within/box:text-green-dark"
          >
            {label}
          </label>
          {!error && aside}
          {error && <FieldErrorText id={`${id}-error`} message={error} />}
        </div>
        {children}
      </div>
      {hint && !error && <p className="mt-1.5 px-1 text-xs text-secondary-text">{hint}</p>}
    </div>
  );
}

/** The small in-box error: tiny icon and short message in a light red. */
export function FieldErrorText({ id, message, className }: { id?: string; message: string; className?: string }) {
  return (
    <span
      id={id}
      className={cn(
        "flex min-w-0 items-center gap-1 text-right text-[0.5625rem] leading-3 font-medium tracking-wide text-danger-text",
        className,
      )}
    >
      <AlertCircle className="size-2.5 shrink-0" aria-hidden />
      {message}
    </span>
  );
}

/** One bordered box holding several bare BoxFields (e.g. card number, expiry and CVC), divided by hairlines. */
export function BoxGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "divide-y divide-input overflow-hidden rounded-xl border border-input bg-card shadow-xs transition-[border-color,box-shadow] focus-within:border-green-action focus-within:ring-4 focus-within:ring-green/15 dark:bg-white/[0.03]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small error line for option groups (radio tiles, checkboxes) that have no box. */
export function InlineError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-1.5 flex items-center gap-1 px-0.5 text-[0.5625rem] font-medium tracking-wide text-danger-text"
    >
      <AlertCircle className="size-2.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

/** Form-level message (wrong password, declined card): calm, no border. */
export function FormAlert({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-2.5 rounded-xl bg-danger-soft px-3.5 py-3 text-sm leading-snug text-danger dark:bg-danger/10",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
