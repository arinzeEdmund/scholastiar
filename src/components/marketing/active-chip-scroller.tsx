"use client";

import { useEffect } from "react";

/** Scrolls the active filter (aria-current="page") into view inside a horizontally scrolling bar. */
export function ActiveChipScroller({ label }: { label: string }) {
  useEffect(() => {
    const active = document.querySelector<HTMLElement>(`nav[aria-label="${label}"] [aria-current="page"]`);
    active?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [label]);
  return null;
}
