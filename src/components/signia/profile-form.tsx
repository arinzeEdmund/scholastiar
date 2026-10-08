"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";

import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { ChoiceTiles } from "@/components/forms/choice";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveSigniaProfile } from "@/lib/actions/signia";
import { SECTION_LABELS } from "@/lib/signia/labels";
import { signiaProfileSchema, type SigniaProfileFormInput } from "@/lib/validation/signia";
import { cn } from "@/lib/utils";

export function SigniaProfileForm({ defaults }: { defaults: SigniaProfileFormInput }) {
  const router = useRouter();
  const form = useForm<SigniaProfileFormInput>({ resolver: zodResolver(signiaProfileSchema), defaultValues: defaults });
  const { pending, run } = useFormAction<SigniaProfileFormInput>(form.setError);
  const { errors } = form.formState;
  const sections = useWatch({ control: form.control, name: "sections" });
  const summary = useWatch({ control: form.control, name: "summary" });
  const handle = useWatch({ control: form.control, name: "handle" });

  function move(index: number, by: -1 | 1) {
    const next = [...sections];
    const j = index + by;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    form.setValue("sections", next, { shouldDirty: true });
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        run(
          () => saveSigniaProfile(values),
          { loading: "Saving your portfolio…", success: "Portfolio saved" },
          () => {
            router.push("/signia");
            router.refresh();
          },
        ),
      )}
      className="space-y-6"
    >
      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <h2 className="font-semibold text-primary-text">Your page</h2>
        <BoxField
          id="sg-handle"
          label="Handle"
          error={errors.handle?.message}
          hint={`Your page: scholastiar.ai/s/${handle || "your-name"}`}
        >
          <Input
            {...form.register("handle")}
            {...boxControlProps("sg-handle", errors.handle?.message)}
            className={boxControl}
            autoComplete="off"
          />
        </BoxField>
        <BoxField
          id="sg-headline"
          label="Headline"
          error={errors.headline?.message}
          hint="One line on what you do and where you're heading."
        >
          <Input
            {...form.register("headline")}
            {...boxControlProps("sg-headline", errors.headline?.message)}
            className={boxControl}
          />
        </BoxField>
        <BoxField
          id="sg-summary"
          label="About me"
          error={errors.summary?.message}
          aside={<span className="text-[0.6875rem] text-secondary-text tabular-nums">{summary.length}/1200</span>}
        >
          <Textarea
            {...form.register("summary")}
            {...boxControlProps("sg-summary", errors.summary?.message)}
            rows={5}
            className={cn(boxControl, "resize-y")}
          />
        </BoxField>
        <BoxField id="sg-now" label="What I'm working on now" error={errors.current_work_summary?.message}>
          <Textarea
            {...form.register("current_work_summary")}
            {...boxControlProps("sg-now", errors.current_work_summary?.message)}
            rows={2}
            className={cn(boxControl, "resize-y")}
          />
        </BoxField>
      </section>

      <section className="space-y-5 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <h2 className="font-semibold text-primary-text">Who can see it</h2>
        <Controller
          control={form.control}
          name="discoverability"
          render={({ field }) => (
            <ChoiceTiles
              label="Audience"
              columns={2}
              value={field.value}
              onChange={field.onChange}
              options={[
                {
                  value: "public",
                  label: "Anyone with the link",
                  description: "A public page you can share anywhere.",
                },
                {
                  value: "application_only",
                  label: "Application reviewers only",
                  description: "No public page; reviewers see it with your applications.",
                },
              ]}
            />
          )}
        />
        <Controller
          control={form.control}
          name="public_status"
          render={({ field }) => (
            <div className="flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3">
              <div>
                <Label htmlFor="sg-publish" className="text-sm font-medium text-primary-text">
                  Published
                </Label>
                <p className="text-xs text-secondary-text">Turn off to hide everything while you work on it.</p>
              </div>
              <Switch
                id="sg-publish"
                checked={field.value === "published"}
                onCheckedChange={(on) => field.onChange(on ? "published" : "unpublished")}
              />
            </div>
          )}
        />
      </section>

      <section className="space-y-3 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <h2 className="font-semibold text-primary-text">Sections</h2>
        <p className="text-sm text-secondary-text">
          Put your strongest proof first. Switch off anything you don&apos;t want to show.
        </p>
        <ul className="divide-y rounded-xl border">
          {sections.map((section, index) => (
            <li key={section.key} className="flex items-center gap-2 px-3 py-2">
              <span className="flex-1 text-sm font-medium text-primary-text">{SECTION_LABELS[section.key]}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${SECTION_LABELS[section.key]} up`}
              >
                <ArrowUp aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => move(index, 1)}
                disabled={index === sections.length - 1}
                aria-label={`Move ${SECTION_LABELS[section.key]} down`}
              >
                <ArrowDown aria-hidden />
              </Button>
              <Switch
                checked={section.visible}
                onCheckedChange={(on) =>
                  form.setValue(
                    "sections",
                    sections.map((s, i) => (i === index ? { ...s, visible: on } : s)),
                    { shouldDirty: true },
                  )
                }
                aria-label={`Show ${SECTION_LABELS[section.key]}`}
              />
            </li>
          ))}
        </ul>
      </section>

      <FormFooter
        pending={pending}
        submitLabel="Save portfolio"
        backHref="/signia"
        aboveTabs
        hint="Your page updates as soon as you save"
      />
    </form>
  );
}
