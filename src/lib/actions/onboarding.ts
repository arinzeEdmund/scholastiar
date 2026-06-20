'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const STEPS = ['personal','visa','education','experience','skills','preferences','review'] as const;
type Step = typeof STEPS[number];

async function getCandidateProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('candidate_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  return data;
}

async function ensureCandidateProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: existing } = await supabase
    .from('candidate_profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from('candidate_profiles')
    .insert({ user_id: user.id })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

async function markStepComplete(
  supabase: Awaited<ReturnType<typeof createClient>>,
  candidateProfileId: string,
  step: Step,
  nextStep: string,
) {
  const { data: existing } = await supabase
    .from('candidate_onboarding_sessions')
    .select('id, completed_steps')
    .eq('candidate_profile_id', candidateProfileId)
    .maybeSingle();

  if (existing) {
    const steps = Array.from(new Set([...existing.completed_steps, step]));
    await supabase
      .from('candidate_onboarding_sessions')
      .update({ completed_steps: steps, current_step: nextStep, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('candidate_onboarding_sessions')
      .insert({ candidate_profile_id: candidateProfileId, completed_steps: [step], current_step: nextStep });
  }
}

// ── Personal step ──────────────────────────────────────────────
export async function savePersonalInfo(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const profileId = await ensureCandidateProfile(supabase);
  await supabase.from('candidate_profiles').update({
    preferred_name:           formData.get('preferred_name') as string || null,
    nationality:              formData.get('nationality') as string || null,
    date_of_birth:            formData.get('date_of_birth') as string || null,
    phone:                    formData.get('phone') as string || null,
    current_location_country: formData.get('current_location_country') as string || null,
    current_location_city:    formData.get('current_location_city') as string || null,
    languages:                (formData.get('languages') as string || '').split(',').map(s => s.trim()).filter(Boolean),
    updated_at:               new Date().toISOString(),
  }).eq('id', profileId);
  await markStepComplete(supabase, profileId, 'personal', 'visa');
  redirect('/onboarding/visa');
}

// ── Visa step ──────────────────────────────────────────────────
export async function saveVisaInfo(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const profileId = await ensureCandidateProfile(supabase);
  const targetCountries = (formData.get('target_countries') as string || '')
    .split(',').map(s => s.trim()).filter(Boolean);

  await supabase.from('candidate_visa_profiles').upsert({
    candidate_profile_id:     profileId,
    passport_country:         formData.get('passport_country') as string || null,
    current_visa_status:      formData.get('current_visa_status') as string || null,
    needs_sponsorship:        formData.get('needs_sponsorship') === 'true',
    willing_to_relocate:      formData.get('willing_to_relocate') === 'true',
    target_countries:         targetCountries,
    work_authorization_notes: formData.get('work_authorization_notes') as string || null,
    updated_at:               new Date().toISOString(),
  }, { onConflict: 'candidate_profile_id' });
  await markStepComplete(supabase, profileId, 'visa', 'education');
  redirect('/onboarding/education');
}

// ── Education step ─────────────────────────────────────────────
export async function saveEducation(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const profileId = await ensureCandidateProfile(supabase);
  await supabase.from('education_records').insert({
    candidate_profile_id: profileId,
    institution_name:     formData.get('institution_name') as string,
    country:              formData.get('country') as string || null,
    degree_level:         formData.get('degree_level') as string || null,
    field_of_study:       formData.get('field_of_study') as string || null,
    qualification_name:   formData.get('qualification_name') as string || null,
    start_date:           formData.get('start_date') as string || null,
    end_date:             formData.get('end_date') as string || null,
    is_current:           formData.get('is_current') === 'true',
    grade:                formData.get('grade') as string || null,
  });
  await markStepComplete(supabase, profileId, 'education', 'experience');
  redirect('/onboarding/experience');
}

// ── Experience step ────────────────────────────────────────────
export async function saveExperience(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const profileId = await ensureCandidateProfile(supabase);
  const toolsUsed = (formData.get('tools_used') as string || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  await supabase.from('work_experiences').insert({
    candidate_profile_id: profileId,
    company_name:         formData.get('company_name') as string,
    job_title:            formData.get('job_title') as string,
    country:              formData.get('country') as string || null,
    city:                 formData.get('city') as string || null,
    start_date:           formData.get('start_date') as string || null,
    end_date:             formData.get('end_date') as string || null,
    is_current:           formData.get('is_current') === 'true',
    responsibilities:     formData.get('responsibilities') as string || null,
    achievements:         formData.get('achievements') as string || null,
    tools_used:           toolsUsed,
    industry:             formData.get('industry') as string || null,
  });
  await markStepComplete(supabase, profileId, 'experience', 'skills');
  redirect('/onboarding/skills');
}

// ── Skills step ────────────────────────────────────────────────
export async function saveSkills(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const profileId = await ensureCandidateProfile(supabase);
  const skillNames = (formData.get('skills') as string || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  if (skillNames.length > 0) {
    await supabase.from('candidate_skills').insert(
      skillNames.map(name => ({
        candidate_profile_id: profileId,
        skill_name: name,
        skill_type: 'technical',
        source: 'manual',
      }))
    );
  }
  await markStepComplete(supabase, profileId, 'skills', 'preferences');
  redirect('/onboarding/preferences');
}

// ── Preferences step ───────────────────────────────────────────
export async function savePreferences(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const profileId = await ensureCandidateProfile(supabase);
  const split = (key: string) =>
    (formData.get(key) as string || '').split(',').map(s => s.trim()).filter(Boolean);

  await supabase.from('career_preferences').upsert({
    candidate_profile_id: profileId,
    target_roles:         split('target_roles'),
    industries:           split('industries'),
    seniority_levels:     split('seniority_levels'),
    salary_min:           formData.get('salary_min') ? Number(formData.get('salary_min')) : null,
    salary_currency:      formData.get('salary_currency') as string || 'USD',
    work_modes:           split('work_modes'),
    target_countries:     split('target_countries'),
    updated_at:           new Date().toISOString(),
  }, { onConflict: 'candidate_profile_id' });
  await markStepComplete(supabase, profileId, 'preferences', 'review');
  redirect('/onboarding/review');
}

// ── Complete onboarding ────────────────────────────────────────
export async function completeOnboarding(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  await supabase
    .from('user_profiles')
    .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
    .eq('user_id', user.id);

  const profile = await getCandidateProfile(supabase);
  if (profile) {
    await supabase
      .from('candidate_onboarding_sessions')
      .update({ completed_at: new Date().toISOString() })
      .eq('candidate_profile_id', profile.id);
  }
  redirect('/onboarding/complete');
}
