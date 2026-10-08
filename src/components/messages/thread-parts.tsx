"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Loader2, Paperclip, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { markThreadRead, sendThreadMessage } from "@/lib/actions/threads";
import { messageSchema, type MessageInput } from "@/lib/validation/threads";
import { cn } from "@/lib/utils";

/** Marks the conversation read once it's opened. */
export function MarkThreadRead({ threadId, unread }: { threadId: string; unread: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (!unread) return;
    void markThreadRead(threadId).then(() => router.refresh());
  }, [threadId, unread, router]);
  return null;
}

/** Downloads an .ics file so the interview lands in the student's own calendar. */
export function AddToCalendar({
  title,
  startsAt,
  minutes,
  location,
}: {
  title: string;
  startsAt: string;
  minutes: number;
  location: string;
}) {
  function download() {
    const fmt = (d: Date) =>
      d
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const start = new Date(startsAt);
    const end = new Date(start.getTime() + minutes * 60_000);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Scholastiar//Interview//EN",
      "BEGIN:VEVENT",
      `UID:${start.getTime()}@scholastiar.ai`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${title}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview.ics";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Button type="button" size="sm" variant="outline" onClick={download}>
      <CalendarPlus aria-hidden />
      Add to calendar
    </Button>
  );
}

/** Reply box: message, optional documents from the vault, send. */
export function Composer({ threadId, documents }: { threadId: string; documents: { id: string; name: string }[] }) {
  const router = useRouter();
  const form = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { threadId, body: "", attachmentIds: [] },
  });
  const { pending, run } = useFormAction<MessageInput>(form.setError);
  const attached = useWatch({ control: form.control, name: "attachmentIds" });
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      noValidate
      onSubmit={form.handleSubmit((values) =>
        run(
          () => sendThreadMessage(values),
          { loading: "Sending…", success: "Sent" },
          () => {
            form.reset({ threadId, body: "", attachmentIds: [] });
            router.refresh();
          },
        ),
      )}
      className="space-y-2"
    >
      <BoxField id="reply" label="Your reply" error={form.formState.errors.body?.message}>
        <Textarea
          {...form.register("body")}
          {...boxControlProps("reply", form.formState.errors.body?.message)}
          rows={3}
          className={cn(boxControl, "resize-none")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ref.current?.requestSubmit();
          }}
        />
      </BoxField>
      {attached.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Attached documents">
          {attached.map((id) => (
            <li
              key={id}
              className="inline-flex items-center gap-1 rounded-full bg-soft-green px-2 py-0.5 text-xs text-green-dark dark:bg-green/15"
            >
              <Paperclip className="size-3" aria-hidden />
              {documents.find((d) => d.id === id)?.name}
              <button
                type="button"
                onClick={() =>
                  form.setValue(
                    "attachmentIds",
                    attached.filter((a) => a !== id),
                  )
                }
                aria-label="Remove attachment"
              >
                <X className="size-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2">
        <Controller
          control={form.control}
          name="attachmentIds"
          render={({ field }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="sm" disabled={documents.length === 0}>
                  <Paperclip aria-hidden />
                  Attach a document
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>From your documents</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {documents.map((d) => (
                  <DropdownMenuCheckboxItem
                    key={d.id}
                    checked={field.value.includes(d.id)}
                    onCheckedChange={(on) =>
                      field.onChange(on ? [...field.value, d.id] : field.value.filter((v) => v !== d.id))
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    {d.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
        <span className="hidden text-xs text-subtle-text sm:inline">Ctrl + Enter to send</span>
        <Button type="submit" className="ml-auto rounded-xl" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
          Send
        </Button>
      </div>
    </form>
  );
}
