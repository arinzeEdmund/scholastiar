'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { label: 'Personal',    href: '/onboarding/personal' },
  { label: 'Visa',        href: '/onboarding/visa' },
  { label: 'Education',   href: '/onboarding/education' },
  { label: 'Experience',  href: '/onboarding/experience' },
  { label: 'Skills',      href: '/onboarding/skills' },
  { label: 'Preferences', href: '/onboarding/preferences' },
  { label: 'Review',      href: '/onboarding/review' },
] as const;

function stepIndex(pathname: string) {
  return STEPS.findIndex((s) => pathname.startsWith(s.href));
}

export function OnboardingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = stepIndex(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9F7]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-semibold tracking-tight text-[#1E1E1E]">
            Scholastiar<span className="text-[#10B65B]">.</span>
          </Link>
          <span className="text-sm text-[#8A8F98]">
            Step {Math.max(current + 1, 1)} of {STEPS.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-[#E5E7EB]">
          <div
            className="h-full bg-[#10B65B] transition-all duration-300"
            style={{ width: `${((Math.max(current, 0) + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Step pills (desktop) */}
      <div className="hidden border-b border-[#E5E7EB] bg-white md:block">
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 py-3">
          {STEPS.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div
                key={step.href}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                  done && 'bg-[#EAF6F0] text-[#087A3E]',
                  active && 'bg-[#10B65B] text-white',
                  !done && !active && 'text-[#8A8F98]'
                )}
              >
                {done ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
                {step.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
