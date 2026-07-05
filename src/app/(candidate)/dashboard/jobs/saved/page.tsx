import Link from 'next/link';
import { getSavedJobs } from '@/lib/actions/saved-jobs';
import { SaveButton } from '@/components/jobs/save-button';
import { SponsorshipBadge } from '@/components/jobs/sponsorship-badge';
import { DashboardJobsNav } from '@/components/nav/dashboard-jobs-nav';
import { Bookmark, MapPin, Briefcase, Building2, Clock, ChevronRight, Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import type { JobWithDetails } from '@/types/database';

export const metadata: Metadata = { title: 'Saved Jobs — Scholastiar.ai' };

const TABS = [
  { value: 'all',      label: 'All saved' },
  { value: 'closing',  label: 'Closing soon' },
  { value: 'visa',     label: 'Visa sponsored' },
];

function formatSalary(min?: number | null, max?: number | null, currency?: string | null) {
  if (!min && !max) return null;
  const sym = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : currency === 'CHF' ? 'CHF ' : currency === 'AUD' ? 'A$' : currency === 'AED' ? 'AED ' : currency === 'SGD' ? 'S$' : currency === 'CAD' ? 'C$' : '$';
  const fmt = (n: number) => n >= 1000 ? `${sym}${Math.round(n / 1000)}k` : `${sym}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return min ? `From ${fmt(min)}` : `Up to ${fmt(max!)}`;
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function SavedJobCard({ job }: { job: JobWithDetails }) {
  const sponsorship = job.job_sponsorship_metadata;
  const companyName = job.employer_companies?.name;
  const location = [job.city, job.country].filter(Boolean).join(', ');
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
  const WORK_MODE_LABELS: Record<string, string> = { on_site: 'On-site', remote: 'Remote', hybrid: 'Hybrid' };
  const daysLeft = job.application_deadline ? daysUntil(job.application_deadline) : null;
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;
  const isClosed = daysLeft !== null && daysLeft < 0;

  return (
    <div className={`group relative rounded-xl border bg-white transition-shadow hover:shadow-md ${
      isUrgent ? 'border-orange-200' : isClosed ? 'border-[#E5E7EB] opacity-60' : 'border-[#E5E7EB]'
    }`}>
      {isUrgent && (
        <div className="rounded-t-xl bg-orange-50 px-4 py-1.5 text-xs font-medium text-orange-700">
          <Calendar className="mr-1 inline h-3 w-3" />
          Closing in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
        </div>
      )}
      {isClosed && (
        <div className="rounded-t-xl bg-[#F7F9F7] px-4 py-1.5 text-xs font-medium text-[#8A8F98]">
          Application deadline passed
        </div>
      )}
      <Link href={`/dashboard/jobs/${job.id}`} className="block p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F9F7] text-sm font-bold text-[#10B65B]">
            {(companyName ?? 'C')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-primary-text group-hover:text-green transition-colors line-clamp-1">
                {job.title}
              </h3>
              <SaveButton jobId={job.id} initialSaved />
            </div>
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
            <div className="mt-2 flex flex-wrap gap-2">
              {sponsorship && (
                <SponsorshipBadge
                  status={sponsorship.sponsorship_status}
                  visaTypes={sponsorship.target_visa_types}
                />
              )}
              {salary && (
                <span className="rounded-full border border-[#E5E7EB] px-2.5 py-0.5 text-xs text-[#5F6368]">
                  {salary}
                </span>
              )}
              {job.seniority_level && (
                <span className="rounded-full border border-[#E5E7EB] px-2.5 py-0.5 text-xs capitalize text-[#5F6368]">
                  {job.seniority_level}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs font-medium text-[#10B65B]">
            View & apply <ChevronRight className="h-3 w-3" />
          </span>
          {!isClosed && !isUrgent && daysLeft !== null && (
            <span className="flex items-center gap-1 text-[11px] text-[#8A8F98]">
              <Clock className="h-3 w-3" />
              {daysLeft}d left
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function SavedJobsPage({ searchParams }: PageProps) {
  const { view } = await searchParams;
  const activeView = view ?? 'all';

  const allJobs = (await getSavedJobs()) as unknown as JobWithDetails[];

  const filtered = (() => {
    if (activeView === 'closing') {
      return allJobs
        .filter((j) => j.application_deadline)
        .filter((j) => {
          const d = daysUntil(j.application_deadline!);
          return d >= 0 && d <= 14;
        })
        .sort((a, b) => daysUntil(a.application_deadline!) - daysUntil(b.application_deadline!));
    }
    if (activeView === 'visa') {
      return allJobs.filter(
        (j) => j.job_sponsorship_metadata?.sponsorship_status === 'available' ||
               j.job_sponsorship_metadata?.sponsorship_status === 'open_to_discussion'
      );
    }
    return allJobs;
  })();

  return (
    <>
      <DashboardJobsNav savedCount={allJobs.length} />

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-[#1E1E1E]">Saved jobs</h1>
          <p className="mt-0.5 text-sm text-[#5F6368]">
            {allJobs.length} saved · {filtered.length} shown
          </p>
        </div>

        {/* View tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <Link
              key={t.value}
              href={`/dashboard/jobs/saved${t.value === 'all' ? '' : `?view=${t.value}`}`}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeView === t.value
                  ? 'bg-[#1E1E1E] text-white'
                  : 'bg-white border border-[#E5E7EB] text-[#5F6368] hover:border-[#1E1E1E]'
              }`}
            >
              {t.label}
              {t.value === 'closing' && allJobs.filter((j) => {
                if (!j.application_deadline) return false;
                const d = daysUntil(j.application_deadline);
                return d >= 0 && d <= 7;
              }).length > 0 && (
                <span className="ml-1.5 rounded-full bg-orange-500 px-1.5 text-[10px] text-white">
                  {allJobs.filter((j) => {
                    if (!j.application_deadline) return false;
                    const d = daysUntil(j.application_deadline);
                    return d >= 0 && d <= 7;
                  }).length}
                </span>
              )}
            </Link>
          ))}
        </div>

        {allJobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <Bookmark className="mx-auto h-8 w-8 text-[#8A8F98]" />
            <p className="mt-3 text-sm font-medium text-[#1E1E1E]">No saved jobs yet</p>
            <p className="mt-1 text-xs text-[#8A8F98]">
              Tap the bookmark icon on any job to save it here.
            </p>
            <Link href="/dashboard/jobs"
              className="mt-4 inline-block rounded-xl bg-[#10B65B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0ea350] transition-colors">
              Browse jobs
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-8 text-center">
            <p className="text-sm text-[#5F6368]">No jobs match this view.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job) => (
              <SavedJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
