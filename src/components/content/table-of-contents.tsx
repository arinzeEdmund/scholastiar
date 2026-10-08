"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * Sticky "On this page" navigation that highlights the section in view (scroll-spy).
 * Sections must have matching ids.
 */
export function TableOfContents({ items, title = "On this page" }: { items: TocItem[]; title?: string }) {
  const [active, setActive] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A section counts as current once it reaches the upper third of the viewport.
      { rootMargin: "-80px 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={title}>
      <p className="text-xs font-semibold tracking-wider text-secondary-text uppercase">{title}</p>
      <ol className="mt-3 space-y-1 border-l">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 border-transparent py-1 pl-3 text-sm text-secondary-text transition-colors hover:text-primary-text",
                active === item.id && "border-green font-medium text-primary-text",
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
