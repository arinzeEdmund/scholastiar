import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DevPageFrame } from "@/components/dev/dev-page-frame";
import { PageHeader, PageSection } from "@/components/layout/page-header";
import { Progress } from "@/components/ui/progress";
import { ROUTE_STAGES } from "@/config/route-stages";
import { READY_ROUTES } from "@/config/routes";

export const metadata: Metadata = { title: "Build status" };

const SHELLS = [
  { key: "public", name: "Public website", note: "Header, mobile menu, dark footer" },
  { key: "candidate", name: "Candidate", note: "Top nav, Opportunities menu, mobile bottom tabs" },
  { key: "employer", name: "Employer", note: "Sidebar workspace, Post a job action" },
  { key: "provider", name: "Provider", note: "Universities, funders, organisers" },
  { key: "forwarder", name: "Forwarder", note: "Apply For Me contracts" },
  { key: "office", name: "Office / agency", note: "Scholastiar offices and partner agencies" },
  { key: "admin", name: "Admin console", note: "Dark, dense operational sidebar" },
];

const UTILITY_PAGES = [
  { href: "/not-found", label: "Not found (404)" },
  { href: "/unauthorized", label: "Unauthorized (403)" },
  { href: "/server-error", label: "Server error (500)" },
  { href: "/maintenance", label: "Maintenance" },
  { href: "/offline", label: "Offline fallback" },
];

function stageSummary() {
  const stages = new Map<string, { total: number; ready: number }>();
  for (const [route, stage] of Object.entries(ROUTE_STAGES)) {
    const entry = stages.get(stage) ?? { total: 0, ready: 0 };
    entry.total += 1;
    if (READY_ROUTES.has(route)) entry.ready += 1;
    stages.set(stage, entry);
  }
  return [...stages.entries()];
}

export default function DevHome() {
  const stages = stageSummary();
  const total = stages.reduce((sum, [, s]) => sum + s.total, 0);
  const ready = stages.reduce((sum, [, s]) => sum + s.ready, 0);

  return (
    <DevPageFrame>
      <PageHeader
        eyebrow="Phase A · UI build"
        title="Build status"
        description="Every screen is built against mock data first. Open the dev panel (bottom-left) to switch persona, plan and screen state."
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          <PageSection
            title="Layout shells"
            description="The frames every screen sits in. Preview each one with a sample persona."
          >
            <ul className="grid gap-3 sm:grid-cols-2">
              {SHELLS.map((shell) => (
                <li key={shell.key}>
                  <Link
                    href={`/dev/shells/${shell.key}`}
                    className="group flex h-full items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-green"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-primary-text">{shell.name}</div>
                      <div className="mt-0.5 text-sm text-secondary-text">{shell.note}</div>
                    </div>
                    <ArrowRight className="size-4 text-secondary-text group-hover:text-green-dark" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </PageSection>

          <PageSection title="Utility pages">
            <ul className="divide-y rounded-lg border bg-card">
              {UTILITY_PAGES.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    prefetch={false}
                    className="flex items-center justify-between px-4 py-3 text-sm hover:bg-soft"
                  >
                    <span className="font-medium text-primary-text">{page.label}</span>
                    <span className="font-mono text-xs text-secondary-text">{page.href}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </PageSection>
        </div>

        <PageSection title="Screens by stage" description={`${ready} of ${total} routes built`}>
          <ol className="space-y-3 rounded-lg border bg-card p-4">
            {stages.map(([stage, s]) => {
              const done = s.ready === s.total;
              return (
                <li key={stage}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-1.5 font-medium text-primary-text">
                      {done && <CheckCircle2 className="size-4 text-green" aria-label="Complete" />}
                      {stage}
                    </span>
                    <span className="text-xs text-secondary-text tabular-nums">
                      {s.ready}/{s.total}
                    </span>
                  </div>
                  <Progress
                    value={(s.ready / s.total) * 100}
                    className="mt-1.5 h-1.5"
                    aria-label={`${stage} progress`}
                  />
                </li>
              );
            })}
          </ol>
        </PageSection>
      </div>
    </DevPageFrame>
  );
}
