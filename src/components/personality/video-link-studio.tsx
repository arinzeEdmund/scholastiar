"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoEmbed } from "@/components/video/video-embed";
import { MAX_PROMPTS, PERSONALITY_PROMPTS } from "@/config/personality";
import { savePersonalityVideoLink } from "@/lib/actions/personality";
import { cn } from "@/lib/utils";
import { parseVideoLink, VIDEO_LINK_HELP } from "@/lib/video-embed";

const schema = z.object({
  prompts: z.array(z.enum(PERSONALITY_PROMPTS)).min(1, "Choose at least one prompt.").max(MAX_PROMPTS),
  url: z
    .string()
    .trim()
    .refine((v) => parseVideoLink(v) !== null, VIDEO_LINK_HELP),
});
type Values = z.infer<typeof schema>;

/**
 * Add a PersonalityAI CV by link: choose the prompts you answer, paste the link, check it plays,
 * save. Students record on Loom, Tella, YouTube or their phone — we only embed.
 */
export function VideoLinkStudio() {
  const router = useRouter();
  const [step, setStep] = useState<"prompts" | "link">("prompts");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { prompts: [PERSONALITY_PROMPTS[0], PERSONALITY_PROMPTS[2]], url: "" },
  });
  const { pending, run } = useFormAction<Values>(form.setError);
  const prompts = useWatch({ control: form.control, name: "prompts" });
  const url = useWatch({ control: form.control, name: "url" });
  const linked = parseVideoLink(url);
  const { errors } = form.formState;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        run(
          () => savePersonalityVideoLink(values),
          { loading: "Saving…", success: "Your PersonalityAI CV is saved" },
          () => router.push("/personality-cv"),
        ),
      )}
      className="space-y-5"
    >
      <ol className="flex gap-1.5" aria-label="Steps">
        {(["prompts", "link"] as const).map((s, i) => (
          <li key={s} className="flex-1" aria-current={s === step ? "step" : undefined}>
            <span
              className={cn(
                "block h-1.5 rounded-full",
                step === "link" || i === 0 ? "bg-green" : "bg-neutral-soft dark:bg-white/10",
              )}
            />
            <span
              className={cn(
                "mt-1.5 block text-xs",
                s === step ? "font-semibold text-primary-text" : "text-secondary-text",
              )}
            >
              {i + 1}. {s === "prompts" ? "Choose your prompts" : "Add your video link"}
            </span>
          </li>
        ))}
      </ol>

      {step === "prompts" ? (
        <section className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
          <h2 className="font-semibold text-primary-text">Choose up to {MAX_PROMPTS} prompts to answer</h2>
          <p className="mt-1 text-sm text-secondary-text">
            One minute in total, about 20 seconds a prompt. Talk the way you would to an admissions tutor — no script
            needed.
          </p>
          <div role="group" aria-label="Prompts" className="mt-4 grid gap-2 sm:grid-cols-2">
            {PERSONALITY_PROMPTS.map((prompt) => {
              const on = prompts.includes(prompt);
              const full = !on && prompts.length >= MAX_PROMPTS;
              return (
                <button
                  key={prompt}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  disabled={full}
                  onClick={() =>
                    form.setValue("prompts", on ? prompts.filter((p) => p !== prompt) : [...prompts, prompt], {
                      shouldValidate: true,
                    })
                  }
                  className={cn(
                    "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-left text-sm transition-all disabled:opacity-50",
                    on
                      ? "border-green-action bg-soft-green/50 text-primary-text dark:bg-green/10"
                      : "text-secondary-text hover:border-green/50",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                      on ? "border-green-action bg-green-action text-white" : "border-subtle-text/60",
                    )}
                    aria-hidden
                  >
                    {on && <Check className="size-3" />}
                  </span>
                  {prompt}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex justify-end">
            <Button
              type="button"
              className="rounded-xl"
              onClick={() => setStep("link")}
              disabled={prompts.length === 0}
            >
              Next: add your video
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </section>
      ) : (
        <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
          <div>
            <h2 className="font-semibold text-primary-text">Add your video link</h2>
            <p className="mt-1 text-sm text-secondary-text">
              Record on Loom, Tella or your phone, upload it to YouTube, Vimeo or Google Drive as unlisted or
              anyone-with-the-link, then paste the link here.
            </p>
          </div>
          <ol className="list-decimal space-y-0.5 pl-5 text-sm text-secondary-text">
            {prompts.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
          <BoxField
            id="video-link"
            label="Video link"
            error={errors.url?.message ?? (url && !linked ? VIDEO_LINK_HELP : undefined)}
            hint={VIDEO_LINK_HELP}
          >
            <Input
              type="url"
              inputMode="url"
              placeholder="https://www.loom.com/share/…"
              {...form.register("url")}
              {...boxControlProps("video-link", errors.url?.message)}
              className={boxControl}
            />
          </BoxField>
          {linked && <VideoEmbed url={linked.url} title="Your PersonalityAI CV" />}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" onClick={() => setStep("prompts")}>
              <ArrowLeft aria-hidden />
              Prompts
            </Button>
            <Button type="submit" className="ml-auto rounded-xl" disabled={!linked || pending}>
              {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}
              Use this video
            </Button>
          </div>
        </section>
      )}
    </form>
  );
}
