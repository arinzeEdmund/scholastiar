import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Page title row: title, supporting line, and the page's actions. */
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-1.5 text-sm font-medium text-green-dark">{eyebrow}</div>}
        <h1 className="text-2xl font-bold text-primary-text sm:text-[1.75rem]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-secondary-text sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** A titled region inside a page. Not a card — sections stay flat. */
export function PageSection({
  title,
  description,
  actions,
  children,
  className,
  id,
}: {
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            {title && <h2 className="text-lg font-semibold text-primary-text">{title}</h2>}
            {description && <p className="mt-1 text-sm text-secondary-text">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
