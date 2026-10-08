import { LogIn } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthHeading } from "@/components/auth/auth-heading";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SURFACES } from "@/config/personas";
import { DEMO_PASSWORD } from "@/data/fixtures";
import { devListProfiles } from "@/data/mock/dev";
import { nextStepFor } from "@/lib/auth-flow";
import { isMock } from "@/lib/env";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

/** The demo panel shows the two student personas only: Amara (Starter) and Kwame (Pro). */
const DEMO_SIGN_IN_USERS = ["user-amara", "user-kwame"];

export default async function SignInPage() {
  const session = await getSession();
  if (session) redirect(await nextStepFor(session.user.user_id));

  const demo = isMock
    ? {
        password: DEMO_PASSWORD,
        accounts: (await devListProfiles())
          .filter((p) => DEMO_SIGN_IN_USERS.includes(p.user_id))
          .map((p) => ({
            name: p.full_name,
            email: p.email,
            surface: SURFACES[p.primary_role].label,
          })),
      }
    : undefined;

  return (
    <div>
      <AuthHeading
        icon={LogIn}
        eyebrow="Sign in"
        title="Welcome back"
        description="Pick up where you left off — your profile, applications and deadlines are waiting."
      />
      <div className="mt-8">
        <SignInForm demo={demo} />
      </div>
      <p className="mt-5 text-center text-sm text-secondary-text">
        New to Scholastiar.ai?{" "}
        <Link href="/auth/choose-role" className="font-semibold text-green-dark hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
