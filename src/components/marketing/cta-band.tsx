import type { ReactNode } from "react";

/** Closing call to action on public pages: brand black lit by a green glow, with light beams and grain. */
export function CtaBand({ title, description, actions }: { title: string; description: string; actions: ReactNode }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grain overflow-hidden rounded-2xl aurora-dark text-white">
          <div className="flex flex-col items-start justify-between gap-6 beams p-8 sm:p-12 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
              <p className="mt-3 text-white/75">{description}</p>
            </div>
            <div className="flex flex-wrap gap-3">{actions}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
