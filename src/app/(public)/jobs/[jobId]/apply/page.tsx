import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getJobById } from '@/lib/actions/jobs';
import { submitApplication } from '@/lib/actions/applications';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SponsorshipBadge } from '@/components/jobs/sponsorship-badge';
import { ShieldCheck, MapPin, Building2 } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ error?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { jobId } = await params;
  const result = await getJobById(jobId);
  if (!result.ok) return { title: 'Apply' };
  return { title: `Apply — ${result.data.title}` };
}

export default async function ApplyPage({ params, searchParams }: PageProps) {
  const { jobId } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/sign-in?next=/jobs/${jobId}/apply`);

  const result = await getJobById(jobId);
  if (!result.ok) notFound();
  const job = result.data;

  const sponsorship = job.job_sponsorship_metadata;
  const locationParts = [job.city, job.country].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Job summary */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F7F9F7] text-sm font-bold text-[#10B65B]">
              {(job.employer_companies?.name ?? 'C')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#1E1E1E]">{job.title}</p>
              <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-[#5F6368]">
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

        {error === 'consent' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Please confirm your consent before submitting your application.
          </div>
        )}
        {error === 'failed' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Something went wrong. Please try again.
          </div>
        )}

        {/* Application form */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5">
          <h1 className="text-lg font-semibold text-[#1E1E1E]">Your application</h1>
          <form action={submitApplication} className="space-y-5">
            <input type="hidden" name="job_id" value={job.id} />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="cover_letter">
                Cover letter <span className="text-[#8A8F98] font-normal">(optional)</span>
              </label>
              <Textarea
                id="cover_letter"
                name="cover_letter"
                rows={6}
                placeholder="Tell the employer why you're a great fit for this role…"
              />
              <p className="text-xs text-[#8A8F98]">
                Tip: mention your relevant experience, visa/work authorisation status, and why you want this specific role.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="additional_info">
                Anything else to add? <span className="text-[#8A8F98] font-normal">(optional)</span>
              </label>
              <Textarea
                id="additional_info"
                name="additional_info"
                rows={3}
                placeholder="Portfolio links, availability, relocation timeline…"
              />
            </div>

            {/* Consent — required per security invariant */}
            <div className="rounded-lg bg-[#F7F9F7] border border-[#E5E7EB] p-4 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#10B65B]" />
                <div className="text-sm text-[#5F6368] leading-relaxed">
                  <p className="font-medium text-[#1E1E1E]">Before you submit</p>
                  <p className="mt-1">
                    Your profile information — including your name, skills, education, work experience,
                    and visa/mobility preferences — will be shared with the employer for this role.
                    AI-assisted features provide estimates and suggestions only;
                    they do not guarantee outcomes or interviews.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  value="true"
                  required
                  className="h-4 w-4 accent-[#10B65B]"
                />
                <span className="text-sm text-[#1E1E1E]">
                  I understand and consent to sharing my profile for this application.
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Submit application</Button>
              <Button asChild variant="outline">
                <Link href={`/jobs/${job.id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
