import { BadgeCheck, CalendarClock, Clock, Info, Paperclip, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { AddToCalendar, Composer, MarkThreadRead } from "@/components/messages/thread-parts";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Conversation" };

const time = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(iso));
const longDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(iso));

const TYPE_LABEL = {
  university: "International admissions",
  scholarship: "Scholarship selection panel",
  scholastiar: "Scholastiar team",
  employer: "Employer",
} as const;

export default async function ThreadPage({ params }: PageProps<"/messages/[threadId]">) {
  const { user } = await requireCandidate();
  const { threadId } = await params;
  const result = await safeLoad(() =>
    Promise.all([repos.threads.get(user.user_id, threadId), repos.candidate.listDocuments(user.user_id)]),
  );
  if (!result.ok) {
    return (
      <div className="space-y-6">
        <SubPageHeader backHref="/messages" backLabel="Messages" title="Conversation" />
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }
  const [data, documents] = result.data;
  if (!data) notFound();
  const { thread, messages } = data;
  const unread = messages.some((m) => m.sender !== "student" && !m.read_at);

  return (
    <div className="space-y-6">
      <MarkThreadRead threadId={thread.id} unread={unread} />
      <SubPageHeader
        backHref="/messages"
        backLabel="Messages"
        title={thread.subject}
        description={thread.context_label ?? undefined}
      />

      <div className="grid gap-6 *:min-w-0 lg:grid-cols-[1fr_18rem]">
        <section
          aria-label="Conversation"
          className="flex flex-col rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]"
        >
          <ol className="flex-1 space-y-4 p-4 sm:p-5">
            {messages.map((m) => {
              if (m.kind === "status_update") {
                return (
                  <li key={m.id} className="flex justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-info-soft px-3 py-1 text-xs font-medium text-info dark:bg-info/15">
                      <Info className="size-3.5" aria-hidden />
                      Status: {m.meta?.status} · {time(m.created_at)}
                    </span>
                  </li>
                );
              }
              const mine = m.sender === "student";
              return (
                <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[85%] sm:max-w-[75%]", mine && "text-right")}>
                    <p className="mb-1 text-xs text-secondary-text">
                      {mine ? "You" : m.author_name} · {time(m.created_at)}
                    </p>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed whitespace-pre-line",
                        mine
                          ? "rounded-br-md bg-green-action text-white"
                          : "rounded-bl-md bg-soft text-primary-text dark:bg-white/[0.06]",
                      )}
                    >
                      {m.body}
                    </div>
                    {m.kind === "interview_invite" && m.meta && (
                      <div className="mt-2 rounded-2xl border border-green/30 bg-soft-green/50 p-4 text-left dark:bg-green/10">
                        <p className="flex items-center gap-2 text-sm font-semibold text-primary-text">
                          <CalendarClock className="size-4 text-green-dark" aria-hidden />
                          Interview · {longDate(m.meta.starts_at)} (UTC)
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-secondary-text">
                          <Clock className="size-3.5" aria-hidden />
                          {m.meta.duration_minutes} minutes · {m.meta.mode} · {m.meta.location}
                        </p>
                        <div className="mt-3">
                          <AddToCalendar
                            title={`Interview — ${thread.counterpart_name}`}
                            startsAt={m.meta.starts_at}
                            minutes={Number(m.meta.duration_minutes)}
                            location={m.meta.location}
                          />
                        </div>
                      </div>
                    )}
                    {m.attachments.length > 0 && (
                      <ul className={cn("mt-1.5 flex flex-wrap gap-1.5", mine && "justify-end")}>
                        {m.attachments.map((a) => (
                          <li
                            key={a.document_id}
                            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-secondary-text"
                          >
                            <Paperclip className="size-3" aria-hidden />
                            {a.file_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="border-t p-4 sm:p-5">
            <Composer threadId={thread.id} documents={documents.map((d) => ({ id: d.id, name: d.file_name }))} />
          </div>
        </section>

        <aside className="space-y-4" aria-label="About this conversation">
          <section className="rounded-2xl border bg-card p-4 dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-soft-green text-sm font-bold text-green-dark dark:bg-green/15">
                {thread.counterpart_initials}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1 text-sm font-semibold text-primary-text">
                  <span className="truncate">{thread.counterpart_name}</span>
                  {thread.counterpart_verified && (
                    <BadgeCheck className="size-3.5 shrink-0 text-green" aria-label="Verified" />
                  )}
                </p>
                <p className="text-xs text-secondary-text">{TYPE_LABEL[thread.counterpart_type]}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-secondary-text">Usually replies within two working days.</p>
          </section>
          <p className="flex gap-2 rounded-2xl border p-4 text-xs text-secondary-text">
            <ShieldCheck className="size-4 shrink-0 text-green-dark" aria-hidden />
            Never send money or passwords through messages. Official fees are paid on the institution&apos;s own payment
            page.
          </p>
        </aside>
      </div>
    </div>
  );
}
