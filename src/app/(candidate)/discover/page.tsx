import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getPersonalizedJobs } from '@/lib/actions/jobs';
import { getSavedJobIds } from '@/lib/actions/saved-jobs';
import { SaveButton } from '@/components/jobs/save-button';
import { SponsorshipBadge } from '@/components/jobs/sponsorship-badge';
import { ScorePill } from '@/components/jobs/score-pill';
import { MainNav } from '@/components/nav/main-nav';
import {
  MapPin, Briefcase, Building2, Clock,
  ChevronRight, CircleAlert, Plane,
} from 'lucide-react';
import type { Metadata } from 'next';
import type { JobWithMatch } from '@/lib/actions/jobs';

export const metadata: Metadata = { title: 'Discover — Scholastiar.ai' };

const WORK_MODE_LABELS: Record<string, string> = {
  on_site: 'On-site', remote: 'Remote', hybrid: 'Hybrid',
};

function formatSalary(min?: number | null, max?: number | null, currency?: string | null) {
  if (!min && !max) return null;
  const sym = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : currency === 'CHF' ? 'CHF ' : currency === 'AUD' ? 'A$' : currency === 'AED' ? 'AED ' : currency === 'SGD' ? 'S$' : currency === 'CAD' ? 'C$' : '$';
  const fmt = (n: number) => n >= 1000 ? `${sym}${Math.round(n / 1000)}k` : `${sym}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return min ? `From ${fmt(min)}` : `Up to ${fmt(max!)}`;
}


function DiscoverJobCard({ job, isSaved }: { job: JobWithMatch; isSaved: boolean }) {
  const salary     = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
  const sponsorship = job.job_sponsorship_metadata;
  const companyName = job.employer_companies?.name;
  const location   = [job.city, job.country].filter(Boolean).join(', ');
  const postedDays = job.published_at
    ? Math.floor((Date.now() - new Date(job.published_at).getTime()) / 86_400_000)
    : null;

  return (
    <div className="group relative rounded-xl border border-border bg-white transition-shadow hover:shadow-md">

      {/* Save button — absolute so it never competes with the title width */}
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

        {/* ── Badges: sponsorship · salary · seniority ─────────── */}
        {(sponsorship || salary || job.seniority_level) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {sponsorship && (
              <SponsorshipBadge
                status={sponsorship.sponsorship_status}
                visaTypes={sponsorship.target_visa_types}
              />
            )}
            {salary && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-secondary-text">
                {salary}
              </span>
            )}
            {job.seniority_level && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs capitalize text-secondary-text">
                {job.seniority_level}
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

export default async function DiscoverPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const { data: profile } = await supabase
    .from('candidate_profiles')
    .select('id, preferred_name, profile_completion_score')
    .eq('user_id', user.id)
    .maybeSingle();

  const hasPrefs = profile?.id ? (await supabase
    .from('career_preferences')
    .select('id')
    .eq('candidate_profile_id', profile.id)
    .maybeSingle()).data !== null : false;

  const [result, savedIds] = await Promise.all([
    getPersonalizedJobs({}),
    getSavedJobIds(),
  ]);

  const jobs = result.ok ? result.data.jobs : [];
  const name = profile?.preferred_name ?? user.email?.split('@')[0] ?? 'there';
  const completionScore = profile?.profile_completion_score ?? 0;

  const sponsored = jobs.filter(j => j.job_sponsorship_metadata?.sponsorship_status === 'available');
  const highMatch  = jobs.filter(j => (j.match?.score ?? 0) >= 65);
  const remote     = jobs.filter(j => j.work_mode === 'remote');

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <MainNav user={{ email: user.email ?? '' }} />

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1E1E1E]">
              Good to see you, {name}
            </h1>
            <p className="mt-1 text-sm text-[#5F6368]">
              {jobs.length} opportunities across {new Set(jobs.map(j => j.country).filter(Boolean)).size} countries · ranked by profile match
            </p>
          </div>
          <Link
            href="/dashboard/jobs"
            className="shrink-0 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#5F6368] hover:bg-[#F7F9F7] transition-colors"
          >
            Full job dashboard →
          </Link>
        </div>

        {/* Profile completion banner */}
        {completionScore < 80 && (
          <Link
            href="/onboarding/personal"
            className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 hover:border-orange-300 transition-colors"
          >
            <CircleAlert className="h-5 w-5 shrink-0 text-orange-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-800">
                Your profile is {completionScore}% complete
              </p>
              <p className="text-xs text-orange-600">
                {!hasPrefs
                  ? 'Add your target countries, skills, and work preferences to see personalised match scores.'
                  : 'Add more skills and experience to improve your match scores.'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-orange-400" />
          </Link>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 text-center">
            <p className="text-2xl font-bold text-[#10B65B]">{sponsored.length}</p>
            <p className="mt-0.5 text-xs text-[#5F6368]">Visa sponsored</p>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 text-center">
            <p className="text-2xl font-bold text-[#1E1E1E]">{highMatch.length}</p>
            <p className="mt-0.5 text-xs text-[#5F6368]">Strong matches</p>
          </div>
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 text-center">
            <p className="text-2xl font-bold text-[#1E1E1E]">{remote.length}</p>
            <p className="mt-0.5 text-xs text-[#5F6368]">Remote roles</p>
          </div>
        </div>

        {/* Visa sponsored highlight strip */}
        {sponsored.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#1E1E1E]">
                <Plane className="h-4 w-4 text-[#10B65B]" />
                Visa sponsored roles
              </h2>
              <Link href="/dashboard/jobs/visa-sponsored" className="text-xs font-medium text-[#10B65B] hover:underline">
                See all →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sponsored.slice(0, 4).map((job) => (
                <DiscoverJobCard key={job.id} job={job} isSaved={savedIds.includes(job.id)} />
              ))}
            </div>
          </section>
        )}

        {/* All opportunities sorted by match */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1E1E1E]">
              All opportunities
              <span className="ml-2 text-xs font-normal text-[#8A8F98]">sorted by match</span>
            </h2>
            <Link href="/dashboard/jobs" className="text-xs font-medium text-[#10B65B] hover:underline">
              Filter & search →
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
              <p className="text-sm font-medium text-[#1E1E1E]">No active opportunities right now</p>
              <p className="mt-1 text-xs text-[#8A8F98]">Check back soon — new roles are added daily.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <DiscoverJobCard key={job.id} job={job} isSaved={savedIds.includes(job.id)} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
