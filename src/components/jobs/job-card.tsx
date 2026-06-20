import Link from 'next/link';
import { MapPin, Clock, Briefcase, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SponsorshipBadge } from './sponsorship-badge';
import type { JobWithDetails } from '@/types/database';

interface JobCardProps {
  job: JobWithDetails;
}

const WORK_MODE_LABELS: Record<string, string> = {
  on_site: 'On-site',
  remote: 'Remote',
  hybrid: 'Hybrid',
};

function formatSalary(min?: number | null, max?: number | null, currency?: string | null) {
  if (!min && !max) return null;
  const sym = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  const fmt = (n: number) => n >= 1000 ? `${sym}${Math.round(n / 1000)}k` : `${sym}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export function JobCard({ job }: JobCardProps) {
  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
  const sponsorship = job.job_sponsorship_metadata;
  const postedDays = job.published_at
    ? Math.floor((Date.now() - new Date(job.published_at).getTime()) / 86_400_000)
    : null;

  const companyName = job.employer_companies?.name;
  const locationParts = [job.city, job.country].filter(Boolean).join(', ');

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block rounded-xl border border-[#E5E7EB] bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F7F9F7] text-sm font-bold text-[#10B65B]">
          {(companyName ?? 'C')[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-[#1E1E1E] group-hover:text-[#10B65B] transition-colors">
            {job.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5F6368]">
            {companyName && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" /> {companyName}
              </span>
            )}
            {locationParts && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {locationParts}
              </span>
            )}
            {job.work_mode && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" /> {WORK_MODE_LABELS[job.work_mode] ?? job.work_mode}
              </span>
            )}
          </div>
        </div>
        {postedDays !== null && (
          <span className="shrink-0 text-xs text-[#8A8F98]">
            <Clock className="mb-0.5 mr-0.5 inline h-3 w-3" />
            {postedDays === 0 ? 'Today' : postedDays === 1 ? '1d ago' : `${postedDays}d ago`}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {sponsorship && (
          <SponsorshipBadge
            status={sponsorship.sponsorship_status}
            visaTypes={sponsorship.target_visa_types}
          />
        )}
        {job.seniority_level && (
          <Badge variant="secondary" className="capitalize">{job.seniority_level}</Badge>
        )}
        {salary && <Badge variant="secondary">{salary}</Badge>}
        {job.employment_type && (
          <Badge variant="secondary" className="capitalize">
            {job.employment_type.replace('_', ' ')}
          </Badge>
        )}
      </div>
    </Link>
  );
}
