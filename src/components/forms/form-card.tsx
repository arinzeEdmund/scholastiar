import { CheckCircle2, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A titled group of fields. `plain` drops the card chrome when the form already sits inside a card
 * (e.g. profile editor sections).
 */
export function FormCard({
  icon: Icon,
  title,
  description,
  complete = false,
  plain = false,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  complete?: boolean;
  plain?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset
      className={cn(
        "min-w-0",
        plain
          ? "border-t pt-6 first:border-t-0 first:pt-0"
          : "rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]",
        className,
      )}
    >
      <legend className="sr-only">{title}</legend>
      <div className={cn("flex items-start gap-3", plain ? "mb-4" : "border-b px-4 py-3.5 sm:px-5")}>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
            complete ? "bg-green-action text-white" : "bg-soft-green text-green-dark dark:bg-green/10",
          )}
        >
          <Icon className="size-[1.1rem]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p aria-hidden className="font-semibold text-primary-text">
            {title}
          </p>
          {description && <p className="text-xs leading-snug text-secondary-text">{description}</p>}
        </div>
        {complete && (
          <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-[0.6875rem] font-semibold text-green-dark">
            <CheckCircle2 className="size-3.5" aria-hidden />
            Done
          </span>
        )}
      </div>
      <div className={cn(!plain && "p-4 sm:p-5")}>{children}</div>
    </fieldset>
  );
}
