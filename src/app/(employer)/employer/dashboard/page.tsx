import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getMyCompany, getMyJobs } from '@/lib/actions/employer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, Users, Building2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Employer dashboard — Scholastiar.ai' };

const STATUS_BADGE: Record<string, string> = {
  draft:          'bg-[#F7F9F7] text-[#8A8F98]',
  pending_review: 'bg-yellow-50 text-yellow-700',
  active:         'bg-[#EAF6F0] text-[#10B65B]',
  paused:         'bg-orange-50 text-orange-600',
  closed:         'bg-[#F7F9F7] text-[#5F6368]',
  rejected:       'bg-red-50 text-red-600',
  archived:       'bg-[#F7F9F7] text-[#8A8F98]',
};

export default async function EmployerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const company = await getMyCompany();
  if (!company) redirect('/employer/setup');

  const jobs = await getMyJobs() as Array<{
    id: string; title: string; status: string; country: string | null;
    work_mode: string; created_at: string; employment_type: string;
  }>;

  const activeCount = jobs.filter(j => j.status === 'active').length;
  const pendingCount = jobs.filter(j => j.status === 'pending_review').length;

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EAF6F0] text-lg font-bold text-[#10B65B]">
              {company.name[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#1E1E1E]">{company.name}</h1>
              <p className="text-sm text-[#5F6368]">{company.headquarters_city ?? ''}{company.headquarters_country ? `, ${company.headquarters_country}` : ''}</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/employer/jobs/new"><Plus className="mr-1.5 h-4 w-4" />Post a job</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Briefcase, label: 'Active jobs',    value: activeCount },
            { icon: Users,     label: 'Pending review', value: pendingCount },
            { icon: Building2, label: 'Total posted',   value: jobs.length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-[#E5E7EB] bg-white p-5">
              <Icon className="h-5 w-5 text-[#8A8F98]" />
              <p className="mt-3 text-2xl font-semibold text-[#1E1E1E]">{value}</p>
              <p className="text-xs text-[#5F6368]">{label}</p>
            </div>
          ))}
        </div>

        {/* Admin notice */}
        {pendingCount > 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {pendingCount} job{pendingCount > 1 ? 's are' : ' is'} pending admin review before going live.
          </div>
        )}

        {/* Jobs list */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#8A8F98]">Your jobs</h2>
          {jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
              <p className="text-sm text-[#5F6368]">No jobs posted yet.</p>
              <Button asChild size="sm" className="mt-3">
                <Link href="/employer/jobs/new">Post your first job</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#1E1E1E]">{job.title}</p>
                    <p className="mt-0.5 text-xs text-[#5F6368]">
                      {job.country} · {job.work_mode.replace('_', ' ')} · {job.employment_type.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[job.status] ?? ''}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/employer/jobs/${job.id}/applicants`}>Applicants</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
