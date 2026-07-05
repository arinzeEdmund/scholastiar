import Link from 'next/link';
import { getAdminJobs } from '@/lib/actions/admin';
import { JobModerationActions } from '@/components/admin/job-moderation-actions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Job moderation — Admin' };

const STATUS_CHIP: Record<string, string> = {
  pending_review: 'bg-yellow-500/20 text-yellow-300',
  active:         'bg-green/20 text-green',
  paused:         'bg-blue-500/20 text-blue-300',
  rejected:       'bg-red-500/20 text-red-400',
  draft:          'bg-white/10 text-white/50',
  closed:         'bg-white/10 text-white/50',
  archived:       'bg-white/10 text-white/50',
};

const SPONSORSHIP_CHIP: Record<string, string> = {
  available:                    'text-green',
  open_to_discussion:           'text-yellow-300',
  work_authorization_required:  'text-orange-300',
  not_available:                'text-white/40',
  unknown:                      'text-white/40',
};

const SPONSORSHIP_LABEL: Record<string, string> = {
  available:                    'Sponsors visas',
  open_to_discussion:           'Case by case',
  work_authorization_required:  'Work auth req.',
  not_available:                'No sponsorship',
  unknown:                      'Unknown',
};

const STATUS_FILTERS = [
  { label: 'All',      value: 'all' },
  { label: 'Pending',  value: 'pending_review' },
  { label: 'Active',   value: 'active' },
  { label: 'Paused',   value: 'paused' },
  { label: 'Rejected', value: 'rejected' },
];

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminJobsPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const activeFilter = status ?? 'all';
  const jobs = await getAdminJobs(activeFilter === 'all' ? undefined : activeFilter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Job moderation</h1>
          <p className="mt-0.5 text-sm text-white/50">{jobs.length} jobs</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/admin/jobs${f.value === 'all' ? '' : `?status=${f.value}`}`}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              activeFilter === f.value
                ? 'bg-white text-[#0F0F0F]'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#1A1A1A] p-12 text-center">
          <p className="text-sm text-white/40">No jobs in this queue.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wide">Job</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wide hidden md:table-cell">Employer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wide hidden lg:table-cell">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wide hidden lg:table-cell">Sponsorship</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobs.map((job) => {
                const sponsorship = Array.isArray(job.job_sponsorship_metadata)
                  ? job.job_sponsorship_metadata[0]
                  : job.job_sponsorship_metadata;
                const sponsorStatus = sponsorship?.sponsorship_status ?? 'unknown';
                const company = Array.isArray(job.employer_companies)
                  ? job.employer_companies[0]
                  : job.employer_companies;
                const location  = [job.city, job.country].filter(Boolean).join(', ');
                const statusChip = STATUS_CHIP[job.status] ?? 'bg-white/10 text-white/50';
                const isPending  = job.status === 'pending_review';
                const isActive   = job.status === 'active';

                return (
                  <tr key={job.id} className="bg-[#1A1A1A] hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                      <Link
                        href={`/jobs/${job.id}`}
                        target="_blank"
                        className="font-medium text-white hover:text-green transition-colors line-clamp-1"
                      >
                        {job.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-white/40 capitalize">
                        {job.employment_type?.replace('_', ' ')} · {job.seniority_level}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-white/80">{company?.name ?? '—'}</p>
                      {company?.verification_status && (
                        <p className={`text-xs mt-0.5 ${company.verification_status === 'verified' ? 'text-green' : 'text-yellow-300'}`}>
                          {company.verification_status}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-white/60 text-xs">
                      {location || '—'}
                      {job.work_mode && (
                        <span className="ml-1 capitalize text-white/40">· {job.work_mode.replace('_', '-')}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className={`text-xs ${SPONSORSHIP_CHIP[sponsorStatus] ?? 'text-white/40'}`}>
                        {SPONSORSHIP_LABEL[sponsorStatus] ?? sponsorStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusChip}`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <JobModerationActions
                        jobId={job.id}
                        isPending={isPending}
                        isActive={isActive}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
