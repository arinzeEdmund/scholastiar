# UI-First Build Plan

Status: Active build strategy (adopted 2026-10-01)

This file decides **how** Scholastiar.ai is built.

`CANONICAL_ORDER.md` still decides document authority and service order. This file decides build phases.

## The Decision

Build the platform in two phases:

```txt
Phase A — UI Build
  Build every screen of the entire platform, one by one, in the ordered sequence below.
  Every screen is fully interactive and works against a mock data layer.
  No Supabase, no real AI provider calls, no payments, no email.

  ── UI Freeze gate ──

Phase B — Backend Build
  Build the Supabase schema, RLS, real auth, server actions, AI providers,
  storage, realtime, payments and email. Wire them in behind the same
  data layer interfaces, one domain at a time, in service order.
```

Why:

- The whole product can be seen, clicked and validated before any backend cost is paid.
- UX, flows and page specs get corrected while changes are cheap.
- The database is designed against real screens. Every table and column has a screen that needs it.
- Backend work becomes "make this already-working screen real" instead of "design and build everything at once".

## The One Rule That Prevents A Rewrite

The UI must never talk to mock data directly. It talks to a **data layer** whose interfaces are the same ones the Supabase implementation will satisfy later.

```txt
src/
  data/
    types/            domain types, shaped after STRUCTURE/DATABASE/db.md
    fixtures/         realistic seed objects (follow SEED_DATA.md, no real personal data)
    repositories/     one interface per domain: jobs, applications, profiles, ...
    mock/             in-memory implementations of every repository
    supabase/         (Phase B) Supabase implementations of the same interfaces
    index.ts          selects the implementation (DATA_SOURCE=mock | supabase)
  lib/actions/        server actions; Phase A calls mock repos, Phase B calls supabase repos
```

Rules:

- Components and pages import from `src/data` and `src/lib/actions` only. They never import fixtures.
- Domain types follow `db.md` table names and columns, so Phase B is a mapping exercise rather than a redesign.
- Server actions keep the production contract: Zod-validated input, `ActionResult<T>` output, no `redirect()` on success paths.
- Pages stay Server Components where the production version would be. They read through repositories on the server, exactly as they will with Supabase.
- The mock store lives on the server, in memory. In development it persists to a gitignored local JSON file so state survives restarts. A dev-only "Reset demo data" control restores the fixtures.

## Mock Platform Services (Phase A only)

These stand in for real infrastructure during Phase A and are deleted or replaced in Phase B.

| Concern | Phase A stand-in | Phase B replacement |
|---|---|---|
| Auth / session | Mock session cookie set by sign-in, sign-up and the dev role switcher | Supabase Auth |
| Roles | Dev role switcher: candidate, employer, provider, forwarder, office/agency, admin | `USER_ROLES_AND_PERMISSIONS.md` + RLS |
| Plans / entitlements | Dev plan switcher: free and each paid tier in `PRICING.md` | Billing entitlements |
| AI generation | Deterministic canned outputs with simulated latency and a simulated failure toggle | DeepSeek → Claude → OpenAI provider abstraction |
| File upload / video | Accept a file, keep its metadata, show a preview from a local object URL | Supabase Storage / Stream |
| Payments / checkout | Simulated success and failure screens | Stripe → Paystack → Flutterwave |
| Messaging realtime | Mock threads, with replies appended locally | Supabase Realtime |
| Notifications / email | In-app mock notifications created by mock actions | Notification queue + email intelligence |

The dev switchers render only when `DATA_SOURCE=mock`. They must never ship to production.

Implementation (built in U0):

- `/dev` shows build progress per stage and links to shell previews; `/dev/gallery` shows every base component.
- The dev panel (floating "Dev" button) switches persona, plan, screen state (live / loading / empty / error) and simulated AI failure, and resets demo data.
- When a route meets the Definition Of UI Done, add it to `READY_ROUTES` in `src/config/routes.ts`. Until then, navigation shows it greyed out with the stage that builds it.
- `pnpm test:e2e` runs the Playwright smoke tests against a production build. Add tests for each stage's key flows.

## Definition Of "UI Done" For A Screen

A screen is marked `completed ✅` in Phase A only when all of these are true:

1. The route from `ROUTES.md` exists and renders.
2. It matches its `PAGES/*.md` spec and `UI_BASE/ux_ui_base.md`.
3. It shows realistic mock data from the data layer. No lorem ipsum, no hardcoded arrays in components.
4. It has loading, empty and error states. Use a dev toggle or fixture variants to view each one.
5. It works at mobile (375px), tablet (768px) and desktop (1280px+) widths. Mobile bottom navigation works where it applies.
6. Every link, button, tab, filter and menu item goes somewhere real or does something real. No dead ends and no `href="#"`.
7. Forms use React Hook Form + Zod, show inline errors, prevent double submits, and persist through mock actions.
8. Mutations follow the toast pattern (`loading → success/error`) and the result is visible after navigation or refresh.
9. Role and plan gating behave as specified. Locked actions explain the required plan or role.
10. AI-assisted surfaces show generating, result, edit, regenerate and failure states using simulated output.
11. Basic accessibility holds: keyboard reachable, visible focus, labelled inputs, sensible headings.
11a. It looks right and stays readable in both light and dark mode (`ux_ui_base.md` → Light And Dark Mode).
12. `pnpm build` and lint pass with zero errors.

## Phase A Build Order

Build stages one at a time. Within a stage, build screens one by one in the listed order. Do not start the next stage until every screen in the current stage meets the Definition Of UI Done.

The per-route checklist lives in `PROGRESS_TRACKER.md` under **UI Screen Board**.

```txt
U0  Foundation
    App scaffold, design tokens, base components, layout shells (public, candidate,
    employer, provider, forwarder, office/agency, admin), mobile bottom tabs,
    PWA shell, data layer + mock store, dev role/plan/state switchers, utility pages.

U1  Public & marketing          home, about, how-it-works, pricing, blog, faq, legal, search
U2  Auth (mocked)               sign-in, sign-up variants (candidate: choose Starter/Pro +
                                mock checkout), choose-role, password flows
U3  Candidate core              dashboard, onboarding (all steps), profile, settings
U4  Shared opportunity system   universal opportunity card, filters, save, board actions,
                                shared apply workspace components (built inside a
                                component gallery route before the first service uses them)
U5  Candidate tools             AI CV, PersonalityAI CV, Signia + public /s/[handle],
                                application insights, messages, notifications, billing
U6  02 Universities             plus the shared candidate surfaces every service uses:
                                unified /saved and /applications list, detail and drafts
U7  03 Scholarships
U8  Provider portals            school and scholarship provider surfaces (universities,
                                colleges and scholarship providers)
U9  09 AI Apply Agent
U10 10 Apply For Me             customer and forwarder surfaces
U11 11 Discovery Engine         admin discovery surfaces
U12 12 Relocation              journey, Pre-Arrival and Post-Arrival Processes, costs, travel,
                                accommodation booking, roommates, communities, city guide,
                                pilots, cohorts, Handsoff, Year Check-in (candidate and public)
U13 Relocation operations       pilot workspace, housing-provider workspace, relocation admin
                                (rules library, embassies, preview, communities approval,
                                pilots, cohorts, settlements, support cases)
U14 13 Migration Agencies       public, customer, office and partner agency surfaces
U15 14 Jobs — candidate (Pro)   dashboard-only job connections: jobs, job detail, saved,
                                post-study jobs with visa sponsorship, apply flow. Pro plan
                                only; Starter sees both sections locked with an upgrade prompt.
                                No public job board.
U16 Employers                   employer onboarding, dashboard, jobs, applicants,
                                pipeline, candidates, messages, analytics, billing
U17 Admin                       platform admin surfaces, including per-service moderation
U18 Full click-through audit    see "UI Freeze Gate"
```

Spec gaps:

- If a `PAGES/*.md` spec defines a screen that is missing from `ROUTES.md`, add it to `ROUTES.md` and to the UI Screen Board before building it.
- If a screen needs behavior no spec defines, record the question in `PROGRESS_TRACKER.md` and ask. Do not invent business logic.
- If building a screen shows that a spec is wrong, update the spec in the same session.

## UI Freeze Gate

Phase B starts only after:

- [ ] every route on the UI Screen Board is `completed ✅`
- [ ] the critical journeys below have been clicked through end to end on mobile and desktop, in each relevant role
- [ ] Playwright smoke tests cover those journeys against the mock data layer
- [ ] every domain type in `src/data/types` has been reconciled with `db.md`, and `db.md` has been updated where the screens showed it was wrong
- [ ] open questions in `PROGRESS_TRACKER.md` are resolved or explicitly deferred
- [ ] the user has signed off on the UI

Critical journeys:

1. Visitor → sign up → choose Starter or Pro → mock checkout → onboarding → dashboard → personalized feed
2. Pro student opens Jobs in the dashboard → finds a student job that fits their visa hours → saves → applies with AI CV and answers → tracks status → messages the employer
3. Employer signs up → sets up company → posts job → admin approves → reviews applicants → moves pipeline → messages candidate
4. Candidate completes one application flow for a university and a scholarship
5. Provider publishes an opportunity → admin moderates → candidate applies
6. Candidate configures AI Apply Agent → queues opportunities → reviews a run
7. Candidate posts an Apply For Me proposal → forwarder accepts → milestones → proof → payment
8. Admin reviews the discovery queue → publishes an opportunity
9. Candidate books a migration agency service → office manages the appointment
10. Plan gating: a Starter student opens the locked Jobs or Post-study jobs section → upgrade to Pro → mock checkout → jobs unlocked

## Phase B Build Order

Follow the unified service order. For each domain:

1. Write migrations from `db.md` (reconciled at the UI Freeze) and `DATABASE_IMPLEMENTATION_PLAN.md`.
2. Write RLS from `RLS_POLICIES.md` and add RLS tests.
3. Implement `src/data/supabase/<domain>` against the existing repository interface.
4. Switch that domain to Supabase. Screens must not need changes beyond real error and latency handling.
5. Replace stand-ins: real auth, AI provider, storage, realtime, payments and email, as each domain needs them.
6. Run the acceptance criteria and tests from `ACCEPTANCE_CRITERIA.md` and `TESTING_STRATEGY.md`.
7. Mark the domain `tested 🟡`.

Sequence:

```txt
B0  Supabase project, env, auth, roles, RLS foundation, AI provider abstraction
B1  Profiles, onboarding, documents
B2  Applications, messaging, notifications
B3  AI CV, PersonalityAI CV, Signia
B4–B6  Universities, Scholarships, provider portals
B7  AI Apply Agent
B8  Apply For Me
B9  Discovery Engine
B10 Relocation (rules library, journeys, accommodation, pilots, cohorts, Year Check-in, settlement)
B11 Migration Agencies
B12 Jobs and employers (Pro entitlement for job connections)
B13 Billing and payments (Stripe, Paystack, Flutterwave, Cryptomus), WhatsApp and email delivery, admin operations, analytics, email intelligence
B14 Remove the mock layer and dev switchers from production builds; launch readiness
```

## Status Labels Across Both Phases

```txt
not started
in progress
completed ✅   Phase A: screen meets the Definition Of UI Done against mock data
tested 🟡      Phase B: screen is wired to the real backend and passes tests, RLS and acceptance criteria
```
