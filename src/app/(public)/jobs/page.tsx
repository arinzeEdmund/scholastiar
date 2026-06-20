import { Suspense } from 'react';
import { JobCard } from '@/components/jobs/job-card';
import { getPublicJobs } from '@/lib/actions/jobs';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Browse jobs — Scholastiar.ai' };

interface PageProps {
  searchParams: Promise<{ q?: string; country?: string; work_mode?: string; sponsorship?: string }>;
}

const WORK_MODES = [
  { value: '', label: 'Any mode' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on_site', label: 'On-site' },
];

async function JobList({ q, country, work_mode, sponsorship }: { q?: string; country?: string; work_mode?: string; sponsorship?: string }) {
  const result = await getPublicJobs({ q, country, work_mode, sponsorship });
  if (!result.ok) return <p className="text-sm text-red-500">Failed to load jobs: {result.error}</p>;
  const jobs = result.data;
  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[#5F6368]">No jobs match your search. Try adjusting the filters.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {jobs.map((job) => <JobCard key={job.id} job={job} />)}
    </div>
  );
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { q, country, work_mode, sponsorship } = params;

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      {/* Hero search bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-semibold text-[#1E1E1E]">
            International jobs &amp; opportunities
          </h1>
          <p className="mt-1 text-sm text-[#5F6368]">
            Visa-sponsored, relocation-friendly, and cross-border roles worldwide.
          </p>
          <form method="GET" className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8F98]" />
              <Input
                name="q"
                defaultValue={q}
                placeholder="Job title, skill, or keyword"
                className="pl-9"
              />
            </div>
            <Input
              name="country"
              defaultValue={country}
              placeholder="Country"
              className="w-36"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Filter chips */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#8A8F98]" />
          {WORK_MODES.map(({ value, label }) => (
            <a
              key={value}
              href={`/jobs?${new URLSearchParams({ ...(q ? { q } : {}), ...(country ? { country } : {}), ...(value ? { work_mode: value } : {}), ...(sponsorship ? { sponsorship } : {}) }).toString()}`}
            >
              <Badge
                variant={work_mode === value || (!work_mode && !value) ? 'default' : 'outline'}
                className="cursor-pointer"
              >
                {label}
              </Badge>
            </a>
          ))}
          <a
            href={`/jobs?${new URLSearchParams({ ...(q ? { q } : {}), ...(country ? { country } : {}), ...(work_mode ? { work_mode } : {}), sponsorship: sponsorship === 'yes' ? '' : 'yes' }).toString()}`}
          >
            <Badge
              variant={sponsorship === 'yes' ? 'default' : 'outline'}
              className="cursor-pointer"
            >
              ✈ Visa sponsored
            </Badge>
          </a>
        </div>

        <Suspense fallback={<div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-white animate-pulse border border-[#E5E7EB]" />)}</div>}>
          <JobList q={q} country={country} work_mode={work_mode} sponsorship={sponsorship} />
        </Suspense>
      </div>
    </div>
  );
}
