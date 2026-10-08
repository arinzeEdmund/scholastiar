# Master Build Plan

Status: Unified AI-guided execution roadmap

## Purpose

This file defines the order AI agents and developers should follow when building Scholastiar.ai as one unified opportunity and mobility platform.

The old split structure is collapsed. All services belong to one product, but implementation must still happen one service at a time.

## Build Strategy: UI First (adopted 2026-10-01)

The platform is built in two phases. Full detail is in `STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md`.

1. **Phase A — UI Build:** build every screen of every service, one by one, in the service order below. Each screen is fully interactive against a mock data layer (`src/data`) whose interfaces match the future Supabase implementation.
2. **UI Freeze gate:** every route is done, the critical journeys work end to end, the data types are reconciled with `db.md`, and the user signs off.
3. **Phase B — Backend Build:** the schema, RLS, auth, AI providers, storage, realtime, payments and email are built and wired in behind the same interfaces, in the same service order.

The service descriptions below define the scope of each service. They apply to its screens in Phase A and to its backend in Phase B.

## Required Reading Order

Before implementation, read from the repository root:

1. `STRUCTURE/AGENTS.md`
2. `STRUCTURE/MAP.md`
3. `STRUCTURE/BUILD_GUIDE/MVP_SCOPE.md`
4. `STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md`
5. `STRUCTURE/DATABASE/db.md`
6. `STRUCTURE/UI_BASE/ux_ui_base.md`
7. `STRUCTURE/BUILD_GUIDE/PWA_FIRST_WEB_APP.md`
8. relevant `STRUCTURE/SERVICES/*.md` service spec
9. relevant `STRUCTURE/PAGES/*.md` page spec
10. `STRUCTURE/BUILD_GUIDE/ACCEPTANCE_CRITERIA.md`
11. `STRUCTURE/BUILD_GUIDE/IMPLEMENTATION_START_CHECKLIST.md`
12. `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md`

## Foundation Phase

Phase A foundation (stage U0): set up Next.js, TypeScript, Tailwind, shadcn/ui, linting, formatting, design tokens, base layouts and role shells, the PWA app shell, mobile web navigation, installability, offline-aware states, the `src/data` repository interfaces + mock store, dev role/plan/state switchers, and utility pages.

Phase B foundation (stage B0): set up the Supabase project, client/server utilities, environment variables, real auth and role routing, RLS foundations, document storage, and the server-side AI provider abstraction. These replace the Phase A mock stand-ins behind the existing data layer interfaces.

## Unified Service Build Order

### 1. Universities

Build study-abroad country hubs, university discovery, university profiles, program data, admissions requirements, student visa readiness, bulk university application packages, and admissions tracking. As the first opportunity service, it also brings the shared application surfaces: the unified saved page, AI-assisted applications and application tracking.

### 2. Scholarships

Build scholarship discovery, eligibility matching, scholarship profiles, document readiness, essay/question mapping, AI scholarship application packages, deadlines, and scholarship tracking.

### 3. AI Apply Agent

Build the supervised AI application execution layer with user rules, consent, field mapping, document readiness checks, hosted apply support, external-portal safety boundaries, proof capture, and status updates.

### 4. Apply For Me

Build the human-powered application marketplace with customer missions, Scholastiar Forwarders, bidding/acceptance, milestone tracking, proof of submission, quality review, disputes, and payments.

### 5. Discovery Engine

Build the internal opportunity discovery, verification, enrichment, deduplication, admin review, publishing, and freshness monitoring system for all opportunity categories.

### 6. Relocation

Build Pre-Arrival Processes and Post-Arrival Processes from a layered country rules library (destination → embassy → visa type → city → school) with a country activation gate; offices, maps, routes and deadlines per step; the cost estimator and public country cost pages; accommodation booking with payment and local settlement; roommates; admin-approved communities; city guides; pilots (freelance → verified → staff) and cohorts; Handsoff → Alumni or Year Check-in ($600/year) with support cases. Russia first. See `SERVICES/12-relocation.md`.

### 7. Migration Agencies

Build Scholastiar offices and verified partner agencies with service listings, appointment booking, document pre-checks, consultant communication, pricing, trust signals, reviews, and country-specific support.

### 8. Jobs (Pro only)

Jobs are a Pro-plan feature inside the candidate dashboard: job connections, never a promise of employment (decided 2026-10-07). Starter sees Jobs and Post-study jobs locked with an upgrade prompt; there is no public job board. Build the Pro access gate, student job and post-study job discovery, work eligibility (study visa hours, work visa sponsorship for graduates), employer job posting, job detail pages, saved jobs, AI CV support, AI-assisted applications, application tracking, employer review, candidate ranking, messaging hooks, and admin moderation for jobs.

## Build Rule

Phase A: do not move to the next UI stage until every screen in the current stage meets the Definition Of UI Done in `UI_FIRST_BUILD_PLAN.md`.

Phase B: do not start until the UI Freeze gate passes. Do not move to the next backend stage until the current domain works end to end on real data and passes the relevant acceptance criteria.

## Feature Status Rule

Track every major feature in `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md` using:

```txt
not started
in progress
completed ✅
tested 🟡
```

Use `completed ✅` when a feature is implemented and manually working within scope.

Use `tested 🟡` only after the feature passes the relevant automated tests, manual verification, RLS/security checks where applicable, and acceptance criteria.

## Shared Platform Services

Auth, onboarding, candidate profiles, employer infrastructure, documents, AI CV, PersonalityAI CV, Signia, applications, messaging, notifications, billing, analytics, admin operations, and RLS are shared services. Build or extend them when the current ordered service requires them, but keep the main delivery focus on the active service in the build order.

## Documentation Sync Rule

When implementation changes product scope, architecture, database design, UI patterns, permissions, API behavior, or acceptance criteria, update the relevant build guide or spec file in the same work session.

## Progress Tracking Rule

After every meaningful implementation change, update `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md` with:

- current service
- current goal
- completed work
- next up
- open questions
- architecture decisions
- session notes needed to resume
