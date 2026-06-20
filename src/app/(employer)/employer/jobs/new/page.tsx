import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createJob } from '@/lib/actions/employer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Post a job — Scholastiar.ai' };

export default async function NewJobPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const { data: membership } = await supabase
    .from('employer_memberships')
    .select('employer_company_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (!membership) redirect('/employer/setup');

  return (
    <div className="min-h-screen bg-[#F7F9F7] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1E1E1E]">Post a job</h1>
          <p className="mt-1 text-sm text-[#5F6368]">
            Your job will be reviewed by our team before going live. This usually takes under 24 hours.
          </p>
        </div>

        <form action={createJob} className="space-y-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
          {/* Role basics */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="title">
              Job title <span className="text-red-500">*</span>
            </label>
            <Input id="title" name="title" required placeholder="Senior Software Engineer" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="country">Country <span className="text-red-500">*</span></label>
              <Input id="country" name="country" required placeholder="United Kingdom" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="city">City</label>
              <Input id="city" name="city" placeholder="London" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">Work mode</label>
              <div className="flex gap-4 text-sm">
                {['on_site','hybrid','remote'].map(m => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="work_mode" value={m} defaultChecked={m === 'on_site'} className="accent-[#10B65B]" />
                    {m.replace('_', '-')}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]">Employment type</label>
              <div className="flex flex-wrap gap-4 text-sm">
                {[['full_time','Full-time'],['part_time','Part-time'],['contract','Contract'],['internship','Internship']].map(([v,l]) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="employment_type" value={v} defaultChecked={v === 'full_time'} className="accent-[#10B65B]" />
                    {l}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="seniority_level">Seniority level</label>
              <Input id="seniority_level" name="seniority_level" placeholder="mid, senior, lead…" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="application_deadline">Application deadline</label>
              <Input id="application_deadline" name="application_deadline" type="date" />
            </div>
          </div>

          {/* Salary */}
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="salary_min">Salary min</label>
              <Input id="salary_min" name="salary_min" type="number" min={0} placeholder="50000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="salary_max">Salary max</label>
              <Input id="salary_max" name="salary_max" type="number" min={0} placeholder="80000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="salary_currency">Currency</label>
              <Input id="salary_currency" name="salary_currency" defaultValue="USD" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="description">
              Job description <span className="text-red-500">*</span>
            </label>
            <Textarea id="description" name="description" required rows={8}
              placeholder="Describe the role, responsibilities, what success looks like, and your team culture…" />
          </div>

          {/* Visa sponsorship */}
          <div className="rounded-lg bg-[#F7F9F7] border border-[#E5E7EB] p-4 space-y-3">
            <p className="text-sm font-medium text-[#1E1E1E]">Visa & international hiring</p>
            <div className="space-y-1.5">
              <p className="text-xs text-[#5F6368]">Sponsorship status</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {[
                  ['available','We sponsor visas'],
                  ['open_to_discussion','Case by case'],
                  ['work_authorization_required','Work auth required'],
                  ['not_available','No sponsorship'],
                ].map(([v,l]) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="sponsorship_status" value={v} className="accent-[#10B65B]" />
                    {l}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="relocation_support" value="true" className="accent-[#10B65B]" />
                Relocation support available
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="open_to_international" value="true" className="accent-[#10B65B]" defaultChecked />
                Open to international applicants
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full">Submit for review</Button>
        </form>
      </div>
    </div>
  );
}
