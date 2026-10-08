"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  Handshake,
  HelpCircle,
  Loader2,
  Newspaper,
  type LucideIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { BoxField, boxControl, boxControlProps, InlineError } from "@/components/forms/box-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/lib/actions/inbound";
import { cn } from "@/lib/utils";
import { CONTACT_TOPICS, contactSchema, type ContactInput } from "@/lib/validation/inbound";

const TOPIC_ICONS: Record<ContactInput["topic"], LucideIcon> = {
  applicant_support: GraduationCap,
  employer_sales: Building2,
  partnerships: Handshake,
  press: Newspaper,
  other: HelpCircle,
};

export function ContactForm({ defaultTopic }: { defaultTopic?: ContactInput["topic"] }) {
  const [pending, startTransition] = useTransition();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", topic: defaultTopic, message: "" },
  });
  const { errors } = form.formState;

  function onSubmit(values: ContactInput) {
    const toastId = toast.loading("Sending your message…");
    startTransition(async () => {
      const result = await sendContactMessage(values);
      if (!result.ok) {
        for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
          if (messages?.[0]) form.setError(field as keyof ContactInput, { message: messages[0] });
        }
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success("Message sent", { id: toastId });
      setSentTo(values.email);
    });
  }

  if (sentTo) {
    return (
      <div role="status" className="rounded-lg border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-green" aria-hidden />
        <h2 className="mt-4 text-xl font-semibold">Thanks — your message is with us</h2>
        <p className="mt-2 text-secondary-text">
          We&apos;ll reply to <strong className="text-primary-text">{sentTo}</strong> within two working days.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            form.reset({ name: "", email: "", topic: undefined, message: "" });
            setSentTo(null);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl border bg-card p-6 shadow-lg shadow-black/5 sm:p-8 dark:shadow-black/40"
    >
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <BoxField id="contact-name" label="Your name" error={errors.name?.message}>
            <Input
              {...boxControlProps("contact-name", errors.name?.message)}
              className={boxControl}
              autoComplete="name"
              {...form.register("name")}
            />
          </BoxField>
          <BoxField id="contact-email" label="Email" error={errors.email?.message}>
            <Input
              {...boxControlProps("contact-email", errors.email?.message)}
              className={boxControl}
              type="email"
              autoComplete="email"
              {...form.register("email")}
            />
          </BoxField>
        </div>
        <div>
          <span id="contact-topic-label" className="text-xs font-medium text-secondary-text">
            What is this about?
          </span>
          <Controller
            control={form.control}
            name="topic"
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-labelledby="contact-topic-label"
                aria-describedby={errors.topic ? "contact-topic-error" : undefined}
                className="mt-2 grid gap-2 sm:grid-cols-2"
              >
                {(Object.entries(CONTACT_TOPICS) as [ContactInput["topic"], string][]).map(([value, label]) => {
                  const Icon = TOPIC_ICONS[value];
                  const checked = field.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      onClick={() => field.onChange(value)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border bg-card p-3 text-left text-sm transition-colors hover:border-green/60",
                        checked && "border-green bg-soft-green/50 ring-1 ring-green",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg",
                          checked ? "bg-green-action text-white" : "bg-soft text-secondary-text",
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className={cn("font-medium", checked ? "text-primary-text" : "text-secondary-text")}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          <InlineError id="contact-topic-error" message={errors.topic?.message} />
        </div>
        <BoxField id="contact-message" label="Message" error={errors.message?.message}>
          <Textarea
            {...boxControlProps("contact-message", errors.message?.message)}
            className={cn(boxControl, "min-h-36 resize-y")}
            rows={6}
            placeholder="Tell us what you need help with. Please don't include passport numbers or other sensitive details."
            {...form.register("message")}
          />
        </BoxField>
        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto sm:self-start">
          {pending && <Loader2 className="animate-spin" aria-hidden />}
          Send message
        </Button>
      </FieldGroup>
    </form>
  );
}
