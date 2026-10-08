"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";

import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { ChoiceTiles } from "@/components/forms/choice";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveAbout } from "@/lib/actions/candidate";
import { PROFILE_VISIBILITY } from "@/lib/candidate/labels";
import { cn } from "@/lib/utils";
import { aboutSchema, type AboutInput } from "@/lib/validation/candidate";

export function AboutForm({ defaults, stickyFooter = true }: { defaults: AboutInput; stickyFooter?: boolean }) {
  const router = useRouter();
  const form = useForm<AboutInput>({ resolver: zodResolver(aboutSchema), defaultValues: defaults });
  const { errors } = form.formState;
  const { pending, run } = useFormAction(form.setError);
  const summary = useWatch({ control: form.control, name: "summary" }) ?? "";
  const err = (name: keyof AboutInput) => errors[name]?.message as string | undefined;

  const onSubmit = (values: AboutInput) =>
    run(
      () => saveAbout(values),
      { loading: "Saving…", success: "Profile updated" },
      () => router.refresh(),
    );

  const link = (name: "linkedinUrl" | "websiteUrl" | "portfolioUrl", label: string, placeholder: string) => (
    <BoxField id={name} label={label} error={err(name)}>
      <Input
        {...boxControlProps(name, err(name))}
        type="url"
        placeholder={placeholder}
        className={boxControl}
        {...form.register(name)}
      />
    </BoxField>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-3">
      <BoxField id="headline" label="Headline" error={err("headline")}>
        <Input
          {...boxControlProps("headline", err("headline"))}
          placeholder="e.g. Public health graduate · Incoming MSc student in London"
          className={boxControl}
          {...form.register("headline")}
        />
      </BoxField>
      <BoxField
        id="summary"
        label="Summary"
        error={err("summary")}
        aside={<span className="text-[0.6875rem] text-secondary-text tabular-nums">{summary.length}/1200</span>}
      >
        <Textarea
          {...boxControlProps("summary", err("summary"))}
          rows={5}
          placeholder="Who you are, what you're good at and what you want next — three or four sentences."
          className={cn(boxControl, "min-h-28 resize-y")}
          {...form.register("summary")}
        />
      </BoxField>
      <div className="grid gap-3 sm:grid-cols-3">
        {link("linkedinUrl", "LinkedIn (optional)", "https://linkedin.com/in/…")}
        {link("portfolioUrl", "Portfolio (optional)", "https://")}
        {link("websiteUrl", "Website (optional)", "https://")}
      </div>
      <div className="pt-2">
        <Controller
          control={form.control}
          name="profileVisibility"
          render={({ field }) => (
            <ChoiceTiles
              label="Who can see your profile"
              value={field.value}
              onChange={field.onChange}
              options={Object.entries(PROFILE_VISIBILITY).map(([value, o]) => ({
                value: value as AboutInput["profileVisibility"],
                label: o.label,
                description: o.text,
              }))}
            />
          )}
        />
      </div>
      <FormFooter pending={pending} submitLabel="Save changes" aboveTabs sticky={stickyFooter} />
    </form>
  );
}
