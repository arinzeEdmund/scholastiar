import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/auth-form';
import { sendPasswordReset } from '@/lib/actions/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reset your password' };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#1E1E1E]">Reset your password</h1>
        <p className="mt-1 text-sm text-[#5F6368]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm action={sendPasswordReset} />
      <p className="text-center text-sm text-[#5F6368]">
        Remembered it?{' '}
        <Link href="/auth/sign-in" className="font-medium text-[#10B65B] hover:text-[#0E9F50]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
