import type { Metadata } from "next";

import { DevPageFrame } from "@/components/dev/dev-page-frame";
import { OutboxView } from "@/components/dev/outbox-view";
import { PageHeader } from "@/components/layout/page-header";
import { repos } from "@/data";

export const metadata: Metadata = { title: "Message outbox" };

export default async function OutboxPage() {
  const logs = await repos.messages.listDeliveries();
  return (
    <DevPageFrame>
      <PageHeader
        eyebrow="Phase A · Messages"
        title="Message outbox"
        description="Every email, WhatsApp and in-app message the app would send. WhatsApp only goes to users who opted in; skipped messages show why."
      />
      <div className="mt-8">
        <OutboxView logs={logs} />
      </div>
    </DevPageFrame>
  );
}
