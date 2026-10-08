"use client";

import { Lock, Minus } from "lucide-react";
import { useState } from "react";

import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Switch } from "@/components/ui/switch";
import type { NotificationCategory, NotificationChannel, NotificationPreference } from "@/data/types";
import { saveNotificationPreferences } from "@/lib/actions/settings";
import { NOTIFICATION_CATEGORIES, NOTIFICATION_CHANNELS } from "@/lib/candidate/labels";
import { cn } from "@/lib/utils";

type Key = `${NotificationCategory}:${NotificationChannel}`;
const CHANNELS = Object.keys(NOTIFICATION_CHANNELS) as NotificationChannel[];
const CATEGORIES = Object.keys(NOTIFICATION_CATEGORIES) as NotificationCategory[];

export function NotificationPreferences({
  preferences,
  whatsappOptedIn,
}: {
  preferences: NotificationPreference[];
  whatsappOptedIn: boolean;
}) {
  const [state, setState] = useState<Record<Key, boolean>>(
    () =>
      Object.fromEntries(preferences.map((p) => [`${p.notification_type}:${p.channel}`, p.enabled])) as Record<
        Key,
        boolean
      >,
  );
  const { pending, run } = useFormAction();

  const rule = (category: NotificationCategory, channel: NotificationChannel) => {
    const rules = NOTIFICATION_CATEGORIES[category];
    if (rules.never?.includes(channel)) return "never" as const;
    if (channel === "whatsapp" && !whatsappOptedIn) return "no_whatsapp" as const;
    if (rules.locked?.includes(channel)) return "locked" as const;
    return "free" as const;
  };

  function save() {
    const payload = CATEGORIES.flatMap((category) =>
      CHANNELS.map((channel) => {
        const r = rule(category, channel);
        return {
          notification_type: category,
          channel,
          enabled: r === "locked" ? true : r === "never" ? false : Boolean(state[`${category}:${channel}`]),
        };
      }),
    );
    run(() => saveNotificationPreferences(payload), { loading: "Saving…", success: "Notification settings saved" });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th scope="col" className="px-3 py-3 font-medium text-secondary-text sm:px-4">
                Notify me about
              </th>
              {CHANNELS.map((channel) => (
                <th
                  key={channel}
                  scope="col"
                  className={cn(
                    "w-12 px-0.5 py-3 text-center text-[0.6875rem] font-medium text-secondary-text sm:w-20 sm:text-sm",
                    channel === "whatsapp" && !whatsappOptedIn && "opacity-50",
                  )}
                >
                  {NOTIFICATION_CHANNELS[channel]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {CATEGORIES.map((category) => (
              <tr key={category}>
                <th scope="row" className="px-3 py-3.5 text-left font-normal sm:px-4">
                  <span className="block font-medium text-primary-text">{NOTIFICATION_CATEGORIES[category].label}</span>
                  <span className="block text-xs text-secondary-text">{NOTIFICATION_CATEGORIES[category].text}</span>
                </th>
                {CHANNELS.map((channel) => {
                  const key: Key = `${category}:${channel}`;
                  const r = rule(category, channel);
                  const label = `${NOTIFICATION_CATEGORIES[category].label} by ${NOTIFICATION_CHANNELS[channel].toLowerCase()}`;
                  return (
                    <td key={channel} className="px-0.5 py-3.5 text-center">
                      {r === "never" ? (
                        <span className="inline-flex text-subtle-text" title="Never sent on this channel">
                          <Minus className="size-4" aria-label={`${label}: never sent`} />
                        </span>
                      ) : (
                        <span className="relative inline-flex items-center">
                          <Switch
                            checked={r === "locked" || (r !== "no_whatsapp" && Boolean(state[key]))}
                            disabled={r !== "free"}
                            onCheckedChange={(checked) => setState((s) => ({ ...s, [key]: checked }))}
                            aria-label={label}
                          />
                          {r === "locked" && (
                            <Lock className="absolute -right-3.5 size-3 text-subtle-text" aria-hidden />
                          )}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 px-1 text-xs text-secondary-text">
        Payments and security messages always go by email and WhatsApp. Promotions never go to WhatsApp. Push
        notifications reach you when Scholastiar is installed on your phone or computer.
      </p>
      <FormFooter pending={pending} submitLabel="Save notification settings" aboveTabs />
    </form>
  );
}
