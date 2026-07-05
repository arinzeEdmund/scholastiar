import Link from 'next/link';
import {
  Briefcase, GraduationCap, BookOpen, Users,
  Coins, Trophy, Presentation, Award, ArrowRight,
} from 'lucide-react';
import { MainNav } from '@/components/nav/main-nav';
import { createClient } from '@/lib/supabase/server';

const SERVICES = [
  { name: 'Visa Sponsored Jobs',         href: '/jobs',         icon: Briefcase,     live: true },
  { name: 'Visa Sponsored Universities', href: '/universities', icon: GraduationCap, live: false },
  { name: 'Visa Sponsored Scholarships', href: '/scholarships', icon: BookOpen,       live: false },
  { name: 'Visa Sponsored Fellowships',  href: '/fellowships',  icon: Users,          live: false },
  { name: 'Visa Sponsored Grants',       href: '/grants',       icon: Coins,          live: false },
  { name: 'Visa Sponsored Competitions', href: '/competitions', icon: Trophy,         live: false },
  { name: 'Visa Sponsored Conferences',  href: '/conferences',  icon: Presentation,   live: false },
  { name: 'Visa Sponsored Awards',       href: '/awards',       icon: Award,          live: false },
];

const STATS = [
  { value: '30+',   label: 'Countries' },
  { value: '1,200+', label: 'Live opportunities' },
  { value: '8',     label: 'Opportunity types' },
  { value: 'Free',  label: 'To get started' },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9F7]">
      <MainNav user={user ? { email: user.email ?? '' } : null} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:py-28 text-center">
        {/* subtle grid bg */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#10B65B0A_1px,transparent_1px),linear-gradient(to_bottom,#10B65B0A_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#10B65B]/30 bg-[#EAF6F0] px-4 py-1.5 text-xs font-semibold text-[#10B65B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B65B] animate-pulse" />
            Visa Sponsored Jobs are live now
          </div>

          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-[#1E1E1E] sm:text-5xl">
            Every opportunity.<br />
            <span className="text-[#10B65B]">Every border.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[#5F6368]">
            Jobs, scholarships, fellowships, grants and more — all filterable by visa sponsorship,
            relocation support, and your nationality. One platform for global talent.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/auth/sign-up/candidate"
              className="flex items-center gap-2 rounded-xl bg-[#10B65B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0ea350]">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/jobs"
              className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#1E1E1E] shadow-sm transition-colors hover:bg-[#F7F9F7]">
              Browse visa sponsored jobs
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-4">
                <p className="text-2xl font-bold text-[#1E1E1E]">{value}</p>
                <p className="mt-0.5 text-xs text-[#8A8F98]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#1E1E1E]">All opportunity types</h2>
            <p className="mt-2 text-sm text-[#5F6368]">
              Every category shows only opportunities open to international applicants.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ name, href, icon: Icon, live }) => (
              <Link
                key={href}
                href={href}
                className="group relative flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5 transition-all hover:border-[#10B65B]/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6F0] transition-colors group-hover:bg-[#10B65B]">
                    <Icon className="h-5 w-5 text-[#10B65B] transition-colors group-hover:text-white" />
                  </div>
                  {live ? (
                    <span className="rounded-full bg-[#10B65B] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Live
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#F7F9F7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#8A8F98]">
                      Soon
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#1E1E1E] leading-snug">{name}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-medium text-[#10B65B] opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="mx-4 mb-16">
        <div className="mx-auto max-w-5xl rounded-2xl bg-[#1E1E1E] px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-white">Hiring international talent?</p>
            <p className="mt-1 text-sm text-white/60">
              Post visa-sponsored roles and reach thousands of qualified global candidates.
            </p>
          </div>
          <Link href="/auth/sign-up/employer"
            className="shrink-0 rounded-xl bg-[#10B65B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0ea350]">
            Post a job
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#E5E7EB] bg-white px-4 py-6 text-center text-xs text-[#8A8F98]">
        © {new Date().getFullYear()} Scholastiar.ai · Built for global talent
      </footer>
    </div>
  );
}
