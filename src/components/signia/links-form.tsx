"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { BoxField, boxControl, boxControlProps, InlineError } from "@/components/forms/box-field";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SocialPlatform } from "@/data/types";
import { saveSigniaLinks } from "@/lib/actions/signia";
import { PLATFORMS, VISIBILITY_LABELS } from "@/lib/signia/labels";
import { signiaLinksSchema, type SigniaLinksFormInput } from "@/lib/validation/signia";

export function SigniaLinksForm({ defaults }: { defaults: SigniaLinksFormInput }) {
  const router = useRouter();
  const form = useForm<SigniaLinksFormInput>({ resolver: zodResolver(signiaLinksSchema), defaultValues: defaults });
  const links = useFieldArray({ control: form.control, name: "links" });
  const { pending, run } = useFormAction<SigniaLinksFormInput>(form.setError);
  const { errors } = form.formState;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        run(
          () => saveSigniaLinks(values),
          { loading: "Saving links…", success: "Links saved" },
          () => router.refresh(),
        ),
      )}
      className="space-y-4"
    >
      {links.fields.length === 0 && (
        <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-secondary-text">
          Add LinkedIn, GitHub, a research profile or your own site — whatever shows your work best.
        </p>
      )}
      <ul className="space-y-3">
        {links.fields.map((link, index) => (
          <li key={link.id} className="rounded-2xl border bg-card p-4 shadow-xs dark:bg-white/[0.03]">
            <div className="grid gap-3 sm:grid-cols-2">
              <Controller
                control={form.control}
                name={`links.${index}.platform`}
                render={({ field }) => (
                  <BoxField id={`ln-platform-${index}`} label="Platform">
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        const label = form.getValues(`links.${index}.label`);
                        if (!label || Object.values(PLATFORMS).some((p) => p.label === label)) {
                          form.setValue(`links.${index}.label`, PLATFORMS[v as SocialPlatform].label);
                        }
                      }}
                    >
                      <SelectTrigger className={boxControl} {...boxControlProps(`ln-platform-${index}`)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.entries(PLATFORMS) as [SocialPlatform, { label: string }][]).map(([value, p]) => (
                          <SelectItem key={value} value={value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </BoxField>
                )}
              />
              <BoxField id={`ln-label-${index}`} label="Label" error={errors.links?.[index]?.label?.message}>
                <Input
                  {...form.register(`links.${index}.label`)}
                  {...boxControlProps(`ln-label-${index}`, errors.links?.[index]?.label?.message)}
                  className={boxControl}
                />
              </BoxField>
              <BoxField
                id={`ln-url-${index}`}
                label="Link"
                error={errors.links?.[index]?.url?.message}
                className="sm:col-span-2"
              >
                <Input
                  type="url"
                  inputMode="url"
                  placeholder="https://"
                  {...form.register(`links.${index}.url`)}
                  {...boxControlProps(`ln-url-${index}`, errors.links?.[index]?.url?.message)}
                  className={boxControl}
                />
              </BoxField>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Controller
                control={form.control}
                name={`links.${index}.visibility`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="h-8 w-auto rounded-lg text-xs"
                      aria-label={`Who can see link ${index + 1}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(VISIBILITY_LABELS).map(([value, v]) => (
                        <SelectItem key={value} value={value}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <span className="ml-auto" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => links.move(index, index - 1)}
                disabled={index === 0}
                aria-label={`Move link ${index + 1} up`}
              >
                <ArrowUp aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => links.move(index, index + 1)}
                disabled={index === links.fields.length - 1}
                aria-label={`Move link ${index + 1} down`}
              >
                <ArrowDown aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 hover:text-danger"
                onClick={() => links.remove(index)}
                aria-label={`Remove link ${index + 1}`}
              >
                <Trash2 aria-hidden />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <InlineError message={errors.links?.message ?? errors.links?.root?.message} />
      <Button
        type="button"
        variant="outline"
        className="rounded-xl"
        onClick={() =>
          links.append({
            id: `new-${crypto.randomUUID()}`,
            platform: "linkedin",
            label: "LinkedIn",
            url: "",
            visibility: "public",
          })
        }
        disabled={links.fields.length >= 15}
      >
        <Plus aria-hidden />
        Add a link
      </Button>
      <FormFooter pending={pending} submitLabel="Save links" backHref="/signia" aboveTabs hint="Shown in this order" />
    </form>
  );
}
