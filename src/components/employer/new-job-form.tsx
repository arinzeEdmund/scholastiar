'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createJob } from '@/lib/actions/employer';

export function NewJobForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const toastId = toast.loading('Posting your job…');

    startTransition(async () => {
      const result = await createJob(fd);
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success('Job posted! It will be reviewed within 24 hours.', { id: toastId });
      router.push('/employer/dashboard');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-white p-6">
      {/* Role basics */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="title">
          Job title <span className="text-red-500">*</span>
        </label>
        <Input id="title" name="title" required placeholder="Senior Software Engineer" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text" htmlFor="country">
            Country <span className="text-red-500">*</span>
          </label>
          <Input id="country" name="country" required placeholder="United Kingdom" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text" htmlFor="city">City</label>
          <Input id="city" name="city" placeholder="London" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text">Work mode</label>
          <div className="flex gap-4 text-sm">
            {['on_site', 'hybrid', 'remote'].map((m) => (
              <label key={m} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="work_mode" value={m} defaultChecked={m === 'on_site'} className="accent-green" />
                {m.replace('_', '-')}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text">Employment type</label>
          <div className="flex flex-wrap gap-4 text-sm">
            {[['full_time', 'Full-time'], ['part_time', 'Part-time'], ['contract', 'Contract'], ['internship', 'Internship']].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="employment_type" value={v} defaultChecked={v === 'full_time'} className="accent-green" />
                {l}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text" htmlFor="seniority_level">Seniority level</label>
          <Input id="seniority_level" name="seniority_level" placeholder="mid, senior, lead…" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text" htmlFor="application_deadline">Application deadline</label>
          <Input id="application_deadline" name="application_deadline" type="date" />
        </div>
      </div>

      {/* Salary */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text" htmlFor="salary_min">Salary min</label>
          <Input id="salary_min" name="salary_min" type="number" min={0} placeholder="50000" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text" htmlFor="salary_max">Salary max</label>
          <Input id="salary_max" name="salary_max" type="number" min={0} placeholder="80000" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-primary-text" htmlFor="salary_currency">Currency</label>
          <Input id="salary_currency" name="salary_currency" defaultValue="USD" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-primary-text" htmlFor="description">
          Job description <span className="text-red-500">*</span>
        </label>
        <Textarea id="description" name="description" required rows={8}
          placeholder="Describe the role, responsibilities, what success looks like, and your team culture…" />
      </div>

      {/* Visa sponsorship */}
      <div className="rounded-lg bg-soft-background border border-border p-4 space-y-3">
        <p className="text-sm font-medium text-primary-text">Visa &amp; international hiring</p>
        <div className="space-y-1.5">
          <p className="text-xs text-secondary-text">Sponsorship status</p>
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              ['available', 'We sponsor visas'],
              ['open_to_discussion', 'Case by case'],
              ['work_authorization_required', 'Work auth required'],
              ['not_available', 'No sponsorship'],
            ].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="sponsorship_status" value={v} className="accent-green" />
                {l}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="relocation_support" value="true" className="accent-green" />
            Relocation support available
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="open_to_international" value="true" className="accent-green" defaultChecked />
            Open to international applicants
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Posting…' : 'Submit for review'}
      </Button>
    </form>
  );
}
