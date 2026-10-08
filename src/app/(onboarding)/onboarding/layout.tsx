import { LogOut } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { requireCandidate } from "@/lib/guards";

/** Focused frame for the onboarding interview: no app navigation, just progress and a way out. */
export default async function OnboardingLayout({ children }: LayoutProps<"/onboarding">) {
  await requireCandidate();
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-56 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-green/10 blur-3xl dark:bg-green/[0.08]" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,black,transparent)] bg-size-[22px_22px]" />
      </div>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo href="/dashboard" />
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-secondary-text transition-colors hover:bg-soft hover:text-primary-text dark:hover:bg-white/5"
          >
            <LogOut className="size-4" aria-hidden />
            Save and exit
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 pt-4 pb-10 sm:px-6 sm:pt-8">
        {children}
      </main>
    </div>
  );
}
