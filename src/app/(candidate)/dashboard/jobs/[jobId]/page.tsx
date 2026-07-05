import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getJobByIdAuth } from '@/lib/actions/jobs';
import type { MatchResult } from '@/lib/utils/match-score';
import { getSavedJobIds } from '@/lib/actions/saved-jobs';
import { SaveButton } from '@/components/jobs/save-button';
import { DashboardJobsNav } from '@/components/nav/dashboard-jobs-nav';
import {
  MapPin, Building2, Briefcase, Calendar, Globe,
  CheckCircle2, Circle, XCircle, Zap, ChevronLeft,
  Plane, Users, ExternalLink,
} from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  const result = await getJobByIdAuth(jobId);
  if (!result.ok) return { title: 'Job not found' };
  return { title: `${result.data.job.title} — Scholastiar.ai` };
}

function formatSalary(min?: number | null, max?: number | null, currency?: string | null) {
  if (!min && !max) return null;
  const sym = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : currency === 'CHF' ? 'CHF ' : currency === 'AUD' ? 'A$' : currency === 'AED' ? 'AED ' : currency === 'SGD' ? 'S$' : currency === 'CAD' ? 'C$' : '$';
  const fmt = (n: number) => n >= 1000 ? `${sym}${Math.round(n / 1000)}k` : `${sym}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} ${currency ?? ''}`;
  return min ? `From ${fmt(min)} ${currency ?? ''}` : `Up to ${fmt(max!)} ${currency ?? ''}`;
}

const WORK_MODE_LABELS: Record<string, string> = {
  on_site: 'On-site', remote: 'Remote', hybrid: 'Hybrid',
};

const SCORE_COLOR = (score: number) =>
  score >= 70 ? 'text-[#10B65B]' :
  score >= 50 ? 'text-yellow-600' : 'text-[#8A8F98]';

const SCORE_BG = (score: number) =>
  score >= 70 ? 'bg-[#EAF6F0] border-[#10B65B]/20' :
  score >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-[#F7F9F7] border-[#E5E7EB]';

export default async function AuthJobDetailPage({ params }: PageProps) {
  const { jobId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const [result, savedIds] = await Promise.all([
    getJobByIdAuth(jobId),
    getSavedJobIds(),
  ]);

  if (!result.ok) notFound();

  const { job, profile: matchResult, missingSkills, candidateSkills } = result.data;
  const typedMatchResult = matchResult as MatchResult | null;
  const sponsorship = job.job_sponsorship_metadata;
  const requirements = job.job_requirements ?? [];
  const required  = requirements.filter((r) => r.importance === 'required');
  const preferred = requirements.filter((r) => r.importance !== 'required');
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
  const location = [job.city, job.country].filter(Boolean).join(', ');
  const isSaved = savedIds.includes(job.id);
  const score = typedMatchResult?.score ?? 0;

  return (
    <>
      <DashboardJobsNav savedCount={savedIds.length} />

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-5">
        {/* Back */}
        <Link href="/dashboard/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-[#5F6368] hover:text-[#1E1E1E] transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to feed
        </Link>

        {/* Header card */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F7F9F7] text-xl font-bold text-[#10B65B]">
              {(job.employer_companies?.name ?? 'C')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold leading-snug text-[#1E1E1E]">{job.title}</h1>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#5F6368]">
                {job.employer_companies?.name && (
                  <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {job.employer_companies.name}</span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {location}</span>
                )}
                {job.work_mode && (
                  <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}</span>
                )}
                {job.application_deadline && (
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />
                    Closes {new Date(job.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {salary && (
                  <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs font-medium text-[#5F6368]">
                    {salary}
                  </span>
                )}
                {job.seniority_level && (
                  <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs capitalize text-[#5F6368]">
                    {job.seniority_level}
                  </span>
                )}
                {job.employment_type && (
                  <span className="rounded-full border border-[#E5E7EB] px-3 py-1 text-xs capitalize text-[#5F6368]">
                    {job.employment_type.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <Link
              href={`/jobs/${job.id}/apply`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#10B65B] py-3 text-sm font-semibold text-white hover:bg-[#0ea350] transition-colors"
            >
              Apply now
            </Link>
            <SaveButton jobId={job.id} initialSaved={isSaved} className="rounded-xl border border-[#E5E7EB] px-4" />
          </div>
        </div>

        {/* Match analysis */}
        {typedMatchResult && (
          <div className={`rounded-2xl border p-5 ${SCORE_BG(score)}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className={`h-5 w-5 ${SCORE_COLOR(score)}`} />
                  <h2 className="font-semibold text-[#1E1E1E]">Profile match</h2>
                </div>
                <p className="mt-0.5 text-xs text-[#5F6368]">
                  Based on your skills, preferences and visa profile.
                  {' '}
                  <span className="italic">This is an estimate, not a guarantee.</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-4xl font-bold ${SCORE_COLOR(score)}`}>{score}%</p>
              </div>
            </div>

            {typedMatchResult.reasons.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {typedMatchResult.reasons.map((r) => (
                  <div key={r} className="flex items-start gap-1.5 rounded-lg bg-white/60 px-3 py-2 text-xs text-[#1E1E1E]">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10B65B]" />
                    {r}
                  </div>
                ))}
              </div>
            )}

            {/* Missing skills */}
            {missingSkills.length > 0 && (
              <div className="mt-4 border-t border-white/50 pt-4">
                <p className="mb-2 text-xs font-semibold text-[#1E1E1E]">
                  Skills gap ({missingSkills.length} required skill{missingSkills.length > 1 ? 's' : ''} not in your profile)
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((s) => (
                    <span key={s} className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs text-red-600">
                      <XCircle className="h-3 w-3" /> {s}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-[#8A8F98]">
                  Add these to your profile to improve your match score and strengthen your application.
                  {' '}
                  <Link href="/onboarding/skills" className="text-[#10B65B] hover:underline">
                    Update skills →
                  </Link>
                </p>
              </div>
            )}

            {candidateSkills.length > 0 && (
              <div className="mt-3 border-t border-white/50 pt-3">
                <p className="mb-2 text-xs font-semibold text-[#1E1E1E]">Your matching skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {candidateSkills.slice(0, 10).map((s) => (
                    <span key={s} className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs text-[#5F6368]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Visa sponsorship detail */}
        {sponsorship && sponsorship.sponsorship_status !== 'not_available' && sponsorship.sponsorship_status !== 'unknown' && (
          <div className="rounded-2xl border border-[#10B65B]/20 bg-[#EAF6F0] p-5">
            <div className="flex items-center gap-2 font-semibold text-[#10B65B]">
              <Plane className="h-5 w-5" />
              Visa & international hiring
            </div>
            <div className="mt-3 space-y-2 text-sm text-[#1E1E1E]">
              {sponsorship.sponsorship_status === 'available' && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#10B65B] shrink-0" />
                  Visa sponsorship confirmed available
                </div>
              )}
              {sponsorship.sponsorship_status === 'open_to_discussion' && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-yellow-600 shrink-0" />
                  Sponsorship considered on a case-by-case basis
                </div>
              )}
              {sponsorship.relocation_support_available && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#10B65B] shrink-0" />
                  Relocation support available
                </div>
              )}
              {sponsorship.open_to_international_applicants && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#10B65B] shrink-0" />
                  Open to international applicants
                </div>
              )}
              {sponsorship.target_visa_types?.length > 0 && (
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 text-[#10B65B] shrink-0 mt-0.5" />
                  Visa types: {sponsorship.target_visa_types.join(', ')}
                </div>
              )}
              {sponsorship.notes && (
                <p className="mt-2 rounded-xl bg-white/60 p-3 text-[#5F6368] text-xs">{sponsorship.notes}</p>
              )}
            </div>
            <p className="mt-3 text-[11px] text-[#5F6368]">
              Always confirm sponsorship eligibility directly with the employer before applying.
            </p>
          </div>
        )}

        {/* Employer info */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">About the employer</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF6F0] text-sm font-bold text-[#10B65B]">
              {(job.employer_companies?.name ?? 'C')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-[#1E1E1E]">{job.employer_companies?.name}</p>
              {job.employer_companies?.headquarters_country && (
                <p className="text-xs text-[#5F6368]">
                  <MapPin className="mr-0.5 inline h-3 w-3" />
                  {job.employer_companies.headquarters_country}
                </p>
              )}
            </div>
            {job.employer_companies?.verification_status === 'verified' && (
              <span className="ml-auto rounded-full bg-[#EAF6F0] px-2.5 py-1 text-[11px] font-semibold text-[#10B65B]">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        {/* Job description */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">About this role</h2>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#1E1E1E]">
            {job.description}
          </div>
        </div>

        {/* Requirements */}
        {(required.length > 0 || preferred.length > 0) && (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-5">
            {required.length > 0 && (
              <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">Required</h2>
                <ul className="space-y-2">
                  {required.map((r) => {
                    const isMissing = missingSkills.some(
                      (ms) => ms.toLowerCase() === r.requirement_text.toLowerCase()
                    );
                    return (
                      <li key={r.id} className="flex items-start gap-2 text-sm">
                        {isMissing
                          ? <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                          : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B65B]" />
                        }
                        <span className={isMissing ? 'text-[#5F6368]' : 'text-[#1E1E1E]'}>
                          {r.requirement_text}
                          {isMissing && (
                            <span className="ml-2 text-[11px] text-red-400">not in your profile</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {preferred.length > 0 && (
              <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8A8F98]">Nice to have</h2>
                <ul className="space-y-2">
                  {preferred.map((r) => (
                    <li key={r.id} className="flex items-start gap-2 text-sm text-[#5F6368]">
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[#8A8F98]" />
                      {r.requirement_text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* CTA footer */}
        <div className="flex gap-3 pb-8">
          <Link
            href={`/jobs/${job.id}/apply`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#10B65B] py-3 text-sm font-semibold text-white hover:bg-[#0ea350] transition-colors"
          >
            Apply now <ExternalLink className="h-4 w-4" />
          </Link>
          <Link href="/dashboard/jobs"
            className="rounded-xl border border-[#E5E7EB] px-5 py-3 text-sm font-medium text-[#5F6368] hover:bg-[#F7F9F7] transition-colors">
            ← Feed
          </Link>
        </div>
      </div>
    </>
  );
}
