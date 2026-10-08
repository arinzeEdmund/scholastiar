import { ArrowLeft, KeyRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeading } from "@/components/auth/auth-heading";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <div>
      <AuthHeading
        icon={KeyRound}
        eyebrow="Account recovery"
        title="Forgot your password?"
        description="Enter the email you signed up with and we'll send you a secure link to choose a new one."
      />
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
      <p className="mt-10 text-center text-sm">
        <Link
          href="/auth/sign-in"
          className="inline-flex items-center gap-1.5 font-medium text-secondary-text hover:text-primary-text"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Remembered it? Back to sign in
        </Link>
      </p>
    </div>
  );
}
