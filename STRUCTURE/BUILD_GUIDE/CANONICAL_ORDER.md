# Canonical Order

Status: Single source of truth for documentation order and build sequence

## Purpose

This file defines the canonical order for reading, interpreting, and following the Scholastiar.ai structure documents.

When another structure file repeats reading order, build order, or source-of-truth hierarchy, this file should take precedence.

## Source-Of-Truth Ranking

Follow project files in this authority order:

1. `STRUCTURE/AGENTS.md`
   - Product vision, philosophy, operating rules, stack, AI direction, Supabase direction, and core development principles.

2. `STRUCTURE/MAP.md`
   - Documentation navigation, relationships between files, service/page mapping, and planning system overview.

3. `STRUCTURE/BUILD_GUIDE/AI_BUILD_RULES.md`
   - Required implementation rules for AI agents and developers, including security, scope, AI, UI, and progress rules.

4. `STRUCTURE/BUILD_GUIDE/MASTER_BUILD_PLAN.md`
   - Execution roadmap, build phases, service-by-service sequence, and delivery discipline.

5. `STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md`
   - Build strategy: Phase A (all UI against a mock data layer), the UI Freeze gate, and Phase B (backend). Decides the UI stage order, the Definition Of UI Done, and the backend stage order.

6. `STRUCTURE/BUILD_GUIDE/MVP_SCOPE.md`
   - First-launch boundary, in-scope platform features, out-of-scope features, and launch criteria.

7. `STRUCTURE/DATABASE/db.md`
   - Master database architecture, table design, relationships, RLS expectations, indexing, and data principles.

8. `STRUCTURE/UI_BASE/ux_ui_base.md`
   - Master UI/UX reference, visual system, interaction principles, dashboard patterns, and product design direction.

9. Relevant `STRUCTURE/SERVICES/*.md`
   - Domain-specific service requirements for the active ordered service.

10. Relevant `STRUCTURE/PAGES/*.md`
   - Page, screen, route, and user-flow requirements for the active ordered service.

11. Relevant supporting files in `STRUCTURE/BUILD_GUIDE/`
    - Use these according to the work being done:
      - `ROUTES.md`
      - `API_ACTIONS.md`
      - `DATA_FLOW.md`
      - `COMPONENT_SYSTEM.md`
      - `DATABASE_IMPLEMENTATION_PLAN.md`
      - `RLS_POLICIES.md`
      - `USER_ROLES_AND_PERMISSIONS.md`
      - `AI_PROMPTS.md`
      - `PWA_FIRST_WEB_APP.md`
      - `PRICING.md`
      - `EMAIL_INTELLIGENCE.md`
      - `PUBLISHING_INTELLIGENCE_ENGINE.md`
      - `SPONSORED_ADS_MARKETPLACE.md`
      - `SEED_DATA.md`
      - `ENVIRONMENT.md`
      - `TESTING_STRATEGY.md`
      - `ACCEPTANCE_CRITERIA.md`

12. `STRUCTURE/BUILD_GUIDE/IMPLEMENTATION_START_CHECKLIST.md`
    - Pre-code readiness checklist before beginning implementation.

13. `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md`
    - Current implementation status, session notes, completed work, open questions, and next steps.

## Required Reading Order Before Implementation

Before implementing a feature, read:

1. `STRUCTURE/AGENTS.md`
2. `STRUCTURE/MAP.md`
3. `STRUCTURE/BUILD_GUIDE/CANONICAL_ORDER.md`
4. `STRUCTURE/BUILD_GUIDE/AI_BUILD_RULES.md`
5. `STRUCTURE/BUILD_GUIDE/MASTER_BUILD_PLAN.md`
6. `STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md`
7. `STRUCTURE/BUILD_GUIDE/MVP_SCOPE.md`
8. `STRUCTURE/DATABASE/db.md`
9. `STRUCTURE/UI_BASE/ux_ui_base.md`
10. relevant `STRUCTURE/SERVICES/*.md`
11. relevant `STRUCTURE/PAGES/*.md`
12. relevant supporting `STRUCTURE/BUILD_GUIDE/*.md` files
13. `STRUCTURE/BUILD_GUIDE/IMPLEMENTATION_START_CHECKLIST.md`
14. `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md`

## Unified Service Build Order

Build Scholastiar.ai as one unified product, but implement services in this order:

1. Universities
2. Scholarships
3. AI Apply Agent
4. Apply For Me
5. Discovery Engine
6. Relocation
7. Migration Agencies
8. Jobs (Pro-only job connections, with the employer side)

Scholastiar.ai offers school-related services only (decided 2026-10-07): Fellowships, Grants, Competitions, Conferences / Training and Awards were removed, along with their specs (`04`–`08`). Service files keep their numbers (`02-universities.md`, `03-scholarships.md`, `09-ai-apply-agent.md` … `14-jobs.md`). Jobs was service 01 until 2026-10-07, when it became `14-jobs.md`: jobs are a Pro-plan feature inside the candidate dashboard — job connections, never a promise of employment — not a headline service. See `SERVICES/14-jobs.md` → Positioning.

This order applies twice:

- **Phase A — UI Build:** screens are built in this service order, inside the UI stages defined in `UI_FIRST_BUILD_PLAN.md`. Shared surfaces come first: foundation, public, auth, candidate core and the shared opportunity system. Employers, candidate tools, provider portals and admin are placed where `UI_FIRST_BUILD_PLAN.md` puts them.
- **Phase B — Backend Build:** the backend is built in this service order after the UI Freeze gate.

Phase A: do not move to the next UI stage until every screen in the current stage meets the Definition Of UI Done.

Phase B: do not move to the next service until the active service works end to end on real data within its defined scope and passes the relevant acceptance criteria.

## Service And Page Pairing Rule

For every ordered service, read the service file and matching page file together.

Examples:

```txt
STRUCTURE/SERVICES/02-universities.md
STRUCTURE/PAGES/02-universities-pages.md

STRUCTURE/SERVICES/14-jobs.md
STRUCTURE/PAGES/14-jobs-pages.md
```

Service files define what the product must do.

Page files define where and how users experience it.

## Conflict Resolution

If two structure files conflict:

1. Follow `STRUCTURE/AGENTS.md` for product philosophy, platform scope, tech stack, and non-negotiable principles.
2. Follow this file for reading order, service order, and documentation authority.
3. Follow `STRUCTURE/DATABASE/db.md` for database structure.
4. Follow `STRUCTURE/UI_BASE/ux_ui_base.md` for design direction.
5. Follow the active service/page specs for feature-specific behavior.
6. Use `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md` to record unresolved conflicts or decisions.

Do not silently invent business logic when the structure files are unclear. Record the uncertainty and ask for clarification before implementing risky behavior.

## Maintenance Rule

When reading order, build order, or documentation authority changes, update this file first.

Other files should reference this file instead of duplicating the full order.
