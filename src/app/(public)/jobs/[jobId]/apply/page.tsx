import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getJobById } from '@/lib/actions/jobs';
import { ApplyForm } from '@/components/jobs/apply-form';
import { SponsorshipBadge } from '@/components/jobs/sponsorship-badge';
import { MapPin, Building2 } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  const result = await getJobById(jobId);
  if (!result.ok) return { title: 'Apply' };
  return { title: `Apply — ${result.data.title}` };
}

export default async function ApplyPage({ params }: PageProps) {
  const { jobId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/sign-in?next=/jobs/${jobId}/apply`);

  const result = await getJobById(jobId);
  if (!result.ok) notFound();
  const job = result.data;

  const sponsorship = job.job_sponsorship_metadata;
  const locationParts = [job.city, job.country].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-soft-background">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Job summary */}
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-soft-background text-sm font-bold text-green">
              {(job.employer_companies?.name ?? 'C')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-primary-text">{job.title}</p>
              <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-secondary-text">
                {job.employer_companies?.name && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {job.employer_companies.name}
                  </span>
                )}
                {locationParts && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {locationParts}
                  </span>
                )}
              </div>
              {sponsorship && (
                <div className="mt-2">
                  <SponsorshipBadge
                    status={sponsorship.sponsorship_status}
                    visaTypes={sponsorship.target_visa_types}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <ApplyForm jobId={jobId} />

        <p className="text-center text-xs text-muted-text">
          <Link href={`/jobs/${jobId}`} className="hover:underline">← Back to job details</Link>
        </p>
      </div>
    </div>
  );
}
