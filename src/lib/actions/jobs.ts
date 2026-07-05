'use server';

import { createClient } from '@/lib/supabase/server';
import { computeMatchScore } from '@/lib/utils/match-score';
import type { JobWithDetails, ActionResult } from '@/types/database';
import type { MatchResult } from '@/lib/utils/match-score';

export interface JobFilters {
  q?: string;
  country?: string;
  work_mode?: string;
  sponsorship?: string;
  seniority?: string;
}

export interface JobWithMatch extends JobWithDetails {
  match?: MatchResult;
}

const JOB_SELECT = `
  *,
  employer_companies ( id, name, slug, verification_status, sponsorship_policy, headquarters_country ),
  job_sponsorship_metadata ( * ),
  job_requirements ( * )
`;

async function getCandidateContext(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('candidate_profiles')
    .select('id, preferred_name, headline, profile_completion_score')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) return { profile: null, prefs: { targetCountries: [], workModes: [], targetRoles: [], skills: [], seniorityLevels: [], needsSponsorship: false } };

  const [{ data: visa }, { data: prefs }, { data: skills }] = await Promise.all([
    supabase.from('candidate_visa_profiles').select('needs_sponsorship, willing_to_relocate, target_countries').eq('candidate_profile_id', profile.id).maybeSingle(),
    supabase.from('career_preferences').select('target_roles, work_modes, target_countries, seniority_levels').eq('candidate_profile_id', profile.id).maybeSingle(),
    supabase.from('candidate_skills').select('skill_name').eq('candidate_profile_id', profile.id),
  ]);

  return {
    profile,
    prefs: {
      targetCountries: [...(visa?.target_countries ?? []), ...(prefs?.target_countries ?? [])],
      workModes: prefs?.work_modes ?? [],
      targetRoles: prefs?.target_roles ?? [],
      skills: (skills ?? []).map((s) => s.skill_name),
      seniorityLevels: prefs?.seniority_levels ?? [],
      needsSponsorship: visa?.needs_sponsorship ?? false,
    },
  };
}

export async function getPublicJobs(filters: JobFilters = {}): Promise<ActionResult<JobWithDetails[]>> {
  try {
    const supabase = await createClient();
    let query = supabase.from('jobs').select(JOB_SELECT).eq('status', 'active').order('published_at', { ascending: false }).limit(50);
    if (filters.q) query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
    if (filters.country) query = query.eq('country', filters.country);
    if (filters.work_mode) query = query.eq('work_mode', filters.work_mode);
    const { data, error } = await query;
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []) as JobWithDetails[] };
  } catch {
    return { ok: false, error: 'Failed to load jobs.' };
  }
}

export async function getPersonalizedJobs(filters: JobFilters = {}): Promise<
  ActionResult<{ jobs: JobWithMatch[]; profile: { preferred_name: string | null; profile_completion_score: number } | null }>
> {
  try {
    const supabase = await createClient();
    const ctx = await getCandidateContext(supabase);

    let query = supabase.from('jobs').select(JOB_SELECT).eq('status', 'active').order('published_at', { ascending: false }).limit(60);
    if (filters.q) query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
    if (filters.country) query = query.eq('country', filters.country);
    if (filters.work_mode) query = query.eq('work_mode', filters.work_mode);
    if (filters.seniority) query = query.eq('seniority_level', filters.seniority);

    const { data, error } = await query;
    if (error) return { ok: false, error: error.message };

    const jobs = (data ?? []) as JobWithDetails[];
    const candidatePrefs = ctx?.prefs ?? { targetCountries: [], workModes: [], targetRoles: [], skills: [], seniorityLevels: [], needsSponsorship: false };
    const jobsWithMatch = jobs
      .map((job) => ({ ...job, match: computeMatchScore(job, candidatePrefs) }))
      .sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));

    return { ok: true, data: { jobs: jobsWithMatch, profile: ctx?.profile ?? null } };
  } catch {
    return { ok: false, error: 'Failed to load personalized jobs.' };
  }
}

export async function getVisaSponsoredJobs(filters: JobFilters = {}): Promise<ActionResult<JobWithDetails[]>> {
  try {
    const supabase = await createClient();
    let query = supabase.from('jobs').select(JOB_SELECT).eq('status', 'active').order('published_at', { ascending: false }).limit(50);
    if (filters.q) query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
    if (filters.country) query = query.eq('country', filters.country);
    if (filters.work_mode) query = query.eq('work_mode', filters.work_mode);
    const { data, error } = await query;
    if (error) return { ok: false, error: error.message };
    const jobs = ((data ?? []) as JobWithDetails[]).filter(
      (j) => j.job_sponsorship_metadata?.sponsorship_status === 'available' ||
             j.job_sponsorship_metadata?.sponsorship_status === 'open_to_discussion'
    );
    return { ok: true, data: jobs };
  } catch {
    return { ok: false, error: 'Failed to load visa-sponsored jobs.' };
  }
}

export async function getJobById(jobId: string): Promise<ActionResult<JobWithDetails>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('jobs').select(JOB_SELECT).eq('id', jobId).eq('status', 'active').single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: data as JobWithDetails };
  } catch {
    return { ok: false, error: 'Failed to load job.' };
  }
}

export async function getJobByIdAuth(jobId: string): Promise<
  ActionResult<{ job: JobWithMatch; profile: MatchResult | null; missingSkills: string[]; candidateSkills: string[] }>
> {
  try {
    const supabase = await createClient();
    const [{ data, error }, ctx] = await Promise.all([
      supabase.from('jobs').select(JOB_SELECT).eq('id', jobId).eq('status', 'active').single(),
      getCandidateContext(supabase),
    ]);

    if (error || !data) return { ok: false, error: 'Job not found.' };

    const job = data as JobWithDetails;
    const candidatePrefs = ctx?.prefs ?? { targetCountries: [], workModes: [], targetRoles: [], skills: [], seniorityLevels: [], needsSponsorship: false };
    const match = computeMatchScore(job, candidatePrefs);

    const reqSkills = (job.job_requirements ?? [])
      .filter((r) => r.requirement_type === 'skill' && r.importance === 'required')
      .map((r) => r.requirement_text);
    const candidateSkillsLower = candidatePrefs.skills.map((s) => s.toLowerCase());
    const missingSkills = reqSkills.filter(
      (rs) => !candidateSkillsLower.some((cs) =>
        cs.includes(rs.toLowerCase().split(' ')[0]) || rs.toLowerCase().includes(cs.split(' ')[0])
      )
    );

    return {
      ok: true,
      data: { job: { ...job, match }, profile: match, missingSkills, candidateSkills: candidatePrefs.skills },
    };
  } catch {
    return { ok: false, error: 'Failed to load job.' };
  }
}
