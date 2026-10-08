"use client";

import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { CATALOGUE_SORTS, STUDY_MODES, type CatalogueSort } from "@/config/catalogue";
import type { CatalogueFacets } from "@/data/repositories/catalogue";
import type { StudyMode } from "@/data/types";
import { countryName } from "@/lib/catalogue/links";
import { activeFilterCount, catalogueSearch, EMPTY_QUERY, type CatalogueQuery } from "@/lib/catalogue/query";
import { flag } from "@/lib/flags";
import { cn } from "@/lib/utils";

const TUITION_STEPS = [3000, 5000, 8000, 12000];

/** Navigates to a new catalogue state without jumping the page, and reports pending. */
function useCatalogueNavigation(hash: string) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const go = (next: CatalogueQuery) =>
    startTransition(() => router.replace(`${pathname}${catalogueSearch(next)}${hash}`, { scroll: false }));
  return { go, pending };
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t pt-4 first:border-t-0 first:pt-0">
      <legend className="mb-2.5 text-sm font-semibold text-primary-text">{title}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

function Option({
  id,
  checked,
  onChange,
  children,
  count,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="flex-1 cursor-pointer text-sm font-normal text-secondary-text">
        {children}
      </Label>
      {count !== undefined && <span className="text-xs text-subtle-text tabular-nums">{count}</span>}
    </div>
  );
}

function ToggleRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal text-secondary-text">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function FilterFields({
  query,
  facets,
  go,
  idPrefix,
}: {
  query: CatalogueQuery;
  facets: CatalogueFacets;
  go: (q: CatalogueQuery) => void;
  idPrefix: string;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;
  return (
    <div className="space-y-4">
      <Group title="Country">
        {facets.countries.map(({ code, count }) => (
          <Option
            key={code}
            id={id(`country-${code}`)}
            checked={query.countries.includes(code)}
            onChange={() => go({ ...query, countries: toggle(query.countries, code) })}
            count={count}
          >
            <span aria-hidden>{flag(code)}</span> {countryName(code)}
          </Option>
        ))}
      </Group>
      <Group title="Subject">
        {facets.fields.map(({ slug, name, count }) => (
          <Option
            key={slug}
            id={id(`field-${slug}`)}
            checked={query.fields.includes(slug)}
            onChange={() => go({ ...query, fields: toggle(query.fields, slug) })}
            count={count}
          >
            {name}
          </Option>
        ))}
      </Group>
      <Group title="How you study">
        {(Object.entries(STUDY_MODES) as [StudyMode, string][]).map(([mode, label]) => (
          <Option
            key={mode}
            id={id(`mode-${mode}`)}
            checked={query.modes.includes(mode)}
            onChange={() => go({ ...query, modes: toggle(query.modes, mode) })}
          >
            {label}
          </Option>
        ))}
      </Group>
      <Group title="Taught in">
        {facets.languages.map(({ name, count }) => (
          <Option
            key={name}
            id={id(`lang-${name}`)}
            checked={query.languages.includes(name)}
            onChange={() => go({ ...query, languages: toggle(query.languages, name) })}
            count={count}
          >
            {name}
          </Option>
        ))}
      </Group>
      <Group title="Tuition per year">
        <Select
          value={query.maxTuitionUsd ? String(query.maxTuitionUsd) : "any"}
          onValueChange={(value) => go({ ...query, maxTuitionUsd: value === "any" ? null : Number(value) })}
        >
          <SelectTrigger className="w-full" aria-label="Maximum tuition per year">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any amount</SelectItem>
            {TUITION_STEPS.map((step) => (
              <SelectItem key={step} value={String(step)}>
                Up to ${step.toLocaleString("en-US")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Group>
      <Group title="More">
        <ToggleRow
          id={id("funded")}
          label="Fully funded only"
          checked={query.fundedOnly}
          onChange={() => go({ ...query, fundedOnly: !query.fundedOnly })}
        />
        <ToggleRow
          id={id("open")}
          label="Open for applications"
          checked={query.openOnly}
          onChange={() => go({ ...query, openOnly: !query.openOnly })}
        />
        <ToggleRow
          id={id("verified")}
          label="Verified by the university"
          checked={query.verifiedOnly}
          onChange={() => go({ ...query, verifiedOnly: !query.verifiedOnly })}
        />
      </Group>
    </div>
  );
}

/** Desktop sidebar filters. */
export function FilterPanel({
  query,
  facets,
  hash = "",
}: {
  query: CatalogueQuery;
  facets: CatalogueFacets;
  hash?: string;
}) {
  const { go, pending } = useCatalogueNavigation(hash);
  return (
    <aside aria-label="Filters" className="rounded-2xl border bg-card p-4 dark:bg-white/[0.03]" aria-busy={pending}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-primary-text">
          <SlidersHorizontal className="size-4 text-green-dark" aria-hidden />
          Filters
          {pending && <Loader2 className="size-3.5 animate-spin text-subtle-text" aria-label="Updating results" />}
        </h2>
        {activeFilterCount(query) > 0 && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => go({ ...EMPTY_QUERY, tab: query.tab, q: query.q, sort: query.sort })}
          >
            Clear all
          </Button>
        )}
      </div>
      <FilterFields query={query} facets={facets} go={go} idPrefix="panel" />
    </aside>
  );
}

/** Phone and tablet: filters in a sheet. */
export function FilterSheetButton({
  query,
  facets,
  hash = "",
}: {
  query: CatalogueQuery;
  facets: CatalogueFacets;
  hash?: string;
}) {
  const { go, pending } = useCatalogueNavigation(hash);
  const count = activeFilterCount(query);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="rounded-xl">
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <SlidersHorizontal aria-hidden />}
          Filters
          {count > 0 && (
            <span className="rounded-full bg-green-action px-1.5 text-xs text-white tabular-nums">{count}</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Results update as you choose.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">
          <FilterFields query={query} facets={facets} go={go} idPrefix="sheet" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Search box for the catalogue: programme, subject or university. */
export function CatalogueSearchBox({ query, hash = "" }: { query: CatalogueQuery; hash?: string }) {
  const { go, pending } = useCatalogueNavigation(hash);
  const [text, setText] = useState(query.q);
  function submit(event: FormEvent) {
    event.preventDefault();
    go({ ...query, q: text.trim() });
  }
  return (
    <form role="search" onSubmit={submit} className="relative flex-1">
      <Label htmlFor="catalogue-q" className="sr-only">
        Search programmes, subjects and universities
      </Label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle-text"
        aria-hidden
      />
      <Input
        id="catalogue-q"
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Programme, subject or university"
        className="h-11 rounded-xl pr-24 pl-10"
      />
      <Button
        type="submit"
        size="sm"
        className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg"
        disabled={pending}
      >
        {pending && <Loader2 className="animate-spin" aria-hidden />}
        Search
      </Button>
    </form>
  );
}

/** Sort menu. "Best fit" is only offered to signed-in students. */
export function SortSelect({
  query,
  canSortByFit,
  hash = "",
}: {
  query: CatalogueQuery;
  canSortByFit: boolean;
  hash?: string;
}) {
  const { go } = useCatalogueNavigation(hash);
  const options = (Object.entries(CATALOGUE_SORTS) as [CatalogueSort, string][]).filter(
    ([key]) => key !== "fit" || canSortByFit,
  );
  return (
    <Select value={query.sort} onValueChange={(value) => go({ ...query, sort: value as CatalogueSort })}>
      <SelectTrigger className="w-full rounded-xl sm:w-52" aria-label="Sort results">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** One removable chip per active filter, plus "Clear all". */
export function ActiveFilterChips({
  query,
  facets,
  hash = "",
}: {
  query: CatalogueQuery;
  facets: CatalogueFacets;
  hash?: string;
}) {
  const { go } = useCatalogueNavigation(hash);
  const chips: { key: string; label: string; next: CatalogueQuery }[] = [
    ...(query.q ? [{ key: "q", label: `“${query.q}”`, next: { ...query, q: "" } }] : []),
    ...query.countries.map((c) => ({
      key: `c-${c}`,
      label: countryName(c),
      next: { ...query, countries: query.countries.filter((x) => x !== c) },
    })),
    ...query.fields.map((f) => ({
      key: `f-${f}`,
      label: facets.fields.find((x) => x.slug === f)?.name ?? f,
      next: { ...query, fields: query.fields.filter((x) => x !== f) },
    })),
    ...query.modes.map((m) => ({
      key: `m-${m}`,
      label: STUDY_MODES[m],
      next: { ...query, modes: query.modes.filter((x) => x !== m) },
    })),
    ...query.languages.map((l) => ({
      key: `l-${l}`,
      label: `Taught in ${l}`,
      next: { ...query, languages: query.languages.filter((x) => x !== l) },
    })),
    ...(query.maxTuitionUsd
      ? [
          {
            key: "max",
            label: `Up to $${query.maxTuitionUsd.toLocaleString("en-US")} a year`,
            next: { ...query, maxTuitionUsd: null },
          },
        ]
      : []),
    ...(query.fundedOnly ? [{ key: "funded", label: "Fully funded", next: { ...query, fundedOnly: false } }] : []),
    ...(query.openOnly ? [{ key: "open", label: "Open now", next: { ...query, openOnly: false } }] : []),
    ...(query.verifiedOnly ? [{ key: "verified", label: "Verified", next: { ...query, verifiedOnly: false } }] : []),
  ];
  if (chips.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={() => go(chip.next)}
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-full border border-green/30 bg-soft-green px-2.5 text-xs font-medium text-green-dark transition-colors hover:border-green dark:bg-green/10",
            )}
            aria-label={`Remove filter: ${chip.label}`}
          >
            {chip.label}
            <X className="size-3" aria-hidden />
          </button>
        </li>
      ))}
      <li>
        <Button
          variant="link"
          size="sm"
          className="h-7 px-1"
          onClick={() => go({ ...EMPTY_QUERY, tab: query.tab, sort: query.sort })}
        >
          Clear all
        </Button>
      </li>
    </ul>
  );
}
