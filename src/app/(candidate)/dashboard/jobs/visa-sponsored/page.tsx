import Link from 'next/link';
import { getVisaSponsoredJobs } from '@/lib/actions/jobs';
import { getSavedJobIds } from '@/lib/actions/saved-jobs';
import { SaveButton } from '@/components/jobs/save-button';
import { DashboardJobsNav } from '@/components/nav/dashboard-jobs-nav';
import {
  MapPin, Briefcase, Building2, Plane, Globe, ChevronRight, SlidersHorizontal,
} from 'lucide-react';
import type { Metadata } from 'next';
import type { JobWithDetails } from '@/types/database';

export const metadata: Metadata = { title: 'Visa Sponsored Jobs — Scholastiar.ai' };

const SPONSORSHIP_CONFIG = {
  available: {
    label: 'Visa sponsored',
    chip: 'bg-[#EAF6F0] text-[#10B65B]',
    dot: 'bg-[#10B65B]',
  },
  open_to_discussion: {
    label: 'Sponsorship possible',
    chip: 'bg-yellow-50 text-yellow-700',
    dot: 'bg-yellow-400',
  },
};

const COUNTRIES = [
  'United Kingdom', 'Canada', 'Germany', 'Netherlands',
  'United Arab Emirates', 'Australia', 'Switzerland', 'Singapore',
];

const WORK_MODES = [
  { value: '', label: 'All modes' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on_site', label: 'On-site' },
];

function formatSalary(min?: number | null, max?: number | null, currency?: string | null) {
  if (!min && !max) return null;
  const sym = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : currency === 'CHF' ? 'CHF ' : currency === 'AUD' ? 'A$' : currency === 'AED' ? 'AED ' : currency === 'SGD' ? 'S$' : currency === 'CAD' ? 'C$' : '$';
  const fmt = (n: number) => n >= 1000 ? `${sym}${Math.round(n / 1000)}k` : `${sym}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return min ? `From ${fmt(min)}` : `Up to ${fmt(max!)}`;
}

function VisaJobCard({ job, isSaved }: { job: JobWithDetails; isSaved: boolean }) {
  const sponsorship = job.job_sponsorship_metadata;
  const config = SPONSORSHIP_CONFIG[sponsorship?.sponsorship_status as keyof typeof SPONSORSHIP_CONFIG];
  const companyName = job.employer_companies?.name;
  const location = [job.city, job.country].filter(Boolean).join(', ');
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
  const WORK_MODE_LABELS: Record<string, string> = { on_site: 'On-site', remote: 'Remote', hybrid: 'Hybrid' };

  return (
    <div className="group relative rounded-xl border border-[#E5E7EB] bg-white transition-shadow hover:shadow-md">
      <Link href={`/dashboard/jobs/${job.id}`} className="block p-5">
        {/* Sponsorship status bar */}
        {config && (
          <div className={`mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${config.chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            <Plane className="h-3 w-3" />
            {config.label}
            {sponsorship?.relocation_support_available && (
              <span className="ml-auto text-[11px] opacity-70">+ Relocation support</span>
            )}
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F9F7] text-sm font-bold text-[#10B65B]">
              {(companyName ?? 'C')[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-[#1E1E1E] leading-snug group-hover:text-[#10B65B] transition-colors line-clamp-2">
                {job.title}
              </h3>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#5F6368]">
                {companyName && (
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {companyName}</span>
                )}
                {location && (
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {location}</span>
                )}
                {job.work_mode && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}
                  </span>
                )}
              </div>
            </div>
          </div>
          <SaveButton jobId={job.id} initialSaved={isSaved} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {job.seniority_level && (
            <span className="rounded-full border border-[#E5E7EB] px-2.5 py-0.5 text-xs capitalize text-[#5F6368]">
              {job.seniority_level}
            </span>
          )}
          {salary && (
            <span className="rounded-full border border-[#E5E7EB] px-2.5 py-0.5 text-xs text-[#5F6368]">
              {salary}
            </span>
          )}
          {sponsorship?.open_to_international_applicants && (
            <span className="flex items-center gap-1 rounded-full border border-[#E5E7EB] px-2.5 py-0.5 text-xs text-[#5F6368]">
              <Globe className="h-3 w-3" /> International applicants welcome
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs font-medium text-[#10B65B]">
            View & apply <ChevronRight className="h-3 w-3" />
          </span>
          {job.application_deadline && (
            <span className="text-[11px] text-[#8A8F98]">
              Closes {new Date(job.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ q?: string; country?: string; work_mode?: string }>;
}

export default async function VisaSponsoredJobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [result, savedIds] = await Promise.all([
    getVisaSponsoredJobs(params),
    getSavedJobIds(),
  ]);

  const jobs = result.ok ? result.data : [];
  const sponsored = jobs.filter((j) => j.job_sponsorship_metadata?.sponsorship_status === 'available');
  const possible  = jobs.filter((j) => j.job_sponsorship_metadata?.sponsorship_status === 'open_to_discussion');

  return (
    <>
      <DashboardJobsNav savedCount={savedIds.length} />

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-[#10B65B]/20 bg-[#EAF6F0] px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B65B]">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#1E1E1E]">Visa Sponsored Jobs</h1>
              <p className="mt-0.5 text-sm text-[#5F6368]">
                {jobs.length} roles that offer visa support, relocation assistance, or are open to international applicants.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/60 p-3 text-center">
              <p className="text-xl font-bold text-[#10B65B]">{sponsored.length}</p>
              <p className="text-xs text-[#5F6368]">Confirmed sponsors</p>
            </div>
            <div className="rounded-xl bg-white/60 p-3 text-center">
              <p className="text-xl font-bold text-yellow-600">{possible.length}</p>
              <p className="text-xs text-[#5F6368]">Open to discussion</p>
            </div>
            <div className="rounded-xl bg-white/60 p-3 text-center sm:col-span-1 col-span-2">
              <p className="text-xl font-bold text-[#1E1E1E]">
                {jobs.filter((j) => j.job_sponsorship_metadata?.relocation_support_available).length}
              </p>
              <p className="text-xs text-[#5F6368]">Include relocation</p>
            </div>
          </div>
        </div>

        {/* Country quick-filter chips */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/jobs/visa-sponsored"
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              !params.country ? 'bg-[#1E1E1E] text-white' : 'bg-white border border-[#E5E7EB] text-[#5F6368] hover:border-[#1E1E1E]'
            }`}
          >
            All countries
          </Link>
          {COUNTRIES.map((c) => (
            <Link
              key={c}
              href={`/dashboard/jobs/visa-sponsored?country=${encodeURIComponent(c)}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                params.country === c
                  ? 'bg-[#1E1E1E] text-white'
                  : 'bg-white border border-[#E5E7EB] text-[#5F6368] hover:border-[#1E1E1E]'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Search + work mode filter */}
        <form method="GET" className="flex flex-wrap gap-2">
          {params.country && (
            <input type="hidden" name="country" value={params.country} />
          )}
          <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2">
            <SlidersHorizontal className="h-4 w-4 text-[#8A8F98] shrink-0" />
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search job title or skill…"
              className="flex-1 bg-transparent text-sm text-[#1E1E1E] placeholder:text-[#8A8F98] outline-none"
            />
          </div>
          <select
            name="work_mode"
            defaultValue={params.work_mode ?? ''}
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#5F6368] outline-none"
          >
            {WORK_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-[#10B65B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0ea350] transition-colors"
          >
            Filter
          </button>
        </form>

        {/* Job sections */}
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <p className="text-sm font-medium text-[#1E1E1E]">No visa-sponsored jobs match your filters</p>
            <Link href="/dashboard/jobs/visa-sponsored" className="mt-3 inline-block text-sm font-medium text-[#10B65B] hover:underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sponsored.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E1E1E]">
                  <span className="h-2 w-2 rounded-full bg-[#10B65B]" />
                  Confirmed visa sponsors
                  <span className="ml-1 rounded-full bg-[#EAF6F0] px-2 py-0.5 text-xs text-[#10B65B]">
                    {sponsored.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {sponsored.map((job) => (
                    <VisaJobCard key={job.id} job={job} isSaved={savedIds.includes(job.id)} />
                  ))}
                </div>
              </section>
            )}
            {possible.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1E1E1E]">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  Open to sponsorship discussion
                  <span className="ml-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700">
                    {possible.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {possible.map((job) => (
                    <VisaJobCard key={job.id} job={job} isSaved={savedIds.includes(job.id)} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-[#8A8F98]">
          Sponsorship details are provided by employers and are subject to change. Always confirm directly with the employer before applying.
        </p>
      </div>
    </>
  );
}
