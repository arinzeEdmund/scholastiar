"use client";

import { Check, Plus, X } from "lucide-react";
import { useId, useState, type KeyboardEvent, type ReactNode } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { flag } from "@/lib/flags";
import { cn } from "@/lib/utils";

import { BoxField, boxControl, InlineError } from "./box-field";

// Choice controls that share the contained-field look: tiles, chips, tags and country pickers.
// Group errors use InlineError (small icon + short message), never red borders.

const tileBase =
  "rounded-xl border border-input bg-card text-left shadow-xs transition-all hover:border-green/50 focus-visible:border-green-action focus-visible:ring-4 focus-visible:ring-green/15 focus-visible:outline-none dark:bg-white/[0.03]";
const tileOn = "border-green-action bg-soft-green/50 shadow-[0_0_0_3px_rgb(16_182_91/0.14)] dark:bg-green/10";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
}

/** Group label in the same small style as BoxField labels. */
export function GroupLabel({ id, children, hint }: { id: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <span id={id} className="text-xs font-medium text-secondary-text">
        {children}
      </span>
      {hint && <span className="text-[0.6875rem] text-secondary-text">{hint}</span>}
    </div>
  );
}

/** Single choice as tiles (radio group). */
export function ChoiceTiles<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  columns = 3,
  hint,
}: {
  label: string;
  options: ChoiceOption<T>[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  error?: string;
  columns?: 1 | 2 | 3 | 4;
  hint?: ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <GroupLabel id={`${id}-label`} hint={hint}>
        {label}
      </GroupLabel>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "grid gap-2",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-3",
          columns === 4 && "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(option.value)}
              className={cn(tileBase, "flex items-start gap-2.5 px-3.5 py-3", checked && tileOn)}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                  checked ? "border-green-action" : "border-subtle-text/60",
                )}
              >
                {checked && <span className="size-2 rounded-full bg-green-action" />}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-sm font-medium text-primary-text">
                  {option.icon}
                  {option.label}
                </span>
                {option.description && (
                  <span className="mt-0.5 block text-xs leading-snug text-secondary-text">{option.description}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <InlineError id={`${id}-error`} message={error} />
    </div>
  );
}

/** Multiple choice as toggle chips (checkbox group). */
export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  options: ChoiceOption<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  error?: string;
  hint?: ReactNode;
}) {
  const id = useId();
  const toggle = (option: T) =>
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  return (
    <div>
      <GroupLabel id={`${id}-label`} hint={hint}>
        {label}
      </GroupLabel>
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={error ? `${id}-error` : undefined}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const checked = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => toggle(option.value)}
              className={cn(
                tileBase,
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
                checked ? cn(tileOn, "text-primary-text") : "text-secondary-text",
              )}
            >
              {checked ? (
                <Check className="size-3.5 text-green-dark" strokeWidth={3} aria-hidden />
              ) : (
                <Plus className="size-3.5 text-subtle-text" aria-hidden />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
      <InlineError id={`${id}-error`} message={error} />
    </div>
  );
}

/** Large goal-style cards with a check (multiple choice). */
export function ChoiceCards<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: ChoiceOption<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <GroupLabel id={`${id}-label`}>{label}</GroupLabel>
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={error ? `${id}-error` : undefined}
        className="grid gap-2 sm:grid-cols-2"
      >
        {options.map((option) => {
          const checked = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => onChange(checked ? value.filter((v) => v !== option.value) : [...value, option.value])}
              className={cn(tileBase, "flex items-center gap-3 p-3.5", checked && tileOn)}
            >
              {option.icon && (
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    checked ? "bg-green-action text-white" : "bg-soft text-secondary-text dark:bg-white/5",
                  )}
                >
                  {option.icon}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-primary-text">{option.label}</span>
                {option.description && <span className="block text-xs text-secondary-text">{option.description}</span>}
              </span>
              <span
                aria-hidden
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-md border-2",
                  checked ? "border-green-action bg-green-action text-white" : "border-subtle-text/60",
                )}
              >
                {checked && <Check className="size-3" strokeWidth={3.5} />}
              </span>
            </button>
          );
        })}
      </div>
      <InlineError id={`${id}-error`} message={error} />
    </div>
  );
}

/** Free-text tags inside a box: type and press Enter (or comma) to add. Suggestions add in one tap. */
export function TagInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  suggestions = [],
  error,
  max = 20,
}: {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  error?: string;
  max?: number;
}) {
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const tag = raw.trim().replace(/,$/, "").trim();
    if (!tag || value.some((v) => v.toLowerCase() === tag.toLowerCase()) || value.length >= max) return;
    onChange([...value, tag]);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
      setDraft("");
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };
  const unused = suggestions.filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));

  return (
    <div>
      <BoxField id={id} label={label} error={error}>
        <div className="flex flex-wrap items-center gap-1.5 px-3.5 pt-1 pb-2.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-soft-green px-2.5 py-0.5 text-sm text-primary-text dark:bg-green/15"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v !== tag))}
                className="-mr-1 rounded-full p-0.5 text-secondary-text hover:bg-black/5 hover:text-primary-text dark:hover:bg-white/10"
                aria-label={`Remove ${tag}`}
              >
                <X className="size-3" aria-hidden />
              </button>
            </span>
          ))}
          <input
            id={id}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => {
              if (draft.trim()) {
                add(draft);
                setDraft("");
              }
            }}
            placeholder={value.length === 0 ? placeholder : "Add another"}
            aria-describedby={error ? `${id}-error` : undefined}
            className="min-w-32 flex-1 bg-transparent py-0.5 text-[0.95rem] text-primary-text outline-none placeholder:text-subtle-text/80"
          />
        </div>
      </BoxField>
      {unused.length > 0 && value.length < max && (
        <div className="mt-2 flex flex-wrap gap-1.5" aria-label={`Suggested ${label.toLowerCase()}`}>
          {unused.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-input px-2.5 py-0.5 text-xs text-secondary-text transition-colors hover:border-green/50 hover:text-primary-text"
            >
              <Plus className="size-3" aria-hidden />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface CountryOption {
  iso2: string;
  name: string;
}

/** One country, as a Select inside a box. */
export function CountrySelect({
  id,
  label,
  countries,
  value,
  onChange,
  error,
  placeholder = "Choose a country",
  allowNone = false,
}: {
  id: string;
  label: string;
  countries: CountryOption[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  allowNone?: boolean;
}) {
  return (
    <BoxField id={id} label={label} error={error}>
      <Select value={value || (allowNone ? "none" : "")} onValueChange={(v) => onChange(v === "none" ? "" : v)}>
        <SelectTrigger
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={boxControl}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {allowNone && <SelectItem value="none">Not set</SelectItem>}
          {countries.map((c) => (
            <SelectItem key={c.iso2} value={c.iso2}>
              <span aria-hidden>{flag(c.iso2)}</span> {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BoxField>
  );
}

/** Several countries: chips inside a box, plus a picker to add more. */
export function CountryMultiSelect({
  id,
  label,
  countries,
  value,
  onChange,
  error,
  max = 10,
  placeholder = "Add a country",
}: {
  id: string;
  label: string;
  countries: CountryOption[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  max?: number;
  placeholder?: string;
}) {
  const name = (code: string) => countries.find((c) => c.iso2 === code)?.name ?? code;
  const available = countries.filter((c) => !value.includes(c.iso2));
  return (
    <BoxField id={id} label={label} error={error}>
      <div className="flex flex-wrap items-center gap-1.5 px-3.5 pt-1 pb-2">
        {value.map((code) => (
          <span
            key={code}
            className="inline-flex items-center gap-1 rounded-full bg-soft-green px-2.5 py-0.5 text-sm text-primary-text dark:bg-green/15"
          >
            <span aria-hidden>{flag(code)}</span>
            {name(code)}
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v !== code))}
              className="-mr-1 rounded-full p-0.5 text-secondary-text hover:bg-black/5 hover:text-primary-text dark:hover:bg-white/10"
              aria-label={`Remove ${name(code)}`}
            >
              <X className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        {value.length < max && (
          <Select value="" onValueChange={(code) => onChange([...value, code])}>
            <SelectTrigger
              id={id}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              className="h-7 w-auto gap-1 border-0 bg-transparent px-1 text-sm text-secondary-text shadow-none hover:text-primary-text focus-visible:ring-0 data-[size=default]:h-7 dark:bg-transparent dark:hover:bg-transparent"
            >
              <Plus className="size-3.5" aria-hidden />
              <SelectValue placeholder={value.length === 0 ? placeholder : "Add"} />
            </SelectTrigger>
            <SelectContent>
              {available.map((c) => (
                <SelectItem key={c.iso2} value={c.iso2}>
                  <span aria-hidden>{flag(c.iso2)}</span> {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </BoxField>
  );
}
