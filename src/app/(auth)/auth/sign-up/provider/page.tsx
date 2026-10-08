import type { Metadata } from "next";

import { SignUpPage } from "@/components/auth/sign-up-page";

export const metadata: Metadata = { title: "University and funder sign-up" };

export default async function Page({ searchParams }: PageProps<"/auth/sign-up/provider">) {
  const plan = (await searchParams).plan;
  return <SignUpPage audience="provider" requestedPlan={typeof plan === "string" ? plan : undefined} />;
}
