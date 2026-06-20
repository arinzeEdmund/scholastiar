import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { User, MapPin, Phone, Globe, Pencil } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My profile' };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const { data: profile } = await supabase
    .from('candidate_profiles')
    .select('*, candidate_skills(*), career_preferences(*), candidate_visa_profiles(*)')
    .eq('user_id', user.id)
    .maybeSingle();

  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('full_name, avatar_url')
    .eq('user_id', user.id)
    .maybeSingle();

  const displayName = userProfile?.full_name || profile?.preferred_name || user.email?.split('@')[0];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Header card */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF6F0] text-xl font-semibold text-[#10B65B]">
              {displayName?.[0]?.toUpperCase() ?? <User className="h-6 w-6" />}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#1E1E1E]">{displayName}</h1>
              {profile?.headline && <p className="mt-0.5 text-sm text-[#5F6368]">{profile.headline}</p>}
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#8A8F98]">
                {profile?.current_location_city && profile?.current_location_country && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.current_location_city}, {profile.current_location_country}
                  </span>
                )}
                {profile?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/profile/edit"><Pencil className="mr-1.5 h-3.5 w-3.5" />Edit</Link>
          </Button>
        </div>
        {profile?.professional_summary && (
          <p className="mt-4 text-sm text-[#5F6368] leading-relaxed">{profile.professional_summary}</p>
        )}
        {/* Completion score */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-[#8A8F98]">
            <span>Profile strength</span>
            <span>{profile?.profile_completion_score ?? 0}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-[#E5E7EB]">
            <div
              className="h-full rounded-full bg-[#10B65B] transition-all"
              style={{ width: `${profile?.profile_completion_score ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      {profile?.candidate_skills && profile.candidate_skills.length > 0 && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#8A8F98]">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(profile.candidate_skills as Array<{ skill_name: string }>).map((s) => (
              <Badge key={s.skill_name} variant="secondary">{s.skill_name}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Visa profile */}
      {profile?.candidate_visa_profiles && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8A8F98]">Visa & mobility</h2>
            <Link href="/profile/visa" className="text-xs font-medium text-[#10B65B] hover:text-[#0E9F50]">Edit</Link>
          </div>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="text-[#8A8F98]">Sponsorship needed: </span>
              <span className="font-medium text-[#1E1E1E]">
                {(profile.candidate_visa_profiles as { needs_sponsorship: boolean }).needs_sponsorship ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-[#8A8F98]">Open to relocate: </span>
              <span className="font-medium text-[#1E1E1E]">
                {(profile.candidate_visa_profiles as { willing_to_relocate: boolean }).willing_to_relocate ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!profile && (
        <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white p-8 text-center">
          <Globe className="mx-auto h-8 w-8 text-[#8A8F98]" />
          <p className="mt-2 text-sm font-medium text-[#1E1E1E]">Profile not yet set up</p>
          <p className="mt-1 text-xs text-[#8A8F98]">Complete onboarding to build your international profile.</p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/onboarding">Start onboarding</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
