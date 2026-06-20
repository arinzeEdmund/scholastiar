import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { saveExperience } from '@/lib/actions/onboarding';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Work experience' };

export default function ExperienceStepPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E1E1E]">Work experience</h2>
        <p className="mt-1 text-sm text-[#5F6368]">Add your most recent role. You can add more from your profile later.</p>
      </div>
      <form action={saveExperience} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="company_name">
              Company <span className="text-red-500">*</span>
            </label>
            <Input id="company_name" name="company_name" required placeholder="Acme Corp" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="job_title">
              Job title <span className="text-red-500">*</span>
            </label>
            <Input id="job_title" name="job_title" required placeholder="Software Engineer" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="country">Country</label>
            <Input id="country" name="country" placeholder="Nigeria" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="city">City</label>
            <Input id="city" name="city" placeholder="Lagos" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="start_date">Start date</label>
            <Input id="start_date" name="start_date" type="month" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="end_date">End date</label>
            <Input id="end_date" name="end_date" type="month" />
            <label className="flex items-center gap-2 text-xs text-[#5F6368]">
              <input type="checkbox" name="is_current" value="true" className="accent-[#10B65B]" />
              I currently work here
            </label>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="responsibilities">Responsibilities</label>
          <Textarea id="responsibilities" name="responsibilities" rows={3} placeholder="Describe your key responsibilities…" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="achievements">Achievements</label>
          <Textarea id="achievements" name="achievements" rows={3} placeholder="Quantified achievements: Reduced API response time by 40%…" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="tools_used">Tools & technologies</label>
          <Input id="tools_used" name="tools_used" placeholder="React, Node.js, PostgreSQL (comma-separated)" />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save and continue</Button>
        </div>
      </form>
    </div>
  );
}
