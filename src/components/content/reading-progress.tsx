"use client";

import { useEffect, useState } from "react";

/** Thin bar under the site header showing how far through the article the reader is. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const update = () => {
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const done = total <= 0 ? 1 : Math.min(Math.max(-rect.top / total, 0), 1);
      setProgress(done);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-16 z-30 h-0.5 origin-left bg-green transition-transform duration-150"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
