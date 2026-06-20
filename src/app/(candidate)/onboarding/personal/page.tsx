import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { savePersonalInfo } from '@/lib/actions/onboarding';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Personal information' };

export default function PersonalStepPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E1E1E]">Personal information</h2>
        <p className="mt-1 text-sm text-[#5F6368]">Tell us about yourself. This powers your profile and matching.</p>
      </div>
      <form action={savePersonalInfo} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="preferred_name">Preferred name</label>
            <Input id="preferred_name" name="preferred_name" placeholder="How you like to be called" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="nationality">Nationality</label>
            <Input id="nationality" name="nationality" placeholder="e.g. Nigerian, Indian" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="date_of_birth">Date of birth</label>
            <Input id="date_of_birth" name="date_of_birth" type="date" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="phone">Phone number</label>
            <Input id="phone" name="phone" type="tel" placeholder="+234 800 000 0000" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="current_location_country">Current country</label>
            <Input id="current_location_country" name="current_location_country" placeholder="e.g. United Kingdom" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="current_location_city">Current city</label>
            <Input id="current_location_city" name="current_location_city" placeholder="e.g. London" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="languages">Languages spoken</label>
          <Input id="languages" name="languages" placeholder="English, French, Yoruba (comma-separated)" />
          <p className="text-xs text-[#8A8F98]">Enter languages separated by commas.</p>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save and continue</Button>
        </div>
      </form>
    </div>
  );
}
