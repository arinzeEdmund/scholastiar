import Link from 'next/link';
import { SignUpCandidateForm } from '@/components/auth/auth-form';
import { signUpCandidate } from '@/lib/actions/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Create candidate account' };

export default function SignUpCandidatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#1E1E1E]">Create your account</h1>
        <p className="mt-1 text-sm text-[#5F6368]">
          Find jobs, scholarships, fellowships, and opportunities worldwide.
        </p>
      </div>
      <SignUpCandidateForm action={signUpCandidate} />
      <p className="text-center text-sm text-[#5F6368]">
        Already have an account?{' '}
        <Link href="/auth/sign-in" className="font-medium text-[#10B65B] hover:text-[#0E9F50]">
          Sign in
        </Link>
      </p>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-[#8A8F98]">Are you an employer?</span>
        </div>
      </div>
      <p className="text-center text-sm text-[#5F6368]">
        <Link href="/auth/sign-up/employer" className="font-medium text-[#10B65B] hover:text-[#0E9F50]">
          Create an employer account
        </Link>
      </p>
    </div>
  );
}
