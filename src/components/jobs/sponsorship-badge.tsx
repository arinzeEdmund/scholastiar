import { Badge } from '@/components/ui/badge';
import { Plane } from 'lucide-react';

interface SponsorshipBadgeProps {
  status?: string | null;
  visaTypes?: string[] | null;
  className?: string;
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Visa sponsored',
  open_to_discussion: 'Sponsorship possible',
  work_authorization_required: 'Work auth required',
};

export function SponsorshipBadge({ status, visaTypes, className }: SponsorshipBadgeProps) {
  if (!status || status === 'not_available' || status === 'unknown') return null;

  const label = STATUS_LABELS[status] ?? 'Sponsorship';
  const types = visaTypes?.slice(0, 2).join(', ');

  return (
    <Badge
      className={`gap-1 bg-[#EAF6F0] text-[#10B65B] hover:bg-[#EAF6F0] border-[#10B65B]/20 ${className ?? ''}`}
      variant="outline"
    >
      <Plane className="h-3 w-3" />
      {label}
      {types ? ` · ${types}` : ''}
    </Badge>
  );
}
