import { redirect } from 'next/navigation';
import { JobCard } from '@/components/jobs/job-card';
import { getPublicJobs } from '@/lib/actions/jobs';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Discover — Scholastiar.ai' };

export default async function DiscoverPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const { data: prefs } = await supabase
    .from('career_preferences')
    .select('target_countries, work_modes, target_roles')
    .eq('candidate_profile_id', (
      await supabase.from('candidate_profiles').select('id').eq('user_id', user.id).maybeSingle()
    ).data?.id ?? '')
    .maybeSingle();

  const country = prefs?.target_countries?.[0];
  const work_mode = prefs?.work_modes?.[0];

  const result = await getPublicJobs({ country, work_mode });
  const jobs = result.ok ? result.data : [];

  const hasPrefs = !!prefs;

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1E1E1E]">Discover</h1>
            <p className="mt-0.5 text-sm text-[#5F6368]">
              {hasPrefs ? 'Opportunities matched to your preferences.' : 'Set your preferences to improve matches.'}
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/jobs">All jobs</Link>
          </Button>
        </div>

        {!hasPrefs && (
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-6 text-center">
            <p className="text-sm text-[#5F6368]">
              Complete your onboarding to get personalised job matches.
            </p>
            <Button asChild size="sm" className="mt-3">
              <Link href="/onboarding">Complete profile</Link>
            </Button>
          </div>
        )}

        {jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-[#5F6368]">
            No matched opportunities yet. <Link href="/jobs" className="text-[#10B65B] hover:underline">Browse all jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
}
