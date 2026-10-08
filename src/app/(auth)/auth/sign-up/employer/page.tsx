import type { Metadata } from "next";

import { SignUpPage } from "@/components/auth/sign-up-page";

export const metadata: Metadata = { title: "Employer sign-up" };

export default async function Page({ searchParams }: PageProps<"/auth/sign-up/employer">) {
  const plan = (await searchParams).plan;
  return <SignUpPage audience="employer" requestedPlan={typeof plan === "string" ? plan : undefined} />;
}
