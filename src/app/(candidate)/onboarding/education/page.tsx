import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { saveEducation } from '@/lib/actions/onboarding';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Education' };

export default function EducationStepPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E1E1E]">Education</h2>
        <p className="mt-1 text-sm text-[#5F6368]">Add your most recent or highest qualification. You can add more from your profile later.</p>
      </div>
      <form action={saveEducation} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="institution_name">
            Institution name <span className="text-red-500">*</span>
          </label>
          <Input id="institution_name" name="institution_name" required placeholder="University of Lagos" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="country">Country</label>
            <Input id="country" name="country" placeholder="Nigeria" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="degree_level">Degree level</label>
            <Input id="degree_level" name="degree_level" placeholder="BSc, MSc, PhD, HND…" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="field_of_study">Field of study</label>
            <Input id="field_of_study" name="field_of_study" placeholder="Computer Science" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="qualification_name">Qualification name</label>
            <Input id="qualification_name" name="qualification_name" placeholder="Bachelor of Science" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="start_date">Start date</label>
            <Input id="start_date" name="start_date" type="month" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="end_date">End date</label>
            <Input id="end_date" name="end_date" type="month" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="grade">Grade / classification</label>
          <Input id="grade" name="grade" placeholder="First Class, 3.8 GPA, Distinction…" />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save and continue</Button>
        </div>
      </form>
    </div>
  );
}
