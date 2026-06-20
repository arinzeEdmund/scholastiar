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
- VisaSponsorshipBadge
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
- Use the shared `OpportunityCard` pattern for jobs, universities, scholarships, fellowships, grants, competitions, conferences/training, and awards.
- Opportunity cards must show application effort, success/fit score, save action, direct apply action when available, and board actions for AI Apply Agent or Apply For Me when allowed by subscription.
- Opportunity success scores must include responsible tooltip copy and must not imply guaranteed outcomes.
- Mobile web/PWA screens must support bottom navigation, sticky action bars, install prompts, offline-aware states, and push permission flows where relevant.

## Protected UI Areas

Generated or third-party component internals should not be edited directly unless explicitly requested.

Prefer composition around base components instead of rewriting the base library.
