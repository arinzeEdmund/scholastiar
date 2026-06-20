import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getJobApplications } from '@/lib/actions/applications';
import { Button } from '@/components/ui/button';
import { MapPin, User } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Applicants — Scholastiar.ai' };

interface PageProps {
  params: Promise<{ jobId: string }>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  submitted:    { label: 'New',          color: 'bg-blue-50 text-blue-700' },
  under_review: { label: 'Reviewing',    color: 'bg-yellow-50 text-yellow-700' },
  shortlisted:  { label: 'Shortlisted',  color: 'bg-[#EAF6F0] text-[#10B65B]' },
  interviewed:  { label: 'Interviewed',  color: 'bg-purple-50 text-purple-700' },
  offered:      { label: 'Offered',      color: 'bg-[#EAF6F0] text-[#10B65B]' },
  rejected:     { label: 'Rejected',     color: 'bg-red-50 text-red-600' },
  withdrawn:    { label: 'Withdrawn',    color: 'bg-[#F7F9F7] text-[#8A8F98]' },
};

export default async function ApplicantsPage({ params }: PageProps) {
  const { jobId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  // Verify access
  const { data: job } = await supabase
    .from('jobs')
    .select('id, title, employer_company_id')
    .eq('id', jobId)
    .single();

  if (!job) redirect('/employer/dashboard');

  const { data: membership } = await supabase
    .from('employer_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('employer_company_id', job.employer_company_id)
    .eq('status', 'active')
    .maybeSingle();

  if (!membership) redirect('/employer/dashboard');

  const applications = await getJobApplications(jobId) as Array<{
    id: string;
    status: string;
    submitted_at: string | null;
    cover_letter: string | null;
    candidate_profiles: {
      id: string;
      preferred_name: string | null;
      headline: string | null;
      current_location_country: string | null;
      current_location_city: string | null;
      profile_completion_score: number;
      candidate_skills: Array<{ skill_name: string }>;
      candidate_visa_profiles: { needs_sponsorship: boolean; willing_to_relocate: boolean } | null;
    } | null;
  }>;

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#8A8F98]">Applicants for</p>
            <h1 className="text-xl font-semibold text-[#1E1E1E]">{job.title}</h1>
            <p className="mt-0.5 text-sm text-[#5F6368]">{applications.length} total</p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/employer/dashboard">← Dashboard</Link>
          </Button>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <p className="text-sm text-[#5F6368]">No applications yet. Share the job to attract candidates.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const candidate = app.candidate_profiles;
              const location = [candidate?.current_location_city, candidate?.current_location_country].filter(Boolean).join(', ');
              const status = STATUS_CONFIG[app.status] ?? { label: app.status, color: 'bg-[#F7F9F7] text-[#8A8F98]' };

              return (
                <div key={app.id} className="rounded-xl border border-[#E5E7EB] bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF6F0] text-sm font-bold text-[#10B65B]">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1E1E1E]">
                          {candidate?.preferred_name ?? 'Candidate'}
                        </p>
                        {candidate?.headline && (
                          <p className="text-xs text-[#5F6368]">{candidate.headline}</p>
                        )}
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#8A8F98]">
                          {location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {location}
                            </span>
                          )}
                          {candidate?.candidate_visa_profiles?.needs_sponsorship && (
                            <span className="rounded-full bg-[#EAF6F0] px-2 py-0.5 text-[#10B65B]">
                              Needs sponsorship
                            </span>
                          )}
                          {candidate?.candidate_visa_profiles?.willing_to_relocate && (
                            <span className="rounded-full bg-[#EAF6F0] px-2 py-0.5 text-[#10B65B]">
                              Open to relocate
                            </span>
                          )}
                        </div>
                        {candidate?.candidate_skills && candidate.candidate_skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {candidate.candidate_skills.slice(0, 5).map((s) => (
                              <span key={s.skill_name} className="rounded bg-[#F7F9F7] px-2 py-0.5 text-xs text-[#5F6368]">
                                {s.skill_name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      {app.submitted_at && (
                        <span className="text-xs text-[#8A8F98]">
                          {new Date(app.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                  {app.cover_letter && (
                    <p className="mt-3 border-t border-[#E5E7EB] pt-3 text-sm text-[#5F6368] line-clamp-2">
                      {app.cover_letter}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
