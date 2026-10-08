"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ChoiceTiles } from "@/components/forms/choice";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updatePersonalitySettings, type PersonalitySettingsInput } from "@/lib/actions/personality";

const schema = z.object({
  visibility: z.enum(["applications", "signia", "hidden"]),
  attach_by_default: z.boolean(),
  share_transcript: z.boolean(),
});

function Row({ id, title, text, children }: { id: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <Label htmlFor={id} className="text-sm font-medium text-primary-text">
          {title}
        </Label>
        <p className="text-xs text-secondary-text">{text}</p>
      </div>
      {children}
    </div>
  );
}

export function PersonalitySettingsForm({ defaults }: { defaults: PersonalitySettingsInput }) {
  const form = useForm<PersonalitySettingsInput>({ resolver: zodResolver(schema), defaultValues: defaults });
  const { pending, run } = useFormAction<PersonalitySettingsInput>(form.setError);

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        run(() => updatePersonalitySettings(values), { loading: "Saving…", success: "Privacy settings saved" }),
      )}
      className="space-y-6"
    >
      <section className="space-y-5 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <Controller
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <ChoiceTiles
              label="Who can watch your video"
              columns={1}
              value={field.value}
              onChange={field.onChange}
              options={[
                {
                  value: "applications",
                  label: "Reviewers of my applications",
                  description: "Admissions teams and scholarship panels, only on applications you attach it to.",
                },
                {
                  value: "signia",
                  label: "Reviewers, and my Signia page",
                  description: "Also shown as the introduction on your public Signia portfolio.",
                },
                { value: "hidden", label: "Nobody for now", description: "Keep it, but don't share it anywhere." },
              ]}
            />
          )}
        />
        <div className="divide-y border-t">
          <Controller
            control={form.control}
            name="attach_by_default"
            render={({ field }) => (
              <Row
                id="attach"
                title="Attach to new applications"
                text="You can still remove it from any single application."
              >
                <Switch id="attach" checked={field.value} onCheckedChange={field.onChange} />
              </Row>
            )}
          />
          <Controller
            control={form.control}
            name="share_transcript"
            render={({ field }) => (
              <Row
                id="transcript"
                title="Share a written transcript"
                text="Helps reviewers who prefer reading, and makes your video accessible."
              >
                <Switch id="transcript" checked={field.value} onCheckedChange={field.onChange} />
              </Row>
            )}
          />
        </div>
      </section>
      <FormFooter
        pending={pending}
        submitLabel="Save settings"
        backHref="/personality-cv"
        aboveTabs
        hint="Applies straight away"
      />
    </form>
  );
}
