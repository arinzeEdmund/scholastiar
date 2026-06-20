import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getApplicationById } from '@/lib/actions/applications';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Application submitted — Scholastiar.ai' };

interface PageProps {
  params: Promise<{ applicationId: string }>;
}

export default async function ApplicationConfirmationPage({ params }: PageProps) {
  const { applicationId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const application = await getApplicationById(applicationId);
  if (!application) redirect('/applications');

  const job = application.jobs as { title: string; employer_companies?: { name?: string } } | null;

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-[#E5E7EB] bg-white p-8 text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF6F0]">
          <CheckCircle2 className="h-8 w-8 text-[#10B65B]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#1E1E1E]">Application submitted</h1>
          {job && (
            <p className="mt-2 text-sm text-[#5F6368]">
              You applied for <span className="font-medium text-[#1E1E1E]">{job.title}</span>
              {job.employer_companies?.name && (
                <> at <span className="font-medium text-[#1E1E1E]">{job.employer_companies.name}</span></>
              )}.
            </p>
          )}
          <p className="mt-2 text-sm text-[#8A8F98]">
            The employer will contact you if you are shortlisted. You can track this
            application in your applications dashboard.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/applications">View my applications</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/discover">Find more opportunities</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
