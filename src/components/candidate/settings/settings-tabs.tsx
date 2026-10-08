import Link from "next/link";

import { cn } from "@/lib/utils";

const TABS = [
  { href: "/settings", label: "Account" },
  { href: "/settings/notifications", label: "Notifications" },
];

/** Settings section tabs. Each tab is its own page, so these are links. */
export function SettingsTabs({ active }: { active: string }) {
  return (
    <nav aria-label="Settings" className="border-b">
      <ul className="-mb-px flex gap-6">
        {TABS.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              aria-current={active === tab.href ? "page" : undefined}
              className={cn(
                "block border-b-2 py-2.5 text-sm font-medium transition-colors",
                active === tab.href
                  ? "border-green-action text-primary-text"
                  : "border-transparent text-secondary-text hover:text-primary-text",
              )}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
