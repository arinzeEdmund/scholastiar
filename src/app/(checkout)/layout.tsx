import { Lock } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/** Distraction-free frame for paying: logo, secure badge, theme toggle — no site navigation. */
export default function CheckoutLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col bg-soft">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-text">
              <Lock className="size-4 text-green-dark" aria-hidden />
              Secure checkout
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-6 text-xs text-secondary-text">
        <Link href="/terms" className="hover:text-primary-text">
          Terms
        </Link>
        <Link href="/privacy" className="hover:text-primary-text">
          Privacy
        </Link>
        <Link href="/faq" className="hover:text-primary-text">
          Help centre
        </Link>
      </footer>
    </div>
  );
}
