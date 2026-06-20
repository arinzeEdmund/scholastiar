'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/types/database';

export async function signInWithEmail(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = (formData.get('next') as string) || '/discover';

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, error: error.message };

  redirect(next);
}

export async function signUpCandidate(formData: FormData): Promise<ActionResult> {
  const fullName = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const country = formData.get('country') as string;

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

  redirect('/auth/verify-email');
}

export async function signUpEmployer(formData: FormData): Promise<ActionResult> {
  const fullName = formData.get('full_name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const companyName = formData.get('company_name') as string;

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

  redirect('/auth/verify-email');
}

export async function sendPasswordReset(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.APP_URL}/auth/callback?next=/auth/reset-password`,
  });

  if (error) return { ok: false, error: error.message };

  return { ok: true, data: undefined };
}

export async function updatePassword(formData: FormData): Promise<ActionResult> {
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { ok: false, error: error.message };

  redirect('/discover');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/sign-in');
}
