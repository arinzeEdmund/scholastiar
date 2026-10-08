import { BadgeCheck, Check, Lock, Plane } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const POINTS = [
  "Explain yourself once — every application is prepared from one profile",
  "Visa, funding and relocation guidance for your destination",
  "Deadline reminders and readiness checks for every opportunity",
];

/** Two-column auth frame: form on the left, atmosphere brand panel on the right (desktop). */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1fr]">
      <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
        {/* Quiet atmosphere: a soft green glow and a fading dot grid behind the form. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-48 left-1/2 h-[30rem] w-[46rem] -translate-x-1/2 rounded-full bg-green/10 blur-3xl dark:bg-green/[0.09]" />
          <div className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] bg-size-[22px_22px] dark:opacity-70" />
        </div>
        <header className="flex items-center justify-between px-5 py-3.5 sm:px-10">
          <Logo />
          <ThemeToggle />
        </header>
        <main id="main" className="flex flex-1 items-start justify-center px-5 py-4 sm:px-10 sm:py-6 lg:items-center">
          <div className="w-full max-w-[30rem]">{children}</div>
        </main>
        <footer className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-3 text-xs text-secondary-text">
          <Link href="/privacy" className="hover:text-primary-text">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-primary-text">
            Terms
          </Link>
          <Link href="/faq" className="hover:text-primary-text">
            Help centre
          </Link>
          <span className="inline-flex items-center gap-1">
            <Lock className="size-3" aria-hidden />
            Secure sign-in
          </span>
        </footer>
      </div>

      <aside className="grain relative hidden overflow-hidden aurora-dark text-white lg:flex lg:flex-col lg:justify-center">
        <div className="absolute inset-0 beams" aria-hidden />
        <div className="relative mx-auto w-full max-w-md px-10">
          <p className="text-sm font-semibold text-mint">Scholastiar.ai</p>
          <h2 className="mt-3 text-4xl leading-tight font-bold text-balance">
            Study, fund, work and stay — <span className="text-gradient-mint">with one profile.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-white/80">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green text-white">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-mint/15 text-mint">
                <Plane className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold">MSc Global Public Health</p>
                <p className="flex items-center gap-1 text-sm text-white/65">
                  Kingsbridge University
                  <BadgeCheck className="size-3.5 text-mint" aria-hidden />
                </p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-green" />
            </div>
            <p className="mt-2 text-xs text-white/60">Application readiness · 3 of 4 ready (example)</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
