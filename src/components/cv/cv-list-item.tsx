import { FileText, Target } from "lucide-react";
import Link from "next/link";

import type { CvVersion } from "@/data/types";
import { coveragePercent, formatCvDate, formatLabel } from "@/lib/cv/labels";

/** One CV in a list: name, what it's for, format, date and keyword match. */
export function CvListItem({ cv }: { cv: CvVersion }) {
  const coverage = coveragePercent(cv);
  return (
    <Link
      href={`/ai-cv/${cv.id}`}
      className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-soft dark:hover:bg-white/[0.04]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-soft-green text-green-dark dark:bg-green/15">
        <FileText className="size-4.5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-primary-text group-hover:text-green-dark">
          {cv.title}
        </span>
        <span className="flex flex-wrap items-center gap-x-2 text-xs text-secondary-text">
          <span>{formatLabel(cv)}</span>
          <span aria-hidden>·</span>
          <span>{formatCvDate(cv.created_at)}</span>
          {cv.edited_at && (
            <>
              <span aria-hidden>·</span>
              <span>edited</span>
            </>
          )}
        </span>
      </span>
      {coverage !== null && (
        <span
          className="hidden shrink-0 items-center gap-1 rounded-full bg-soft-green px-2 py-0.5 text-xs font-semibold text-green-dark sm:inline-flex dark:bg-green/15"
          title="Share of the programme's key words your CV already uses"
        >
          <Target className="size-3" aria-hidden />
          {coverage}% match
        </span>
      )}
    </Link>
  );
}
