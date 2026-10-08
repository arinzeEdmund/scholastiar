"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Ban,
  BadgeCheck,
  BookOpen,
  Briefcase,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  MapPin,
  Minus,
  Plane,
  Plus,
  Rocket,
  School,
  ShieldCheck,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { BoxField, boxControl, boxControlProps, InlineError } from "@/components/forms/box-field";
import { CountryMultiSelect, CountrySelect, type CountryOption } from "@/components/forms/choice";
import { FormCard } from "@/components/forms/form-card";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PostStudyPermitType } from "@/data/types";
import { saveVisa } from "@/lib/actions/candidate";
import { formatDay, PERMIT_STATUS, STUDY_STATUS } from "@/lib/candidate/labels";
import { cn } from "@/lib/utils";
import { visaSchema, type VisaInput } from "@/lib/validation/candidate";

const DAY = 86_400_000;

/** Single choice as icon tiles. */
function IconChoice<T extends string>({
  label,
  value,
  onChange,
  options,
  error,
  columns = 3,
}: {
  label: string;
  value: T | "" | null | undefined;
  onChange: (value: T) => void;
  options: { value: T; label: string; text?: string; icon: LucideIcon }[];
  error?: string;
  columns?: 2 | 3;
}) {
  return (
    <div>
      <p id={`${label}-label`} className="mb-2 text-xs font-medium text-secondary-text">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={`${label}-label`}
        className={cn("grid gap-2", columns === 2 ? "grid-cols-2" : "sm:grid-cols-3")}
      >
        {options.map(({ value: v, label: optionLabel, text, icon: Icon }) => {
          const active = value === v;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(v)}
              className={cn(
                "group flex items-start gap-3 rounded-xl border border-input bg-card p-3 text-left shadow-xs transition-all hover:border-green/50 dark:bg-white/[0.03]",
                active &&
                  "border-green-action bg-soft-green/50 shadow-[0_0_0_3px_rgb(16_182_91/0.14)] dark:bg-green/10",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                  active
                    ? "bg-green-action text-white"
                    : "bg-soft text-secondary-text group-hover:text-green-dark dark:bg-white/5",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-primary-text">{optionLabel}</span>
                {text && <span className="mt-0.5 block text-xs leading-snug text-secondary-text">{text}</span>}
              </span>
            </button>
          );
        })}
      </div>
      <InlineError message={error} />
    </div>
  );
}

/** Course dates as a bar with today's position. */
function CourseTimeline({ start, end, today }: { start?: string; end?: string; today: number }) {
  if (!start || !end) return null;
  const a = new Date(`${start}T00:00:00Z`).getTime();
  const b = new Date(`${end}T00:00:00Z`).getTime();
  if (!(b > a)) return null;
  const progress = Math.min(1, Math.max(0, (today - a) / (b - a)));
  const months = Math.round((b - a) / (DAY * 30.4));
  const status =
    today < a
      ? `Starts in ${Math.ceil((a - today) / DAY)} days`
      : today > b
        ? "Course finished"
        : `${Math.max(1, Math.round((b - today) / (DAY * 30.4)))} months to go`;
  return (
    <div className="rounded-xl bg-soft px-4 py-3 dark:bg-white/[0.04]">
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-semibold text-primary-text">{months}-month course</span>
        <span className="font-medium text-green-dark">{status}</span>
      </div>
      <div className="relative mt-3 h-2 rounded-full bg-neutral-soft dark:bg-white/10">
        <div
          className="h-full rounded-full bg-linear-to-r from-green-action to-green"
          style={{ width: `${progress * 100}%` }}
        />
        {today >= a && today <= b && (
          <span
            className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-green-action shadow"
            style={{ left: `${progress * 100}%` }}
            aria-hidden
          />
        )}
      </div>
      <div className="mt-1.5 flex justify-between text-[0.6875rem] text-secondary-text">
        <span>{formatDay(start)}</span>
        <span>{formatDay(end)}</span>
      </div>
    </div>
  );
}

/** Weekly hours with − / + and quick picks. */
function HoursControl({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  const n = Number(value) || 0;
  const set = (next: number) => onChange(String(Math.min(60, Math.max(0, next))));
  return (
    <div>
      <p id="hours-label" className="mb-2 text-xs font-medium text-secondary-text">
        Weekly hour limit in term time
      </p>
      <div className="flex items-center gap-2 rounded-xl border border-input bg-card p-1.5 shadow-xs dark:bg-white/[0.03]">
        <button
          type="button"
          onClick={() => set(n - 1)}
          aria-label="One hour less"
          className="flex size-10 items-center justify-center rounded-lg bg-soft text-primary-text hover:bg-soft-green dark:bg-white/5"
        >
          <Minus className="size-4" aria-hidden />
        </button>
        <label className="flex flex-1 items-baseline justify-center gap-1.5">
          <Input
            id="termTimeHours"
            inputMode="numeric"
            aria-labelledby="hours-label"
            aria-invalid={Boolean(error)}
            value={value}
            placeholder="—"
            onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
            className="h-auto w-14 border-0 bg-transparent p-0 text-center text-2xl font-bold tabular-nums shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <span className="text-xs text-secondary-text">hours a week</span>
        </label>
        <button
          type="button"
          onClick={() => set(n + 1)}
          aria-label="One hour more"
          className="flex size-10 items-center justify-center rounded-lg bg-soft text-primary-text hover:bg-soft-green dark:bg-white/5"
        >
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {[10, 15, 20].map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => set(h)}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
              n === h
                ? "border-green-action bg-soft-green/60 text-green-dark dark:bg-green/15"
                : "border-input text-secondary-text hover:text-primary-text",
            )}
          >
            {h} hours
          </button>
        ))}
      </div>
      <InlineError message={error} />
    </div>
  );
}

export function VisaForm({
  defaults,
  countries,
  permitTypes,
  mode,
}: {
  defaults: VisaInput;
  countries: CountryOption[];
  permitTypes: PostStudyPermitType[];
  mode: "onboarding" | "profile";
}) {
  const router = useRouter();
  const form = useForm<VisaInput>({ resolver: zodResolver(visaSchema), defaultValues: defaults });
  const { errors } = form.formState;
  const { pending, run } = useFormAction(form.setError);
  const onboarding = mode === "onboarding";
  const plain = !onboarding;

  const [
    studyStatus,
    studyCountry,
    passportCountry,
    permitStatus,
    permitTypeId,
    permitExpiry,
    courseStart,
    courseEnd,
    hours,
    holidayWork,
    needsSponsorship,
    targets,
  ] = useWatch({
    control: form.control,
    name: [
      "studyStatus",
      "studyCountry",
      "passportCountry",
      "permitStatus",
      "permitTypeId",
      "permitExpiry",
      "courseStart",
      "courseEnd",
      "termTimeHours",
      "holidayWork",
      "needsSponsorship",
      "targetCountries",
    ],
  });
  const graduated = studyStatus === "graduated";
  const permitsHere = permitTypes.filter((p) => p.country_code === studyCountry);
  const selectedPermit = permitTypes.find((p) => p.id === permitTypeId);
  // Captured once on mount so render stays pure.
  const [today] = useState(() => Date.now());
  const permitDaysLeft = permitExpiry
    ? Math.ceil((new Date(`${permitExpiry}T00:00:00Z`).getTime() - today) / DAY)
    : null;

  const onSubmit = (values: VisaInput) =>
    run(
      () => saveVisa(values, onboarding),
      { loading: "Saving…", success: onboarding ? "Saved" : "Visa details updated" },
      (data) => {
        if (data.redirectTo) router.push(data.redirectTo);
        else router.refresh();
      },
    );

  const err = (name: keyof VisaInput) => errors[name]?.message as string | undefined;
  const date = (name: "courseStart" | "courseEnd" | "permitExpiry", label: string) => (
    <BoxField id={name} label={label} error={err(name)}>
      <Input {...boxControlProps(name, err(name))} type="date" className={boxControl} {...form.register(name)} />
    </BoxField>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className={plain ? "space-y-6" : "space-y-4"}>
      <p className="flex gap-2.5 rounded-xl border border-info/20 bg-info-soft/60 px-3.5 py-3 text-sm text-secondary-text dark:bg-info/10">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
        <span>
          Copy these from your own visa documents. We use them for your visa guidance and, on Pro, to label which jobs
          fit — we never decide your work rights, and this isn&apos;t legal advice.
        </span>
      </p>

      <FormCard
        plain={plain}
        icon={GraduationCap}
        title="Where you are in your studies"
        complete={Boolean(studyStatus)}
      >
        <Controller
          control={form.control}
          name="studyStatus"
          render={({ field }) => (
            <IconChoice
              label="Choose the one that fits today"
              value={field.value}
              onChange={field.onChange}
              error={err("studyStatus")}
              options={[
                {
                  value: "incoming",
                  label: STUDY_STATUS.incoming.label,
                  text: STUDY_STATUS.incoming.text,
                  icon: Plane,
                },
                {
                  value: "studying",
                  label: STUDY_STATUS.studying.label,
                  text: STUDY_STATUS.studying.text,
                  icon: BookOpen,
                },
                {
                  value: "graduated",
                  label: STUDY_STATUS.graduated.label,
                  text: STUDY_STATUS.graduated.text,
                  icon: GraduationCap,
                },
              ]}
            />
          )}
        />
      </FormCard>

      <FormCard
        plain={plain}
        icon={School}
        title="Your course"
        description="Where and what you study — from your offer or enrolment letter."
        complete={Boolean(passportCountry) && Boolean(studyCountry)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="passportCountry"
            render={({ field }) => (
              <CountrySelect
                id="passportCountry"
                label="Passport country"
                countries={countries}
                value={field.value}
                onChange={field.onChange}
                error={err("passportCountry")}
              />
            )}
          />
          <Controller
            control={form.control}
            name="studyCountry"
            render={({ field }) => (
              <CountrySelect
                id="studyCountry"
                label={graduated ? "Country you studied in" : "Country you study in"}
                countries={countries}
                value={field.value}
                onChange={field.onChange}
                error={err("studyCountry")}
              />
            )}
          />
          <BoxField id="institution" label="University or college (optional)" error={err("institution")}>
            <Input
              {...boxControlProps("institution", err("institution"))}
              className={boxControl}
              {...form.register("institution")}
            />
          </BoxField>
          <BoxField id="currentVisaStatus" label="Current visa or permit (optional)" error={err("currentVisaStatus")}>
            <Input
              {...boxControlProps("currentVisaStatus", err("currentVisaStatus"))}
              className={boxControl}
              placeholder={graduated ? "e.g. Graduate route" : "e.g. Student visa"}
              {...form.register("currentVisaStatus")}
            />
          </BoxField>
          {date("courseStart", "Course start (optional)")}
          {date("courseEnd", "Course end (optional)")}
        </div>
        <div className="mt-3">
          <CourseTimeline start={courseStart} end={courseEnd} today={today} />
        </div>
      </FormCard>

      {!graduated && (
        <FormCard
          plain={plain}
          icon={Briefcase}
          title="Work conditions on your study visa"
          description="On Pro, these decide which jobs we mark as fitting your visa hours."
          complete={Boolean(hours) && Boolean(holidayWork)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="termTimeHours"
              render={({ field }) => (
                <HoursControl value={field.value ?? ""} onChange={field.onChange} error={err("termTimeHours")} />
              )}
            />
            <Controller
              control={form.control}
              name="holidayWork"
              render={({ field }) => (
                <IconChoice
                  label="Full-time work in official holidays?"
                  columns={2}
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "yes", label: "Allowed", icon: Sun },
                    { value: "no", label: "Not allowed", icon: Ban },
                  ]}
                />
              )}
            />
          </div>
          <BoxField id="restrictions" label="Other conditions (optional)" error={err("restrictions")} className="mt-4">
            <Textarea
              {...boxControlProps("restrictions", err("restrictions"))}
              rows={2}
              placeholder="e.g. No self-employment"
              className={cn(boxControl, "min-h-14 resize-y")}
              {...form.register("restrictions")}
            />
          </BoxField>
        </FormCard>
      )}

      <FormCard
        plain={plain}
        icon={Rocket}
        title="After you graduate"
        description="Your post-study permit, and whether an employer will need to sponsor you."
        complete={Boolean(needsSponsorship)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <BoxField id="permitTypeId" label="Post-study permit">
            <Controller
              control={form.control}
              name="permitTypeId"
              render={({ field }) => (
                <Select value={field.value || "none"} onValueChange={(v) => field.onChange(v === "none" ? "" : v)}>
                  <SelectTrigger id="permitTypeId" className={boxControl}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {permitsHere.length ? "None or not sure" : "Choose your study country first"}
                    </SelectItem>
                    {permitsHere.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </BoxField>
          <BoxField id="permitStatus" label="Permit status">
            <Controller
              control={form.control}
              name="permitStatus"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="permitStatus" className={boxControl}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PERMIT_STATUS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </BoxField>
          {permitStatus === "holding" && date("permitExpiry", "Permit expiry date")}
          {permitStatus === "holding" && permitDaysLeft !== null && (
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm",
                permitDaysLeft < 180
                  ? "bg-warning-soft text-warning"
                  : "bg-soft-green/60 text-green-dark dark:bg-green/10",
              )}
            >
              <span className="text-2xl font-bold tabular-nums">{Math.max(0, Math.round(permitDaysLeft / 30.4))}</span>
              <span className="leading-tight">
                months left on your permit
                <span className="block text-xs opacity-80">Sponsored jobs should start before it ends.</span>
              </span>
            </div>
          )}
        </div>
        {selectedPermit?.official_url && (
          <a
            href={selectedPermit.official_url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-green-dark hover:underline"
          >
            Official guidance for {selectedPermit.name}
            <ExternalLink className="size-3" aria-hidden />
          </a>
        )}
        <div className="mt-4">
          <Controller
            control={form.control}
            name="needsSponsorship"
            render={({ field }) => (
              <IconChoice
                label="Will you need an employer to sponsor your work visa after studying?"
                value={field.value}
                onChange={field.onChange}
                error={err("needsSponsorship")}
                options={[
                  { value: "yes", label: "Yes", text: "I'll need sponsorship", icon: BadgeCheck },
                  { value: "no", label: "No", text: "I won't need it", icon: X },
                  { value: "unsure", label: "Not sure yet", text: "We'll show both", icon: HelpCircle },
                ]}
              />
            )}
          />
        </div>
      </FormCard>

      <FormCard
        plain={plain}
        icon={MapPin}
        title="Where you want to be"
        description="Countries you want to study or work in next."
        complete={(targets ?? []).length > 0}
      >
        <div className="space-y-3">
          <Controller
            control={form.control}
            name="targetCountries"
            render={({ field }) => (
              <CountryMultiSelect
                id="targetCountries"
                label="Countries you want to study or work in"
                countries={countries}
                value={field.value}
                onChange={field.onChange}
                error={err("targetCountries")}
              />
            )}
          />
          <Controller
            control={form.control}
            name="countriesLivedIn"
            render={({ field }) => (
              <CountryMultiSelect
                id="countriesLivedIn"
                label="Countries you've lived or worked in (optional)"
                countries={countries}
                value={field.value}
                onChange={field.onChange}
                max={15}
              />
            )}
          />
          <Controller
            control={form.control}
            name="relocation"
            render={({ field }) => (
              <IconChoice
                label="Open to relocating within a country for the right role?"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "yes", label: "Yes", icon: BadgeCheck },
                  { value: "maybe", label: "For the right role", icon: HelpCircle },
                  { value: "no", label: "No", icon: X },
                ]}
              />
            )}
          />
        </div>
      </FormCard>

      <FormFooter
        pending={pending}
        submitLabel={onboarding ? "Save and continue" : "Save changes"}
        continueArrow={onboarding}
        aboveTabs={!onboarding}
        backHref={onboarding ? "/onboarding/personal" : "/profile"}
        backLabel={onboarding ? "Back" : "Cancel"}
      />
    </form>
  );
}
