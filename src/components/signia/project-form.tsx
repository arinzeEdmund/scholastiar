"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { ConfirmDelete } from "@/components/candidate/confirm-delete";
import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { ChoiceTiles, TagInput } from "@/components/forms/choice";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SigniaProjectLink, SigniaProjectType } from "@/data/types";
import { deleteSigniaProject, saveSigniaProject } from "@/lib/actions/signia";
import { PROJECT_TYPES, VISIBILITY_LABELS } from "@/lib/signia/labels";
import { signiaProjectSchema, type SigniaProjectFormInput } from "@/lib/validation/signia";
import { cn } from "@/lib/utils";

const LINK_TYPES: Record<SigniaProjectLink["link_type"], string> = {
  github: "Code",
  demo: "Live demo",
  paper: "Paper",
  video: "Video",
  article: "Article",
  dataset: "Dataset",
  other: "Other",
};

function Area({
  id,
  label,
  hint,
  error,
  rows = 3,
  register,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  rows?: number;
  register: ReturnType<ReturnType<typeof useForm<SigniaProjectFormInput>>["register"]>;
}) {
  return (
    <BoxField id={id} label={label} error={error} hint={hint}>
      <Textarea {...register} {...boxControlProps(id, error)} rows={rows} className={cn(boxControl, "resize-y")} />
    </BoxField>
  );
}

export function SigniaProjectForm({
  id,
  defaults,
  skillSuggestions,
}: {
  id: string | null;
  defaults: SigniaProjectFormInput;
  skillSuggestions: string[];
}) {
  const router = useRouter();
  const form = useForm<SigniaProjectFormInput>({ resolver: zodResolver(signiaProjectSchema), defaultValues: defaults });
  const links = useFieldArray({ control: form.control, name: "links" });
  const { pending, run } = useFormAction<SigniaProjectFormInput>(form.setError);
  const { errors } = form.formState;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        run(
          () => saveSigniaProject(id, values),
          { loading: "Saving project…", success: id ? "Project saved" : "Project added" },
          () => {
            router.push("/signia");
            router.refresh();
          },
        ),
      )}
      className="space-y-6"
    >
      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <h2 className="font-semibold text-primary-text">The basics</h2>
        <BoxField id="pj-title" label="Title" error={errors.title?.message}>
          <Input
            {...form.register("title")}
            {...boxControlProps("pj-title", errors.title?.message)}
            className={boxControl}
          />
        </BoxField>
        <BoxField id="pj-summary" label="One-line summary" error={errors.summary?.message}>
          <Input
            {...form.register("summary")}
            {...boxControlProps("pj-summary", errors.summary?.message)}
            className={boxControl}
          />
        </BoxField>
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="project_type"
            render={({ field }) => (
              <BoxField id="pj-type" label="Type">
                <Select value={field.value} onValueChange={(v) => field.onChange(v as SigniaProjectType)}>
                  <SelectTrigger className={boxControl} {...boxControlProps("pj-type")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(PROJECT_TYPES) as [SigniaProjectType, string][]).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </BoxField>
            )}
          />
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <BoxField id="pj-status" label="Status">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={boxControl} {...boxControlProps("pj-status")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                  </SelectContent>
                </Select>
              </BoxField>
            )}
          />
          <BoxField id="pj-start" label="Started">
            <Input
              type="date"
              {...form.register("start_date", { setValueAs: (v) => v || null })}
              {...boxControlProps("pj-start")}
              className={boxControl}
            />
          </BoxField>
          <BoxField id="pj-end" label="Finished">
            <Input
              type="date"
              {...form.register("end_date", { setValueAs: (v) => v || null })}
              {...boxControlProps("pj-end")}
              className={boxControl}
            />
          </BoxField>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <h2 className="font-semibold text-primary-text">The story</h2>
        <p className="text-sm text-secondary-text">
          Problem → what you did → what changed. Reviewers remember results.
        </p>
        <Area
          id="pj-role"
          label="Your role and contribution"
          error={errors.role_description?.message}
          register={form.register("role_description")}
          rows={2}
        />
        <Area
          id="pj-problem"
          label="The problem"
          error={errors.problem_statement?.message}
          register={form.register("problem_statement")}
        />
        <Area
          id="pj-approach"
          label="What you did"
          error={errors.approach?.message}
          register={form.register("approach")}
          rows={4}
        />
        <Area
          id="pj-outcome"
          label="The result"
          hint="A real number or outcome if you have one — only what's true."
          error={errors.outcome?.message}
          register={form.register("outcome")}
        />
      </section>

      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <h2 className="font-semibold text-primary-text">Skills and links</h2>
        <Controller
          control={form.control}
          name="skills"
          render={({ field }) => (
            <TagInput
              id="pj-skills"
              max={12}
              label="Skills this project proves"
              value={field.value}
              onChange={field.onChange}
              suggestions={skillSuggestions}
              placeholder="Add a skill"
              error={errors.skills?.message}
            />
          )}
        />
        <div className="space-y-3">
          <p className="text-xs font-medium text-secondary-text">Links (code, paper, demo, video…)</p>
          {links.fields.map((link, index) => (
            <div key={link.id} className="grid gap-2 rounded-xl border p-3 sm:grid-cols-[9rem_1fr_1.4fr_auto]">
              <Controller
                control={form.control}
                name={`links.${index}.link_type`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-label="Link type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LINK_TYPES).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <BoxField id={`pj-link-label-${index}`} label="Label" error={errors.links?.[index]?.label?.message}>
                <Input
                  {...form.register(`links.${index}.label`)}
                  {...boxControlProps(`pj-link-label-${index}`)}
                  className={boxControl}
                />
              </BoxField>
              <BoxField id={`pj-link-url-${index}`} label="Link" error={errors.links?.[index]?.url?.message}>
                <Input
                  type="url"
                  inputMode="url"
                  {...form.register(`links.${index}.url`)}
                  {...boxControlProps(`pj-link-url-${index}`)}
                  className={boxControl}
                  placeholder="https://"
                />
              </BoxField>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="self-center"
                onClick={() => links.remove(index)}
                aria-label={`Remove link ${index + 1}`}
              >
                <Trash2 aria-hidden />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => links.append({ id: `new-${crypto.randomUUID()}`, link_type: "github", label: "", url: "" })}
            disabled={links.fields.length >= 8}
          >
            <Plus aria-hidden />
            Add a link
          </Button>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-xs sm:p-6 dark:bg-white/[0.03]">
        <Controller
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <ChoiceTiles
              label="Who can see this project"
              columns={3}
              value={field.value}
              onChange={field.onChange}
              options={Object.entries(VISIBILITY_LABELS).map(([value, v]) => ({
                value: value as SigniaProjectFormInput["visibility"],
                label: v.label,
                description: v.note,
              }))}
            />
          )}
        />
        {id && (
          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <p className="text-sm text-secondary-text">Delete this project from your portfolio.</p>
            <ConfirmDelete
              label={`Delete ${defaults.title}`}
              title="Delete this project?"
              description="It's removed from your portfolio. Media attached to it stays in your media library."
              action={() => deleteSigniaProject(id)}
              onDone={() => {
                router.push("/signia");
                router.refresh();
              }}
              successMessage="Project deleted"
            />
          </div>
        )}
      </section>

      <FormFooter
        pending={pending}
        submitLabel={id ? "Save project" : "Add project"}
        backHref="/signia"
        aboveTabs
        hint="Shown on your portfolio by visibility"
      />
    </form>
  );
}
