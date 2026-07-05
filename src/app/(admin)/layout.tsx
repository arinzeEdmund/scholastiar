import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('primary_role, platform_roles')
    .eq('id', user.id)
    .single();

  const isAdmin =
    profile?.primary_role === 'admin' ||
    (profile?.platform_roles ?? []).some((r: string) =>
      ['platform_admin', 'super_admin', 'support_admin'].includes(r)
    );

  if (!isAdmin) redirect('/');

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <header className="border-b border-white/10 bg-[#1A1A1A]">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
          <Link href="/admin" className="text-sm font-semibold text-[#10B65B]">
            Scholastiar Admin
          </Link>
          <nav className="flex gap-4 text-sm text-white/60">
            <Link href="/admin/jobs" className="hover:text-white transition-colors">Jobs</Link>
            <Link href="/admin/employers" className="hover:text-white transition-colors">Employers</Link>
            <Link href="/admin/users" className="hover:text-white transition-colors">Users</Link>
          </nav>
          <div className="ml-auto text-xs text-white/40">{user.email}</div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
