import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe, FileText, Star } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Set up your profile' };

const HIGHLIGHTS = [
  { icon: Globe,    text: 'Match to cross-border opportunities in 30+ countries' },
  { icon: FileText, text: 'Generate tailored CVs and application materials with AI' },
  { icon: Star,     text: 'Track applications and get deadline alerts' },
];

export default function OnboardingStartPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1E1E1E]">Let&apos;s build your profile</h1>
        <p className="mt-2 text-[#5F6368]">
          This takes around 5 minutes. Your answers power your job matching, AI CV generation,
          and application support.
        </p>
      </div>
      <ul className="space-y-4">
        {HIGHLIGHTS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF6F0]">
              <Icon className="h-4 w-4 text-[#10B65B]" />
            </span>
            <span className="text-sm text-[#1E1E1E]">{text}</span>
          </li>
        ))}
      </ul>
      <Button asChild className="w-full">
        <Link href="/onboarding/personal">Start — Personal info</Link>
      </Button>
    </div>
  );
}
