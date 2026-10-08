import { Wrench } from "lucide-react";
import type { Metadata } from "next";

import { ReloadButton } from "@/components/states/reload-button";
import { StatusPage } from "@/components/states/status-page";

export const metadata: Metadata = { title: "Scheduled maintenance" };

export default function MaintenancePage() {
  return (
    <StatusPage
      icon={Wrench}
      title="Scholastiar.ai is being upgraded"
      description="We're making improvements and will be back shortly. Your profile, documents, saved opportunities and applications are not affected."
      actions={<ReloadButton size="lg">Check again</ReloadButton>}
      footnote="Deadline reminders will still reach you by email while we're down."
    />
  );
}
