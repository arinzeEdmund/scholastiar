import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getPersonalizedJobs } from '@/lib/actions/jobs';
import { getSavedJobIds } from '@/lib/actions/saved-jobs';
import { SaveButton } from '@/components/jobs/save-button';
import { SponsorshipBadge } from '@/components/jobs/sponsorship-badge';
import { ScorePill } from '@/components/jobs/score-pill';
import { DashboardJobsNav } from '@/components/nav/dashboard-jobs-nav';
import {
  MapPin, Briefcase, Clock, Building2,
  CircleAlert, ChevronRight, SlidersHorizontal,
} from 'lucide-react';
import type { Metadata } from 'next';
import type { JobWithMatch } from '@/lib/actions/jobs';

export const metadata: Metadata = { title: 'My Job Feed — Scholastiar.ai' };

const WORK_MODES = [
  { value: '', label: 'All modes' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on_site', label: 'On-site' },
];
const SENIORITY = [
  { value: '', label: 'Any level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
];

function formatSalary(min?: number | null, max?: number | null, currency?: string | null) {
  if (!min && !max) return null;
  const sym = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : currency === 'CHF' ? 'CHF ' : currency === 'AUD' ? 'A$' : currency === 'AED' ? 'AED ' : currency === 'SGD' ? 'S$' : currency === 'CAD' ? 'C$' : '$';
  const fmt = (n: number) => n >= 1000 ? `${sym}${Math.round(n / 1000)}k` : `${sym}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return min ? `From ${fmt(min)}` : `Up to ${fmt(max!)}`;
}


function DashboardJobCard({ job, isSaved }: { job: JobWithMatch; isSaved: boolean }) {
  const salary      = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
  const sponsorship = job.job_sponsorship_metadata;
  const companyName = job.employer_companies?.name;
  const location    = [job.city, job.country].filter(Boolean).join(', ');
  const postedDays  = job.published_at
    ? Math.floor((Date.now() - new Date(job.published_at).getTime()) / 86_400_000)
    : null;
  const WORK_MODE_LABELS: Record<string, string> = {
    on_site: 'On-site', remote: 'Remote', hybrid: 'Hybrid',
  };

  return (
    <div className="group relative rounded-xl border border-border bg-white transition-shadow hover:shadow-md">

      {/* Save button — absolute so title gets full width */}
      <div className="absolute right-3 top-3 z-10">
        <SaveButton jobId={job.id} initialSaved={isSaved} />
      </div>

      <Link href={`/dashboard/jobs/${job.id}`} className="block p-5">

        {/* ── Header: logo + title + meta ──────────────────────── */}
        <div className="flex items-start gap-3 pr-10">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-soft-background text-base font-bold text-green">
            {(companyName ?? 'C')[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-primary-text leading-snug group-hover:text-green transition-colors line-clamp-2">
              {job.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-secondary-text">
              {companyName && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> {companyName}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {location}
                </span>
              )}
              {job.work_mode && (
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}
                </span>
              )}
              {postedDays !== null && (
                <span className="flex items-center gap-1 text-muted-text">
                  <Clock className="h-3 w-3" />
                  {postedDays === 0 ? 'Today' : postedDays === 1 ? '1d ago' : `${postedDays}d ago`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Badges: sponsorship · seniority · salary · type ──── */}
        {(sponsorship || job.seniority_level || salary || job.employment_type) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {sponsorship && (
              <SponsorshipBadge
                status={sponsorship.sponsorship_status}
                visaTypes={sponsorship.target_visa_types}
              />
            )}
            {job.seniority_level && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs capitalize text-secondary-text">
                {job.seniority_level}
              </span>
            )}
            {salary && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-secondary-text">
                {salary}
              </span>
            )}
            {job.employment_type && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs capitalize text-secondary-text">
                {job.employment_type.replace('_', ' ')}
              </span>
            )}
          </div>
        )}

        {/* ── Application readiness score ───────────────────────── */}
        {job.match && (
          <div className="mt-3">
            <ScorePill score={job.match.score} reasons={job.match.reasons} />
          </div>
        )}

        {/* ── Footer: CTA + deadline ────────────────────────────── */}
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs font-medium text-green">
            View job <ChevronRight className="h-3 w-3" />
          </span>
          {job.application_deadline && (
            <span className="text-[11px] text-muted-text">
              Closes {new Date(job.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

      </Link>
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ q?: string; country?: string; work_mode?: string; seniority?: string }>;
}

export default async function DashboardJobsPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const params = await searchParams;
  const result = await getPersonalizedJobs(params);
  const savedIds = await getSavedJobIds();

  if (!result.ok) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[#5F6368]">Could not load jobs. Please try again.</p>
      </div>
    );
  }

  const { jobs, profile } = result.data;
  const name = profile?.preferred_name ?? user.email?.split('@')[0] ?? 'there';
  const completionScore = profile?.profile_completion_score ?? 0;

  return (
    <>
      <DashboardJobsNav savedCount={savedIds.length} />

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Greeting + profile completeness */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1E1E1E]">
              Good to see you, {name}
            </h1>
            <p className="mt-0.5 text-sm text-[#5F6368]">
              {jobs.length} opportunities matched to your profile
            </p>
          </div>
          {completionScore < 80 && (
            <Link
              href="/onboarding/personal"
              className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm hover:border-orange-300 transition-colors"
            >
              <CircleAlert className="h-4 w-4 text-orange-500 shrink-0" />
              <div>
                <p className="font-medium text-orange-800">Profile {completionScore}% complete</p>
                <p className="text-xs text-orange-600">Complete it for better matches</p>
              </div>
              <ChevronRight className="h-4 w-4 text-orange-400 ml-auto shrink-0" />
            </Link>
          )}
        </div>

        {/* Filters */}
        <form method="GET" className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2">
            <SlidersHorizontal className="h-4 w-4 text-[#8A8F98] shrink-0" />
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search job title or keyword…"
              className="flex-1 bg-transparent text-sm text-[#1E1E1E] placeholder:text-[#8A8F98] outline-none"
            />
          </div>
          <input
            name="country"
            defaultValue={params.country}
            placeholder="Country"
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#1E1E1E] placeholder:text-[#8A8F98] outline-none min-w-[130px]"
          />
          <select
            name="work_mode"
            defaultValue={params.work_mode ?? ''}
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#5F6368] outline-none"
          >
            {WORK_MODES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            name="seniority"
            defaultValue={params.seniority ?? ''}
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#5F6368] outline-none"
          >
            {SENIORITY.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-xl bg-[#10B65B] px-4 py-2 text-sm font-medium text-white hover:bg-[#0ea350] transition-colors"
          >
            Search
          </button>
          {(params.q || params.country || params.work_mode || params.seniority) && (
            <Link href="/dashboard/jobs" className="text-sm text-[#8A8F98] hover:text-[#5F6368]">
              Clear
            </Link>
          )}
        </form>

        {/* Job list */}
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <p className="text-sm font-medium text-[#1E1E1E]">No jobs found</p>
            <p className="mt-1 text-xs text-[#8A8F98]">Try adjusting your filters or complete your profile for better matches.</p>
            <Link href="/dashboard/jobs" className="mt-4 inline-block text-sm font-medium text-[#10B65B] hover:underline">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <DashboardJobCard
                key={job.id}
                job={job}
                isSaved={savedIds.includes(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
