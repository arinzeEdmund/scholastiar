import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Calm, recoverable errors: what happened + what to do next. Never blames the user. */
export function ErrorState({
  title = "We couldn't load this right now",
  description = "This is usually temporary. Try again in a moment.",
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center rounded-lg border bg-soft px-6 py-12 text-center", className)}
    >
      <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-warning-soft text-warning">
        <AlertTriangle className="size-5" aria-hidden />
      </span>
      <h3 className="text-base font-semibold text-primary-text">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-secondary-text">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
