import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Empty states guide action: explanation + primary action + optional secondary. */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-lg border border-dashed px-6 py-12 text-center", className)}>
      <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-soft-green text-green-dark">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="text-base font-semibold text-primary-text">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-secondary-text">{description}</p>
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
