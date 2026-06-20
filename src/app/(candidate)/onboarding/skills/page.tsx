import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { saveSkills } from '@/lib/actions/onboarding';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Skills' };

export default function SkillsStepPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1E1E1E]">Your skills</h2>
        <p className="mt-1 text-sm text-[#5F6368]">
          List your top technical and professional skills. These drive matching and AI CV generation.
        </p>
      </div>
      <form action={saveSkills} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="skills">Skills</label>
          <Input
            id="skills"
            name="skills"
            placeholder="TypeScript, Project Management, Python, Data Analysis (comma-separated)"
          />
          <p className="text-xs text-[#8A8F98]">
            Enter your skills separated by commas. You can add proficiency levels from your profile later.
          </p>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save and continue</Button>
        </div>
      </form>
    </div>
  );
}
