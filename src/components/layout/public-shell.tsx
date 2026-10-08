"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { publicNav } from "@/config/navigation";

import { NavLink } from "./nav-link";
import { PublicFooter } from "./public-footer";
import { RouteButton } from "./route-button";
import { UserMenu, type ShellUser } from "./user-menu";

export interface PublicAccount {
  user: ShellUser;
  /** Where this account goes next: checkout, verification, onboarding or the workspace. */
  next: { href: string; label: string } | null;
}

/** Public website frame: editorial header, content, strong dark footer. */
export function PublicShell({ children, account }: { children: ReactNode; account?: PublicAccount | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Logo />
          <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
            {publicNav.map((item) => (
              <NavLink key={item.href} item={item} variant="top" />
            ))}
          </nav>
          <ThemeToggle className="ml-auto" />
          <Button asChild variant="ghost" size="icon" className="-ml-4" aria-label="Search">
            <Link href="/search">
              <Search />
            </Link>
          </Button>
          {account ? (
            <div className="flex items-center gap-3">
              {account.next && (
                <RouteButton href={account.next.href} className="hidden lg:inline-flex">
                  {account.next.label}
                </RouteButton>
              )}
              <UserMenu user={account.user} next={account.next ?? undefined} />
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <RouteButton href="/auth/sign-in" variant="ghost">
                Sign in
              </RouteButton>
              <RouteButton href="/auth/choose-role">Get started</RouteButton>
            </div>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-4 lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[86vw] max-w-sm"
              onOpenAutoFocus={(event) => {
                // Focus the panel itself so the first nav item's tooltip doesn't pop open.
                event.preventDefault();
                (event.currentTarget as HTMLElement).focus();
              }}
            >
              <SheetHeader>
                <SheetTitle>
                  <Logo href={null} />
                </SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {publicNav.map((item) => (
                  <NavLink key={item.href} item={item} variant="side" onNavigate={() => setMenuOpen(false)} />
                ))}
              </nav>
              <div className="mt-auto grid gap-2 p-4">
                {account ? (
                  account.next && (
                    <RouteButton href={account.next.href} size="lg">
                      {account.next.label}
                    </RouteButton>
                  )
                ) : (
                  <>
                    <RouteButton href="/auth/choose-role" size="lg">
                      Get started
                    </RouteButton>
                    <RouteButton href="/auth/sign-in" variant="outline" size="lg">
                      Sign in
                    </RouteButton>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <PublicFooter />
    </div>
  );
}
