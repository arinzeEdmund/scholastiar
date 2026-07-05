'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import type { ActionResult } from '@/types/database';

type AuthStatus = 'idle' | 'submitting';

function authErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

// ── Sign In Form ───────────────────────────────────────────────
interface SignInFormProps {
  action: (formData: FormData) => Promise<ActionResult<{ next: string }>>;
  next?: string;
}

export function SignInForm({ action, next: nextProp }: SignInFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const isSubmitting = status === 'submitting';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setStatus('submitting');
    const fd = new FormData(e.currentTarget);
    if (nextProp) fd.set('next', nextProp);
    const toastId = toast.loading('Signing in…');

    try {
      const result = await action(fd);
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        setError(result.error);
        setStatus('idle');
        return;
      }
      toast.success('Signed in.', { id: toastId });
      router.replace(result.data.next);
      router.refresh();
    } catch (err) {
      const message = authErrorMessage(err);
      toast.error(message, { id: toastId });
      setError(message);
      setStatus('idle');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}

// ── Sign Up Candidate Form ──────────────────────────────────────
interface SignUpCandidateFormProps {
  action: (formData: FormData) => Promise<ActionResult<{ next: string }>>;
}

export function SignUpCandidateForm({ action }: SignUpCandidateFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const isSubmitting = status === 'submitting';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setStatus('submitting');
    const fd = new FormData(e.currentTarget);
    const toastId = toast.loading('Creating your account…');

    try {
      const result = await action(fd);
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        setError(result.error);
        setStatus('idle');
        return;
      }
      toast.success('Account created! Check your email to verify.', { id: toastId });
      router.replace(result.data.next);
      router.refresh();
    } catch (err) {
      const message = authErrorMessage(err);
      toast.error(message, { id: toastId });
      setError(message);
      setStatus('idle');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="full_name">Full name</label>
        <Input id="full_name" name="full_name" type="text" required autoComplete="name" placeholder="Your full name" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" placeholder="At least 8 characters" minLength={8} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="country">Current country</label>
        <Input id="country" name="country" type="text" placeholder="e.g. Nigeria, India, Brazil" />
      </div>
      <p className="text-xs text-muted-text">
        By creating an account you agree to our{' '}
        <a href="/terms" className="underline hover:text-primary-text">Terms</a>{' '}and{' '}
        <a href="/privacy" className="underline hover:text-primary-text">Privacy Policy</a>.
      </p>
      <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create candidate account'}
      </Button>
    </form>
  );
}

// ── Sign Up Employer Form ──────────────────────────────────────
interface SignUpEmployerFormProps {
  action: (formData: FormData) => Promise<ActionResult<{ next: string }>>;
}

export function SignUpEmployerForm({ action }: SignUpEmployerFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const isSubmitting = status === 'submitting';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setStatus('submitting');
    const fd = new FormData(e.currentTarget);
    const toastId = toast.loading('Creating your employer account…');

    try {
      const result = await action(fd);
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        setError(result.error);
        setStatus('idle');
        return;
      }
      toast.success('Account created! Check your email to verify.', { id: toastId });
      router.replace(result.data.next);
      router.refresh();
    } catch (err) {
      const message = authErrorMessage(err);
      toast.error(message, { id: toastId });
      setError(message);
      setStatus('idle');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="full_name">Your full name</label>
        <Input id="full_name" name="full_name" type="text" required placeholder="Your full name" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="company_name">Company name</label>
        <Input id="company_name" name="company_name" type="text" required placeholder="Acme Corp" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="email">Work email</label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" placeholder="At least 8 characters" minLength={8} />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create employer account'}
      </Button>
    </form>
  );
}

// ── Forgot Password Form ───────────────────────────────────────
// Uses the browser Supabase client directly so the PKCE code verifier
// is stored in the browser and the callback exchange succeeds.
export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('pending');
    const toastId = toast.loading('Sending reset link…');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
      toast.error(error.message, { id: toastId });
    } else {
      setStatus('success');
      toast.success('Check your inbox!', { id: toastId });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'success' && (
        <p className="rounded-lg bg-soft-green px-4 py-3 text-sm text-green">
          Check your inbox — we sent a password reset link.
        </p>
      )}
      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={status === 'pending' || status === 'success'}>
        {status === 'pending' ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
  );
}

// ── Reset Password Form ────────────────────────────────────────
interface ResetPasswordFormProps {
  action: (formData: FormData) => Promise<ActionResult<{ next: string }>>;
}

export function ResetPasswordForm({ action }: ResetPasswordFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const isSubmitting = status === 'submitting';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setStatus('submitting');
    const fd = new FormData(e.currentTarget);
    const toastId = toast.loading('Updating password…');

    try {
      const result = await action(fd);
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        setError(result.error);
        setStatus('idle');
        return;
      }
      toast.success('Password updated!', { id: toastId });
      router.replace(result.data.next);
      router.refresh();
    } catch (err) {
      const message = authErrorMessage(err);
      toast.error(message, { id: toastId });
      setError(message);
      setStatus('idle');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="password">New password</label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" placeholder="At least 8 characters" minLength={8} />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update password'}
      </Button>
    </form>
  );
}
