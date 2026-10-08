"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Award, Check, ClipboardPaste, FileText, GraduationCap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { BoxField, boxControl, boxControlProps, InlineError } from "@/components/forms/box-field";
import { ChipGroup, ChoiceTiles } from "@/components/forms/choice";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CvFormat, CvSectionKey, CvTone } from "@/data/types";
import { generateCv } from "@/lib/actions/cv";
import { cvGenerateSchema, type CvGenerateInput } from "@/lib/validation/cv";
import { cn } from "@/lib/utils";

export interface TargetOption {
  value: string;
  label: string;
  detail: string;
  saved: boolean;
}

const FORMAT_OPTIONS: { value: CvFormat; label: string; description: string }[] = [
  { value: "academic", label: "Academic CV", description: "Education first — for universities and scholarships" },
  { value: "uk_cv", label: "UK CV", description: "Two pages, no photo or date of birth" },
  { value: "eu_cv", label: "EU CV", description: "Europass-style, languages up front" },
  { value: "us_resume", label: "US resume", description: "One page, results first" },
  { value: "africa", label: "African regional", description: "Personal details and education early" },
  { value: "visa_employment", label: "Visa-conscious", description: "For work abroad, mobility clear" },
];

const TONES: { value: CvTone; label: string; description: string }[] = [
  { value: "concise", label: "Concise", description: "Short and direct" },
  { value: "warm", label: "Warm", description: "Personal and motivated" },
  { value: "formal", label: "Formal", description: "Classic and measured" },
];

const SECTIONS: { value: CvSectionKey; label: string }[] = [
  { value: "summary", label: "Profile" },
  { value: "education", label: "Education" },
  { value: "experience", label: "Experience" },
  { value: "skills", label: "Skills" },
  { value: "certifications", label: "Certifications" },
  { value: "languages", label: "Languages" },
];

const STEPS = [
  "Reading what they're looking for",
  "Choosing your most relevant experience",
  "Formatting for the country",
];

/** Generating overlay: the three steps the AI goes through, in plain words. */
function Generating() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 500);
    return () => clearInterval(timer);
  }, []);
  return (
    <div role="status" aria-live="polite" className="rounded-2xl border bg-card p-6 shadow-xs dark:bg-white/[0.03]">
      <p className="flex items-center gap-2 font-semibold text-primary-text">
        <Loader2 className="size-5 animate-spin text-green" aria-hidden />
        Building your CV from your profile…
      </p>
      <ol className="mt-4 space-y-2">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={cn("flex items-center gap-2 text-sm", index <= step ? "text-primary-text" : "text-subtle-text")}
          >
            {index < step ? (
              <Check className="size-4 text-green" aria-hidden />
            ) : (
              <span
                className={cn(
                  "size-4 rounded-full border-2",
                  index === step ? "border-green" : "border-subtle-text/40",
                )}
                aria-hidden
              />
            )}
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CvGenerateForm({
  programs,
  scholarships,
  skills,
  defaults,
}: {
  programs: TargetOption[];
  scholarships: TargetOption[];
  skills: string[];
  defaults: Pick<CvGenerateInput, "targetType" | "targetId" | "tone" | "format">;
}) {
  const router = useRouter();
  const form = useForm<CvGenerateInput>({
    resolver: zodResolver(cvGenerateSchema),
    defaultValues: {
      ...defaults,
      pasted: "",
      sections: SECTIONS.map((s) => s.value),
      strengths: [],
    },
  });
  const { pending, run } = useFormAction<CvGenerateInput>(form.setError);
  const targetType = useWatch({ control: form.control, name: "targetType" });
  const { errors } = form.formState;

  function onSubmit(values: CvGenerateInput) {
    run(
      () => generateCv(values),
      { loading: "Generating your CV…", success: "Your CV is ready" },
      ({ id }) => router.push(`/ai-cv/${id}`),
    );
  }

  if (pending) return <Generating />;

  const options = targetType === "program" ? programs : scholarships;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <h2 className="font-semibold text-primary-text">1. What is this CV for?</h2>
        <Controller
          control={form.control}
          name="targetType"
          render={({ field }) => (
            <ChoiceTiles
              label="Tailor it to"
              columns={4}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                form.setValue("targetId", undefined);
              }}
              options={[
                {
                  value: "program",
                  label: "Programme",
                  icon: <GraduationCap className="size-4 text-green-dark" aria-hidden />,
                },
                {
                  value: "scholarship",
                  label: "Scholarship",
                  icon: <Award className="size-4 text-green-dark" aria-hidden />,
                },
                {
                  value: "pasted",
                  label: "Description",
                  icon: <ClipboardPaste className="size-4 text-green-dark" aria-hidden />,
                },
                {
                  value: "general",
                  label: "General",
                  icon: <FileText className="size-4 text-green-dark" aria-hidden />,
                },
              ]}
            />
          )}
        />

        {(targetType === "program" || targetType === "scholarship") && (
          <Controller
            control={form.control}
            name="targetId"
            render={({ field }) => (
              <BoxField
                id="cv-target"
                label={targetType === "program" ? "Programme" : "Scholarship"}
                error={errors.targetId?.message}
              >
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger className={boxControl} {...boxControlProps("cv-target", errors.targetId?.message)}>
                    <SelectValue
                      placeholder={targetType === "program" ? "Choose a programme" : "Choose a scholarship"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {options.some((o) => o.saved) && (
                      <SelectGroup>
                        <SelectLabel>Your shortlist</SelectLabel>
                        {options
                          .filter((o) => o.saved)
                          .map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label} · {o.detail}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    )}
                    <SelectGroup>
                      <SelectLabel>All {targetType === "program" ? "programmes" : "scholarships"}</SelectLabel>
                      {options
                        .filter((o) => !o.saved)
                        .map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label} · {o.detail}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </BoxField>
            )}
          />
        )}

        {targetType === "pasted" && (
          <BoxField
            id="cv-pasted"
            label="Description"
            error={errors.pasted?.message}
            hint="Paste a programme, scholarship or job description. We use it to choose and order your experience — never to add claims."
          >
            <Textarea
              {...form.register("pasted")}
              {...boxControlProps("cv-pasted", errors.pasted?.message)}
              rows={7}
              className={cn(boxControl, "min-h-36 resize-y")}
              placeholder="Paste the full description here…"
            />
          </BoxField>
        )}
      </section>

      <section className="space-y-5 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <h2 className="font-semibold text-primary-text">2. Format and tone</h2>
        <Controller
          control={form.control}
          name="format"
          render={({ field }) => (
            <ChoiceTiles
              label="Country format"
              columns={3}
              value={field.value}
              onChange={field.onChange}
              options={FORMAT_OPTIONS}
            />
          )}
        />
        <Controller
          control={form.control}
          name="tone"
          render={({ field }) => (
            <ChoiceTiles
              label="Tone of your profile summary"
              columns={3}
              value={field.value}
              onChange={field.onChange}
              options={TONES}
            />
          )}
        />
      </section>

      <section className="space-y-5 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <h2 className="font-semibold text-primary-text">3. What to include</h2>
        <Controller
          control={form.control}
          name="sections"
          render={({ field }) => (
            <ChipGroup
              label="Sections"
              options={SECTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.sections?.message}
            />
          )}
        />
        {skills.length > 0 ? (
          <Controller
            control={form.control}
            name="strengths"
            render={({ field }) => (
              <div>
                <ChipGroup
                  label="Strengths to put first (up to 3)"
                  options={skills.map((s) => ({ value: s, label: s }))}
                  value={field.value}
                  onChange={(next) => field.onChange(next.slice(0, 3))}
                  hint={`${field.value.length} of 3`}
                />
                <InlineError message={errors.strengths?.message} />
              </div>
            )}
          />
        ) : (
          <p className="text-sm text-secondary-text">Add skills to your profile to choose which ones lead.</p>
        )}
      </section>

      <FormFooter
        pending={pending}
        submitLabel="Generate CV"
        backHref="/ai-cv"
        aboveTabs
        hint="Built only from your profile"
      />
    </form>
  );
}
