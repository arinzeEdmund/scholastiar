"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addSigniaMediaLink } from "@/lib/actions/signia";
import { MEDIA_TYPES } from "@/lib/signia/labels";
import { MEDIA_LINK_TYPES, mediaLinkFormSchema, type MediaLinkFormInput } from "@/lib/validation/video";

/** Add proof by link — no uploads. Video links play in the page; other links open where they're hosted. */
export function MediaLinkForm() {
  const router = useRouter();
  const form = useForm<MediaLinkFormInput>({
    resolver: zodResolver(mediaLinkFormSchema),
    defaultValues: { media_type: "video", url: "", title: "" },
  });
  const { pending, run } = useFormAction<MediaLinkFormInput>(form.setError);
  const { errors } = form.formState;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        run(
          () => addSigniaMediaLink(values),
          { loading: "Adding…", success: "Added to your media" },
          () => {
            form.reset({ media_type: values.media_type, url: "", title: "" });
            router.refresh();
          },
        ),
      )}
      className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]"
    >
      <div>
        <h2 className="flex items-center gap-2 font-semibold text-primary-text">
          <Link2 className="size-4 text-green-dark" aria-hidden />
          Add by link
        </h2>
        <p className="mt-0.5 text-sm text-secondary-text">
          Videos from YouTube, Loom, Tella, Vimeo or Google Drive play right on your page. Documents, slides and images:
          a Google Drive, Dropbox or website link. Make sure anyone with the link can view it.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
        <Controller
          control={form.control}
          name="media_type"
          render={({ field }) => (
            <BoxField id="ml-type" label="Type">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={boxControl} {...boxControlProps("ml-type")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_LINK_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {MEDIA_TYPES[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </BoxField>
          )}
        />
        <BoxField id="ml-url" label="Link" error={errors.url?.message}>
          <Input
            type="url"
            inputMode="url"
            placeholder="https://"
            {...form.register("url")}
            {...boxControlProps("ml-url", errors.url?.message)}
            className={boxControl}
          />
        </BoxField>
      </div>
      <BoxField id="ml-title" label="Title" error={errors.title?.message}>
        <Input
          {...form.register("title")}
          {...boxControlProps("ml-title", errors.title?.message)}
          className={boxControl}
        />
      </BoxField>
      <Button type="submit" className="rounded-xl" disabled={pending}>
        {pending && <Loader2 className="animate-spin" aria-hidden />}
        Add to media
      </Button>
    </form>
  );
}
