"use client";

import type { NavItem } from "@/config/navigation";

import { NavLink } from "./nav-link";

/** App-like bottom navigation for signed-in applicants on mobile (PWA_FIRST_WEB_APP.md). */
export function MobileBottomTabs({ items }: { items: NavItem[] }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-safe backdrop-blur lg:hidden"
    >
      <div className="mx-auto flex max-w-md">
        {items.map((item) => (
          <NavLink key={item.href} item={item} variant="tab" />
        ))}
      </div>
    </nav>
  );
}
