import Link from 'next/link';
import { SignUpEmployerForm } from '@/components/auth/auth-form';
import { signUpEmployer } from '@/lib/actions/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Create employer account' };

export default function SignUpEmployerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#1E1E1E]">Post jobs on Scholastiar</h1>
        <p className="mt-1 text-sm text-[#5F6368]">
          Reach international candidates ready to relocate and work globally.
        </p>
      </div>
      <SignUpEmployerForm action={signUpEmployer} />
      <p className="text-center text-sm text-[#5F6368]">
        Already have an account?{' '}
        <Link href="/auth/sign-in" className="font-medium text-[#10B65B] hover:text-[#0E9F50]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
