import { Bell, Settings2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { NotificationList, type NotificationItem } from "@/components/notifications/notification-list";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { Button } from "@/components/ui/button";
import { repos, type NotificationCategory } from "@/data";
import { NOTIFICATION_CATEGORIES } from "@/lib/candidate/labels";
import { requireCandidate } from "@/lib/guards";
import { CATALOGUE } from "@/lib/messages/catalogue";
import { safeLoad } from "@/lib/safe-load";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications" };

const categoryOf = (eventKey: string): NotificationCategory | null =>
  (CATALOGUE as Record<string, { category: NotificationCategory | null }>)[eventKey]?.category ?? null;

export default async function NotificationsPage({ searchParams }: PageProps<"/notifications">) {
  const { user } = await requireCandidate();
  const raw = (await searchParams).type;
  const filter = typeof raw === "string" && raw in NOTIFICATION_CATEGORIES ? (raw as NotificationCategory) : null;
  const result = await safeLoad(() => repos.messages.listInApp(user.user_id));

  const header = (
    <PageHeader
      eyebrow="Notifications"
      title="What's new"
      description="Deadlines, messages, matches and account updates in one place."
      actions={
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/settings/notifications">
            <Settings2 aria-hidden />
            Choose what you get
          </Link>
        </Button>
      }
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

  const all: NotificationItem[] = result.data.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    href: n.href,
    read: Boolean(n.read_at),
    createdAt: n.created_at,
    category: categoryOf(n.event_key),
  }));
  const present = [...new Set(all.map((n) => n.category).filter((c): c is NotificationCategory => !!c))];
  const items = filter ? all.filter((n) => n.category === filter) : all;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {header}
      {present.length > 1 && (
        <nav aria-label="Filter notifications" className="flex flex-wrap gap-1.5">
          {[null, ...present].map((category) => (
            <Link
              key={category ?? "all"}
              href={category ? `/notifications?type=${category}` : "/notifications"}
              aria-current={category === filter ? "page" : undefined}
              className={cn(
                "h-8 rounded-full border px-3 text-sm leading-8",
                category === filter
                  ? "border-green-action bg-green-action text-white"
                  : "text-secondary-text hover:border-green/50",
              )}
            >
              {category ? NOTIFICATION_CATEGORIES[category].label : "All"}
            </Link>
          ))}
        </nav>
      )}
      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter ? "Nothing here" : "No notifications yet"}
          description="Deadline reminders, messages and new matches will appear here."
        />
      ) : (
        <NotificationList key={filter ?? "all"} items={items} />
      )}
    </div>
  );
}
