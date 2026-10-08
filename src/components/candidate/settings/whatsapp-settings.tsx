"use client";

import { Loader2, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { saveWhatsApp } from "@/lib/actions/settings";
import { formatPhone } from "@/lib/phone";

/** WhatsApp number and opt-in for official Scholastiar messages. */
export function WhatsAppSettings({ phone, optedIn }: { phone: string | null; optedIn: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(phone ? formatPhone(phone) : "");
  const [enabled, setEnabled] = useState(optedIn);
  const [error, setError] = useState<string>();
  const { pending, run } = useFormAction();

  return (
    <section aria-labelledby="whatsapp-title" className="rounded-2xl border bg-card p-5 shadow-xs dark:bg-white/[0.03]">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#128C4B] dark:text-[#25D366]">
          <MessageCircle className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="whatsapp-title" className="font-semibold text-primary-text">
            WhatsApp updates
          </h2>
          <p className="text-sm text-secondary-text">
            Get every important update from Scholastiar&apos;s official WhatsApp account, as well as by email.
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Receive WhatsApp updates" />
      </div>
      <form
        noValidate
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
        onSubmit={(e) => {
          e.preventDefault();
          setError(undefined);
          run(
            async () => {
              const result = await saveWhatsApp({ phone: value, optedIn: enabled });
              if (!result.ok) setError(result.fieldErrors?.phone?.[0]);
              return result;
            },
            { loading: "Saving…", success: enabled ? "WhatsApp updates on" : "WhatsApp updates off" },
            () => router.refresh(),
          );
        }}
      >
        <BoxField id="whatsapp-phone" label="WhatsApp number" error={error} className="flex-1">
          <Input
            {...boxControlProps("whatsapp-phone", error)}
            type="tel"
            autoComplete="tel"
            placeholder="+234 801 555 0100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={boxControl}
          />
        </BoxField>
        <Button type="submit" className="h-[3.875rem] rounded-xl px-5 sm:w-auto" disabled={pending}>
          {pending && <Loader2 className="animate-spin" aria-hidden />}
          Save
        </Button>
      </form>
    </section>
  );
}
