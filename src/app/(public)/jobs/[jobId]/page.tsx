import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SponsorshipBadge } from '@/components/jobs/sponsorship-badge';
import { SaveButton } from '@/components/jobs/save-button';
import { getJobById } from '@/lib/actions/jobs';
import { getSavedJobIds } from '@/lib/actions/saved-jobs';
import { createClient } from '@/lib/supabase/server';
import { MapPin, Building2, Briefcase, Calendar, Clock, Globe, CheckCircle2, Circle } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  const result = await getJobById(jobId);
  if (!result.ok) return { title: 'Job not found' };
  return { title: `${result.data.title} — Scholastiar.ai` };
}

const WORK_MODE_LABELS: Record<string, string> = { on_site: 'On-site', remote: 'Remote', hybrid: 'Hybrid' };

function formatSalary(min?: number | null, max?: number | null, currency?: string | null) {
  if (!min && !max) return null;
  const sym = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  const fmt = (n: number) => n >= 1000 ? `${sym}${Math.round(n / 1000)}k` : `${sym}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} ${currency ?? 'USD'}`;
  if (min) return `From ${fmt(min)} ${currency ?? 'USD'}`;
  return `Up to ${fmt(max!)} ${currency ?? 'USD'}`;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { jobId } = await params;
  const result = await getJobById(jobId);
  if (!result.ok) notFound();
  const job = result.data;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedIds = user ? await getSavedJobIds() : [];
  const isSaved = savedIds.includes(job.id);

  const sponsorship = job.job_sponsorship_metadata;
  const requirements = job.job_requirements ?? [];
  const required = requirements.filter((r) => r.importance === 'required');
  const preferred = requirements.filter((r) => r.importance !== 'required');
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
  const locationParts = [job.city, job.country].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F7F9F7] text-lg font-bold text-[#10B65B]">
              {(job.employer_companies?.name ?? 'C')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-[#1E1E1E]">{job.title}</h1>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#5F6368]">
                {job.employer_companies?.name && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" /> {job.employer_companies.name}
                  </span>
                )}
                {locationParts && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {locationParts}
                  </span>
                )}
                {job.work_mode && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" /> {WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}
                  </span>
                )}
                {job.application_deadline && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Closes {new Date(job.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
                {job.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> Posted {new Date(job.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {sponsorship && (
              <SponsorshipBadge
                status={sponsorship.sponsorship_status}
                visaTypes={sponsorship.target_visa_types}
              />
            )}
            {job.seniority_level && <Badge variant="secondary" className="capitalize">{job.seniority_level}</Badge>}
            {salary && <Badge variant="secondary">{salary}</Badge>}
            {job.employment_type && (
              <Badge variant="secondary" className="capitalize">{job.employment_type.replace('_', ' ')}</Badge>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <Button asChild className="flex-1">
              <Link href={`/jobs/${job.id}/apply`}>Apply now</Link>
            </Button>
            {user
              ? <SaveButton jobId={job.id} initialSaved={isSaved} />
              : <Button asChild variant="outline"><Link href={`/auth/sign-in?next=/jobs/${job.id}`}>Save</Link></Button>
            }
          </div>
        </div>

        {/* Sponsorship detail */}
        {sponsorship && sponsorship.sponsorship_status === 'available' && (
          <div className="rounded-xl border border-[#10B65B]/20 bg-[#EAF6F0] p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#10B65B]">
              <Globe className="h-4 w-4" /> Visa sponsorship available
            </div>
            <div className="mt-2 grid gap-1 text-sm text-[#1E1E1E]">
              {sponsorship.relocation_support_available && <p>Relocation support available</p>}
              {sponsorship.open_to_international_applicants && <p>Open to international applicants</p>}
              {sponsorship.target_visa_types?.length > 0 && (
                <p>Visa types: {sponsorship.target_visa_types.join(', ')}</p>
              )}
              {sponsorship.sponsorship_countries?.length > 0 && (
                <p>Covering: {sponsorship.sponsorship_countries.join(', ')}</p>
              )}
              {sponsorship.notes && <p className="mt-1 text-[#5F6368]">{sponsorship.notes}</p>}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#8A8F98]">About this role</h2>
          <div className="prose prose-sm max-w-none text-[#1E1E1E] leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>
        </div>

        {/* Requirements */}
        {(required.length > 0 || preferred.length > 0) && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5">
            {required.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#8A8F98]">Requirements</h2>
                <ul className="space-y-2">
                  {required.map((r) => (
                    <li key={r.id} className="flex items-start gap-2 text-sm text-[#1E1E1E]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B65B]" />
                      {r.requirement_text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {preferred.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#8A8F98]">Nice to have</h2>
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
          <Button asChild className="flex-1">
            <Link href={`/jobs/${job.id}/apply`}>Apply now</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/jobs">← All jobs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
