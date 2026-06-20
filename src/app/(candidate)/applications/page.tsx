import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getMyApplications } from '@/lib/actions/applications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My applications — Scholastiar.ai' };

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft:        { label: 'Draft',          color: 'bg-[#F7F9F7] text-[#8A8F98]' },
  submitted:    { label: 'Submitted',      color: 'bg-blue-50 text-blue-700' },
  under_review: { label: 'Under review',   color: 'bg-yellow-50 text-yellow-700' },
  shortlisted:  { label: 'Shortlisted',    color: 'bg-[#EAF6F0] text-[#10B65B]' },
  interviewed:  { label: 'Interviewed',    color: 'bg-purple-50 text-purple-700' },
  offered:      { label: 'Offer received', color: 'bg-[#EAF6F0] text-[#10B65B]' },
  rejected:     { label: 'Not selected',   color: 'bg-red-50 text-red-600' },
  withdrawn:    { label: 'Withdrawn',      color: 'bg-[#F7F9F7] text-[#8A8F98]' },
};

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const applications = await getMyApplications() as Array<{
    id: string;
    status: string;
    submitted_at: string | null;
    jobs: { id: string; title: string; country: string | null; city: string | null; work_mode: string; employer_companies: { name: string } | null } | null;
  }>;

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1E1E1E]">My applications</h1>
            <p className="mt-0.5 text-sm text-[#5F6368]">{applications.length} total</p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/discover">Find jobs</Link>
          </Button>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <p className="text-sm font-medium text-[#1E1E1E]">No applications yet</p>
            <p className="mt-1 text-xs text-[#8A8F98]">
              When you apply for jobs they will appear here.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/jobs">Browse jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const job = app.jobs;
              const status = STATUS_CONFIG[app.status] ?? { label: app.status, color: 'bg-[#F7F9F7] text-[#8A8F98]' };
              const location = [job?.city, job?.country].filter(Boolean).join(', ');

              return (
                <div
                  key={app.id}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F7F9F7] text-sm font-bold text-[#10B65B]">
                      {(job?.employer_companies?.name ?? 'C')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/jobs/${job?.id}`}
                        className="font-semibold text-[#1E1E1E] hover:text-[#10B65B] transition-colors"
                      >
                        {job?.title ?? 'Job'}
                      </Link>
                      <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-[#5F6368]">
                        {job?.employer_companies?.name && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> {job.employer_companies.name}
                          </span>
                        )}
                        {location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {location}
                          </span>
                        )}
                        {app.submitted_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Applied {new Date(app.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
