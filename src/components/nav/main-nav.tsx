'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  Briefcase, GraduationCap, BookOpen, Users,
  Coins, Trophy, Presentation, Award,
  Menu, X, ChevronDown, Globe,
} from 'lucide-react';

const SERVICES = [
  {
    name: 'Visa Sponsored Jobs',
    href: '/jobs',
    icon: Briefcase,
    desc: 'Roles that offer visa & work permit support',
    tag: 'Live',
  },
  {
    name: 'Visa Sponsored Universities',
    href: '/universities',
    icon: GraduationCap,
    desc: 'Degree programmes open to international students',
    tag: null,
  },
  {
    name: 'Visa Sponsored Scholarships',
    href: '/scholarships',
    icon: BookOpen,
    desc: 'Funded study awards across 100+ countries',
    tag: null,
  },
  {
    name: 'Visa Sponsored Fellowships',
    href: '/fellowships',
    icon: Users,
    desc: 'Leadership and research fellowships worldwide',
    tag: null,
  },
  {
    name: 'Visa Sponsored Grants',
    href: '/grants',
    icon: Coins,
    desc: 'Project and innovation funding for global talent',
    tag: null,
  },
  {
    name: 'Visa Sponsored Competitions',
    href: '/competitions',
    icon: Trophy,
    desc: 'Prize competitions open to all nationalities',
    tag: null,
  },
  {
    name: 'Visa Sponsored Conferences',
    href: '/conferences',
    icon: Presentation,
    desc: 'Funded attendance and training opportunities',
    tag: null,
  },
  {
    name: 'Visa Sponsored Awards',
    href: '/awards',
    icon: Award,
    desc: 'Recognition programmes that elevate global careers',
    tag: null,
  },
];

export function MainNav({ user }: { user?: { email: string } | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B65B]">
            <Globe className="h-4 w-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold text-[#1E1E1E] tracking-tight">
            Scholastiar<span className="text-[#10B65B]">.</span>ai
          </span>
        </Link>

        {/* Desktop centre nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Opportunities mega-menu trigger */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setDropOpen((v) => !v)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                dropOpen
                  ? 'bg-[#EAF6F0] text-[#10B65B]'
                  : 'text-[#5F6368] hover:bg-[#F7F9F7] hover:text-[#1E1E1E]'
              }`}
            >
              Opportunities
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega-menu dropdown */}
            {dropOpen && (
              <div className="absolute left-1/2 top-full mt-2 w-[640px] -translate-x-1/2 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl ring-1 ring-black/5">
                <div className="p-4">
                  <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-widest text-[#8A8F98]">
                    All opportunity types
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {SERVICES.map(({ name, href, icon: Icon, desc, tag }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setDropOpen(false)}
                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[#F7F9F7]"
                      >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF6F0] transition-colors group-hover:bg-[#10B65B]">
                          <Icon className="h-4 w-4 text-[#10B65B] transition-colors group-hover:text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-[#1E1E1E] leading-tight">
                              {name}
                            </span>
                            {tag && (
                              <span className="rounded-full bg-[#10B65B] px-1.5 py-0.5 text-[10px] font-semibold text-white leading-none">
                                {tag}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[12px] text-[#8A8F98] leading-snug">{desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-[#F0F0F0] pt-3 px-1">
                    <Link
                      href="/jobs"
                      onClick={() => setDropOpen(false)}
                      className="text-[12px] font-medium text-[#10B65B] hover:underline"
                    >
                      Browse all opportunities →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/employer/setup"
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#5F6368] transition-colors hover:bg-[#F7F9F7] hover:text-[#1E1E1E]">
            For Employers
          </Link>
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link href="/discover"
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#5F6368] hover:bg-[#F7F9F7] hover:text-[#1E1E1E] transition-colors">
                Dashboard
              </Link>
              <Link href="/profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF6F0] text-xs font-bold text-[#10B65B] transition-colors hover:bg-[#10B65B] hover:text-white">
                {user.email[0].toUpperCase()}
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#5F6368] transition-colors hover:bg-[#F7F9F7] hover:text-[#1E1E1E]">
                Sign in
              </Link>
              <Link href="/auth/sign-up/candidate"
                className="rounded-lg bg-[#10B65B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0ea350]">
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-[#5F6368] transition-colors hover:bg-[#F7F9F7] md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[#E5E7EB] bg-white md:hidden">
          <div className="max-h-[80vh] overflow-y-auto px-4 py-4 space-y-1">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-[#8A8F98]">
              Opportunities
            </p>
            {SERVICES.map(({ name, href, icon: Icon, tag }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#F7F9F7]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF6F0]">
                  <Icon className="h-4 w-4 text-[#10B65B]" />
                </div>
                <span className="flex-1 text-[14px] font-medium text-[#1E1E1E]">{name}</span>
                {tag && (
                  <span className="rounded-full bg-[#10B65B] px-2 py-0.5 text-[10px] font-semibold text-white">
                    {tag}
                  </span>
                )}
              </Link>
            ))}

            <div className="border-t border-[#E5E7EB] pt-3 mt-3 space-y-1">
              <Link href="/employer/setup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-medium text-[#5F6368] hover:bg-[#F7F9F7]">
                For Employers
              </Link>
              {user ? (
                <>
                  <Link href="/discover" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-medium text-[#5F6368] hover:bg-[#F7F9F7]">
                    Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-medium text-[#5F6368] hover:bg-[#F7F9F7]">
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/sign-in" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-medium text-[#5F6368] hover:bg-[#F7F9F7]">
                    Sign in
                  </Link>
                  <Link href="/auth/sign-up/candidate" onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-xl bg-[#10B65B] px-4 py-3 text-center text-[14px] font-semibold text-white hover:bg-[#0ea350] transition-colors">
                    Get started — it's free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
