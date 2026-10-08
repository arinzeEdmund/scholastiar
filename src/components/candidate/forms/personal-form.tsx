"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe2, Languages, MessageCircle, Phone, Plus, Quote, Sparkles, UserRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { BoxField, boxControl, boxControlProps, InlineError } from "@/components/forms/box-field";
import { CountrySelect, type CountryOption } from "@/components/forms/choice";
import { FormCard } from "@/components/forms/form-card";
import { FormFooter } from "@/components/forms/form-footer";
import { useFormAction } from "@/components/forms/use-form-action";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { CommunicationStyle, LanguageLevel } from "@/data/types";
import { savePersonal } from "@/lib/actions/candidate";
import { COMMUNICATION_STYLE, LANGUAGE_LEVEL } from "@/lib/candidate/labels";
import { cn } from "@/lib/utils";
import { personalSchema, type PersonalInput } from "@/lib/validation/candidate";

const LANGUAGE_SUGGESTIONS = [
  "English",
  "French",
  "Arabic",
  "Spanish",
  "Portuguese",
  "German",
  "Russian",
  "Mandarin",
  "Hindi",
  "Swahili",
  "Yoruba",
  "Igbo",
  "Hausa",
];
const LEVELS = Object.keys(LANGUAGE_LEVEL) as LanguageLevel[];

/** Basic → Native as one tap-to-choose bar. */
function LevelBar({
  value,
  onChange,
  language,
}: {
  value: LanguageLevel;
  onChange: (v: LanguageLevel) => void;
  language: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={`Level for ${language || "this language"}`}
      className="grid grid-cols-4 gap-1 rounded-xl bg-soft p-1 dark:bg-white/5"
    >
      {LEVELS.map((level, i) => {
        const active = value === level;
        const reached = LEVELS.indexOf(value) >= i;
        return (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(level)}
            className={cn(
              "relative min-w-0 rounded-lg px-0.5 py-1.5 text-[0.625rem] leading-tight font-medium tracking-tight transition-all sm:text-[0.6875rem]",
              active
                ? "bg-card text-green-dark shadow-sm ring-1 ring-green/30 dark:bg-white/10"
                : reached
                  ? "text-primary-text"
                  : "text-secondary-text hover:text-primary-text",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "mx-auto mb-1 block h-1 w-6 rounded-full",
                reached ? "bg-green" : "bg-neutral-soft dark:bg-white/15",
              )}
            />
            {LANGUAGE_LEVEL[level]}
          </button>
        );
      })}
    </div>
  );
}

export function PersonalForm({
  defaults,
  countries,
  mode,
  stickyFooter = true,
}: {
  defaults: PersonalInput;
  countries: CountryOption[];
  mode: "onboarding" | "profile";
  stickyFooter?: boolean;
}) {
  const router = useRouter();
  const form = useForm<PersonalInput>({ resolver: zodResolver(personalSchema), defaultValues: defaults });
  const { errors } = form.formState;
  const languages = useFieldArray({ control: form.control, name: "languages" });
  const { pending, run } = useFormAction(form.setError);
  const onboarding = mode === "onboarding";
  // Inside the profile editor the form already sits in a card, so sections render without card chrome.
  const plain = !onboarding;

  const [fullName, nationality, currentCountry, phone, whatsapp, whatsappOptIn, languageValues, tone] = useWatch({
    control: form.control,
    name: [
      "fullName",
      "nationality",
      "currentCountry",
      "phone",
      "whatsapp",
      "whatsappOptIn",
      "languages",
      "communicationStyle",
    ],
  });
  const used = new Set((languageValues ?? []).map((l) => l.name.trim().toLowerCase()));

  const onSubmit = (values: PersonalInput) =>
    run(
      () => savePersonal(values, onboarding),
      { loading: "Saving…", success: onboarding ? "Saved" : "Personal details updated" },
      (data) => {
        if (data.redirectTo) router.push(data.redirectTo);
        else router.refresh();
      },
    );

  const text = (
    name: "fullName" | "preferredName" | "phone" | "currentCity" | "whatsapp",
    label: string,
    props = {},
  ) => (
    <BoxField id={name} label={label} error={errors[name]?.message}>
      <Input
        {...boxControlProps(name, errors[name]?.message)}
        className={boxControl}
        {...props}
        {...form.register(name)}
      />
    </BoxField>
  );

  const addLanguage = (name = "") => {
    const empty = languageValues.findIndex((l) => !l.name.trim());
    if (name && empty >= 0) form.setValue(`languages.${empty}.name`, name, { shouldDirty: true });
    else languages.append({ name, level: "conversational" });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className={plain ? "space-y-6" : "space-y-4"}>
      <FormCard
        plain={plain}
        icon={UserRound}
        title="Your identity"
        description="Use the name on your passport so applications match your documents."
        complete={(fullName ?? "").trim().length >= 2}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {text("fullName", "Full name", { autoComplete: "name", placeholder: "As it appears on your passport" })}
          {text("preferredName", "Preferred name (optional)", { placeholder: "What should we call you?" })}
          <BoxField id="dateOfBirth" label="Date of birth (optional)" error={errors.dateOfBirth?.message}>
            <Input
              {...boxControlProps("dateOfBirth", errors.dateOfBirth?.message)}
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              className={boxControl}
              {...form.register("dateOfBirth")}
            />
          </BoxField>
        </div>
      </FormCard>

      <FormCard
        plain={plain}
        icon={Globe2}
        title="Where you're from"
        description="Your passport country and where you live today."
        complete={Boolean(nationality) && Boolean(currentCountry)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <CountrySelect
                id="nationality"
                label="Nationality (passport)"
                countries={countries}
                value={field.value}
                onChange={field.onChange}
                error={errors.nationality?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="currentCountry"
            render={({ field }) => (
              <CountrySelect
                id="currentCountry"
                label="Country you live in now"
                countries={countries}
                value={field.value}
                onChange={field.onChange}
                error={errors.currentCountry?.message}
              />
            )}
          />
          {text("currentCity", "City (optional)", { autoComplete: "address-level2" })}
        </div>
      </FormCard>

      <FormCard
        plain={plain}
        icon={Phone}
        title="How we reach you"
        description="Email always works. WhatsApp gets you updates faster."
        complete={Boolean(phone) || (Boolean(whatsapp) && whatsappOptIn)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {text("phone", "Phone (optional)", { type: "tel", autoComplete: "tel", placeholder: "+234 801 555 0100" })}
          <div>
            {text("whatsapp", "WhatsApp number", {
              type: "tel",
              autoComplete: "tel",
              placeholder: "+234 801 555 0100",
            })}
            {phone && phone !== whatsapp && (
              <button
                type="button"
                onClick={() => form.setValue("whatsapp", phone, { shouldDirty: true, shouldValidate: true })}
                className="mt-1.5 px-1 text-xs font-medium text-green-dark hover:underline"
              >
                Same as my phone number
              </button>
            )}
          </div>
        </div>
        <label
          className={cn(
            "mt-3 flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors",
            whatsappOptIn
              ? "border-green/40 bg-soft-green/40 dark:bg-green/10"
              : "border-input bg-card dark:bg-white/[0.03]",
          )}
        >
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
              whatsappOptIn ? "bg-green-action text-white" : "bg-soft text-secondary-text dark:bg-white/5",
            )}
          >
            <MessageCircle className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 text-sm leading-snug">
            <span className="block font-medium text-primary-text">Send me updates on WhatsApp</span>
            <span className="block text-xs text-secondary-text">
              Payments, deadlines and application news from Scholastiar&apos;s official account.
            </span>
          </span>
          <Controller
            control={form.control}
            name="whatsappOptIn"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Send me updates on WhatsApp" />
            )}
          />
        </label>
      </FormCard>

      <FormCard
        plain={plain}
        icon={Languages}
        title="Languages you speak"
        description="Employers often filter by language — include every one you can work in."
        complete={(languageValues ?? []).some((l) => l.name.trim())}
      >
        <ul className="space-y-2.5">
          {languages.fields.map((field, index) => (
            <li key={field.id} className="rounded-xl border border-input bg-card p-2.5 dark:bg-white/[0.02]">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="flex items-stretch gap-2 sm:w-44 sm:shrink-0">
                  <BoxField
                    id={`language-${index}`}
                    label="Language"
                    error={errors.languages?.[index]?.name?.message}
                    className="flex-1"
                  >
                    <Input
                      {...boxControlProps(`language-${index}`, errors.languages?.[index]?.name?.message)}
                      className={boxControl}
                      placeholder="e.g. English"
                      {...form.register(`languages.${index}.name`)}
                    />
                  </BoxField>
                  <button
                    type="button"
                    onClick={() => languages.remove(index)}
                    disabled={languages.fields.length === 1}
                    aria-label={`Remove language ${index + 1}`}
                    className="flex w-9 shrink-0 items-center justify-center rounded-xl text-secondary-text transition-colors hover:bg-soft hover:text-danger disabled:opacity-30 sm:hidden dark:hover:bg-white/5"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <Controller
                    control={form.control}
                    name={`languages.${index}.level`}
                    render={({ field: level }) => (
                      <LevelBar
                        value={level.value}
                        onChange={level.onChange}
                        language={languageValues?.[index]?.name ?? ""}
                      />
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => languages.remove(index)}
                  disabled={languages.fields.length === 1}
                  aria-label={`Remove language ${index + 1}`}
                  className="hidden size-9 shrink-0 items-center justify-center rounded-xl text-secondary-text transition-colors hover:bg-soft hover:text-danger disabled:opacity-30 sm:flex dark:hover:bg-white/5"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <InlineError message={errors.languages?.message ?? errors.languages?.root?.message} />
        {languages.fields.length < 10 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => addLanguage()}
              className="inline-flex items-center gap-1 rounded-full bg-green-action px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-green-hover"
            >
              <Plus className="size-3.5" aria-hidden />
              Add a language
            </button>
            {LANGUAGE_SUGGESTIONS.filter((l) => !used.has(l.toLowerCase()))
              .slice(0, 6)
              .map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => addLanguage(language)}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-input px-2.5 py-1 text-xs text-secondary-text transition-colors hover:border-green/50 hover:text-primary-text"
                >
                  <Plus className="size-3" aria-hidden />
                  {language}
                </button>
              ))}
          </div>
        )}
      </FormCard>

      <FormCard
        plain={plain}
        icon={Sparkles}
        title="Your application voice"
        description="The AI writes your CV lines and answers in this tone. You can change it any time."
        complete
      >
        <Controller
          control={form.control}
          name="communicationStyle"
          render={({ field }) => (
            <div
              role="radiogroup"
              aria-label="How should your applications sound?"
              className="grid gap-2 sm:grid-cols-3"
            >
              {(Object.keys(COMMUNICATION_STYLE) as CommunicationStyle[]).map((style) => {
                const active = field.value === style;
                return (
                  <button
                    key={style}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => field.onChange(style)}
                    className={cn(
                      "rounded-xl border border-input bg-card px-3.5 py-3 text-left shadow-xs transition-all hover:border-green/50 dark:bg-white/[0.03]",
                      active &&
                        "border-green-action bg-soft-green/50 shadow-[0_0_0_3px_rgb(16_182_91/0.14)] dark:bg-green/10",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-primary-text">
                        {COMMUNICATION_STYLE[style].label}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                          active ? "border-green-action" : "border-subtle-text/60",
                        )}
                      >
                        {active && <span className="size-2 rounded-full bg-green-action" />}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-secondary-text">{COMMUNICATION_STYLE[style].text}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
        <figure
          key={tone}
          className="mt-3 flex animate-guide-in gap-3 rounded-xl bg-soft px-4 py-3 dark:bg-white/[0.04]"
        >
          <Quote className="mt-0.5 size-4 shrink-0 text-green-dark" aria-hidden />
          <div>
            <figcaption className="text-[0.6875rem] font-semibold tracking-wide text-secondary-text uppercase">
              How it sounds
            </figcaption>
            <blockquote className="mt-0.5 text-sm text-primary-text italic">
              {COMMUNICATION_STYLE[tone ?? "concise"].example}
            </blockquote>
          </div>
        </figure>
      </FormCard>

      <FormFooter
        pending={pending}
        submitLabel={onboarding ? "Save and continue" : "Save changes"}
        continueArrow={onboarding}
        aboveTabs={!onboarding}
        sticky={stickyFooter}
        backHref={onboarding ? "/onboarding" : "/profile"}
        backLabel={onboarding ? "Back" : "Cancel"}
      />
    </form>
  );
}
