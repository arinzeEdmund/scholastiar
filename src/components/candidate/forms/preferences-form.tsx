"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Award, Briefcase, GraduationCap, Plane } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";

import { BoxField, boxControl, boxControlProps, BoxGroup } from "@/components/forms/box-field";
import { ChipGroup, ChoiceCards, CountryMultiSelect, TagInput, type CountryOption } from "@/components/forms/choice";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CandidateGoal, StudentJobType, WorkMode } from "@/data/types";
import { savePreferences } from "@/lib/actions/candidate";
import { CURRENCIES, GOALS, INDUSTRY_SUGGESTIONS, STUDENT_JOB_TYPES, WORK_MODES } from "@/lib/candidate/labels";
import { cn } from "@/lib/utils";
import { preferencesSchema, type PreferencesInput } from "@/lib/validation/candidate";

const GOAL_ICONS: Record<CandidateGoal, React.ReactNode> = {
  study: <GraduationCap className="size-4" aria-hidden />,
  funding: <Award className="size-4" aria-hidden />,
  student_jobs: <Briefcase className="size-4" aria-hidden />,
  post_study_jobs: <Plane className="size-4" aria-hidden />,
};

const ROLE_SUGGESTIONS = [
  "Research assistant",
  "Data analyst",
  "Customer service assistant",
  "Retail assistant",
  "Student ambassador",
  "Software developer",
  "Marketing assistant",
  "Healthcare assistant",
];

export function PreferencesForm({
  defaults,
  countries,
  mode,
  visaHourLimit,
}: {
  defaults: PreferencesInput;
  countries: CountryOption[];
  mode: "onboarding" | "profile";
  /** From the visa profile, to warn when preferred hours exceed it. */
  visaHourLimit: number | null;
}) {
  const router = useRouter();
  const form = useForm<PreferencesInput>({ resolver: zodResolver(preferencesSchema), defaultValues: defaults });
  const { errors } = form.formState;
  const { pending, run } = useFormAction(form.setError);
  const onboarding = mode === "onboarding";
  const [goals, maxHours] = useWatch({ control: form.control, name: ["goals", "maxWeeklyHours"] });
  const wantsJobs = goals.includes("student_jobs") || goals.includes("post_study_jobs");
  const overLimit =
    visaHourLimit !== null && maxHours !== undefined && maxHours !== "" && Number(maxHours) > visaHourLimit;

  const onSubmit = (values: PreferencesInput) =>
    run(
      () => savePreferences(values, onboarding),
      { loading: "Saving…", success: onboarding ? "Saved" : "Preferences updated" },
      (data) => {
        if (data.redirectTo) router.push(data.redirectTo);
        else router.refresh();
      },
    );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Controller
        control={form.control}
        name="goals"
        render={({ field }) => (
          <ChoiceCards
            label="What are you looking for? Choose all that apply."
            value={field.value}
            onChange={field.onChange}
            error={errors.goals?.message}
            options={(Object.keys(GOALS) as CandidateGoal[]).map((goal) => ({
              value: goal,
              label: GOALS[goal].label,
              description: GOALS[goal].text,
              icon: GOAL_ICONS[goal],
            }))}
          />
        )}
      />

      <Controller
        control={form.control}
        name="targetCountries"
        render={({ field }) => (
          <CountryMultiSelect
            id="pref-countries"
            label="Countries you're aiming for"
            countries={countries}
            value={field.value}
            onChange={field.onChange}
            error={errors.targetCountries?.message}
          />
        )}
      />

      {wantsJobs && (
        <div className="space-y-5 border-t pt-6">
          <h2 className="text-base font-semibold text-primary-text">Work you want</h2>
          <Controller
            control={form.control}
            name="targetRoles"
            render={({ field }) => (
              <TagInput
                id="pref-roles"
                label="Roles you'd like"
                value={field.value}
                onChange={field.onChange}
                placeholder="Type a role and press Enter"
                suggestions={ROLE_SUGGESTIONS}
                max={10}
              />
            )}
          />
          <Controller
            control={form.control}
            name="industries"
            render={({ field }) => (
              <TagInput
                id="pref-industries"
                label="Industries (optional)"
                value={field.value}
                onChange={field.onChange}
                placeholder="Type an industry and press Enter"
                suggestions={INDUSTRY_SUGGESTIONS}
                max={12}
              />
            )}
          />

          {goals.includes("student_jobs") && (
            <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
              <Controller
                control={form.control}
                name="studentJobTypes"
                render={({ field }) => (
                  <ChipGroup
                    label="Student job types"
                    value={field.value}
                    onChange={field.onChange}
                    options={(Object.keys(STUDENT_JOB_TYPES) as StudentJobType[]).map((t) => ({
                      value: t,
                      label: STUDENT_JOB_TYPES[t],
                    }))}
                  />
                )}
              />
              <div>
                <BoxField id="pref-hours" label="Most hours a week in term" error={errors.maxWeeklyHours?.message}>
                  <Input
                    {...boxControlProps("pref-hours", errors.maxWeeklyHours?.message)}
                    inputMode="numeric"
                    placeholder={visaHourLimit ? String(visaHourLimit) : "e.g. 15"}
                    className={boxControl}
                    {...form.register("maxWeeklyHours")}
                  />
                </BoxField>
                {visaHourLimit !== null && (
                  <p className={cn("mt-1.5 px-1 text-[0.6875rem]", overLimit ? "text-warning" : "text-secondary-text")}>
                    {overLimit
                      ? `More than the ${visaHourLimit} hours on your visa — jobs above it will be flagged.`
                      : `Your visa allows ${visaHourLimit} hours a week in term.`}
                  </p>
                )}
              </div>
            </div>
          )}

          <Controller
            control={form.control}
            name="workModes"
            render={({ field }) => (
              <ChipGroup
                label="Where you'd work"
                value={field.value}
                onChange={field.onChange}
                options={(Object.keys(WORK_MODES) as WorkMode[]).map((m) => ({ value: m, label: WORK_MODES[m] }))}
              />
            )}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <span className="mb-2 block text-xs font-medium text-secondary-text">Minimum pay (optional)</span>
              <BoxGroup className="flex divide-x divide-y-0">
                <BoxField bare id="pref-pay" label="Amount" error={errors.payMin?.message} className="flex-1">
                  <Input
                    {...boxControlProps("pref-pay", errors.payMin?.message)}
                    inputMode="decimal"
                    placeholder="e.g. 12"
                    className={boxControl}
                    {...form.register("payMin")}
                  />
                </BoxField>
                <BoxField bare id="pref-currency" label="Currency" className="w-24">
                  <Controller
                    control={form.control}
                    name="payCurrency"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="pref-currency" className={boxControl}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </BoxField>
                <BoxField bare id="pref-period" label="Per" className="w-24">
                  <Controller
                    control={form.control}
                    name="payPeriod"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="pref-period" className={boxControl}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hour">Hour</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </BoxField>
              </BoxGroup>
            </div>
            <div>
              <span className="mb-2 block text-xs font-medium text-secondary-text">Availability</span>
              <BoxField id="pref-start" label="Earliest start (optional)" error={errors.earliestStart?.message}>
                <Input
                  {...boxControlProps("pref-start", errors.earliestStart?.message)}
                  type="month"
                  className={boxControl}
                  {...form.register("earliestStart")}
                />
              </BoxField>
            </div>
          </div>
        </div>
      )}

      <FormFooter
        pending={pending}
        submitLabel={onboarding ? "Save and continue" : "Save changes"}
        continueArrow={onboarding}
        aboveTabs={!onboarding}
        backHref={onboarding ? "/onboarding/skills" : "/profile"}
        backLabel={onboarding ? "Back" : "Cancel"}
      />
    </form>
  );
}
