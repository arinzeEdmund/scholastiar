import { BadgeCheck, CalendarClock, MessageSquare, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Input } from "@/components/ui/input";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

const FILTERS = { all: "All", unread: "Unread", interviews: "Interviews" } as const;
type Filter = keyof typeof FILTERS;

const TYPE_LABEL = {
  university: "Admissions",
  scholarship: "Scholarship panel",
  scholastiar: "Scholastiar",
  employer: "Employer",
} as const;

function when(iso: string) {
  const d = new Date(iso);
  const days = (Date.now() - d.getTime()) / 86_400_000;
  if (days < 1) return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(d);
  if (days < 7) return new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(d);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(d);
}

export default async function MessagesPage({ searchParams }: PageProps<"/messages">) {
  const { user } = await requireCandidate();
  const params = await searchParams;
  const filter: Filter = typeof params.show === "string" && params.show in FILTERS ? (params.show as Filter) : "all";
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";
  const result = await safeLoad(() => repos.threads.list(user.user_id));

  const header = (
    <PageHeader
      eyebrow="Messages"
      title="Your conversations"
      description="Admissions offices, scholarship panels and the Scholastiar team — every reply in one place."
    />
  );
  if (!result.ok) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {header}
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }
  const threads = result.data
    .filter((t) => (filter === "unread" ? t.unread > 0 : filter === "interviews" ? t.has_interview : true))
    .filter(
      (t) =>
        !q ||
        `${t.counterpart_name} ${t.subject} ${t.last_message?.body ?? ""}`.toLowerCase().includes(q.toLowerCase()),
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {header}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <nav
          aria-label="Filter conversations"
          className="inline-flex rounded-xl border bg-card p-1 dark:bg-white/[0.03]"
        >
          {(Object.entries(FILTERS) as [Filter, string][]).map(([key, label]) => (
            <Link
              key={key}
              href={key === "all" ? "/messages" : `/messages?show=${key}`}
              aria-current={key === filter ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                key === filter ? "bg-green-action text-white" : "text-secondary-text hover:text-primary-text",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <form role="search" className="relative flex-1" action="/messages">
          {filter !== "all" && <input type="hidden" name="show" value={filter} />}
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle-text"
            aria-hidden
          />
          <label htmlFor="messages-q" className="sr-only">
            Search conversations
          </label>
          <Input
            id="messages-q"
            name="q"
            defaultValue={q}
            placeholder="Search conversations"
            className="h-10 rounded-xl pl-9"
          />
        </form>
      </div>

      {threads.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={result.data.length === 0 ? "No conversations yet" : "Nothing matches"}
          description={
            result.data.length === 0
              ? "When a university, scholarship panel or our team writes to you, the conversation appears here."
              : "Try another word or filter."
          }
        />
      ) : (
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
          {threads.map((t) => (
            <li key={t.id}>
              <Link
                href={`/messages/${t.id}`}
                className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-soft dark:hover:bg-white/[0.04]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-soft-green text-xs font-bold text-green-dark dark:bg-green/15">
                  {t.counterpart_initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "truncate text-sm",
                        t.unread ? "font-semibold text-primary-text" : "font-medium text-primary-text",
                      )}
                    >
                      {t.counterpart_name}
                    </span>
                    {t.counterpart_verified && (
                      <BadgeCheck className="size-3.5 shrink-0 text-green" aria-label="Verified" />
                    )}
                  </span>
                  <span className="block truncate text-xs text-green-dark">
                    {TYPE_LABEL[t.counterpart_type]} · {t.subject}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block truncate text-sm",
                      t.unread ? "text-primary-text" : "text-secondary-text",
                    )}
                  >
                    {t.last_message?.kind === "interview_invite"
                      ? "Interview invitation"
                      : (t.last_message?.body ?? "")}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-xs text-subtle-text">{when(t.last_message_at)}</span>
                  {t.unread > 0 ? (
                    <span
                      className="min-w-5 rounded-full bg-green-action px-1.5 text-center text-xs font-semibold text-white"
                      aria-label={`${t.unread} unread`}
                    >
                      {t.unread}
                    </span>
                  ) : (
                    t.has_interview && (
                      <CalendarClock className="size-4 text-green-dark" aria-label="Has an interview" />
                    )
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="text-center text-xs text-secondary-text">
        Never send money or passwords through messages. Report anything suspicious to Scholastiar support.
      </p>
    </div>
  );
}
