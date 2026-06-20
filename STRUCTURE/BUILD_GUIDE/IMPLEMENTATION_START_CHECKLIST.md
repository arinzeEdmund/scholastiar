# Implementation Start Checklist

Status: Pre-code readiness checklist

Use this file before creating the app scaffold or writing implementation code.

## Start Decision

Implementation starts with Service 1: Jobs.

Jobs should be built as the first full vertical slice of the unified opportunity platform, not as an isolated job board.

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
- employer signup may start without mandatory work email, but unverified employers cannot publish public jobs
- admin MFA is mandatory before public beta and mandatory for production super admin/platform admin access
- billing can begin with stubbed plan entitlements before checkout UI
- checkout provider order is Stripe primary, Paystack fallback, Flutterwave fallback/additional rail
- AI Apply Agent and Apply For Me board actions can exist before full execution systems, but plan gates and board data must be modeled early
- AI provider fallback order is DeepSeek, then Claude, then OpenAI
- fallback is allowed for provider outage, rate limits, restrictions, bans, or policy blocks on otherwise valid workflows

## First Build Sequence

1. App scaffold
2. Design system and base layouts
3. PWA app shell, manifest, mobile bottom navigation, and offline-aware base states
4. Supabase client/server utilities
5. Auth and role routing
6. RLS foundation
7. Candidate onboarding/profile essentials
8. Employer company essentials
9. Jobs schema and seed data
10. Admin job moderation
11. Public job board
12. Candidate job feed
13. Universal opportunity card actions
14. Save/apply flow
15. Application tracking
16. Employer applicant review
17. Basic AI fit/CV/application support

## Stop Conditions

Pause implementation and update planning docs if:

- RLS ownership rules are unclear
- a route requires a missing page spec
- a mutation lacks an acceptance criterion
- a premium feature lacks a plan entitlement rule
- a mobile/PWA action would queue a sensitive operation without online confirmation
- an AI action would submit or expose user data without consent
- external automation would violate a portal rule or legal boundary
