'use server';

import { createClient } from '@/lib/supabase/server';
import type { JobWithDetails, ActionResult } from '@/types/database';

export interface JobFilters {
  q?: string;
  country?: string;
  work_mode?: string;
  sponsorship?: string;
}

export async function getPublicJobs(
  filters: JobFilters = {},
): Promise<ActionResult<JobWithDetails[]>> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('jobs')
      .select(`
        *,
        employer_companies ( id, name, slug, verification_status, sponsorship_policy, headquarters_country ),
        job_sponsorship_metadata ( * ),
        job_requirements ( * )
      `)
      .eq('status', 'active')
      .order('published_at', { ascending: false })
      .limit(50);

    if (filters.q) {
      query = query.or(
        `title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`
      );
    }
    if (filters.country) query = query.eq('country', filters.country);
    if (filters.work_mode) query = query.eq('work_mode', filters.work_mode);
    if (filters.sponsorship === 'yes') {
      // filter via sponsorship join
      query = query.eq('job_sponsorship_metadata.sponsorship_status', 'available');
    }

    const { data, error } = await query;
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []) as JobWithDetails[] };
  } catch (err) {
    return { ok: false, error: 'Failed to load jobs.' };
  }
}

export async function getJobById(jobId: string): Promise<ActionResult<JobWithDetails>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        employer_companies ( id, name, slug, verification_status, sponsorship_policy, headquarters_country ),
        job_sponsorship_metadata ( * ),
        job_requirements ( * )
      `)
      .eq('id', jobId)
      .eq('status', 'active')
      .single();

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: data as JobWithDetails };
  } catch {
    return { ok: false, error: 'Failed to load job.' };
  }
}
