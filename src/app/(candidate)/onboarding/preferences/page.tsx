import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { savePreferences } from '@/lib/actions/onboarding';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Job preferences' };

export default function PreferencesStepPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E1E1E]">Job preferences</h2>
        <p className="mt-1 text-sm text-[#5F6368]">
          Tell us what you&apos;re looking for. This shapes your personalised discovery feed.
        </p>
      </div>
      <form action={savePreferences} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="target_roles">Target roles</label>
          <Input id="target_roles" name="target_roles" placeholder="Software Engineer, Data Scientist (comma-separated)" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="industries">Industries</label>
          <Input id="industries" name="industries" placeholder="Technology, Healthcare, Finance (comma-separated)" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="seniority_levels">Seniority levels</label>
            <Input id="seniority_levels" name="seniority_levels" placeholder="mid, senior (comma-separated)" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="work_modes">Work modes</label>
            <Input id="work_modes" name="work_modes" placeholder="remote, hybrid (comma-separated)" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="salary_min">Minimum salary</label>
            <Input id="salary_min" name="salary_min" type="number" min={0} placeholder="50000" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="salary_currency">Currency</label>
            <Input id="salary_currency" name="salary_currency" placeholder="USD" defaultValue="USD" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="target_countries">Target countries</label>
          <Input id="target_countries" name="target_countries" placeholder="United Kingdom, Canada, Germany (comma-separated)" />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save and continue</Button>
        </div>
      </form>
    </div>
  );
}
