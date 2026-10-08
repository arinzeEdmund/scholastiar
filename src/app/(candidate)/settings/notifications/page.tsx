import type { Metadata } from "next";

import { NotificationPreferences } from "@/components/candidate/settings/notification-preferences";
import { SettingsTabs } from "@/components/candidate/settings/settings-tabs";
import { WhatsAppSettings } from "@/components/candidate/settings/whatsapp-settings";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Notification settings" };

export default async function NotificationSettingsPage() {
  const { user } = await requireCandidate();
  const [preferences, consent] = await Promise.all([
    repos.candidate.getNotificationPreferences(user.user_id),
    repos.messages.getWhatsAppConsent(user.user_id),
  ]);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-primary-text sm:text-[1.75rem]">Settings</h1>
        <p className="mt-1 text-sm text-secondary-text sm:text-base">Choose what we tell you about, and where.</p>
      </header>
      <SettingsTabs active="/settings/notifications" />
      <WhatsAppSettings phone={consent?.phone_e164 || null} optedIn={Boolean(consent?.opted_in)} />
      <NotificationPreferences preferences={preferences} whatsappOptedIn={Boolean(consent?.opted_in)} />
    </div>
  );
}
