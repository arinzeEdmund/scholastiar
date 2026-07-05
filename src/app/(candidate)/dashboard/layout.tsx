import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MainNav } from '@/components/nav/main-nav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  return (
    <div className="min-h-screen bg-[#F7F9F7]">
      <MainNav user={{ email: user.email ?? '' }} />
      {children}
    </div>
  );
}
