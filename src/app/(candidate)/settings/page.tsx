import { CreditCard, LogOut } from "lucide-react";
import type { Metadata } from "next";

import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  AccountForm,
  AppearancePicker,
  ChangePasswordForm,
  DeleteAccount,
} from "@/components/candidate/settings/settings-forms";
import { SettingsTabs } from "@/components/candidate/settings/settings-tabs";
import { EditorSection } from "@/components/candidate/sub-page-header";
import { RouteButton } from "@/components/layout/route-button";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { user } = await requireCandidate();
  const subscription = await repos.billing.getSubscription(user.user_id);
  const plan = subscription ? await repos.billing.getPlan(subscription.plan_id) : null;
  const zones = Intl.supportedValuesOf("timeZone");
  const timezones = zones.includes(user.timezone) ? zones : [user.timezone, ...zones];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary-text sm:text-[1.75rem]">Settings</h1>
        <p className="mt-1 text-sm text-secondary-text sm:text-base">
          Your account, security and how Scholastiar looks.
        </p>
      </header>
      <SettingsTabs active="/settings" />

      <EditorSection id="account" title="Account">
        <AccountForm
          defaults={{ fullName: user.full_name, timezone: user.timezone }}
          email={user.email}
          timezones={timezones}
        />
      </EditorSection>

      <EditorSection id="password" title="Password" description="Use something you don't use on other websites.">
        <ChangePasswordForm />
      </EditorSection>

      <EditorSection id="appearance" title="Appearance">
        <AppearancePicker />
      </EditorSection>

      <EditorSection id="plan" title="Plan and billing">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-soft-green text-green-dark dark:bg-green/10">
              <CreditCard className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-primary-text">{plan?.name ?? "No active plan"}</p>
              <p className="text-sm text-secondary-text">{plan?.description}</p>
            </div>
          </div>
          <RouteButton href="/billing" variant="outline" className="rounded-xl">
            Manage billing
          </RouteButton>
        </div>
      </EditorSection>

      <EditorSection id="session" title="Sign out">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-secondary-text">Signed in as {user.email}.</p>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <LogOut className="size-4 text-green-dark" aria-hidden />
            <SignOutButton label="Sign out on this device" />
          </span>
        </div>
      </EditorSection>

      <section
        aria-labelledby="danger-title"
        className="rounded-2xl border border-danger/25 bg-danger-soft/40 p-5 sm:p-6 dark:bg-danger/[0.06]"
      >
        <h2 id="danger-title" className="text-lg font-semibold text-primary-text">
          Delete account
        </h2>
        <p className="mt-0.5 text-sm text-secondary-text">
          Permanently delete your profile, documents and settings and cancel your plan.
        </p>
        <div className="mt-4">
          <DeleteAccount email={user.email} />
        </div>
      </section>
    </div>
  );
}
