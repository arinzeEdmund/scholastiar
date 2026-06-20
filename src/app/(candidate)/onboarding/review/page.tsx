import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { completeOnboarding } from '@/lib/actions/onboarding';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Review your profile' };

const SECTIONS = [
  { label: 'Personal information', href: '/onboarding/personal' },
  { label: 'Visa & mobility',      href: '/onboarding/visa' },
  { label: 'Education',            href: '/onboarding/education' },
  { label: 'Work experience',      href: '/onboarding/experience' },
  { label: 'Skills',               href: '/onboarding/skills' },
  { label: 'Job preferences',      href: '/onboarding/preferences' },
];

export default function ReviewStepPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E1E1E]">Review your profile</h2>
        <p className="mt-1 text-sm text-[#5F6368]">
          Everything looks good? Complete onboarding to start discovering opportunities.
        </p>
      </div>
      <ul className="divide-y divide-[#E5E7EB] rounded-lg border border-[#E5E7EB]">
        {SECTIONS.map(({ label, href }) => (
          <li key={href} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-[#10B65B]" />
              <span className="text-sm text-[#1E1E1E]">{label}</span>
            </div>
            <Link href={href} className="text-xs font-medium text-[#10B65B] hover:text-[#0E9F50]">
              Edit
            </Link>
          </li>
        ))}
      </ul>
      <form action={completeOnboarding}>
        <Button type="submit" className="w-full">Complete onboarding</Button>
      </form>
    </div>
  );
}
