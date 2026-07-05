import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SignInForm } from '@/components/auth/auth-form';
import { signInWithEmail } from '@/lib/actions/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign in' };

const ERROR_MESSAGES: Record<string, string> = {
  link_expired:         'That link has expired. Please request a new one.',
  auth_callback_failed: 'The sign-in link is invalid or has already been used.',
  missing_code:         'The sign-in link is incomplete. Please request a new one.',
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; email?: string; password?: string }>;
}) {
  const { next, error, email, password } = await searchParams;

  if (email || password) {
    const params = new URLSearchParams();
    if (next) params.set('next', next);
    if (error) params.set('error', error);
    const query = params.toString();
    redirect(query ? `/auth/sign-in?${query}` : '/auth/sign-in');
  }

  const errorMessage = error ? (ERROR_MESSAGES[error] ?? 'Something went wrong. Please try again.') : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-primary-text">Sign in to Scholastiar</h1>
        <p className="mt-1 text-sm text-secondary-text">Welcome back. Enter your details below.</p>
      </div>
      {errorMessage && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMessage}{' '}
          {(error === 'link_expired' || error === 'missing_code') && (
            <Link href="/auth/forgot-password" className="underline font-medium">
              Request a new link
            </Link>
          )}
        </div>
      )}
      <SignInForm action={signInWithEmail} next={next} />
      <div className="flex items-center justify-between text-sm">
        <Link href="/auth/forgot-password" className="text-secondary-text hover:text-green">
          Forgot password?
        </Link>
        <Link href="/auth/sign-up/candidate" className="font-medium text-green hover:text-green/80">
          Create account
        </Link>
      </div>
    </div>
  );
}
