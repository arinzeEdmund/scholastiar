# Scholastiar.ai

Scholastiar.ai is an AI-powered international opportunity and mobility platform.

The platform helps users discover, prepare for, apply to, and track opportunities that can help them work abroad, study abroad, travel for growth, secure funding, build global credibility, relocate, migrate, or move toward a country of choice in search of greener pastures.

The core product philosophy:

> The user should explain themselves once. The platform should handle the rest.

The core opportunity philosophy:

> Every opportunity should help users move across borders toward greener pastures.

## Current Documentation System

This repository is currently in product architecture and AI-guided build preparation mode.

All planning, architecture, page, product, database, and build-guide documents live inside `STRUCTURE/`.

The old split structure has been collapsed. The permanent source of truth is now:

```txt
STRUCTURE/AGENTS.md
STRUCTURE/MAP.md
STRUCTURE/BUILD_GUIDE/
STRUCTURE/DATABASE/
STRUCTURE/UI_BASE/
MOBILE_STRUCTURE/
STRUCTURE/SERVICES/
STRUCTURE/PAGES/
```

## Read First

Before any AI agent or developer implements code, read these files in order from the repository root:

```txt
STRUCTURE/AGENTS.md
STRUCTURE/MAP.md
STRUCTURE/BUILD_GUIDE/AI_BUILD_RULES.md
STRUCTURE/BUILD_GUIDE/MASTER_BUILD_PLAN.md
STRUCTURE/BUILD_GUIDE/MVP_SCOPE.md
STRUCTURE/DATABASE/db.md
STRUCTURE/UI_BASE/ux_ui_base.md
```

Then read the relevant ordered service and page specs:

```txt
STRUCTURE/SERVICES/[ordered-service].md
STRUCTURE/PAGES/[ordered-page-spec].md
```

## Unified Service Build Order

Build the platform as one product, but implement services one after another in this order:

1. Universities
2. Scholarships
3. AI Apply Agent
4. Apply For Me
5. Discovery Engine
6. Relocation
7. Migration Agencies
8. Jobs (Pro-only job connections in the candidate dashboard; moved last on 2026-10-07)

The build is **UI-first** (`BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md`):

- **Phase A — UI Build:** every screen of every service is built, one by one, in this order. Each screen is fully interactive against a mock data layer.
- **UI Freeze gate:** user sign-off on the complete, working UI.
- **Phase B — Backend Build:** Supabase, RLS, auth, AI, storage, payments and email are wired in behind the same data layer, in the same order.

Do not jump ahead until the current stage meets its definition of done.

## Folder Guide

### `AGENTS.md`

Main product vision and operating instructions.

Defines:

- Scholastiar.ai philosophy
- unified opportunity scope
- cross-border mobility principle
- tech stack
- AI rules
- Supabase rules
- UI/UX philosophy
- development principles

### `BUILD_GUIDE/`

Execution guidance for AI agents and developers.

Key files:

- `MASTER_BUILD_PLAN.md` - unified build order from setup to launch
- `UI_FIRST_BUILD_PLAN.md` - active build strategy: UI Build phase, UI Freeze gate, Backend Build phase
- `MVP_SCOPE.md` - launch boundary and service order
- `ROUTES.md` - canonical route map
- `DATABASE_IMPLEMENTATION_PLAN.md` - database build order
- `RLS_POLICIES.md` - practical Supabase access-control guide
- `AI_PROMPTS.md` - central AI prompt architecture
- `COMPONENT_SYSTEM.md` - component planning reference
- `DATA_FLOW.md` - how data moves through the product
- `PWA_FIRST_WEB_APP.md` - PWA-first web/mobile experience, installability, offline behavior, push, mobile web navigation, and React Native bridge
- `USER_ROLES_AND_PERMISSIONS.md` - role matrix
- `API_ACTIONS.md` - server action/API plan
- `TESTING_STRATEGY.md` - verification strategy
- `SEED_DATA.md` - realistic development data plan
- `ENVIRONMENT.md` - environment variables and setup notes
- `PRICING.md` - pricing, plan, entitlement, and monetization source of truth
- `EMAIL_INTELLIGENCE.md` - lifecycle email, digest, readiness, recommendation, and conversion system
- `growth_hack.txt` - $1m MRR target model, cost-effective GTM strategy, growth channels, tools, and execution plan
- `PUBLISHING_INTELLIGENCE_ENGINE.md` - article, news, immigration update, newsletter, SEO, AI search, and content funnel engine
- `SPONSORED_ADS_MARKETPLACE.md` - sponsored posts, ads, sponsorships, featured placements, trust rules, and B2B ad revenue engine
- `ACCEPTANCE_CRITERIA.md` - definition of done
- `AI_BUILD_RULES.md` - implementation rules for AI agents
- `PROGRESS_TRACKER.md` - current status and next steps
- `IMPLEMENTATION_START_CHECKLIST.md` - pre-code startup decisions and first build checklist

### `SERVICES/`

Ordered service specs for the unified platform.

Core opportunity and automation services:

```txt
02-universities.md
03-scholarships.md
09-ai-apply-agent.md
10-apply-for-me.md
11-discovery-engine.md
12-relocation.md
13-migration-agencies.md
14-jobs.md            (formerly 01; Pro-only, built last)
```

Supporting platform services:

```txt
20-work-eligibility.md
90-auth.md
91-onboarding-intelligence.md
92-candidate-profile.md
93-ai-cv-generation.md
94-ai-assisted-applications.md
95-application-tracking.md
96-personality-ai-cv.md
107-signia.md
97-employers.md
98-candidate-ranking.md
99-messaging-communication.md
100-notifications.md
101-application-intelligence.md
102-documents-storage.md
103-billing-subscriptions.md
104-admin-operations.md
105-analytics.md
106-security-rls.md
```

### `PAGES/`

Ordered page architecture for the unified platform.

The first twelve page specs map to the service build order. Support page specs cover auth, onboarding, profiles, applications, PersonalityAI CV, Signia, employers, messaging, billing, admin, analytics, and the original screen list.

### `DATABASE/`

Central database blueprint.

`DATABASE/db.md` defines shared core tables, opportunity tables, AI infrastructure, document/media storage, messaging, notifications, billing, admin/moderation, RLS, indexing, and implementation order.

### `UI_BASE/`

Central UI/UX reference.

`UI_BASE/ux_ui_base.md` defines brand, colors, typography, layout rules, component principles, dashboards, AI interaction UX, candidate/employer/admin UX, mobile rules, accessibility, motion, media direction, and empty/loading/error states.

### `MOBILE_STRUCTURE/`

React Native mobile app planning layer at the repository root.

Defines:

- mobile scope
- Expo/React Native stack
- Expo Router route map
- mobile environment variables
- mobile scaffold checklist
- mobile build order
- mobile navigation
- mobile screens
- mobile components
- mobile data flow
- mobile auth/security
- mobile notifications
- mobile AI workflows
- mobile payments
- app store payment policy planning
- offline strategy
- analytics and crash reporting
- testing and release plan
- web-only features that should stay out of the mobile MVP

## Build Principle

Scholastiar.ai is now planned as one unified platform. The product is broad, but the work must remain sequential, verified, and service-by-service. The UI is built first for the whole platform, and the backend follows.

For any feature:

1. Confirm the service's position in the unified build order.
2. Read the matching file in `STRUCTURE/SERVICES/`.
3. Read the matching file in `STRUCTURE/PAGES/`.
4. Check `STRUCTURE/DATABASE/db.md`.
5. Check `STRUCTURE/UI_BASE/ux_ui_base.md`.
6. Check relevant files in `STRUCTURE/BUILD_GUIDE/`.
7. Build only the current stage, as listed on the UI Screen Board in `PROGRESS_TRACKER.md` during Phase A or on the Backend Board during Phase B, until it meets its definition of done.

Before creating implementation code, also read:

```txt
STRUCTURE/BUILD_GUIDE/IMPLEMENTATION_START_CHECKLIST.md
```

## Current Status

The repository currently contains the planning and implementation guidance required to begin building the unified Scholastiar.ai platform.
