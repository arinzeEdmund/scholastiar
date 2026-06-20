import { ResetPasswordForm } from '@/components/auth/auth-form';
import { updatePassword } from '@/lib/actions/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Set new password' };

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#1E1E1E]">Set a new password</h1>
        <p className="mt-1 text-sm text-[#5F6368]">Choose a strong password for your account.</p>
      </div>
      <ResetPasswordForm action={updatePassword} />
    </div>
  );
}
