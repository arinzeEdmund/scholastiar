import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NewJobForm } from '@/components/employer/new-job-form';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Post a job — Scholastiar.ai' };

export default async function NewJobPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const { data: membership } = await supabase
    .from('employer_memberships')
    .select('employer_company_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (!membership) redirect('/employer/setup');

  return (
    <div className="min-h-screen bg-soft-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-primary-text">Post a job</h1>
          <p className="mt-1 text-sm text-secondary-text">
            Your job will be reviewed by our team before going live. This usually takes under 24 hours.
          </p>
        </div>
        <NewJobForm />
      </div>
    </div>
  );
}
