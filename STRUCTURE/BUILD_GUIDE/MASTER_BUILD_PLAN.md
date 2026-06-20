# Master Build Plan

Status: Unified AI-guided execution roadmap

## Purpose

This file defines the order AI agents and developers should follow when building Scholastiar.ai as one unified opportunity and mobility platform.

The old split structure is collapsed. All services belong to one product, but implementation must still happen one service at a time.

## Required Reading Order

Before implementation, read from the repository root:

1. `STRUCTURE/AGENTS.md`
2. `STRUCTURE/MAP.md`
3. `STRUCTURE/BUILD_GUIDE/MVP_SCOPE.md`
4. `STRUCTURE/DATABASE/db.md`
5. `STRUCTURE/UI_BASE/ux_ui_base.md`
6. `STRUCTURE/BUILD_GUIDE/PWA_FIRST_WEB_APP.md`
7. relevant `STRUCTURE/SERVICES/*.md` service spec
8. relevant `STRUCTURE/PAGES/*.md` page spec
9. `STRUCTURE/BUILD_GUIDE/ACCEPTANCE_CRITERIA.md`
10. `STRUCTURE/BUILD_GUIDE/IMPLEMENTATION_START_CHECKLIST.md`
11. `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md`

## Foundation Phase

Set up Next.js, TypeScript, Tailwind, shadcn/ui, Supabase client/server utilities, environment variables, linting, formatting, base layouts, auth foundations, RLS foundations, profile foundations, document storage, PWA app shell foundations, mobile web navigation, installability, offline-aware states, and the reusable application workspace.

## Unified Service Build Order

### 1. Jobs

Build cross-border job discovery, visa-sponsored jobs, employer job posting, job detail pages, saved jobs, AI CV support, AI-assisted applications, application tracking, employer review, candidate ranking, messaging hooks, and admin moderation for jobs.

### 2. Universities

Build study-abroad country hubs, university discovery, university profiles, program data, admissions requirements, student visa readiness, bulk university application packages, and admissions tracking.

### 3. Scholarships

Build scholarship discovery, eligibility matching, scholarship profiles, document readiness, essay/question mapping, AI scholarship application packages, deadlines, and scholarship tracking.

### 4. Fellowships

Build fellowship discovery, leadership and purpose profile support, fellowship profiles, essay/project builders, references, interview preparation, and fellowship tracking.

### 5. Grants

Build grant discovery, project profile builder, funder matching, budget support, impact planning, proposal/question mapping, grant tracking, and reporting foundations.

### 6. Competitions

Build competition discovery, competition profiles, submission builder, team workspace, pitch and presentation support, submission tracking, and post-competition credibility updates.

### 7. Conferences / Training

Build conferences, workshops, bootcamps, academies, and training discovery; event profiles; funded travel signals; abstract/bio support; travel and visa readiness; networking planning; and event tracking.

### 8. Awards

Build award discovery, award profiles, achievement profile builder, evidence readiness, nomination/reference support, award application packages, and credibility updates.

### 9. AI Apply Agent

Build the supervised AI application execution layer with user rules, consent, field mapping, document readiness checks, hosted apply support, external-portal safety boundaries, proof capture, and status updates.

### 10. Apply For Me

Build the human-powered application marketplace with customer missions, Scholastiar Forwarders, bidding/acceptance, milestone tracking, proof of submission, quality review, disputes, and payments.

### 11. Discovery Engine

Build the internal opportunity discovery, verification, enrichment, deduplication, admin review, publishing, and freshness monitoring system for all opportunity categories.

### 12. Migration Agencies

Build Scholastiar offices and verified partner agencies with service listings, appointment booking, document pre-checks, consultant communication, pricing, trust signals, reviews, and country-specific support.

## Build Rule

Do not move to the next service until the current service works end to end and passes the relevant acceptance criteria.

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
