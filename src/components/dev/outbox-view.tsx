"use client";

import { CheckCheck, Inbox, Mail, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

import { EmptyState } from "@/components/states/empty-state";
import { Button } from "@/components/ui/button";
import type { DeliveryChannel, DeliveryLog } from "@/data/types";
import { clearOutbox } from "@/lib/actions/dev";
import { cn } from "@/lib/utils";

const CHANNEL_META: Record<DeliveryChannel, { label: string; icon: typeof Mail }> = {
  email: { label: "Email", icon: Mail },
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  in_app: { label: "In-app", icon: Inbox },
};

const time = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));

function EmailCard({ log }: { log: DeliveryLog }) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
      <header className="border-b px-4 py-3 text-xs text-secondary-text">
        <p>
          <span className="font-medium text-primary-text">From</span> Scholastiar.ai &lt;hello@scholastiar.ai&gt;
        </p>
        <p>
          <span className="font-medium text-primary-text">To</span> {log.recipient}
        </p>
        <p className="mt-1.5 text-sm font-semibold text-primary-text">{log.subject}</p>
      </header>
      <div className="px-4 py-3 text-sm whitespace-pre-line text-primary-text/90">{log.body}</div>
      {log.link && (
        <div className="px-4 pb-4">
          <a
            href={log.link.href}
            className="inline-flex rounded-lg bg-green-action px-3.5 py-2 text-sm font-semibold text-white hover:bg-green-hover"
          >
            {log.link.label}
          </a>
        </div>
      )}
    </article>
  );
}

function WhatsAppCard({ log }: { log: DeliveryLog }) {
  return (
    <article className="overflow-hidden rounded-2xl border shadow-xs">
      <header className="flex items-center gap-2 bg-[#075E54] px-4 py-2.5 text-white">
        <span className="flex size-7 items-center justify-center rounded-full bg-white/15 text-xs font-bold">S</span>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-sm font-semibold">
            Scholastiar.ai
            <CheckCheck className="size-3.5 text-[#53bdeb]" aria-label="Official business account" />
          </p>
          <p className="text-[0.6875rem] text-white/70">to {log.recipient}</p>
        </div>
      </header>
      <div className="bg-[#efeae2] p-3 dark:bg-[#0b141a]">
        <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-white px-3 py-2 text-sm text-[#111b21] shadow-sm dark:bg-[#202c33] dark:text-[#e9edef]">
          {log.body}
          <p className="mt-1 text-right text-[0.625rem] text-[#667781]">template: {log.whatsapp_template}</p>
        </div>
      </div>
    </article>
  );
}

export function OutboxView({ logs }: { logs: DeliveryLog[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<DeliveryChannel | "all">("all");
  const [pending, startTransition] = useTransition();
  const shown = filter === "all" ? logs : logs.filter((l) => l.channel === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by channel">
          {(["all", "email", "whatsapp", "in_app"] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === key
                  ? "border-green-action bg-soft-green/60 text-green-dark dark:bg-green/15"
                  : "border-input text-secondary-text hover:text-primary-text",
              )}
            >
              {key === "all"
                ? `All (${logs.length})`
                : `${CHANNEL_META[key].label} (${logs.filter((l) => l.channel === key).length})`}
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending || logs.length === 0}
          onClick={() =>
            startTransition(async () => {
              const result = await clearOutbox();
              if (result.ok) {
                toast.success("Outbox cleared");
                router.refresh();
              } else toast.error(result.error);
            })
          }
        >
          <Trash2 aria-hidden />
          Clear outbox
        </Button>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No messages yet"
          description="Sign up, pay, verify, reset a password or upload a document — every message it sends appears here."
          className="mt-6"
        />
      ) : (
        <ol className="mt-6 space-y-5">
          {shown.map((log) => {
            const Icon = CHANNEL_META[log.channel].icon;
            return (
              <li key={log.id} className="grid gap-2 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-5">
                <div className="text-xs text-secondary-text">
                  <p className="flex items-center gap-1.5 font-semibold text-primary-text">
                    <Icon className="size-3.5" aria-hidden />
                    {CHANNEL_META[log.channel].label}
                  </p>
                  <p className="mt-0.5 font-mono">{log.event_key}</p>
                  <p>{time(log.created_at)}</p>
                  <p
                    className={cn(
                      "mt-1 inline-flex rounded-full px-1.5 py-px text-[0.625rem] font-semibold uppercase",
                      log.status === "sent"
                        ? "bg-soft-green text-green-dark dark:bg-green/15"
                        : "bg-neutral-soft text-secondary-text dark:bg-white/10",
                    )}
                  >
                    {log.status}
                  </p>
                  {log.skip_reason && <p className="mt-1">{log.skip_reason}</p>}
                </div>
                <div className={cn(log.status === "skipped" && "opacity-50")}>
                  {log.channel === "email" && <EmailCard log={log} />}
                  {log.channel === "whatsapp" && <WhatsAppCard log={log} />}
                  {log.channel === "in_app" && (
                    <article className="rounded-2xl border bg-card px-4 py-3 shadow-xs dark:bg-white/[0.03]">
                      <p className="text-sm font-semibold text-primary-text">{log.subject}</p>
                      <p className="text-sm text-secondary-text">{log.body}</p>
                      {log.link && (
                        <Link
                          href={log.link.href}
                          className="mt-1 inline-block text-xs font-medium text-green-dark hover:underline"
                        >
                          {log.link.href}
                        </Link>
                      )}
                    </article>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
