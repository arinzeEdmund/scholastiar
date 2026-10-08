import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/** Header for pages inside a section (profile, settings): back link, title, description, actions. */
export function SubPageHeader({
  backHref,
  backLabel,
  title,
  description,
  actions,
}: {
  backHref: string;
  backLabel: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header>
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-secondary-text transition-colors hover:text-primary-text"
      >
        <ChevronLeft className="size-4" aria-hidden />
        {backLabel}
      </Link>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary-text sm:text-[1.75rem]">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-secondary-text sm:text-base">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/** A titled white card section for editor pages. */
export function EditorSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]"
    >
      <h2 id={`${id}-title`} className="text-lg font-semibold text-primary-text">
        {title}
      </h2>
      {description && <p className="mt-0.5 text-sm text-secondary-text">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
