# Scholastiar.ai Project Map

Status: Unified planning and architecture map

Last updated: 2026-06-01

## Purpose

This file maps the full Scholastiar.ai planning system.

All planning files live under `STRUCTURE/`.

Path convention:

- From the repository root, use paths like `STRUCTURE/AGENTS.md`, `STRUCTURE/BUILD_GUIDE/MASTER_BUILD_PLAN.md`, and `STRUCTURE/SERVICES/01-jobs.md`.
- Inside this folder, references like `AGENTS.md`, `BUILD_GUIDE/MASTER_BUILD_PLAN.md`, and `SERVICES/01-jobs.md` remain valid relative paths.

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

Jobs, universities, scholarships, fellowships, grants, competitions, conferences/training, awards, AI Apply Agent, Apply For Me, Discovery Engine, and migration agencies should help users:

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

## Unified Service Build Order

```txt
01 Jobs
02 Universities
03 Scholarships
04 Fellowships
05 Grants
06 Competitions
07 Conferences / Training
08 Awards
09 AI Apply Agent
10 Apply For Me
11 Discovery Engine
12 Migration Agencies
```

## Service And Page Map

```txt
01 Jobs
  service: SERVICES/01-jobs.md
  pages: PAGES/01-jobs-pages.md
  support: SERVICES/20-visa-sponsored-jobs.md, SERVICES/93-ai-cv-generation.md, SERVICES/94-ai-assisted-applications.md, SERVICES/95-application-tracking.md, SERVICES/97-employers.md

02 Universities
  service: SERVICES/02-universities.md
  pages: PAGES/02-universities-pages.md

03 Scholarships
  service: SERVICES/03-scholarships.md
  pages: PAGES/03-scholarships-pages.md

04 Fellowships
  service: SERVICES/04-fellowships.md
  pages: PAGES/04-fellowships-pages.md

05 Grants
  service: SERVICES/05-grants.md
  pages: PAGES/05-grants-pages.md

06 Competitions
  service: SERVICES/06-competitions.md
  pages: PAGES/06-competitions-pages.md

07 Conferences / Training
  service: SERVICES/07-conferences-training.md
  pages: PAGES/07-conferences-training-pages.md

08 Awards
  service: SERVICES/08-awards.md
  pages: PAGES/08-awards-pages.md

09 AI Apply Agent
  service: SERVICES/09-ai-apply-agent.md
  pages: PAGES/09-ai-apply-agent-pages.md

10 Apply For Me
  service: SERVICES/10-apply-for-me.md
  pages: PAGES/10-apply-for-me-pages.md

11 Discovery Engine
  service: SERVICES/11-discovery-engine.md
  pages: PAGES/11-discovery-engine-pages.md

12 Migration Agencies
  service: SERVICES/12-migration-agencies.md
  pages: PAGES/12-migration-agencies-pages.md
```

## Shared Support Services

```txt
20-visa-sponsored-jobs.md
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

## Current Conclusion

The planning foundation is strong enough to begin implementation of the unified Scholastiar.ai platform, starting with Jobs and then moving through the ordered services one by one.
