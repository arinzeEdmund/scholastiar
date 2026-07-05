'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, Plane, LayoutGrid } from 'lucide-react';

const TABS = [
  { label: 'My Feed',        href: '/dashboard/jobs',               icon: LayoutGrid },
  { label: 'Visa Sponsored', href: '/dashboard/jobs/visa-sponsored', icon: Plane },
  { label: 'Saved',          href: '/dashboard/jobs/saved',          icon: Bookmark },
];

export function DashboardJobsNav({ savedCount }: { savedCount?: number }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-16 z-40 border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 scrollbar-none">
        {TABS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? 'border-[#10B65B] text-[#10B65B]'
                  : 'border-transparent text-[#5F6368] hover:text-[#1E1E1E]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {label === 'Saved' && savedCount !== undefined && savedCount > 0 && (
                <span className="rounded-full bg-[#EAF6F0] px-1.5 py-0.5 text-[11px] font-semibold text-[#10B65B]">
                  {savedCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
