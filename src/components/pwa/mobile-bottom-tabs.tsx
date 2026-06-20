'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Bookmark, SendHorizontal, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { label: 'Discover', href: '/discover',     icon: Compass },
  { label: 'Saved',    href: '/saved',         icon: Bookmark },
  { label: 'Apply',    href: '/applications',  icon: SendHorizontal },
  { label: 'Alerts',   href: '/alerts',        icon: Bell },
  { label: 'Me',       href: '/profile',       icon: User },
] as const;

export function MobileBottomTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-stretch border-t border-border bg-white md:hidden"
    >
      {TABS.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
              active
                ? 'text-[#10B65B]'
                : 'text-[#8A8F98] hover:text-[#5F6368]'
            )}
          >
            <Icon
              className={cn('h-5 w-5', active && 'stroke-[2.25px]')}
              aria-hidden="true"
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
