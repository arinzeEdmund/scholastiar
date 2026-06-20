'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function getEmployerCompanyId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('employer_memberships')
    .select('employer_company_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();
  return data?.employer_company_id ?? null;
}

export async function setupEmployerCompany(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  // Create company
  const { data: company, error } = await supabase
    .from('employer_companies')
    .insert({
      name:                  formData.get('name') as string,
      website_url:           formData.get('website_url') as string || null,
      industry:              formData.get('industry') as string || null,
      company_size:          formData.get('company_size') as string || null,
      headquarters_country:  formData.get('headquarters_country') as string || null,
      headquarters_city:     formData.get('headquarters_city') as string || null,
      description:           formData.get('description') as string || null,
      tagline:               formData.get('tagline') as string || null,
      linkedin_url:          formData.get('linkedin_url') as string || null,
      sponsorship_policy:    formData.get('sponsorship_policy') as string || 'unknown',
      onboarding_done:       true,
    })
    .select('id')
    .single();

  if (error) throw error;

  // Create membership as owner
  await supabase.from('employer_memberships').insert({
    employer_company_id: company.id,
    user_id: user.id,
    role: 'owner',
    status: 'active',
  });

  // Update user profile primary role
  await supabase
    .from('user_profiles')
    .update({ primary_role: 'employer', updated_at: new Date().toISOString() })
    .eq('user_id', user.id);

  redirect('/employer/dashboard');
}

export async function createJob(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const companyId = await getEmployerCompanyId(supabase);
  if (!companyId) redirect('/employer/setup');

  const { data: { user } } = await supabase.auth.getUser();

  const { data: job, error } = await supabase
    .from('jobs')
    .insert({
      employer_company_id:  companyId,
      title:                formData.get('title') as string,
      description:          formData.get('description') as string,
      employment_type:      formData.get('employment_type') as string || 'full_time',
      seniority_level:      formData.get('seniority_level') as string || null,
      work_mode:            formData.get('work_mode') as string || 'on_site',
      country:              formData.get('country') as string || null,
      city:                 formData.get('city') as string || null,
      salary_min:           formData.get('salary_min') ? Number(formData.get('salary_min')) : null,
      salary_max:           formData.get('salary_max') ? Number(formData.get('salary_max')) : null,
      salary_currency:      formData.get('salary_currency') as string || 'USD',
      salary_disclosed:     formData.get('salary_disclosed') !== 'false',
      application_deadline: formData.get('application_deadline') as string || null,
      status:               'pending_review',
      created_by:           user?.id,
    })
    .select('id')
    .single();

  if (error) throw error;

  // Insert sponsorship metadata
  const sponsorshipStatus = formData.get('sponsorship_status') as string || 'unknown';
  await supabase.from('job_sponsorship_metadata').insert({
    job_id:                          job.id,
    sponsorship_status:              sponsorshipStatus,
    relocation_support_available:    formData.get('relocation_support') === 'true',
    open_to_international_applicants: formData.get('open_to_international') === 'true',
    employer_confirmed:              true,
  });

  redirect('/employer/jobs?created=1');
}

export async function getMyCompany() {
  const supabase = await createClient();
  const companyId = await getEmployerCompanyId(supabase);
  if (!companyId) return null;
  const { data } = await supabase
    .from('employer_companies')
    .select('*')
    .eq('id', companyId)
    .maybeSingle();
  return data;
}

export async function getMyJobs() {
  const supabase = await createClient();
  const companyId = await getEmployerCompanyId(supabase);
  if (!companyId) return [];
  const { data } = await supabase
    .from('jobs')
    .select('*, job_sponsorship_metadata(*)')
    .eq('employer_company_id', companyId)
    .order('created_at', { ascending: false });
  return data ?? [];
}
