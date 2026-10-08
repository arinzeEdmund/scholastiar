# Scholastiar.ai Project Map

Status: Unified planning and architecture map

Last updated: 2026-10-02

## Purpose

This file maps the full Scholastiar.ai planning system.

All planning files live under `STRUCTURE/`.

Path convention:

- From the repository root, use paths like `STRUCTURE/AGENTS.md`, `STRUCTURE/BUILD_GUIDE/MASTER_BUILD_PLAN.md`, and `STRUCTURE/SERVICES/02-universities.md`.
- Inside this folder, references like `AGENTS.md`, `BUILD_GUIDE/MASTER_BUILD_PLAN.md`, and `SERVICES/02-universities.md` remain valid relative paths.

Use it to understand:

- where every major system is documented
- how ordered services connect
- how pages connect to services
- how each opportunity service supports cross-border mobility, relocation, migration, or global advancement
- how database, UI, AI, and build execution documents fit together
- whether the planning foundation is complete enough to start implementation

## How To Use This Map

Use this file as the project navigation layer before building.

For any feature, read in this order:

1. `AGENTS.md` for product philosophy and scope
2. the relevant `SERVICES/*.md` service spec
3. the matching `PAGES/*.md` page spec
4. `DATABASE/db.md` for required data structures
5. `UI_BASE/ux_ui_base.md` for product design rules
6. the relevant `BUILD_GUIDE/*.md` file for routes, actions, tests, security, and acceptance criteria

The platform is unified, but implementation must follow the ordered service sequence.

## Cross-Border Opportunity Principle

Scholastiar.ai should treat every major opportunity service as a path toward international mobility and greener pastures.

Jobs, universities, scholarships, AI Apply Agent, Apply For Me, Discovery Engine, Relocation, and migration agencies should help users:

- discover opportunities in another country or global market
- understand whether the opportunity can support relocation, travel, study, work, funding, or migration
- compare countries, cities, visa paths, funding support, and long-term outcomes
- build credible application materials that help them move from their current country toward their country of choice
- turn successful outcomes into stronger CVs, profiles, applications, and future mobility options

## Source Of Truth

```txt
STRUCTURE/AGENTS.md
  -> product vision, scope, philosophy, stack, and operating rules

STRUCTURE/README.md
  -> repository orientation and documentation index

STRUCTURE/MAP.md
  -> full project connection map

STRUCTURE/BUILD_GUIDE/
  -> how to build the project

STRUCTURE/DATABASE/db.md
  -> central database architecture

STRUCTURE/UI_BASE/ux_ui_base.md
  -> central UI/UX system

MOBILE_STRUCTURE/
  -> React Native mobile app planning system

STRUCTURE/SERVICES/
  -> ordered unified service specs

STRUCTURE/PAGES/
  -> ordered unified page specs
```

## Documentation Layers

### Vision Layer

- `AGENTS.md`
- `README.md`

Defines the project identity, unified scope, technical direction, and development philosophy.

### Execution Layer

- `BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md` (active build strategy)
- `BUILD_GUIDE/MASTER_BUILD_PLAN.md`
- `BUILD_GUIDE/MVP_SCOPE.md`
- `BUILD_GUIDE/AI_BUILD_RULES.md`
- `BUILD_GUIDE/ACCEPTANCE_CRITERIA.md`
- `BUILD_GUIDE/PROGRESS_TRACKER.md`
- `BUILD_GUIDE/IMPLEMENTATION_START_CHECKLIST.md`
- `BUILD_GUIDE/PRICING.md`
- `BUILD_GUIDE/EMAIL_INTELLIGENCE.md`
- `BUILD_GUIDE/PWA_FIRST_WEB_APP.md`
- `BUILD_GUIDE/growth_hack.txt`
- `BUILD_GUIDE/PUBLISHING_INTELLIGENCE_ENGINE.md`
- `BUILD_GUIDE/SPONSORED_ADS_MARKETPLACE.md`

Defines build order, rules for AI agents, launch limits, PWA-first web/mobile behavior, and definition of done.

### Data Layer

- `DATABASE/db.md`
- `BUILD_GUIDE/DATABASE_IMPLEMENTATION_PLAN.md`
- `BUILD_GUIDE/RLS_POLICIES.md`

Defines schema architecture, migration order, access control, storage, indexing, and security.

### Design Layer

- `UI_BASE/ux_ui_base.md`
- `BUILD_GUIDE/COMPONENT_SYSTEM.md`

Defines brand, UI rules, UX patterns, component conventions, and implementation principles.

### Mobile Layer

- `MOBILE_STRUCTURE/README.md`
- `MOBILE_STRUCTURE/MOBILE_APP_SCOPE.md`
- `MOBILE_STRUCTURE/MOBILE_TECH_STACK.md`
- `MOBILE_STRUCTURE/MOBILE_ENVIRONMENT.md`
- `MOBILE_STRUCTURE/MOBILE_START_CHECKLIST.md`
- `MOBILE_STRUCTURE/MOBILE_BUILD_PLAN.md`
- `MOBILE_STRUCTURE/MOBILE_NAVIGATION.md`
- `MOBILE_STRUCTURE/MOBILE_ROUTES.md`
- `MOBILE_STRUCTURE/MOBILE_SCREENS.md`
- `MOBILE_STRUCTURE/MOBILE_COMPONENT_SYSTEM.md`
- `MOBILE_STRUCTURE/MOBILE_DATA_FLOW.md`
- `MOBILE_STRUCTURE/MOBILE_AUTH_AND_SECURITY.md`
- `MOBILE_STRUCTURE/MOBILE_NOTIFICATIONS.md`
- `MOBILE_STRUCTURE/MOBILE_AI_WORKFLOWS.md`
- `MOBILE_STRUCTURE/MOBILE_PAYMENTS.md`
- `MOBILE_STRUCTURE/MOBILE_APP_STORE_POLICY.md`
- `MOBILE_STRUCTURE/MOBILE_OFFLINE_STRATEGY.md`
- `MOBILE_STRUCTURE/MOBILE_ANALYTICS_AND_CRASH_REPORTING.md`
- `MOBILE_STRUCTURE/MOBILE_TESTING_STRATEGY.md`
- `MOBILE_STRUCTURE/MOBILE_RELEASE_PLAN.md`
- `MOBILE_STRUCTURE/MOBILE_WEB_ONLY_REMOVALS.md`

Defines the React Native mobile app scope, environment, scaffold checklist, navigation, route map, screen inventory, mobile-first workflows, analytics/crash reporting, release strategy, and web-only feature exclusions.

### Service Layer

- `SERVICES/*.md`

Defines product/domain specifications for the unified platform.

### Page Layer

- `PAGES/*.md`

Defines public, candidate, employer/provider, admin, application, automation, and utility screens.

## Build Strategy: UI First

Adopted 2026-10-01. Source of truth: `BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md`.

```txt
Phase A  UI Build
  U0  Foundation (scaffold, design system, shells, PWA, mock data layer, dev switchers)
  U1  Public & marketing
  U2  Auth (mocked)
  U3  Candidate core (dashboard, onboarding, profile, settings)
  U4  Shared opportunity system (opportunity card, apply workspace)
  U5  Candidate tools (AI CV, PersonalityAI CV, Signia, messages, notifications, billing)
  U6  02 Universities (also builds /saved and /applications)
  U7  03 Scholarships
  U8  Provider portals
  U9  09 AI Apply Agent
  U10 10 Apply For Me
  U11 11 Discovery Engine
  U12 12 Relocation (candidate and public)
  U13 Relocation operations (pilots, housing providers, relocation admin)
  U14 13 Migration Agencies
  U15 14 Jobs (candidate, Pro only — locked for Starter, no public board)
  U16 Employers
  U17 Admin
  U18 Full click-through audit
        │
        ▼
  UI Freeze gate  (every route done, critical journeys pass, db.md reconciled, user sign-off)
        │
        ▼
Phase B  Backend Build
  B0 Supabase/auth/RLS/AI foundation → B1 profiles → B2 applications/messaging/notifications → B3 AI CV/Signia
  → B4–B6 universities, scholarships, provider portals → B7 Apply Agent → B8 Apply For Me → B9 Discovery
  → B10 Relocation → B11 Migration Agencies → B12 jobs & employers → B13 billing/admin/analytics/email/WhatsApp
  → B14 launch readiness
```

The UI talks only to `src/data` repository interfaces. Phase A uses mock implementations of them, and Phase B swaps in Supabase implementations. The screens are built once.

## Unified Service Build Order

This order is followed in both phases.

```txt
02 Universities
03 Scholarships
09 AI Apply Agent
10 Apply For Me
11 Discovery Engine
12 Relocation
13 Migration Agencies
14 Jobs (Pro only; was 01 until 2026-10-07)
```

## Service And Page Map

```txt
02 Universities
  service: SERVICES/02-universities.md
  pages: PAGES/02-universities-pages.md
  support: SERVICES/21-study-catalogue.md

03 Scholarships
  service: SERVICES/03-scholarships.md
  pages: PAGES/03-scholarships-pages.md
  support: SERVICES/21-study-catalogue.md

09 AI Apply Agent
  service: SERVICES/09-ai-apply-agent.md
  pages: PAGES/09-ai-apply-agent-pages.md

10 Apply For Me
  service: SERVICES/10-apply-for-me.md
  pages: PAGES/10-apply-for-me-pages.md

11 Discovery Engine
  service: SERVICES/11-discovery-engine.md
  pages: PAGES/11-discovery-engine-pages.md

12 Relocation
  service: SERVICES/12-relocation.md
  pages: PAGES/12-relocation-pages.md
  support: SERVICES/02-universities.md, SERVICES/100-notifications.md, SERVICES/103-billing-subscriptions.md

13 Migration Agencies
  service: SERVICES/13-migration-agencies.md
  pages: PAGES/13-migration-agencies-pages.md
```

14 Jobs (Pro only, dashboard only — see SERVICES/14-jobs.md → Positioning)
  service: SERVICES/14-jobs.md
  pages: PAGES/14-jobs-pages.md
  support: SERVICES/20-work-eligibility.md, SERVICES/93-ai-cv-generation.md, SERVICES/94-ai-assisted-applications.md, SERVICES/95-application-tracking.md, SERVICES/97-employers.md

## Shared Support Services

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

## Shared Support Pages

```txt
000-original-screen-list.md
89-public-pages.md
90-auth-pages.md
91-onboarding-pages.md
92-candidate-profile-pages.md
93-ai-cv-pages.md
94-applications-pages.md
95-personality-ai-cv-pages.md
102-signia-pages.md
96-employers-pages.md
97-messaging-pages.md
98-notifications-pages.md
99-billing-pages.md
100-admin-pages.md
101-analytics-pages.md
```

## Build Readiness Checklist

- [x] Unified product scope exists
- [x] Cross-border mobility principle exists
- [x] Ordered service specs exist
- [x] Ordered page specs exist
- [x] Database blueprint exists
- [x] UI/UX base exists
- [x] Build guide exists
- [x] RLS guidance exists
- [x] AI prompt guidance exists
- [x] Acceptance criteria exist
- [x] Progress tracker exists
- [x] Implementation start checklist exists
- [x] UI-first build plan and per-route UI Screen Board exist

## Current Conclusion

The planning foundation is strong enough to begin implementation. Implementation is UI-first: Phase A builds the entire platform UI screen by screen against a mock data layer, starting with stage U0 Foundation. Only after the UI Freeze gate does Phase B build the backend, starting with the Supabase foundation and then moving through the ordered services one by one.
