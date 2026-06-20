import Link from 'next/link';
import { Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Verify your email' };

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF6F0]">
        <Mail className="h-7 w-7 text-[#10B65B]" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-[#1E1E1E]">Check your inbox</h1>
        <p className="mt-2 text-sm text-[#5F6368]">
          We sent you a verification link. Click it to activate your account and continue
          to onboarding.
        </p>
      </div>
      <p className="text-sm text-[#5F6368]">
        Didn&apos;t receive the email?{' '}
        <Link href="/auth/sign-in" className="font-medium text-[#10B65B] hover:text-[#0E9F50]">
          Try signing in
        </Link>{' '}
        or check your spam folder.
      </p>
    </div>
  );
}
