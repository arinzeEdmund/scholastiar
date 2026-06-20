import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { saveVisaInfo } from '@/lib/actions/onboarding';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Visa & mobility' };

export default function VisaStepPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E1E1E]">Visa & mobility profile</h2>
        <p className="mt-1 text-sm text-[#5F6368]">
          This helps us match you to visa-sponsored and relocation-friendly opportunities.
        </p>
      </div>
      <form action={saveVisaInfo} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="passport_country">Passport country</label>
            <Input id="passport_country" name="passport_country" placeholder="e.g. Nigeria" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="current_visa_status">Current visa status</label>
            <Input id="current_visa_status" name="current_visa_status" placeholder="e.g. Student visa, No visa" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="target_countries">Target countries</label>
          <Input id="target_countries" name="target_countries" placeholder="United Kingdom, Canada, Germany (comma-separated)" />
          <p className="text-xs text-[#8A8F98]">Countries you want to work or live in.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1E1E1E]">Do you need visa sponsorship?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="needs_sponsorship" value="true" className="accent-[#10B65B]" /> Yes
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="needs_sponsorship" value="false" className="accent-[#10B65B]" defaultChecked /> No
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1E1E1E]">Willing to relocate?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="willing_to_relocate" value="true" className="accent-[#10B65B]" defaultChecked /> Yes
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="willing_to_relocate" value="false" className="accent-[#10B65B]" /> No
              </label>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="work_authorization_notes">Work authorisation notes (optional)</label>
          <Textarea
            id="work_authorization_notes"
            name="work_authorization_notes"
            rows={3}
            placeholder="Any relevant details about your current work authorisation or sponsorship history."
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save and continue</Button>
        </div>
      </form>
    </div>
  );
}
