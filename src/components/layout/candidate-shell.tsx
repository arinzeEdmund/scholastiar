"use client";

import { Bell, ChevronDown, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { candidateBottomTabs, candidateTopNav, candidateUserMenu, opportunityNav } from "@/config/navigation";
import { isRouteReady } from "@/config/routes";
import Link from "next/link";

import { MobileBottomTabs } from "./mobile-bottom-tabs";
import { NavLink } from "./nav-link";
import { RouteButton } from "./route-button";
import { UserMenu, type ShellUser } from "./user-menu";

/** Candidate command centre: calm top navigation on desktop, bottom tabs on mobile. */
export function CandidateShell({
  user,
  unreadCount = 0,
  children,
}: {
  user: ShellUser;
  unreadCount?: number;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-soft">
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Logo href={isRouteReady("/dashboard") ? "/dashboard" : null} />

          <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
            <NavLink item={candidateTopNav[0]} variant="top" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 font-medium text-secondary-text hover:text-primary-text">
                  Opportunities
                  <ChevronDown aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                {opportunityNav.map(({ href, label, icon: Icon, pro }) => {
                  const proBadge = pro && (
                    <span className="rounded-full bg-soft-green px-1.5 py-px text-[0.625rem] font-semibold text-green-dark dark:bg-green/15">
                      Pro
                    </span>
                  );
                  return isRouteReady(href) ? (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href}>
                        {Icon && <Icon aria-hidden />}
                        {label}
                        {proBadge && <span className="ml-auto">{proBadge}</span>}
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem key={href} disabled>
                      {Icon && <Icon aria-hidden />}
                      {label}
                      {proBadge}
                      <span className="ml-auto text-[0.625rem] font-semibold text-secondary-text uppercase">Soon</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            {candidateTopNav.slice(1).map((item) => (
              <NavLink key={item.href} item={item} variant="top" />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <RouteButton href="/billing" variant="outline" className="hidden sm:inline-flex">
              <Sparkles aria-hidden className="text-green" />
              Upgrade
            </RouteButton>
            <ThemeToggle />
            <NotificationsButton href="/notifications" count={unreadCount} />
            <UserMenu user={user} items={candidateUserMenu} />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-safe-tabs sm:px-6 lg:pb-10">
        {children}
      </main>

      <MobileBottomTabs items={candidateBottomTabs} />
    </div>
  );
}

export function NotificationsButton({ href, count = 0 }: { href: string; count?: number }) {
  const label = count > 0 ? `Notifications, ${count} unread` : "Notifications";
  return (
    <RouteButton href={href} variant="ghost" size="icon" aria-label={label} className="relative">
      <Bell aria-hidden />
      {count > 0 && <span className="absolute top-2 right-2 size-2 rounded-full bg-green" aria-hidden />}
    </RouteButton>
  );
}
