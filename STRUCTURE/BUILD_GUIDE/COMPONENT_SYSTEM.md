# Component System

Status: UI component planning reference

Source: `UI_BASE/ux_ui_base.md`

PWA source: `STRUCTURE/BUILD_GUIDE/PWA_FIRST_WEB_APP.md`

## Foundations

Use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react icons

Components should be domain-specific, reusable, and consistent.

## Base Components

- Button
- Input
- Textarea
- Select
- Checkbox
- RadioGroup
- Dialog
- Sheet
- Tabs
- Badge
- Card
- Table
- DropdownMenu
- Tooltip
- Progress
- Skeleton
- Toast
- InstallPrompt
- OfflineBanner
- PWAUpdateToast

## Layout Components

- PublicLayout
- CandidateAppShell
- EmployerAppShell
- AdminAppShell
- DashboardHeader
- SidebarNav
- TopNav
- MobileBottomTabs
- PageSection
- EmptyState
- ErrorState
- LoadingState

## Domain Components

- JobCard
- JobFilters
- WorkEligibilityBadge
- CandidateFitScore
- CandidateProfileSummary
- ApplicationTimeline
- ApplicationStatusBadge
- AICVPreview
- AICVEditor
- AIWritingSidebar
- PersonalityCVPlayer
- DocumentUploader
- DocumentVaultItem
- EmployerPipelineBoard
- ApplicantRankCard
- MessageThread
- NotificationItem
- PricingPlanCard
- OpportunityCard
- OpportunityEffortBadge
- OpportunitySuccessScore
- OpportunityApplyActions
- ApplyBoardMenu
- SubscriptionGateBadge
- StickyOpportunityActionBar
- MobileFilterSheet
- PushPermissionSheet
- DeadlineAlertToggle
- AIConsentSheet
- PlanGateSheet

## Toast / Feedback Pattern

Package: `react-hot-toast`

A branded `<Toaster />` wrapper lives at `src/components/ui/toaster.tsx` and is mounted once in `src/app/layout.tsx` (inside `TooltipProvider`, after `PWAUpdateToast`). All pages inherit it automatically — never mount a second `<Toaster />`.

### When to use toasts

Every interactive mutation that can succeed or fail and takes any noticeable time must give the user loading → success/error feedback. This includes:

- Saving/unsaving a job
- Submitting a job application
- Posting a job (employer)
- Moderating a job (admin approve / reject / pause)
- Any future form submission, AI trigger, document upload, or status change

Do **not** use toasts for read-only operations (searching, filtering, navigating).

### Pattern — client component + server action

```tsx
'use client';
import { useTransition } from 'react';
import toast from 'react-hot-toast';
import { myServerAction } from '@/lib/actions/my-action';

function MyButton() {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const toastId = toast.loading('Doing the thing…');
    startTransition(async () => {
      const result = await myServerAction();
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success('Done!', { id: toastId });
    });
  }

  return <button disabled={pending} onClick={handleClick}>Go</button>;
}
```

Key rules:
1. Always assign `toast.loading(…)` to a `toastId` variable.
2. Always resolve every branch with `{ id: toastId }` so the loading toast is replaced, never stacked.
3. Server actions must return `ActionResult<T>` (see `src/lib/actions/auth.ts` for the type), never `Promise<void>` when called from a toast-bearing client component.
4. Navigation after success (`router.push(…)`) happens inside `startTransition`, after `toast.success(…)`.
5. Never import `toast` in Server Components or server actions.

### `ActionResult<T>` type

```ts
type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

Import from `@/lib/actions/auth` or define locally in the actions file. Every mutating server action that a client component calls must return this shape.

## Rules

- Use `UI_BASE/ux_ui_base.md` for colors, spacing, tone, and UX principles.
- Do not create nested cards.
- Use icons for common actions.
- Always include empty, loading, and error states for data-heavy components.
- Keep admin components denser than candidate components.
- Use design tokens and Tailwind theme values instead of hardcoded one-off colors.
- Add `use client` only when browser interactivity requires it.
- Prefer Server Components for static/data-read surfaces.
- Keep form components accessible with labels, validation text, and focus states.
- Use lucide-react icons where possible.
- Use the shared `OpportunityCard` pattern for jobs, universities and scholarships.
- Opportunity cards must show application effort, success/fit score, save action, direct apply action when available, and board actions for AI Apply Agent or Apply For Me when allowed by subscription.
- Opportunity success scores must include responsible tooltip copy and must not imply guaranteed outcomes.
- Mobile web/PWA screens must support bottom navigation, sticky action bars, install prompts, offline-aware states, and push permission flows where relevant.

## Protected UI Areas

Generated or third-party component internals should not be edited directly unless explicitly requested.

Prefer composition around base components instead of rewriting the base library.
