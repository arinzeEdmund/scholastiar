"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Loader2, Sparkles, Target, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";

import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CvContent, CvFormat, CvSectionKey, CvVersion } from "@/data/types";
import { saveCv, suggestRewrite } from "@/lib/actions/cv";
import { CV_FORMATS, CV_SECTIONS, keywordCoverage, numbersNotIn } from "@/lib/cv/build";
import { cvUpdateSchema } from "@/lib/validation/cv";
import { cn } from "@/lib/utils";

type Values = z.infer<typeof cvUpdateSchema>;
type EntryList = "experience" | "education";

const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** Bullets as one textarea (one line per bullet), with AI wording suggestions per line. */
function BulletsEditor({
  control,
  list,
  index,
  heading,
}: {
  control: Control<Values>;
  list: EntryList;
  index: number;
  heading: string;
}) {
  const [suggestions, setSuggestions] = useState<{ from: string; to: string; note: string }[] | null>(null);
  const [pending, startTransition] = useTransition();
  const id = `${list}-${index}-bullets`;

  return (
    <Controller
      control={control}
      name={`content.${list}.${index}.bullets`}
      render={({ field }) => {
        function improve() {
          const current = field.value.filter(Boolean);
          if (current.length === 0) return;
          startTransition(async () => {
            const results = await Promise.all(current.map((text) => suggestRewrite({ text, attempt: 0 })));
            const failed = results.find((r) => !r.ok);
            if (failed && !failed.ok) {
              toast.error(failed.error);
              return;
            }
            const found = results
              .map((r, i) => (r.ok ? { from: current[i], to: r.data.suggestion, note: r.data.note } : null))
              .filter((s): s is { from: string; to: string; note: string } => !!s && s.from !== s.to);
            setSuggestions(found);
            if (found.length === 0) toast.success("Your wording is already strong");
          });
        }
        function accept(from: string, to: string) {
          field.onChange(field.value.map((line: string) => (line === from ? to : line)));
          setSuggestions((s) => s?.filter((x) => x.from !== from) ?? null);
        }
        return (
          <div className="space-y-2">
            <BoxField id={id} label={`${heading} — one point per line`}>
              <Textarea
                {...boxControlProps(id)}
                value={field.value.join("\n")}
                onChange={(e) => field.onChange(e.target.value.split("\n"))}
                onBlur={() => field.onChange(lines(field.value.join("\n")))}
                rows={Math.max(3, field.value.length + 1)}
                className={cn(boxControl, "resize-y")}
              />
            </BoxField>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={improve} disabled={pending}>
                {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Wand2 aria-hidden />}
                Improve wording
              </Button>
              <span className="text-xs text-secondary-text">Suggestions only reword — they never add facts.</span>
            </div>
            {suggestions && suggestions.length > 0 && (
              <ul
                className="space-y-2 rounded-xl border border-green/30 bg-soft-green/40 p-3 dark:bg-green/10"
                aria-label="Suggestions"
              >
                {suggestions.map((s) => (
                  <li key={s.from} className="space-y-1.5">
                    <p className="text-xs text-secondary-text line-through">{s.from}</p>
                    <p className="text-sm text-primary-text">{s.to}</p>
                    <div className="flex items-center gap-2">
                      <Button type="button" size="sm" onClick={() => accept(s.from, s.to)}>
                        Use this
                      </Button>
                      <span className="text-xs text-secondary-text">{s.note}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }}
    />
  );
}

function Checks({ control, keywords, source }: { control: Control<Values>; keywords: string[]; source: string }) {
  const content = useWatch({ control, name: "content" }) as CvContent;
  const coverage = keywordCoverage(content, keywords);
  const warnings = numbersNotIn(content, source);
  return (
    <div className="space-y-4">
      {keywords.length > 0 && (
        <section className="rounded-2xl border bg-card p-4 dark:bg-white/[0.03]">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-primary-text">
            <Target className="size-4 text-green-dark" aria-hidden />
            Key words · {coverage.found.length} of {keywords.length}
          </h2>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {keywords.map((k) => (
              <li
                key={k}
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  coverage.found.includes(k)
                    ? "bg-soft-green font-medium text-green-dark dark:bg-green/15"
                    : "border border-dashed text-secondary-text",
                )}
              >
                {k}
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="rounded-2xl border bg-card p-4 dark:bg-white/[0.03]" aria-live="polite">
        <h2 className="text-sm font-semibold text-primary-text">Fact check</h2>
        {warnings.length === 0 ? (
          <p className="mt-2 flex items-start gap-2 text-sm text-secondary-text">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green" aria-hidden />
            Every number matches your profile.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary-text">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                <span>
                  <span className="font-semibold text-primary-text">{w.value}</span> in {w.where} isn&apos;t in your
                  profile. Only keep it if it&apos;s true.
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export function CvEditor({
  cv,
  profileSkills,
  nationality,
  source,
}: {
  cv: CvVersion;
  profileSkills: string[];
  nationality: string | null;
  /** The profile's own wording, for the live fact check. */
  source: string;
}) {
  const router = useRouter();
  const [format, setFormat] = useState<CvFormat>(cv.format);
  const form = useForm<Values>({
    resolver: zodResolver(cvUpdateSchema),
    defaultValues: { id: cv.id, title: cv.title, content: cv.content },
  });
  const { pending, run } = useFormAction<Values>(form.setError);
  const { errors } = form.formState;
  const order = useWatch({ control: form.control, name: "content.section_order" });
  const hidden = useWatch({ control: form.control, name: "content.hidden_sections" });
  const summary = useWatch({ control: form.control, name: "content.summary" });

  function move(key: CvSectionKey, by: -1 | 1) {
    const next = [...order];
    const i = next.indexOf(key);
    const j = i + by;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    form.setValue("content.section_order", next, { shouldDirty: true });
  }

  function changeFormat(value: CvFormat) {
    setFormat(value);
    form.setValue("content.section_order", CV_FORMATS[value].order, { shouldDirty: true });
    form.setValue("content.header.nationality", CV_FORMATS[value].personal ? nationality : null, { shouldDirty: true });
    toast.success(`Switched to ${CV_FORMATS[value].label} order`);
  }

  function onSubmit(values: Values) {
    const clean = {
      ...values,
      content: {
        ...values.content,
        experience: values.content.experience.map((e) => ({ ...e, bullets: lines(e.bullets.join("\n")) })),
        education: values.content.education.map((e) => ({ ...e, bullets: lines(e.bullets.join("\n")) })),
      },
    };
    run(
      () => saveCv(clean),
      { loading: "Saving your CV…", success: "CV saved" },
      ({ id }) => router.push(`/ai-cv/${id}`),
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="min-w-0 space-y-6">
        <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
          <BoxField id="cv-title" label="CV name" error={errors.title?.message}>
            <Input
              {...form.register("title")}
              {...boxControlProps("cv-title", errors.title?.message)}
              className={boxControl}
            />
          </BoxField>
          <BoxField id="cv-format" label="Country format">
            <Select value={format} onValueChange={(v) => changeFormat(v as CvFormat)}>
              <SelectTrigger className={boxControl} {...boxControlProps("cv-format")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(CV_FORMATS) as [CvFormat, (typeof CV_FORMATS)[CvFormat]][]).map(([key, f]) => (
                  <SelectItem key={key} value={key}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </BoxField>
          <div>
            <p className="mb-2 text-xs font-medium text-secondary-text">Sections and order</p>
            <ul className="divide-y rounded-xl border">
              {order.map((key, i) => (
                <li key={key} className="flex items-center gap-2 px-3 py-2">
                  <span className="flex-1 text-sm font-medium text-primary-text">{CV_SECTIONS[key]}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => move(key, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${CV_SECTIONS[key]} up`}
                  >
                    <ArrowUp aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => move(key, 1)}
                    disabled={i === order.length - 1}
                    aria-label={`Move ${CV_SECTIONS[key]} down`}
                  >
                    <ArrowDown aria-hidden />
                  </Button>
                  <Switch
                    checked={!hidden.includes(key)}
                    onCheckedChange={(on) =>
                      form.setValue(
                        "content.hidden_sections",
                        on ? hidden.filter((h) => h !== key) : [...hidden, key],
                        { shouldDirty: true },
                      )
                    }
                    aria-label={`Show ${CV_SECTIONS[key]}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
          <h2 className="font-semibold text-primary-text">Profile</h2>
          <BoxField
            id="cv-summary"
            label="Profile summary"
            error={errors.content?.summary?.message}
            aside={<span className="text-[0.6875rem] text-secondary-text tabular-nums">{summary.length}/1200</span>}
          >
            <Textarea
              {...form.register("content.summary")}
              {...boxControlProps("cv-summary", errors.content?.summary?.message)}
              rows={4}
              className={cn(boxControl, "resize-y")}
            />
          </BoxField>
        </section>

        {(["experience", "education"] as const).map((list) =>
          cv.content[list].length === 0 ? null : (
            <section
              key={list}
              className="space-y-5 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-semibold text-primary-text">{CV_SECTIONS[list]}</h2>
                <Link
                  href={list === "experience" ? "/profile/edit#experience" : "/profile/edit#education"}
                  className="text-xs font-medium text-green-dark hover:underline"
                >
                  Change titles or dates in your profile
                </Link>
              </div>
              {cv.content[list].map((entry, index) => (
                <div key={entry.source_id} className="space-y-2 border-t pt-4 first:border-t-0 first:pt-0">
                  <p className="text-sm font-semibold text-primary-text">
                    {entry.title}{" "}
                    <span className="font-normal text-secondary-text">
                      · {entry.organisation} · {entry.dates}
                    </span>
                  </p>
                  <BulletsEditor
                    control={form.control}
                    list={list}
                    index={index}
                    heading={list === "experience" ? "What you did and achieved" : "Details"}
                  />
                </div>
              ))}
            </section>
          ),
        )}

        <section className="space-y-3 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
          <h2 className="font-semibold text-primary-text">Skills</h2>
          <p className="text-sm text-secondary-text">
            Choose which of your profile skills appear. To add a new one, add it to your profile first.
          </p>
          <Controller
            control={form.control}
            name="content.skills"
            render={({ field }) => (
              <ul className="flex flex-wrap gap-2">
                {profileSkills.map((skill) => {
                  const on = field.value.includes(skill);
                  return (
                    <li key={skill}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          field.onChange(on ? field.value.filter((s) => s !== skill) : [...field.value, skill])
                        }
                        className={cn(
                          "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
                          on
                            ? "border-green-action bg-soft-green text-green-dark dark:bg-green/15"
                            : "text-secondary-text hover:border-green/50",
                        )}
                      >
                        {on && <CheckCircle2 className="size-3.5" aria-hidden />}
                        {skill}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          />
        </section>

        <FormFooter
          pending={pending}
          submitLabel="Save CV"
          backHref={`/ai-cv/${cv.id}`}
          backLabel="Cancel"
          aboveTabs
          hint="Saved as this CV's version"
        />
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start" aria-label="Live checks">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-secondary-text uppercase">
          <Sparkles className="size-3.5 text-green-dark" aria-hidden />
          Live checks
        </p>
        <Checks control={form.control} keywords={cv.target_keywords} source={source} />
      </aside>
    </form>
  );
}
