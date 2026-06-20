import Link from 'next/link';
import { SignInForm } from '@/components/auth/auth-form';
import { signInWithEmail } from '@/lib/actions/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#1E1E1E]">Sign in to Scholastiar</h1>
        <p className="mt-1 text-sm text-[#5F6368]">Welcome back. Enter your details below.</p>
      </div>
      <SignInForm action={signInWithEmail} />
      <div className="flex items-center justify-between text-sm">
        <Link href="/auth/forgot-password" className="text-[#5F6368] hover:text-[#10B65B]">
          Forgot password?
        </Link>
        <Link href="/auth/sign-up/candidate" className="font-medium text-[#10B65B] hover:text-[#0E9F50]">
          Create account
        </Link>
      </div>
    </div>
  );
}
