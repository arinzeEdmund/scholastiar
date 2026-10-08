"use client";

import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Large search field that submits to /search. Press "/" anywhere on the page to focus it.
 */
export function SearchBox({
  defaultValue = "",
  placeholder = "Search guides, help and opportunity types…",
  autoFocus = false,
  className,
}: {
  defaultValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form action="/search" role="search" className={cn("relative", className)}>
      <label htmlFor="site-search" className="sr-only">
        Search Scholastiar.ai
      </label>
      <div className="flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-lg shadow-black/5 transition-shadow focus-within:border-green focus-within:ring-3 focus-within:ring-green/20 dark:shadow-black/40">
        <Search className="ml-2 size-5 shrink-0 text-secondary-text" aria-hidden />
        <input
          ref={inputRef}
          id="site-search"
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={100}
          className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-subtle-text"
        />
        <kbd className="hidden rounded-md border bg-soft px-2 py-0.5 font-mono text-xs text-secondary-text sm:inline">
          /
        </kbd>
        <Button type="submit" size="lg" className="shrink-0">
          Search
        </Button>
      </div>
    </form>
  );
}
