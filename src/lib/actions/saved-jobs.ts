'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult, JobWithDetails } from '@/types/database';

async function ensureCandidateProfileId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false as const, error: 'Sign in to save jobs.' };
  }

  const { data: existing, error: lookupError } = await supabase
    .from('candidate_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (lookupError) {
    return { ok: false as const, error: 'Could not check your candidate profile. Please try again.' };
  }

  if (existing) {
    return { ok: true as const, profileId: existing.id };
  }

  const preferredName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : user.email?.split('@')[0] ?? null;

  const { data: created, error: createError } = await supabase
    .from('candidate_profiles')
    .insert({
      user_id: user.id,
      preferred_name: preferredName,
    })
    .select('id')
    .single();

  if (createError) {
    return { ok: false as const, error: 'Could not prepare your candidate profile. Please try again.' };
  }

  return { ok: true as const, profileId: created.id };
}

function revalidateSavedJobSurfaces() {
  revalidatePath('/saved');
  revalidatePath('/jobs');
  revalidatePath('/discover');
  revalidatePath('/dashboard/jobs');
  revalidatePath('/dashboard/jobs/saved');
  revalidatePath('/dashboard/jobs/visa-sponsored');
}

export async function setSavedJob(
  jobId: string,
  shouldSave: boolean,
): Promise<ActionResult<{ saved: boolean }>> {
  const supabase = await createClient();
  const profileResult = await ensureCandidateProfileId(supabase);
  if (!profileResult.ok) return { ok: false, error: profileResult.error };

  const profileId = profileResult.profileId;

  if (shouldSave) {
    const { error } = await supabase
      .from('saved_jobs')
      .upsert(
        { candidate_profile_id: profileId, job_id: jobId },
        { onConflict: 'candidate_profile_id,job_id' },
      );

    if (error) return { ok: false, error: 'Could not save this job. Please try again.' };

    revalidateSavedJobSurfaces();
    return { ok: true, data: { saved: true } };
  }

  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('candidate_profile_id', profileId)
    .eq('job_id', jobId);

  if (error) return { ok: false, error: 'Could not remove this job. Please try again.' };

  revalidateSavedJobSurfaces();
  return { ok: true, data: { saved: false } };
}

export async function getSavedJobIds(): Promise<string[]> {
  const supabase = await createClient();
  const profileResult = await ensureCandidateProfileId(supabase);
  if (!profileResult.ok) return [];

  const { data } = await supabase
    .from('saved_jobs')
    .select('job_id')
    .eq('candidate_profile_id', profileResult.profileId);

  return (data ?? []).map((r) => r.job_id);
}

export async function getSavedJobs(): Promise<JobWithDetails[]> {
  const supabase = await createClient();
  const profileResult = await ensureCandidateProfileId(supabase);
  if (!profileResult.ok) return [];

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
    .eq('candidate_profile_id', profileResult.profileId)
    .order('created_at', { ascending: false });

  return (data ?? [])
    .flatMap((r) => Array.isArray(r.jobs) ? r.jobs : [r.jobs])
    .filter((job): job is JobWithDetails => Boolean(job));
}
