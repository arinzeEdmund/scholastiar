import { CheckCircle2, Circle, Clock, Upload } from "lucide-react";
import Link from "next/link";

import type { Readiness } from "@/lib/catalogue/fit";
import { cn } from "@/lib/utils";

/** Entry requirements and which ones the student's document vault already covers. */
export function RequirementsChecklist({ readiness }: { readiness: Readiness }) {
  const { items, ready, total } = readiness;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-primary-text">
          {ready} of {total} documents ready
        </p>
        <span className="text-xs text-secondary-text">From your document vault</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-soft-green dark:bg-white/10" aria-hidden>
        <div className="h-full rounded-full bg-green" style={{ width: `${total ? (ready / total) * 100 : 0}%` }} />
      </div>
      <ul className="mt-3 divide-y rounded-xl border">
        {items.map(({ requirement, status }) => (
          <li key={requirement.id} className="flex items-center gap-3 px-3 py-2.5">
            {status === "ready" ? (
              <CheckCircle2 className="size-4 shrink-0 text-green" aria-label="Ready" />
            ) : status === "missing" ? (
              <Circle className="size-4 shrink-0 text-subtle-text" aria-label="Missing" />
            ) : (
              <Clock className="size-4 shrink-0 text-info" aria-label="Later step" />
            )}
            <span className="min-w-0 flex-1">
              <span className={cn("block text-sm", status === "ready" ? "text-primary-text" : "text-secondary-text")}>
                {requirement.label}
                {!requirement.required && <span className="text-subtle-text"> (optional)</span>}
              </span>
              {requirement.details && <span className="block text-xs text-subtle-text">{requirement.details}</span>}
            </span>
            {status === "missing" && (
              <Link
                href="/profile/documents"
                className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-green-dark hover:bg-soft-green dark:hover:bg-green/10"
              >
                <Upload className="size-3" aria-hidden />
                Upload
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
