import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getSavedJobs } from '@/lib/actions/saved-jobs';
import { JobCard } from '@/components/jobs/job-card';
import { SaveButton } from '@/components/jobs/save-button';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import type { JobWithDetails } from '@/types/database';

export const metadata: Metadata = { title: 'Saved jobs — Scholastiar.ai' };

export default async function SavedJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const jobs = (await getSavedJobs()) as unknown as JobWithDetails[];

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#1E1E1E]">Saved jobs</h1>
            <p className="mt-0.5 text-sm text-[#5F6368]">{jobs.length} saved</p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/jobs">Browse all jobs</Link>
          </Button>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <Bookmark className="mx-auto h-8 w-8 text-[#8A8F98]" />
            <p className="mt-3 text-sm font-medium text-[#1E1E1E]">No saved jobs yet</p>
            <p className="mt-1 text-xs text-[#8A8F98]">
              Tap the bookmark icon on any job to save it here.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/jobs">Browse jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                saveButton={<SaveButton jobId={job.id} initialSaved />}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
