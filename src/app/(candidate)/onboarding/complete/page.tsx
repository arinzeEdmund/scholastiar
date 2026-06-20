import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Welcome to Scholastiar' };

export default function OnboardingCompletePage() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF6F0]">
        <PartyPopper className="h-8 w-8 text-[#10B65B]" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-[#1E1E1E]">Your profile is ready</h2>
        <p className="mt-2 text-[#5F6368]">
          Start discovering cross-border jobs, scholarships, fellowships, and opportunities
          matched to your goals.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button asChild className="w-full">
          <Link href="/discover">Discover opportunities</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/jobs">Browse all jobs</Link>
        </Button>
      </div>
    </div>
  );
}
