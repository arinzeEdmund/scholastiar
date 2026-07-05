'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/types/database';

const signInSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
  next: z.string().optional(),
});

const signUpCandidateSchema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters for your password.'),
  country: z.string().trim().optional(),
});

const signUpEmployerSchema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name.'),
  company_name: z.string().trim().min(2, 'Enter your company name.'),
  email: z.string().trim().email('Enter a valid work email address.'),
  password: z.string().min(8, 'Use at least 8 characters for your password.'),
});

const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Use at least 8 characters for your password.'),
});

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : undefined;
}

function firstValidationError(error: z.ZodError) {
  return error.issues[0]?.message ?? 'Check the form and try again.';
}

function safeNextPath(next?: string) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/discover';
  return next;
}

export async function signInWithEmail(
  formData: FormData,
): Promise<ActionResult<{ next: string }>> {
  const parsed = signInSchema.safeParse({
    email: formValue(formData, 'email'),
    password: formValue(formData, 'password'),
    next: formValue(formData, 'next'),
  });

  if (!parsed.success) {
    return { ok: false, error: firstValidationError(parsed.error) };
  }

  const { email, password } = parsed.data;
  const next = safeNextPath(parsed.data.next);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, error: error.message };
  if (!data.session) return { ok: false, error: 'Sign in did not complete. Please try again.' };

  return { ok: true, data: { next } };
}

export async function signUpCandidate(
  formData: FormData,
): Promise<ActionResult<{ next: string }>> {
  const parsed = signUpCandidateSchema.safeParse({
    full_name: formValue(formData, 'full_name'),
    email: formValue(formData, 'email'),
    password: formValue(formData, 'password'),
    country: formValue(formData, 'country'),
  });

  if (!parsed.success) {
    return { ok: false, error: firstValidationError(parsed.error) };
  }

  const { full_name: fullName, email, password, country } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, primary_role: 'candidate', country },
      emailRedirectTo: `${process.env.APP_URL}/auth/callback?next=/onboarding`,
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { next: '/auth/verify-email' } };
}

export async function signUpEmployer(
  formData: FormData,
): Promise<ActionResult<{ next: string }>> {
  const parsed = signUpEmployerSchema.safeParse({
    full_name: formValue(formData, 'full_name'),
    company_name: formValue(formData, 'company_name'),
    email: formValue(formData, 'email'),
    password: formValue(formData, 'password'),
  });

  if (!parsed.success) {
    return { ok: false, error: firstValidationError(parsed.error) };
  }

  const { full_name: fullName, email, password, company_name: companyName } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, primary_role: 'employer', company_name: companyName },
      emailRedirectTo: `${process.env.APP_URL}/auth/callback?next=/employers/onboarding`,
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { next: '/auth/verify-email' } };
}

export async function updatePassword(
  formData: FormData,
): Promise<ActionResult<{ next: string }>> {
  const parsed = updatePasswordSchema.safeParse({
    password: formValue(formData, 'password'),
  });

  if (!parsed.success) {
    return { ok: false, error: firstValidationError(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { next: '/discover' } };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/sign-in');
}
