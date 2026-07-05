'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ActionResult } from '@/types/database';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('primary_role, platform_roles')
    .eq('id', user.id)
    .single();

  const isAdmin =
    profile?.primary_role === 'admin' ||
    (profile?.platform_roles ?? []).some((r: string) =>
      ['platform_admin', 'super_admin', 'support_admin'].includes(r)
    );

  if (!isAdmin) redirect('/');
  return user;
}

export async function getAdminStats() {
  await requireAdmin();
  const admin = createAdminClient();

  const [
    { count: totalUsers },
    { count: totalJobs },
    { count: pendingJobs },
    { count: totalApplications },
  ] = await Promise.all([
    admin.from('user_profiles').select('*', { count: 'exact', head: true }),
    admin.from('jobs').select('*', { count: 'exact', head: true }),
    admin.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
    admin.from('job_applications').select('*', { count: 'exact', head: true }),
  ]);

  return { totalUsers, totalJobs, pendingJobs, totalApplications };
}

export async function getAdminJobs(statusFilter?: string) {
  await requireAdmin();
  const admin = createAdminClient();

  let query = admin
    .from('jobs')
    .select(`
      id, title, country, city, work_mode, employment_type,
      seniority_level, created_at, status,
      employer_companies ( name, verification_status ),
      job_sponsorship_metadata ( sponsorship_status )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function updateJobStatus(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin();
  const jobId     = formData.get('jobId') as string;
  const newStatus = formData.get('status') as string;
  const note      = (formData.get('note') as string) || null;

  if (!jobId || !newStatus) return { ok: false, error: 'Missing job ID or status.' };

  const admin = createAdminClient();

  const { data: job } = await admin
    .from('jobs')
    .select('status')
    .eq('id', jobId)
    .single();

  const updatePayload: Record<string, unknown> = { status: newStatus };
  if (newStatus === 'active') updatePayload.published_at = new Date().toISOString();

  const { error } = await admin.from('jobs').update(updatePayload).eq('id', jobId);
  if (error) return { ok: false, error: 'Failed to update job status. Please try again.' };

  await admin.from('job_status_history').insert({
    job_id:     jobId,
    old_status: job?.status ?? null,
    new_status: newStatus,
    note,
    changed_by: user.id,
  });

  revalidatePath('/admin/jobs');
  return { ok: true, data: undefined };
}
