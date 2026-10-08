import { LinkIcon, LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeading, authCta } from "@/components/auth/auth-heading";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import { repos } from "@/data";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/auth/reset-password">) {
  const raw = (await searchParams).token;
  const token = typeof raw === "string" ? raw : "";
  const valid = token ? Boolean(await repos.auth.peekToken(token, "reset_password")) : false;

  if (!valid) {
    return (
      <div>
        <AuthHeading
          icon={LinkIcon}
          eyebrow="Link expired"
          title="This link has expired"
          description="Password reset links work once and expire after an hour. Request a new one to continue."
        />
        <Button asChild size="lg" className={`${authCta} mt-8`}>
          <Link href="/auth/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <AuthHeading
        icon={LockKeyhole}
        eyebrow="Account recovery"
        title="Choose a new password"
        description="Use something you don't use on other websites. You'll sign in with it next."
      />
      <div className="mt-8">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
