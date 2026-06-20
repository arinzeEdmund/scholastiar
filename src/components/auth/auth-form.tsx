'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ActionResult } from '@/types/database';

// ── Sign In Form ───────────────────────────────────────────────
interface SignInFormProps {
  action: (formData: FormData) => Promise<ActionResult>;
  next?: string;
}

export function SignInForm({ action, next }: SignInFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult | null, fd: FormData) => action(fd),
    null
  );
  return (
    <form action={formAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      {state && !state.ok && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}

// ── Sign Up Candidate Form ──────────────────────────────────────
interface SignUpCandidateFormProps {
  action: (formData: FormData) => Promise<ActionResult>;
}

export function SignUpCandidateForm({ action }: SignUpCandidateFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult | null, fd: FormData) => action(fd),
    null
  );
  return (
    <form action={formAction} className="space-y-4">
      {state && !state.ok && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="full_name">Full name</label>
        <Input id="full_name" name="full_name" type="text" required autoComplete="name" placeholder="Your full name" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" placeholder="At least 8 characters" minLength={8} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="country">Current country</label>
        <Input id="country" name="country" type="text" placeholder="e.g. Nigeria, India, Brazil" />
      </div>
      <p className="text-xs text-[#8A8F98]">
        By creating an account you agree to our{' '}
        <a href="/terms" className="underline hover:text-[#1E1E1E]">Terms</a>{' '}and{' '}
        <a href="/privacy" className="underline hover:text-[#1E1E1E]">Privacy Policy</a>.
      </p>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Creating account…' : 'Create candidate account'}
      </Button>
    </form>
  );
}

// ── Sign Up Employer Form ──────────────────────────────────────
interface SignUpEmployerFormProps {
  action: (formData: FormData) => Promise<ActionResult>;
}

export function SignUpEmployerForm({ action }: SignUpEmployerFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult | null, fd: FormData) => action(fd),
    null
  );
  return (
    <form action={formAction} className="space-y-4">
      {state && !state.ok && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="full_name">Your full name</label>
        <Input id="full_name" name="full_name" type="text" required placeholder="Your full name" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="company_name">Company name</label>
        <Input id="company_name" name="company_name" type="text" required placeholder="Acme Corp" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="email">Work email</label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="password">Password</label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" placeholder="At least 8 characters" minLength={8} />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Creating account…' : 'Create employer account'}
      </Button>
    </form>
  );
}

// ── Forgot Password Form ───────────────────────────────────────
interface ForgotPasswordFormProps {
  action: (formData: FormData) => Promise<ActionResult>;
}

export function ForgotPasswordForm({ action }: ForgotPasswordFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult | null, fd: FormData) => action(fd),
    null
  );
  return (
    <form action={formAction} className="space-y-4">
      {state?.ok && (
        <p className="rounded-lg bg-[#EAF6F0] px-4 py-3 text-sm text-[#087A3E]">
          Check your inbox — we sent a password reset link.
        </p>
      )}
      {state && !state.ok && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <Button type="submit" className="w-full" disabled={pending || state?.ok}>
        {pending ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
  );
}

// ── Reset Password Form ────────────────────────────────────────
interface ResetPasswordFormProps {
  action: (formData: FormData) => Promise<ActionResult>;
}

export function ResetPasswordForm({ action }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult | null, fd: FormData) => action(fd),
    null
  );
  return (
    <form action={formAction} className="space-y-4">
      {state && !state.ok && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="password">New password</label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" placeholder="At least 8 characters" minLength={8} />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Updating…' : 'Update password'}
      </Button>
    </form>
  );
}
