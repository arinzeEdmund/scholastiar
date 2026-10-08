import type { Metadata } from "next";

import { SignUpPage } from "@/components/auth/sign-up-page";

export const metadata: Metadata = { title: "Create your account" };

export default async function Page({ searchParams }: PageProps<"/auth/sign-up/candidate">) {
  const plan = (await searchParams).plan;
  return <SignUpPage audience="candidate" requestedPlan={typeof plan === "string" ? plan : undefined} />;
}
