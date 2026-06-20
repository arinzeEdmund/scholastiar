import Link from 'next/link';
import { Briefcase, GraduationCap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Choose your role' };

export default function ChooseRolePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#1E1E1E]">How will you use Scholastiar?</h1>
        <p className="mt-1 text-sm text-[#5F6368]">Choose the account type that fits your goals.</p>
      </div>
      <div className="grid gap-3">
        <Link
          href="/auth/sign-up/candidate"
          className="flex items-start gap-4 rounded-lg border border-[#E5E7EB] p-5 transition-colors hover:border-[#10B65B] hover:bg-[#EAF6F0]"
        >
          <GraduationCap className="mt-0.5 h-6 w-6 shrink-0 text-[#10B65B]" />
          <div>
            <p className="font-medium text-[#1E1E1E]">I&apos;m a candidate</p>
            <p className="mt-0.5 text-sm text-[#5F6368]">
              Find jobs, scholarships, fellowships, and opportunities across borders.
            </p>
          </div>
        </Link>
        <Link
          href="/auth/sign-up/employer"
          className="flex items-start gap-4 rounded-lg border border-[#E5E7EB] p-5 transition-colors hover:border-[#10B65B] hover:bg-[#EAF6F0]"
        >
          <Briefcase className="mt-0.5 h-6 w-6 shrink-0 text-[#10B65B]" />
          <div>
            <p className="font-medium text-[#1E1E1E]">I&apos;m an employer</p>
            <p className="mt-0.5 text-sm text-[#5F6368]">
              Post jobs and find international talent ready to relocate.
            </p>
          </div>
        </Link>
      </div>
      <p className="text-center text-sm text-[#5F6368]">
        Already have an account?{' '}
        <Link href="/auth/sign-in" className="font-medium text-[#10B65B] hover:text-[#0E9F50]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
