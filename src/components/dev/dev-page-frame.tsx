import { FlaskConical } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/** Plain frame for dev-only pages (not a product surface). */
export function DevPageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-soft">
      <header className="sticky top-0 z-30 border-b bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
          <Logo href={null} className="text-lg" />
          <span className="inline-flex items-center gap-1 rounded-full bg-near-black px-2 py-0.5 text-[0.7rem] font-semibold text-white">
            <FlaskConical className="size-3 text-green" aria-hidden />
            Dev
          </span>
          <nav aria-label="Dev" className="ml-auto flex min-w-0 items-center gap-3 text-sm font-medium sm:gap-4">
            <Link href="/dev" className="whitespace-nowrap text-secondary-text hover:text-primary-text">
              Build<span className="hidden sm:inline"> status</span>
            </Link>
            <Link href="/dev/gallery" className="text-secondary-text hover:text-primary-text">
              Gallery
            </Link>
            <Link href="/dev/outbox" className="text-secondary-text hover:text-primary-text">
              Outbox
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-8 pb-32 sm:px-6">
        {children}
      </main>
    </div>
  );
}
