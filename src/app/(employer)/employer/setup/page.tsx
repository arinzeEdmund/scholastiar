import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { setupEmployerCompany } from '@/lib/actions/employer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Set up your company — Scholastiar.ai' };

export default async function EmployerSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  // If already has a company, skip to dashboard
  const { data: membership } = await supabase
    .from('employer_memberships')
    .select('employer_company_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (membership) redirect('/employer/dashboard');

  return (
    <div className="min-h-screen bg-[#F7F9F7] flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1E1E1E]">Set up your company</h1>
          <p className="mt-1 text-sm text-[#5F6368]">
            Tell candidates who you are. Jobs won&apos;t go public until reviewed by our team.
          </p>
        </div>
        <form action={setupEmployerCompany} className="space-y-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="name">
              Company name <span className="text-red-500">*</span>
            </label>
            <Input id="name" name="name" required placeholder="Acme Corp" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="headquarters_country">HQ Country</label>
              <Input id="headquarters_country" name="headquarters_country" placeholder="United Kingdom" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="headquarters_city">HQ City</label>
              <Input id="headquarters_city" name="headquarters_city" placeholder="London" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="industry">Industry</label>
              <Input id="industry" name="industry" placeholder="Technology" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="company_size">Company size</label>
              <Input id="company_size" name="company_size" placeholder="50–200 employees" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="website_url">Website</label>
            <Input id="website_url" name="website_url" type="url" placeholder="https://acmecorp.com" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="tagline">Tagline</label>
            <Input id="tagline" name="tagline" placeholder="We build the future of logistics" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]" htmlFor="description">About the company</label>
            <Textarea id="description" name="description" rows={4} placeholder="What does your company do? What's the culture like?" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1E1E1E]">Visa sponsorship policy</label>
            <div className="flex flex-wrap gap-3 text-sm">
              {[
                { value: 'available', label: 'We sponsor visas' },
                { value: 'open_to_discussion', label: 'Case by case' },
                { value: 'not_available', label: 'No sponsorship' },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="sponsorship_policy" value={value} className="accent-[#10B65B]" />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">Create company profile</Button>
        </form>
      </div>
    </div>
  );
}
