# Implementation Start Checklist

Status: Pre-code readiness checklist

Use this file before creating the app scaffold or writing implementation code.

## Start Decision

Implementation is UI-first (decided 2026-10-01). See `STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md`.

Phase A starts with stage U0 Foundation: the app scaffold plus a mock data layer. Then every screen of the platform is built in order. Universities is the first opportunity service and the first full UI journey. Jobs became a Pro-only dashboard feature and the last ordered service (decided 2026-10-07; see `SERVICES/14-jobs.md`).

Supabase, AI provider keys and payment keys are not needed until Phase B.

## Code Location Decision

Default decision:

```txt
implementation code lives at the repository root beside STRUCTURE/
```

Expected root layout after scaffold:

```txt
STRUCTURE/
src/
supabase/
public/
public/manifest.webmanifest
package.json
tsconfig.json
next.config.ts
tailwind.config.ts
components.json
.env.local
```

Use a separate `APP/` folder only if the repository later needs multiple apps.

## Required Local Tooling

Before implementation:

- Node.js LTS is available
- npm, pnpm, or yarn is available
- Supabase project or local Supabase environment is available
- `.env.local` is created from `STRUCTURE/BUILD_GUIDE/ENVIRONMENT.md` placeholders
- Supabase keys can be added when available
- package manager choice is confirmed
- PWA-first web requirements are reviewed in `STRUCTURE/BUILD_GUIDE/PWA_FIRST_WEB_APP.md`

Recommended package manager:

```txt
pnpm
```

Fallback:

```txt
npm
```

## Initial Tech Decisions

Use:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- React Hook Form
- Zod
- TanStack Query
- Zustand only for truly global client state
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Supabase Realtime where useful
- Supabase RLS
- Web App Manifest
- Service Worker / Workbox or next-pwa
- IndexedDB or safe persisted cache for mobile web
- DeepSeek as first AI provider
- latest production DeepSeek model via env-driven model IDs
- Anthropic Claude API as first AI fallback provider
- OpenAI API as second AI fallback provider
- server-side AI provider abstraction with attempt/failure logging
- Vercel AI SDK where useful
- Vercel for deployment
- Stripe, Paystack, and Flutterwave for payments with provider fallback

## First Launch Product Defaults

- employer job posts require admin approval before public visibility
- employer signup may start without mandatory work email, but unverified employers cannot publish jobs
- admin MFA is mandatory before public beta and mandatory for production super admin/platform admin access
- billing can begin with stubbed plan entitlements before checkout UI
- checkout provider order is Stripe primary, Paystack fallback, Flutterwave fallback/additional rail
- AI Apply Agent and Apply For Me board actions can exist before full execution systems, but plan gates and board data must be modeled early
- AI provider fallback order is DeepSeek, then Claude, then OpenAI
- fallback is allowed for provider outage, rate limits, restrictions, bans, or policy blocks on otherwise valid workflows

## First Build Sequence

### Phase A — UI Build (stage U0, then U1 → U18 per `UI_FIRST_BUILD_PLAN.md`)

1. App scaffold (Next.js, TypeScript, Tailwind, shadcn/ui, lint, format)
2. Design tokens and base components from `UI_BASE/ux_ui_base.md` and `COMPONENT_SYSTEM.md`
3. Layout shells for public, candidate, employer, provider, forwarder, office/agency and admin
4. PWA app shell, manifest, mobile bottom navigation, and offline-aware base states
5. `src/data` domain types (shaped after `db.md`), repository interfaces, fixtures and the in-memory mock store
6. Mock session plus the dev role, plan and state switchers
7. Utility pages and the `/dev/gallery` component gallery
8. Then the screens, stage by stage, as listed on the UI Screen Board in `PROGRESS_TRACKER.md`

### Phase B — Backend Build (after the UI Freeze gate)

Follow the Phase B stages B0 → B14 in `UI_FIRST_BUILD_PLAN.md`.

## Stop Conditions

Pause implementation and update planning docs if:

- a screen needs behavior no `SERVICES/` or `PAGES/` spec defines
- a UI component would need to import fixtures or call Supabase directly instead of going through `src/data`

- RLS ownership rules are unclear
- a route requires a missing page spec
- a mutation lacks an acceptance criterion
- a premium feature lacks a plan entitlement rule
- a mobile/PWA action would queue a sensitive operation without online confirmation
- an AI action would submit or expose user data without consent
- external automation would violate a portal rule or legal boundary
