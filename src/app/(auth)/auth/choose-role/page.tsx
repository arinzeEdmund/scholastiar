import { ArrowRight, Building2, GraduationCap, Landmark, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthHeading } from "@/components/auth/auth-heading";

export const metadata: Metadata = { title: "Create an account" };

const ROLES = [
  {
    href: "/auth/sign-up/candidate",
    icon: GraduationCap,
    title: "I'm a student or graduate",
    text: "Study, funding and relocation abroad, plus job connections on Pro.",
    price: "From $35/month",
  },
  {
    href: "/auth/sign-up/employer",
    icon: Building2,
    title: "I'm hiring",
    text: "Hire international students and sponsor graduates' work visas.",
    price: "From $99/month",
  },
  {
    href: "/auth/sign-up/provider",
    icon: Landmark,
    title: "I'm a university or funder",
    text: "Publish programmes or scholarships.",
    price: "From $149/month",
  },
];

export default function ChooseRolePage() {
  return (
    <div>
      <AuthHeading
        icon={Sparkles}
        eyebrow="Get started"
        title="Create an account"
        description="Choose the account that fits you. You'll pick a plan next."
      />
      <ul className="mt-8 space-y-3">
        {ROLES.map(({ href, icon: Icon, title, text, price }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-input bg-card p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-green/50 hover:shadow-lg hover:shadow-black/5 dark:bg-white/[0.03] dark:hover:shadow-black/40"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-soft-green text-green-dark ring-1 ring-green/20 transition-colors group-hover:bg-green-action group-hover:text-white">
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-primary-text">{title}</span>
                <span className="mt-0.5 block text-sm text-secondary-text">{text}</span>
                <span className="mt-1.5 block text-xs font-medium text-green-dark">{price}</span>
              </span>
              <ArrowRight
                className="size-5 shrink-0 text-subtle-text transition-transform group-hover:translate-x-0.5 group-hover:text-green-dark"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center text-sm text-secondary-text">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-semibold text-green-dark hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
