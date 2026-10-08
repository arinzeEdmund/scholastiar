"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, GraduationCap, Loader2, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { ConfirmDelete } from "@/components/candidate/confirm-delete";
import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { CountrySelect, type CountryOption } from "@/components/forms/choice";
import { useFormAction } from "@/components/forms/use-form-action";
import { EmptyState } from "@/components/states/empty-state";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { EducationRecord, WorkExperience } from "@/data/types";
import { deleteEducation, deleteExperience, saveEducation } from "@/lib/actions/candidate";
import { DEGREE_LEVEL, EMPLOYMENT_TYPE, formatRange, labelFor } from "@/lib/candidate/labels";
import { cn } from "@/lib/utils";
import { educationSchema, type EducationFormInput } from "@/lib/validation/candidate";

import { educationDefaults, experienceDefaults } from "./defaults";
import { ExperienceForm } from "./experience-form";

const dialogClass = "max-h-[90dvh] overflow-y-auto sm:max-w-2xl";

function EducationForm({
  record,
  countries,
  onSaved,
  onCancel,
}: {
  record?: EducationRecord;
  countries: CountryOption[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const form = useForm<EducationFormInput>({
    resolver: zodResolver(educationSchema),
    defaultValues: educationDefaults(record),
  });
  const { errors } = form.formState;
  const { pending, run } = useFormAction(form.setError);
  const isCurrent = useWatch({ control: form.control, name: "isCurrent" });
  const err = (name: keyof EducationFormInput) => errors[name]?.message as string | undefined;

  const onSubmit = (values: EducationFormInput) =>
    run(
      () => saveEducation(record?.id ?? null, values),
      { loading: "Saving…", success: record ? "Education updated" : "Education added" },
      onSaved,
    );

  const text = (name: "institution" | "qualification" | "field" | "grade", label: string, props = {}) => (
    <BoxField id={`edu-${name}`} label={label} error={err(name)}>
      <Input
        {...boxControlProps(`edu-${name}`, err(name))}
        className={boxControl}
        {...props}
        {...form.register(name)}
      />
    </BoxField>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        {text("institution", "University, college or school")}
        <Controller
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <CountrySelect
              id="edu-country"
              label="Country (optional)"
              countries={countries}
              value={field.value}
              onChange={field.onChange}
              allowNone
            />
          )}
        />
        <BoxField id="edu-level" label="Level" error={err("degreeLevel")}>
          <Controller
            control={form.control}
            name="degreeLevel"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger {...boxControlProps("edu-level", err("degreeLevel"))} className={boxControl}>
                  <SelectValue placeholder="Choose a level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DEGREE_LEVEL).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </BoxField>
        {text("qualification", "Qualification", { placeholder: "e.g. BSc Microbiology" })}
        {text("field", "Subject", { placeholder: "e.g. Microbiology" })}
        {text("grade", "Grade (optional)", { placeholder: "e.g. 2:1, 3.6 GPA, Distinction" })}
        <BoxField id="edu-start" label="Started (optional)" error={err("startDate")}>
          <Input
            {...boxControlProps("edu-start", err("startDate"))}
            type="month"
            className={boxControl}
            {...form.register("startDate")}
          />
        </BoxField>
        <BoxField id="edu-end" label={isCurrent ? "Expected to finish" : "Finished (optional)"} error={err("endDate")}>
          <Input
            {...boxControlProps("edu-end", err("endDate"))}
            type="month"
            className={boxControl}
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
        I&apos;m studying this now (or about to start)
      </label>
      <BoxField id="edu-description" label="Highlights (optional)" error={err("description")} className="mt-4">
        <Textarea
          {...boxControlProps("edu-description", err("description"))}
          rows={2}
          placeholder="Projects, awards, relevant modules"
          className={cn(boxControl, "min-h-14 resize-y")}
          {...form.register("description")}
        />
      </BoxField>
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" className="h-10 rounded-xl" disabled={pending}>
          {pending && <Loader2 className="animate-spin" aria-hidden />}
          {record ? "Save changes" : "Add education"}
        </Button>
      </div>
    </form>
  );
}

function EntryCard({
  icon: Icon,
  title,
  subtitle,
  meta,
  children,
  actions,
}: {
  icon: typeof Briefcase;
  title: string;
  subtitle: string;
  meta: (string | null)[];
  children?: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5 rounded-2xl border bg-card p-4 shadow-xs dark:bg-white/[0.03]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-soft-green text-green-dark ring-1 ring-green/15">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-primary-text">{title}</p>
            <p className="text-sm text-secondary-text">{subtitle}</p>
          </div>
          <div className="-mt-1 -mr-1 flex shrink-0 items-center">{actions}</div>
        </div>
        <p className="mt-1 text-xs text-secondary-text">{meta.filter(Boolean).join(" · ")}</p>
        {children}
      </div>
    </li>
  );
}

export function EducationEditor({ records, countries }: { records: EducationRecord[]; countries: CountryOption[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<EducationRecord | "new" | null>(null);
  const close = () => setEditing(null);
  const country = (code: string | null) => countries.find((c) => c.iso2 === code)?.name ?? null;

  return (
    <div>
      {records.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education added yet"
          description="Add your degrees, diplomas and the course you're starting. The AI uses these in every application."
          action={
            <Button type="button" onClick={() => setEditing("new")}>
              <Plus aria-hidden />
              Add education
            </Button>
          }
        />
      ) : (
        <>
          <ul className="space-y-3">
            {records.map((record) => (
              <EntryCard
                key={record.id}
                icon={GraduationCap}
                title={record.qualification_name}
                subtitle={record.institution_name}
                meta={[
                  labelFor(DEGREE_LEVEL, record.degree_level),
                  formatRange(record.start_date, record.end_date, false),
                  record.is_current ? "Current" : null,
                  country(record.country_code),
                  record.grade,
                ]}
                actions={
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-secondary-text"
                      onClick={() => setEditing(record)}
                      aria-label={`Edit ${record.qualification_name}`}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <ConfirmDelete
                      label={`Delete ${record.qualification_name}`}
                      title="Delete this qualification?"
                      description={`${record.qualification_name} at ${record.institution_name} will be removed from your profile.`}
                      action={() => deleteEducation(record.id)}
                      onDone={() => router.refresh()}
                      successMessage="Education deleted"
                    />
                  </>
                }
              />
            ))}
          </ul>
          <Button type="button" variant="outline" className="mt-3 rounded-xl" onClick={() => setEditing("new")}>
            <Plus aria-hidden />
            Add education
          </Button>
        </>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "Add education" : "Edit education"}</DialogTitle>
            <DialogDescription>
              Degrees, diplomas, certificates and courses you&apos;re about to start.
            </DialogDescription>
          </DialogHeader>
          {editing !== null && (
            <EducationForm
              record={editing === "new" ? undefined : editing}
              countries={countries}
              onCancel={close}
              onSaved={() => {
                close();
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ExperienceEditor({
  records,
  countries,
  detailLinks = false,
}: {
  records: WorkExperience[];
  countries: CountryOption[];
  /** Profile pages link "Edit" to the full-page editor instead of the dialog. */
  detailLinks?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<WorkExperience | "new" | null>(null);
  const close = () => setEditing(null);

  const addButton = detailLinks ? (
    <Button asChild variant={records.length === 0 ? "default" : "outline"} className="rounded-xl">
      <Link href="/profile/experience/new">
        <Plus aria-hidden />
        Add experience
      </Link>
    </Button>
  ) : (
    <Button
      type="button"
      variant={records.length === 0 ? "default" : "outline"}
      className="rounded-xl"
      onClick={() => setEditing("new")}
    >
      <Plus aria-hidden />
      Add experience
    </Button>
  );

  return (
    <div>
      {records.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience added yet"
          description="Jobs, internships, placements, national service and volunteering all count."
          action={addButton}
        />
      ) : (
        <>
          <ul className="space-y-3">
            {records.map((record) => (
              <EntryCard
                key={record.id}
                icon={Briefcase}
                title={record.job_title}
                subtitle={record.company_name}
                meta={[
                  labelFor(EMPLOYMENT_TYPE, record.employment_type),
                  formatRange(record.start_date, record.end_date, record.is_current),
                  record.city,
                ]}
                actions={
                  <>
                    {detailLinks ? (
                      <Button asChild variant="ghost" size="icon" className="size-8 text-secondary-text">
                        <Link href={`/profile/experience/${record.id}`} aria-label={`Edit ${record.job_title}`}>
                          <Pencil className="size-4" aria-hidden />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-secondary-text"
                        onClick={() => setEditing(record)}
                        aria-label={`Edit ${record.job_title}`}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                    )}
                    <ConfirmDelete
                      label={`Delete ${record.job_title}`}
                      title="Delete this experience?"
                      description={`${record.job_title} at ${record.company_name} will be removed from your profile.`}
                      action={() => deleteExperience(record.id)}
                      onDone={() => router.refresh()}
                      successMessage="Experience deleted"
                    />
                  </>
                }
              >
                {record.achievements.length > 0 ? (
                  <ul className="mt-2 space-y-1 text-sm text-primary-text/90">
                    {record.achievements.slice(0, 2).map((a) => (
                      <li key={a} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-green" aria-hidden />
                        {a}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs font-medium text-warning">Add an achievement to make this stand out.</p>
                )}
              </EntryCard>
            ))}
          </ul>
          <div className="mt-3">{addButton}</div>
        </>
      )}

      {!detailLinks && (
        <Dialog open={editing !== null} onOpenChange={(open) => !open && close()}>
          <DialogContent className={dialogClass}>
            <DialogHeader>
              <DialogTitle>{editing === "new" ? "Add experience" : "Edit experience"}</DialogTitle>
              <DialogDescription>
                What you did and what changed because of you. Numbers help employers see the scale.
              </DialogDescription>
            </DialogHeader>
            {editing !== null && (
              <ExperienceForm
                id={editing === "new" ? null : editing.id}
                defaults={experienceDefaults(editing === "new" ? null : editing)}
                countries={countries}
                variant="dialog"
                onCancel={close}
                onSaved={() => {
                  close();
                  router.refresh();
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
