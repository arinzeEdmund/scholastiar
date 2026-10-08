"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Award, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { BoxField, boxControl, boxControlProps, BoxGroup, InlineError } from "@/components/forms/box-field";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SkillLevel, SkillType } from "@/data/types";
import { saveSkills } from "@/lib/actions/candidate";
import { SKILL_LEVEL, SKILL_TYPE } from "@/lib/candidate/labels";
import { cn } from "@/lib/utils";
import { skillsSchema, type SkillsInput } from "@/lib/validation/candidate";

const SUGGESTIONS: { name: string; type: SkillType }[] = [
  { name: "Excel", type: "tool" },
  { name: "Data analysis", type: "technical" },
  { name: "Customer service", type: "soft" },
  { name: "Report writing", type: "soft" },
  { name: "Project coordination", type: "soft" },
  { name: "Python", type: "tool" },
  { name: "SQL", type: "tool" },
  { name: "Research", type: "domain" },
  { name: "Public speaking", type: "soft" },
  { name: "Teamwork", type: "soft" },
  { name: "Social media", type: "technical" },
  { name: "Cash handling", type: "technical" },
];

const LEVELS = Object.keys(SKILL_LEVEL) as SkillLevel[];

/** Four-step level picker: tap a step to set the level. */
function LevelPicker({
  value,
  onChange,
  skill,
}: {
  value: SkillLevel;
  onChange: (v: SkillLevel) => void;
  skill: string;
}) {
  const index = LEVELS.indexOf(value);
  return (
    <div role="radiogroup" aria-label={`Level for ${skill}`} className="flex items-center gap-2">
      <div className="flex gap-1">
        {LEVELS.map((level, i) => (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={value === level}
            aria-label={SKILL_LEVEL[level]}
            onClick={() => onChange(level)}
            className={cn(
              "h-2 w-6 rounded-full transition-colors",
              i <= index ? "bg-green" : "bg-neutral-soft hover:bg-green/40 dark:bg-white/10",
            )}
          />
        ))}
      </div>
      <span className="w-20 text-xs text-secondary-text">{SKILL_LEVEL[value]}</span>
    </div>
  );
}

export function SkillsForm({ defaults, mode }: { defaults: SkillsInput; mode: "onboarding" | "profile" }) {
  const router = useRouter();
  const form = useForm<SkillsInput>({ resolver: zodResolver(skillsSchema), defaultValues: defaults });
  const { errors } = form.formState;
  const skills = useFieldArray({ control: form.control, name: "skills" });
  const certifications = useFieldArray({ control: form.control, name: "certifications" });
  const { pending, run } = useFormAction(form.setError);
  const onboarding = mode === "onboarding";

  const [draft, setDraft] = useState("");
  const [draftType, setDraftType] = useState<SkillType>("technical");
  const has = (name: string) => skills.fields.some((s) => s.name.toLowerCase() === name.trim().toLowerCase());
  const add = (name: string, type: SkillType) => {
    if (!name.trim() || has(name) || skills.fields.length >= 50) return;
    skills.append({ name: name.trim(), type, level: "intermediate" });
  };

  const onSubmit = (values: SkillsInput) =>
    run(
      () => saveSkills(values, onboarding),
      { loading: "Saving…", success: onboarding ? "Saved" : "Skills updated" },
      (data) => {
        if (data.redirectTo) router.push(data.redirectTo);
        else router.refresh();
      },
    );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-secondary-text">Add a skill</span>
        <span className="text-[0.6875rem] text-secondary-text">{skills.fields.length} added · aim for 5 or more</span>
      </div>
      <div className="flex gap-2">
        <BoxGroup className="flex flex-1 divide-x divide-y-0">
          <BoxField bare id="new-skill" label="Skill" className="flex-1">
            <Input
              id="new-skill"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add(draft, draftType);
                  setDraft("");
                }
              }}
              placeholder="e.g. Data analysis"
              className={boxControl}
            />
          </BoxField>
          <BoxField bare id="new-skill-type" label="Type" className="w-36 sm:w-48">
            <Select value={draftType} onValueChange={(v) => setDraftType(v as SkillType)}>
              <SelectTrigger id="new-skill-type" className={boxControl}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SKILL_TYPE).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </BoxField>
        </BoxGroup>
        <Button
          type="button"
          className="h-auto rounded-xl px-4"
          onClick={() => {
            add(draft, draftType);
            setDraft("");
          }}
          disabled={!draft.trim()}
        >
          <Plus aria-hidden />
          Add
        </Button>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Suggested skills">
        {SUGGESTIONS.filter((s) => !has(s.name))
          .slice(0, 9)
          .map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => add(s.name, s.type)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-input px-2.5 py-0.5 text-xs text-secondary-text transition-colors hover:border-green/50 hover:text-primary-text"
            >
              <Plus className="size-3" aria-hidden />
              {s.name}
            </button>
          ))}
      </div>

      {skills.fields.length > 0 && (
        <ul className="mt-5 divide-y overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
          {skills.fields.map((skill, index) => (
            <li key={skill.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-primary-text">{skill.name}</p>
                <p className="text-[0.6875rem] text-secondary-text">{SKILL_TYPE[skill.type]}</p>
              </div>
              <Controller
                control={form.control}
                name={`skills.${index}.level`}
                render={({ field }) => <LevelPicker value={field.value} onChange={field.onChange} skill={skill.name} />}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-secondary-text"
                onClick={() => skills.remove(index)}
                aria-label={`Remove ${skill.name}`}
              >
                <X className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <InlineError message={errors.skills?.message ?? errors.skills?.root?.message} />

      <div className="mt-8 border-t pt-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-primary-text">
          <Award className="size-4 text-green-dark" aria-hidden />
          Certifications <span className="text-sm font-normal text-secondary-text">(optional)</span>
        </h2>
        <p className="mt-0.5 text-sm text-secondary-text">Courses and credentials with an issuer.</p>
        {certifications.fields.length > 0 && (
          <ul className="mt-4 space-y-3">
            {certifications.fields.map((cert, index) => {
              const e = errors.certifications?.[index];
              return (
                <li key={cert.id} className="flex items-stretch gap-2">
                  <div className="grid flex-1 gap-2 sm:grid-cols-[1.4fr_1fr_0.8fr]">
                    <BoxField id={`cert-${index}-name`} label="Name" error={e?.name?.message}>
                      <Input
                        {...boxControlProps(`cert-${index}-name`, e?.name?.message)}
                        className={boxControl}
                        {...form.register(`certifications.${index}.name`)}
                      />
                    </BoxField>
                    <BoxField id={`cert-${index}-issuer`} label="Issuer" error={e?.issuer?.message}>
                      <Input
                        {...boxControlProps(`cert-${index}-issuer`, e?.issuer?.message)}
                        className={boxControl}
                        {...form.register(`certifications.${index}.issuer`)}
                      />
                    </BoxField>
                    <BoxField id={`cert-${index}-date`} label="Issued" error={e?.issueDate?.message}>
                      <Input
                        {...boxControlProps(`cert-${index}-date`, e?.issueDate?.message)}
                        type="month"
                        className={boxControl}
                        {...form.register(`certifications.${index}.issueDate`)}
                      />
                    </BoxField>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-auto w-10 shrink-0 rounded-xl text-secondary-text"
                    onClick={() => certifications.remove(index)}
                    aria-label={`Remove certification ${index + 1}`}
                  >
                    <X aria-hidden />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
        {certifications.fields.length < 20 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3 text-green-dark"
            onClick={() => certifications.append({ name: "", issuer: "", issueDate: "", url: "" })}
          >
            <Plus aria-hidden />
            Add a certification
          </Button>
        )}
      </div>

      <FormFooter
        pending={pending}
        submitLabel={onboarding ? "Save and continue" : "Save changes"}
        continueArrow={onboarding}
        aboveTabs={!onboarding}
        backHref={onboarding ? "/onboarding/experience" : "/profile"}
        backLabel={onboarding ? "Back" : "Cancel"}
      />
    </form>
  );
}
