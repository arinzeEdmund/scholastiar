import Link from 'next/link';
import { getAdminStats } from '@/lib/actions/admin';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Scholastiar.ai' };

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: 'Total users',        value: stats.totalUsers ?? 0,       href: '/admin/users' },
    { label: 'Total jobs',         value: stats.totalJobs ?? 0,        href: '/admin/jobs' },
    { label: 'Pending review',     value: stats.pendingJobs ?? 0,      href: '/admin/jobs?status=pending_review', highlight: (stats.pendingJobs ?? 0) > 0 },
    { label: 'Applications',       value: stats.totalApplications ?? 0, href: '/admin/applications' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-white">Platform overview</h1>
        <p className="mt-0.5 text-sm text-white/50">Live counts across the platform.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-xl border p-5 transition-colors hover:border-white/20 ${
              c.highlight
                ? 'border-[#10B65B]/40 bg-[#10B65B]/10'
                : 'border-white/10 bg-[#1A1A1A]'
            }`}
          >
            <p className={`text-3xl font-bold ${c.highlight ? 'text-[#10B65B]' : 'text-white'}`}>
              {c.value}
            </p>
            <p className="mt-1 text-xs text-white/50">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-[#1A1A1A] p-5">
        <h2 className="mb-4 text-sm font-semibold text-white/60 uppercase tracking-wide">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/jobs?status=pending_review"
            className="rounded-lg bg-[#10B65B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0ea350] transition-colors">
            Review pending jobs
          </Link>
          <Link href="/admin/employers"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white/80 hover:border-white/40 transition-colors">
            Verify employers
          </Link>
        </div>
      </div>
    </div>
  );
}
