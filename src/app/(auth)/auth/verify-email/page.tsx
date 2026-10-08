import { CheckCircle2, LinkIcon, MailOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthHeading, authCta } from "@/components/auth/auth-heading";
import { DevInbox } from "@/components/auth/dev-inbox";
import { ResendVerification } from "@/components/auth/resend-verification";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { signUpSteps, StepIndicator } from "@/components/auth/step-indicator";
import { Button } from "@/components/ui/button";
import { repos } from "@/data";
import { devLatestToken } from "@/data/mock/dev";
import { landingFor } from "@/lib/auth-flow";
import { isMock } from "@/lib/env";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Verify your email" };

export default async function VerifyEmailPage({ searchParams }: PageProps<"/auth/verify-email">) {
  const status = (await searchParams).status;
  const session = await getSession();

  if (!session) {
    if (status === "verified") {
      return (
        <Result
          icon={<CheckCircle2 className="size-6" aria-hidden />}
          title="Email verified"
          text="Thanks — your email address is confirmed. Sign in to continue."
          action={{ href: "/auth/sign-in", label: "Sign in" }}
        />
      );
    }
    redirect("/auth/sign-in");
  }

  const account = await repos.auth.getAccount(session.user.user_id);
  if (!account) redirect("/auth/sign-in");
  const landing = landingFor(session.user);
  const steps = signUpSteps(session.user.primary_role);

  if (account.email_verified_at) {
    return (
      <div>
        <StepIndicator steps={steps} current={steps.length} />
        <div className="mt-8">
          <Result
            icon={<CheckCircle2 className="size-6" aria-hidden />}
            title="You're all set"
            text={`Your email is verified and your plan is active. Welcome to Scholastiar.ai, ${session.user.full_name.split(" ")[0]}.`}
            action={landing}
          />
        </div>
      </div>
    );
  }

  const token = isMock ? await devLatestToken(session.user.user_id, "verify_email") : null;

  return (
    <div>
      <StepIndicator steps={steps} current={steps.length - 1} />
      {status === "invalid" && (
        <p role="alert" className="mt-6 flex gap-2 rounded-xl bg-warning-soft px-3.5 py-3 text-sm text-warning">
          <LinkIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
          That link has expired or was already used. Send yourself a new one below.
        </p>
      )}
      <div className="mt-8">
        <AuthHeading
          icon={MailOpen}
          eyebrow="Verify your email"
          title="Check your inbox"
          description={
            <>
              We sent a verification link to{" "}
              <strong className="font-semibold text-primary-text">{account.email}</strong>. Open it to finish setting up
              your account. It can take a minute to arrive — check your spam folder too.
            </>
          }
        />
      </div>
      <div className="mt-8 space-y-3">
        {token && <DevInbox href={`/auth/verify-email/confirm?token=${token}`} label="Open the verification link" />}
        <ResendVerification />
      </div>
      <p className="mt-8 text-center text-sm text-secondary-text">
        Wrong email address? <SignOutButton label="Sign out and start again" redirectTo="/auth/choose-role" />
      </p>
    </div>
  );
}

function Result({
  icon,
  title,
  text,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  action: { href: string; label: string };
}) {
  return (
    <div role="status">
      <span className="flex size-12 items-center justify-center rounded-xl bg-soft-green text-green-dark ring-1 ring-green/20">
        {icon}
      </span>
      <h1 className="mt-6 text-[2rem] leading-[1.1] font-bold tracking-tight text-foreground sm:text-[2.5rem]">
        {title}
      </h1>
      <p className="mt-2 text-secondary-text">{text}</p>
      <Button asChild size="lg" className={`${authCta} mt-8`}>
        <Link href={action.href}>{action.label}</Link>
      </Button>
    </div>
  );
}
