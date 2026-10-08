import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/** Full-page message used by utility routes (not found, unauthorized, errors, maintenance, offline). */
export function StatusPage({
  icon: Icon,
  code,
  title,
  description,
  actions,
  footnote,
}: {
  icon: LucideIcon;
  code?: string;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  footnote?: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-soft">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <Logo href={null} />
        <ThemeToggle />
      </header>
      <main id="main" className="flex flex-1 items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md text-center">
          <span className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-soft-green text-green-dark">
            <Icon className="size-6" aria-hidden />
          </span>
          {code && <p className="mb-2 text-sm font-semibold text-green-dark">{code}</p>}
          <h1 className="text-2xl font-bold text-primary-text sm:text-3xl">{title}</h1>
          <div className="mt-3 text-base text-secondary-text">{description}</div>
          {actions && <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">{actions}</div>}
          {footnote && <div className="mt-6 text-sm text-secondary-text">{footnote}</div>}
        </div>
      </main>
    </div>
  );
}
