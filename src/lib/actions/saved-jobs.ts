'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function getCandidateProfileId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('candidate_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  return data?.id ?? null;
}

export async function toggleSaveJob(jobId: string): Promise<{ saved: boolean }> {
  const supabase = await createClient();
  const profileId = await getCandidateProfileId(supabase);
  if (!profileId) return { saved: false };

  const { data: existing } = await supabase
    .from('saved_jobs')
    .select('id')
    .eq('candidate_profile_id', profileId)
    .eq('job_id', jobId)
    .maybeSingle();

  if (existing) {
    await supabase.from('saved_jobs').delete().eq('id', existing.id);
    revalidatePath('/saved');
    revalidatePath('/jobs');
    revalidatePath('/discover');
    return { saved: false };
  }

  await supabase.from('saved_jobs').insert({ candidate_profile_id: profileId, job_id: jobId });
  revalidatePath('/saved');
  revalidatePath('/jobs');
  revalidatePath('/discover');
  return { saved: true };
}

export async function getSavedJobIds(): Promise<string[]> {
  const supabase = await createClient();
  const profileId = await getCandidateProfileId(supabase);
  if (!profileId) return [];

  const { data } = await supabase
    .from('saved_jobs')
    .select('job_id')
    .eq('candidate_profile_id', profileId);

  return (data ?? []).map((r) => r.job_id);
}

export async function getSavedJobs() {
  const supabase = await createClient();
  const profileId = await getCandidateProfileId(supabase);
  if (!profileId) return [];

  const { data } = await supabase
    .from('saved_jobs')
    .select(`
      job_id,
      created_at,
      jobs (
        *,
        employer_companies ( id, name, slug, verification_status, sponsorship_policy, headquarters_country ),
        job_sponsorship_metadata ( * ),
        job_requirements ( * )
      )
    `)
    .eq('candidate_profile_id', profileId)
    .order('created_at', { ascending: false });

  return (data ?? []).map((r) => r.jobs).filter(Boolean);
}
