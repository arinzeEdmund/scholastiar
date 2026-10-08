import { ArrowRight, Bookmark, Download, FileText, Plus, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { DevPageFrame } from "@/components/dev/dev-page-frame";
import { FormControlsDemo, OverlaysDemo, ProfileBasicsForm, PwaDemo, ToastsDemo } from "@/components/dev/gallery-demos";
import { ApplyWorkspaceSection, CatalogueExplorer, VisitorCards } from "@/components/dev/gallery-opportunities";
import { StatusBadge } from "@/components/feedback/status-badge";
import { PageHeader, PageSection } from "@/components/layout/page-header";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ListSkeleton, LoadingState } from "@/components/states/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { repos } from "@/data";
import { parseCatalogueQuery } from "@/lib/catalogue/query";
import { safeLoad } from "@/lib/safe-load";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Component gallery" };

const SECTIONS = [
  ["colours", "Colours"],
  ["typography", "Typography"],
  ["buttons", "Buttons"],
  ["badges", "Badges & status"],
  ["forms", "Forms"],
  ["data", "Data layer"],
  ["cards", "Cards, tabs & tables"],
  ["opportunity-card", "Opportunity cards"],
  ["apply-workspace", "Apply workspace"],
  ["overlays", "Overlays"],
  ["feedback", "Feedback"],
  ["states", "Empty, error & loading"],
  ["pwa", "PWA"],
] as const;

const SWATCHES = [
  {
    name: "Scholastiar green",
    token: "green",
    hex: "#10B65B",
    note: "Signal: logo dot, progress, icons",
    className: "bg-green",
  },
  {
    name: "Action green",
    token: "green-action / primary",
    hex: "#0B8743",
    note: "Filled buttons (AA 4.6:1)",
    className: "bg-green-action",
  },
  { name: "Green dark", token: "green-dark", hex: "#087A3E", note: "Green text, hover", className: "bg-green-deep" },
  {
    name: "Soft green",
    token: "soft-green",
    hex: "#EAF6F0",
    note: "Selected, success backgrounds",
    className: "bg-soft-green",
  },
  {
    name: "Brand black",
    token: "brand-black",
    hex: "#050505",
    note: "Logo, dark sections",
    className: "bg-brand-black",
  },
  {
    name: "Near black",
    token: "near-black",
    hex: "#171717",
    note: "Footer, admin sidebar",
    className: "bg-near-black",
  },
  {
    name: "Primary text",
    token: "primary-text",
    hex: "#1E1E1E",
    note: "Body and headings",
    className: "bg-primary-text",
  },
  {
    name: "Secondary text",
    token: "secondary-text",
    hex: "#5F6368",
    note: "Supporting text (AA)",
    className: "bg-secondary-text",
  },
  {
    name: "Subtle text",
    token: "subtle-text",
    hex: "#8A8F98",
    note: "Placeholders only — not AA for body text",
    className: "bg-subtle-text",
  },
  { name: "Soft background", token: "soft", hex: "#F7F9F7", note: "App backgrounds", className: "bg-soft" },
  { name: "Border", token: "border", hex: "#E5E7EB", note: "Thin neutral borders", className: "bg-border" },
];

async function PlansFromDataLayer() {
  const result = await safeLoad(() => repos.billing.listPlans("candidate"));
  if (!result.ok) {
    return (
      <ErrorState description="Screens show this when data fails to load. Switch screen state to “Live” to recover." />
    );
  }
  const plans = result.data;
  if (plans.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No plans to show"
        description="Screens show this when a list comes back empty. Switch screen state to “Live” in the dev panel to see data."
      />
    );
  }
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell className="capitalize">{plan.audience}</TableCell>
              <TableCell className="text-right text-secondary-text">
                {plan.price === null ? "To be decided" : `$${plan.price}/month`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function GalleryPage({ searchParams }: PageProps<"/dev/gallery">) {
  const [session, params] = await Promise.all([getSession(), searchParams]);
  const catalogueQuery = parseCatalogueQuery(params);

  return (
    <DevPageFrame>
      <PageHeader
        eyebrow="U0 Foundation · U4 Shared opportunity system"
        title="Component gallery"
        description="Every base building block in one place, styled with the Scholastiar design tokens. Check here before a component is used across many screens."
      />

      <nav aria-label="Gallery sections" className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full border bg-card px-3 py-1 text-sm text-secondary-text hover:border-green hover:text-primary-text"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-14">
        <PageSection id="colours" title="Colours" description="Green is a signal colour, not a wall of colour.">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SWATCHES.map((s) => (
              <li key={s.token} className="overflow-hidden rounded-lg border bg-card">
                <div className={`h-16 border-b ${s.className}`} />
                <div className="p-3">
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="font-mono text-xs text-secondary-text">
                    {s.hex} · {s.token}
                  </div>
                  <div className="mt-1 text-xs text-secondary-text">{s.note}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge tone="success">Success</StatusBadge>
            <StatusBadge tone="warning">Warning</StatusBadge>
            <StatusBadge tone="risky">Danger</StatusBadge>
            <StatusBadge tone="info">Info</StatusBadge>
            <StatusBadge tone="pending">Disabled / unknown</StatusBadge>
          </div>
        </PageSection>

        <PageSection
          id="typography"
          title="Typography"
          description="Inter. Bold, direct headings; calm, readable body."
        >
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <p className="text-4xl font-bold sm:text-5xl">Your strongest student matches</p>
            <p className="text-2xl font-bold">Generate a CV for this role</p>
            <p className="text-lg font-semibold">Complete your visa profile</p>
            <p className="max-w-2xl text-base">
              Body text is readable and calm. We explain why we ask for sensitive information, and we never promise
              visa, admission or funding outcomes.
            </p>
            <p className="text-sm font-medium text-secondary-text">Label · Application deadline</p>
            <p className="text-sm text-secondary-text">Helper text is concise and supportive.</p>
          </div>
        </PageSection>

        <PageSection
          id="buttons"
          title="Buttons"
          description="One primary action per section. Labels say exactly what happens."
        >
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Button>Submit application</Button>
              <Button variant="outline">Save draft</Button>
              <Button variant="soft">
                <Sparkles aria-hidden />
                Generate tailored CV
              </Button>
              <Button variant="ghost">Cancel</Button>
              <Button variant="link">View requirements</Button>
              <Button variant="destructive">Withdraw application</Button>
              <Button variant="dark">Approve and publish</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="lg">
                Continue to review
                <ArrowRight aria-hidden />
              </Button>
              <Button>
                <Plus aria-hidden />
                Default
              </Button>
              <Button size="sm">Small</Button>
              <Button size="icon" variant="outline" aria-label="Save opportunity">
                <Bookmark />
              </Button>
              <Button size="icon" variant="outline" aria-label="Download CV">
                <Download />
              </Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </PageSection>

        <PageSection
          id="badges"
          title="Badges & status"
          description="Status always uses an icon and text, never colour alone."
        >
          <div className="flex flex-wrap gap-2 rounded-lg border bg-card p-6">
            <StatusBadge tone="verified">Verified employer</StatusBadge>
            <StatusBadge tone="success">Fits study visa hours</StatusBadge>
            <StatusBadge tone="review">Under review</StatusBadge>
            <StatusBadge tone="warning">Visa hours unclear</StatusBadge>
            <StatusBadge tone="risky">Listing flagged</StatusBadge>
            <StatusBadge tone="info">AI-reviewed</StatusBadge>
            <StatusBadge tone="pending">Pending verification</StatusBadge>
            <Badge variant="outline">Full-time</Badge>
            <Badge variant="neutral">Remote</Badge>
          </div>
        </PageSection>

        <PageSection
          id="forms"
          title="Forms"
          description="Guided, not administrative. Errors sit next to the field and never blame."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 font-semibold">Controls</h3>
              <FormControlsDemo />
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Working form</h3>
              <p className="mt-1 mb-4 text-sm text-secondary-text">
                Saves through a server action into the mock data layer, with toast feedback. Refresh the page — the
                change stays.
              </p>
              {session ? (
                <ProfileBasicsForm
                  key={session.user.updated_at}
                  defaults={{ full_name: session.user.full_name, headline: session.user.headline }}
                />
              ) : (
                <EmptyState
                  title="Sign in as a persona to try this form"
                  description="Open the dev panel (bottom-left) and choose a persona."
                />
              )}
            </div>
          </div>
        </PageSection>

        <PageSection
          id="data"
          title="Data layer"
          description="Read through repositories. Use the dev panel's “Screen state” to see loading, empty and error versions."
        >
          <Suspense fallback={<ListSkeleton rows={3} />}>
            <PlansFromDataLayer />
          </Suspense>
        </PageSection>

        <PageSection
          id="cards"
          title="Cards, tabs & tables"
          description="Cards frame repeated objects. Never nest cards."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tailored CV · Student Library Assistant, Kingsbridge University</CardTitle>
                <CardDescription>UK format · generated 2 days ago</CardDescription>
                <CardAction>
                  <StatusBadge tone="success">Ready</StatusBadge>
                </CardAction>
              </CardHeader>
              <CardContent className="text-sm text-secondary-text">
                Restructured around customer service, reliability and flexible shifts around your timetable.
              </CardContent>
              <CardFooter className="gap-2">
                <Button>Use in application</Button>
                <Button variant="outline">Edit CV</Button>
              </CardFooter>
            </Card>
            <Tabs defaultValue="applied" className="rounded-lg border bg-card p-4">
              <TabsList>
                <TabsTrigger value="applied">Applied</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
              <TabsContent value="applied" className="pt-3 text-sm text-secondary-text">
                Applications you have submitted appear here with their latest status.
              </TabsContent>
              <TabsContent value="drafts" className="pt-3 text-sm text-secondary-text">
                Drafts are saved automatically while you work.
              </TabsContent>
              <TabsContent value="archived" className="pt-3 text-sm text-secondary-text">
                Closed and withdrawn applications.
              </TabsContent>
            </Tabs>
          </div>
        </PageSection>

        <PageSection
          id="opportunity-card"
          title="Opportunity cards"
          description="The universal card for programmes, universities and scholarships, with category tabs, search, filters, sort, save and board actions. Everything below is live against the mock data layer and the URL."
        >
          <Suspense fallback={<ListSkeleton rows={4} />}>
            <CatalogueExplorer query={catalogueQuery} />
          </Suspense>
          <h3 className="mt-10 mb-3 text-sm font-semibold text-primary-text">What a visitor sees</h3>
          <Suspense fallback={<ListSkeleton rows={2} />}>
            <VisitorCards />
          </Suspense>
        </PageSection>

        <PageSection
          id="apply-workspace"
          title="Apply workspace"
          description="Shared parts of every application: the route-aware apply button, steps, requirements and document readiness, AI statement drafting (generating, result, edit, another version, failure) and the final review."
        >
          <Suspense fallback={<ListSkeleton rows={3} />}>
            <ApplyWorkspaceSection />
          </Suspense>
        </PageSection>

        <PageSection
          id="overlays"
          title="Overlays"
          description="Dialogs, sheets, confirmations, menus, popovers and tooltips."
        >
          <div className="rounded-lg border bg-card p-6">
            <OverlaysDemo />
          </div>
        </PageSection>

        <PageSection id="feedback" title="Feedback" description="Every mutation shows loading, then success or error.">
          <div className="grid gap-6 rounded-lg border bg-card p-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold">Toasts</h3>
              <ToastsDemo />
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">Profile strength</span>
                  <span className="text-secondary-text tabular-nums">72%</span>
                </div>
                <Progress value={72} aria-label="Profile strength" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection id="states" title="Empty, error & loading" description="Every data screen has all three.">
          <div className="grid gap-6 lg:grid-cols-3">
            <EmptyState
              icon={Bookmark}
              title="No saved opportunities yet"
              description="Save scholarships, programmes and funding to compare them and get deadline reminders."
              action={<Button>Explore opportunities</Button>}
            />
            <ErrorState
              title="We couldn't upload this file"
              description="Try a PDF under 10MB, or choose another document."
              action={<Button variant="outline">Choose another file</Button>}
            />
            <div className="rounded-lg border bg-card">
              <LoadingState label="Matching your experience to role priorities" />
              <div className="px-4 pb-4">
                <ListSkeleton rows={2} />
              </div>
            </div>
          </div>
        </PageSection>

        <PageSection id="pwa" title="PWA" description="Installable, offline-aware, app-like on phones.">
          <div className="rounded-lg border bg-card p-6">
            <PwaDemo />
          </div>
        </PageSection>
      </div>
    </DevPageFrame>
  );
}
