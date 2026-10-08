import { Check } from "lucide-react";

import type { ApplyRoute } from "@/data/types";
import { cn } from "@/lib/utils";

const LAST: Record<ApplyRoute, string> = {
  hosted: "Submit",
  partner: "We submit",
  official: "Finish on official page",
};

export function applySteps(route: ApplyRoute): string[] {
  return ["Requirements", "Documents", "Statement", "Review", LAST[route]];
}

/** Progress through the shared apply workspace. */
export function ApplySteps({ route, current }: { route: ApplyRoute; current: number }) {
  const steps = applySteps(route);
  return (
    <ol className="flex items-center gap-1.5 sm:gap-2" aria-label="Application steps">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={label}
            className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2"
            aria-current={active ? "step" : undefined}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                done && "bg-green-action text-white",
                active && "bg-soft-green text-green-dark ring-2 ring-green dark:bg-green/15",
                !done && !active && "bg-neutral-soft text-secondary-text dark:bg-white/10",
              )}
            >
              {done ? <Check className="size-3.5" aria-label="Done" /> : index + 1}
            </span>
            <span
              className={cn(
                "hidden truncate text-xs sm:block",
                active ? "font-semibold text-primary-text" : "text-secondary-text",
              )}
            >
              {label}
            </span>
            {index < steps.length - 1 && <span className="h-px min-w-3 flex-1 bg-border" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
