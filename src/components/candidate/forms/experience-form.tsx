"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Lightbulb, Loader2, Plus, X } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { BoxField, boxControl, boxControlProps, InlineError } from "@/components/forms/box-field";
import { CountrySelect, TagInput, type CountryOption } from "@/components/forms/choice";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveExperience } from "@/lib/actions/candidate";
import { ACHIEVEMENT_STARTERS, coachAchievement } from "@/lib/candidate/achievement-coach";
import { EMPLOYMENT_TYPE, INDUSTRY_SUGGESTIONS } from "@/lib/candidate/labels";
import { cn } from "@/lib/utils";
import { experienceSchema, type ExperienceFormInput } from "@/lib/validation/candidate";

const TOOL_SUGGESTIONS = [
  "Excel",
  "Google Sheets",
  "Python",
  "SQL",
  "Power BI",
  "Canva",
  "Figma",
  "Salesforce",
  "Word",
];

const PASSED = { verb: "Action verb", number: "Has a number", result: "Shows a result", length: "Good length" };

/** One achievement line with live coaching underneath. */
function AchievementLine({
  index,
  value,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const checks = coachAchievement(value);
  const id = `achievement-${index}`;
  return (
    <li>
      <div className="flex items-stretch gap-2">
        <BoxField id={id} label={`Achievement ${index + 1}`} className="flex-1">
          <Textarea
            id={id}
            rows={2}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Cut report preparation from 5 days to 2 by automating data cleaning"
            className={cn(boxControl, "min-h-14 resize-y")}
          />
        </BoxField>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-auto w-10 shrink-0 rounded-xl text-secondary-text"
            onClick={onRemove}
            aria-label={`Remove achievement ${index + 1}`}
          >
            <X aria-hidden />
          </Button>
        )}
      </div>
      {checks.length > 0 && (
        <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 px-1" aria-label={`Tips for achievement ${index + 1}`}>
          {checks.map((check) => (
            <li
              key={check.key}
              className={cn(
                "flex items-center gap-1 text-[0.6875rem]",
                check.passed ? "text-green-dark" : "text-secondary-text",
              )}
            >
              {check.passed ? (
                <Check className="size-3" strokeWidth={3} aria-hidden />
              ) : (
                <Lightbulb className="size-3 text-warning" aria-hidden />
              )}
              {check.passed ? PASSED[check.key] : check.tip}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function ExperienceForm({
  id,
  defaults,
  countries,
  variant,
  onSaved,
  onCancel,
}: {
  id: string | null;
  defaults: ExperienceFormInput;
  countries: CountryOption[];
  /** "page": full-page editor with a sticky footer. "dialog": compact buttons. */
  variant: "page" | "dialog";
  onSaved: (id: string) => void;
  onCancel?: () => void;
}) {
  const form = useForm<ExperienceFormInput>({ resolver: zodResolver(experienceSchema), defaultValues: defaults });
  const { errors } = form.formState;
  const { pending, run } = useFormAction(form.setError);
  const isCurrent = useWatch({ control: form.control, name: "isCurrent" });

  const onSubmit = (values: ExperienceFormInput) =>
    run(
      () => saveExperience(id, values),
      { loading: "Saving experience…", success: id ? "Experience updated" : "Experience added" },
      (data) => onSaved(data.id),
    );

  const err = (name: keyof ExperienceFormInput) => errors[name]?.message as string | undefined;
  const text = (name: "title" | "company" | "city" | "industry", label: string, props = {}) => (
    <BoxField id={`exp-${name}`} label={label} error={err(name)}>
      <Input
        {...boxControlProps(`exp-${name}`, err(name))}
        className={boxControl}
        {...props}
        {...form.register(name)}
      />
    </BoxField>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        {text("title", "Your role", { placeholder: "e.g. Research assistant" })}
        {text("company", "Organisation", { placeholder: "Company, charity or university" })}
        <BoxField id="exp-type" label="Type">
          <Controller
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="exp-type" className={boxControl}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EMPLOYMENT_TYPE).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </BoxField>
        {text("industry", "Industry (optional)", { placeholder: "e.g. Healthcare", list: "industry-suggestions" })}
        <datalist id="industry-suggestions">
          {INDUSTRY_SUGGESTIONS.map((i) => (
            <option key={i} value={i} />
          ))}
        </datalist>
        <Controller
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <CountrySelect
              id="exp-country"
              label="Country (optional)"
              countries={countries}
              value={field.value}
              onChange={field.onChange}
              allowNone
            />
          )}
        />
        {text("city", "City (optional)")}
        <BoxField id="exp-start" label="Started" error={err("startDate")}>
          <Input
            {...boxControlProps("exp-start", err("startDate"))}
            type="month"
            className={boxControl}
            {...form.register("startDate")}
          />
        </BoxField>
        <BoxField id="exp-end" label={isCurrent ? "Ended (you still work here)" : "Ended"} error={err("endDate")}>
          <Input
            {...boxControlProps("exp-end", err("endDate"))}
            type="month"
            disabled={isCurrent}
            className={cn(boxControl, "disabled:opacity-40")}
            {...form.register("endDate")}
          />
        </BoxField>
      </div>
      <label className="mt-3 flex w-fit items-center gap-2 text-sm text-secondary-text">
        <Controller
          control={form.control}
          name="isCurrent"
          render={({ field }) => (
            <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
          )}
        />
        I work here now
      </label>

      <BoxField
        id="exp-responsibilities"
        label="What you did (optional)"
        error={err("responsibilities")}
        className="mt-4"
      >
        <Textarea
          {...boxControlProps("exp-responsibilities", err("responsibilities"))}
          rows={3}
          placeholder="Your main responsibilities, in a sentence or two."
          className={cn(boxControl, "min-h-20 resize-y")}
          {...form.register("responsibilities")}
        />
      </BoxField>

      <Controller
        control={form.control}
        name="achievements"
        render={({ field }) => {
          const items = field.value;
          const set = (next: string[]) => field.onChange(next);
          return (
            <div className="mt-5">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="text-xs font-medium text-secondary-text">What you achieved</span>
                <span className="text-[0.6875rem] text-secondary-text">Numbers make an application stand out</span>
              </div>
              <ul className="space-y-3">
                {items.map((value, index) => (
                  <AchievementLine
                    key={index}
                    index={index}
                    value={value}
                    onChange={(v) => set(items.map((item, i) => (i === index ? v : item)))}
                    onRemove={() => set(items.filter((_, i) => i !== index))}
                    canRemove={items.length > 1}
                  />
                ))}
              </ul>
              <InlineError message={err("achievements")} />
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {items.length < 8 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-green-dark"
                    onClick={() => set([...items, ""])}
                  >
                    <Plus aria-hidden />
                    Add achievement
                  </Button>
                )}
                <span className="text-[0.6875rem] text-secondary-text">Start from:</span>
                {ACHIEVEMENT_STARTERS.slice(0, 3).map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => {
                      const emptyIndex = items.findIndex((v) => !v.trim());
                      set(
                        emptyIndex >= 0 ? items.map((v, i) => (i === emptyIndex ? starter : v)) : [...items, starter],
                      );
                    }}
                    className="rounded-full border border-dashed border-input px-2 py-0.5 text-[0.6875rem] text-secondary-text transition-colors hover:border-green/50 hover:text-primary-text"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          );
        }}
      />

      <div className="mt-5">
        <Controller
          control={form.control}
          name="tools"
          render={({ field }) => (
            <TagInput
              id="exp-tools"
              label="Tools you used (optional)"
              value={field.value}
              onChange={field.onChange}
              placeholder="Type a tool and press Enter"
              suggestions={TOOL_SUGGESTIONS}
            />
          )}
        />
      </div>

      {variant === "page" ? (
        <FormFooter pending={pending} submitLabel="Save experience" aboveTabs backHref="/profile" backLabel="Cancel" />
      ) : (
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" className="h-10 rounded-xl" disabled={pending}>
            {pending && <Loader2 className="animate-spin" aria-hidden />}
            {id ? "Save changes" : "Add experience"}
          </Button>
        </div>
      )}
    </form>
  );
}
