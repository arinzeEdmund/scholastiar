'use server';

import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/types/database';

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

export async function submitApplication(
  formData: FormData,
): Promise<ActionResult<{ applicationId: string }>> {
  const supabase = await createClient();
  const profileId = await getCandidateProfileId(supabase);
  if (!profileId) return { ok: false, error: 'You must be signed in to apply.' };

  const jobId = formData.get('job_id') as string;
  const consent = formData.get('consent') === 'true';

  if (!consent) return { ok: false, error: 'Please confirm your consent before submitting.' };

  // Upsert so candidates can't double-apply (unique constraint on job+candidate)
  const { data: application, error } = await supabase
    .from('job_applications')
    .upsert({
      job_id:               jobId,
      candidate_profile_id: profileId,
      cover_letter:         formData.get('cover_letter') as string || null,
      additional_info:      formData.get('additional_info') as string || null,
      consent_given:        true,
      status:               'submitted',
      submitted_at:         new Date().toISOString(),
    }, { onConflict: 'job_id,candidate_profile_id' })
    .select('id')
    .single();

  if (error) return { ok: false, error: 'Something went wrong. Please try again.' };

  // Log initial status history
  await supabase.from('application_status_history').insert({
    job_application_id: application.id,
    new_status: 'submitted',
    changed_by: (await supabase.auth.getUser()).data.user?.id,
  });

  return { ok: true, data: { applicationId: application.id } };
}

export async function getMyApplications() {
  const supabase = await createClient();
  const profileId = await getCandidateProfileId(supabase);
  if (!profileId) return [];

  const { data } = await supabase
    .from('job_applications')
    .select(`
      *,
      jobs (
        id, title, country, city, work_mode,
        employer_companies ( name )
      )
    `)
    .eq('candidate_profile_id', profileId)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export async function getApplicationById(applicationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('job_applications')
    .select(`
      *,
      jobs (
        *,
        employer_companies ( id, name, slug, verification_status, sponsorship_policy, headquarters_country ),
        job_sponsorship_metadata ( * ),
        job_requirements ( * )
      ),
      application_status_history ( * )
    `)
    .eq('id', applicationId)
    .single();
  return data;
}

// Employer actions
export async function getJobApplications(jobId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('job_applications')
    .select(`
      *,
      candidate_profiles (
        id, preferred_name, headline, current_location_country, current_location_city,
        profile_completion_score,
        candidate_skills ( skill_name ),
        candidate_visa_profiles ( needs_sponsorship, willing_to_relocate )
      )
    `)
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
  note?: string,
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  await supabase
    .from('job_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', applicationId);

  await supabase.from('application_status_history').insert({
    job_application_id: applicationId,
    new_status: status,
    note: note ?? null,
    changed_by: user?.id,
  });
}
