"use client";

import { Menu, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { partnerAgencyNav, sidebarNav, type NavGroup, type NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

import { NotificationsButton } from "./candidate-shell";
import { NavLink } from "./nav-link";
import { RouteButton } from "./route-button";
import { UserMenu, type ShellUser } from "./user-menu";

export type SidebarNavKey = keyof typeof sidebarNav | "partner_agency";

export interface SidebarShellProps {
  user: ShellUser;
  /** Which workspace navigation to show. Resolved here because nav items carry icon components. */
  nav: SidebarNavKey;
  /** e.g. "Employer workspace", "Admin console" */
  surfaceLabel: string;
  organizationName?: string | null;
  userMenu?: NavItem[];
  children: ReactNode;
}

/** Operational workspace frame for employer, provider, forwarder, office/agency and admin surfaces. */
export function SidebarShell({
  user,
  nav,
  surfaceLabel,
  organizationName,
  userMenu = [],
  children,
}: SidebarShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { groups, primaryAction, notificationsHref } = nav === "partner_agency" ? partnerAgencyNav : sidebarNav[nav];
  // Admin uses a dark, denser sidebar to signal the operational console.
  const tone = nav === "admin" ? "console" : "light";

  const sidebar = (onNavigate?: () => void) => (
    <SidebarContent
      surfaceLabel={surfaceLabel}
      organizationName={organizationName}
      groups={groups}
      tone={tone}
      onNavigate={onNavigate}
    />
  );

  return (
    <div className="flex min-h-dvh bg-soft">
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh w-64 shrink-0 border-r lg:flex",
          tone === "console" ? "border-white/10 bg-near-black" : "bg-card",
        )}
      >
        {sidebar()}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card px-4 sm:px-6">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Open navigation">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className={cn(
                "w-72 p-0",
                tone === "console" && "border-white/10 bg-near-black [&_[data-slot=sheet-close]]:text-white",
              )}
              onOpenAutoFocus={(event) => {
                // Focus the panel itself so the first nav item's tooltip doesn't pop open.
                event.preventDefault();
                (event.currentTarget as HTMLElement).focus();
              }}
            >
              <SheetTitle className="sr-only">{surfaceLabel} navigation</SheetTitle>
              <SheetDescription className="sr-only">Sections of the {surfaceLabel} workspace</SheetDescription>
              {sidebar(() => setMenuOpen(false))}
            </SheetContent>
          </Sheet>
          <span className="lg:hidden">
            <Logo href={null} className="text-lg" />
          </span>

          <div className="ml-auto flex items-center gap-2">
            {primaryAction && (
              <RouteButton href={primaryAction.href} className="hidden sm:inline-flex">
                <Plus aria-hidden />
                {primaryAction.label}
              </RouteButton>
            )}
            <ThemeToggle />
            {notificationsHref && <NotificationsButton href={notificationsHref} />}
            <UserMenu user={user} items={userMenu} />
          </div>
        </header>

        <main
          id="main"
          className={cn("mx-auto w-full flex-1 px-4 py-6 sm:px-6", tone === "console" ? "max-w-[1440px]" : "max-w-7xl")}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  surfaceLabel,
  organizationName,
  groups,
  tone,
  onNavigate,
}: {
  surfaceLabel: string;
  organizationName?: string | null;
  groups: NavGroup[];
  tone: "light" | "console";
  onNavigate?: () => void;
}) {
  const isConsole = tone === "console";
  return (
    <div className="flex h-full w-full flex-col">
      <div className={cn("border-b px-5 py-4", isConsole && "border-white/10")}>
        <Logo href={null} inverted={isConsole} />
        <div className={cn("mt-2 text-xs font-medium", isConsole ? "text-white/60" : "text-secondary-text")}>
          {surfaceLabel}
          {organizationName && (
            <span
              className={cn("block truncate text-sm font-semibold", isConsole ? "text-white" : "text-primary-text")}
            >
              {organizationName}
            </span>
          )}
        </div>
      </div>
      <nav aria-label={`${surfaceLabel} sections`} className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((group, index) => (
          <div key={group.label ?? index}>
            {group.label && (
              <div
                className={cn(
                  "mb-1.5 px-2.5 text-[0.7rem] font-semibold tracking-wide uppercase",
                  isConsole ? "text-white/50" : "text-secondary-text",
                )}
              >
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  variant="side"
                  onNavigate={onNavigate}
                  className={cn(
                    isConsole &&
                      "h-8 text-white/70 hover:bg-white/10 hover:text-white aria-[current=page]:bg-white/10 aria-[current=page]:text-white",
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
