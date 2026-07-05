'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck } from 'lucide-react';
import { submitApplication } from '@/lib/actions/applications';

interface ApplyFormProps {
  jobId: string;
}

export function ApplyForm({ jobId }: ApplyFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const toastId = toast.loading('Submitting your application…');

    startTransition(async () => {
      const result = await submitApplication(fd);
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success('Application submitted!', { id: toastId });
      router.push(`/applications/${result.data.applicationId}/confirmation`);
    });
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6 space-y-5">
      <h1 className="text-lg font-semibold text-primary-text">Your application</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="job_id" value={jobId} />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text" htmlFor="cover_letter">
            Cover letter <span className="text-muted-text font-normal">(optional)</span>
          </label>
          <Textarea
            id="cover_letter"
            name="cover_letter"
            rows={6}
            placeholder="Tell the employer why you're a great fit for this role…"
          />
          <p className="text-xs text-muted-text">
            Tip: mention your relevant experience, visa/work authorisation status, and why you want this specific role.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text" htmlFor="additional_info">
            Anything else to add? <span className="text-muted-text font-normal">(optional)</span>
          </label>
          <Textarea
            id="additional_info"
            name="additional_info"
            rows={3}
            placeholder="Portfolio links, availability, relocation timeline…"
          />
        </div>

        {/* Consent — required per platform security invariant */}
        <div className="rounded-lg bg-soft-background border border-border p-4 space-y-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green" />
            <div className="text-sm text-secondary-text leading-relaxed">
              <p className="font-medium text-primary-text">Before you submit</p>
              <p className="mt-1">
                Your profile information — including your name, skills, education, work experience,
                and visa/mobility preferences — will be shared with the employer for this role.
                AI-assisted features provide estimates and suggestions only;
                they do not guarantee outcomes or interviews.
              </p>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consent"
              value="true"
              required
              className="h-4 w-4 accent-green"
            />
            <span className="text-sm text-primary-text">
              I understand and consent to sharing my profile for this application.
            </span>
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={pending}>
            {pending ? 'Submitting…' : 'Submit application'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={pending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
