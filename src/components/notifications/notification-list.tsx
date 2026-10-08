"use client";

import {
  Bell,
  CalendarClock,
  CheckCheck,
  CreditCard,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UserRound,
  ClipboardList,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import type { NotificationCategory } from "@/data/types";
import { markNotificationsRead } from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
  category: NotificationCategory | null;
}

const ICONS: Record<NotificationCategory, LucideIcon> = {
  deadlines: CalendarClock,
  application_updates: ClipboardList,
  messages: MessageSquare,
  new_matches: Sparkles,
  profile_activity: UserRound,
  account_security: ShieldCheck,
  billing: CreditCard,
  product_news: Megaphone,
};

function relative(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 60) return minutes <= 1 ? "Just now" : `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return days === 1 ? "Yesterday" : `${days} days ago`;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso));
}

function group(iso: string) {
  const days = (Date.now() - new Date(iso).getTime()) / 86_400_000;
  return days < 1 ? "Today" : days < 7 ? "This week" : "Earlier";
}

/** Notifications grouped by day; opening one marks it read. */
export function NotificationList({ items }: { items: NotificationItem[] }) {
  const router = useRouter();
  const [optimistic, setRead] = useOptimistic(items, (state, ids: string[] | null) =>
    state.map((n) => (ids === null || ids.includes(n.id) ? { ...n, read: true } : n)),
  );
  const [pending, startTransition] = useTransition();
  const unread = optimistic.filter((n) => !n.read).length;

  function markAll() {
    startTransition(async () => {
      setRead(null);
      const result = await markNotificationsRead({ ids: null });
      if (!result.ok) toast.error(result.error);
      else toast.success("All caught up");
    });
  }

  function open(item: NotificationItem) {
    startTransition(async () => {
      if (!item.read) {
        setRead([item.id]);
        await markNotificationsRead({ ids: [item.id] });
      }
      if (item.href) router.push(item.href);
    });
  }

  const groups = ["Today", "This week", "Earlier"]
    .map((label) => ({ label, items: optimistic.filter((n) => group(n.createdAt) === label) }))
    .filter((g) => g.items.length);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-secondary-text" aria-live="polite">
          {unread ? `${unread} unread` : "You're all caught up"}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={markAll} disabled={pending || unread === 0}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <CheckCheck aria-hidden />}
          Mark all as read
        </Button>
      </div>
      {groups.map((g) => (
        <section
          key={g.label}
          aria-label={g.label}
          className="rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]"
        >
          <h2 className="border-b px-4 py-2.5 text-xs font-semibold tracking-wide text-secondary-text uppercase">
            {g.label}
          </h2>
          <ul className="divide-y">
            {g.items.map((item) => {
              const Icon = item.category ? ICONS[item.category] : Bell;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => open(item)}
                    className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-soft focus-visible:bg-soft focus-visible:outline-none dark:hover:bg-white/[0.04]"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-xl",
                        item.read
                          ? "bg-neutral-soft text-secondary-text dark:bg-white/10"
                          : "bg-soft-green text-green-dark dark:bg-green/15",
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-sm",
                          item.read ? "text-secondary-text" : "font-semibold text-primary-text",
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="block truncate text-sm text-secondary-text">{item.body}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-xs text-subtle-text">{relative(item.createdAt)}</span>
                      {!item.read && <span className="size-2 rounded-full bg-green" aria-label="Unread" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
