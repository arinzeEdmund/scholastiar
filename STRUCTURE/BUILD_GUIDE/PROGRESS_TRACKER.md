# Progress Tracker

Status: Permanent implementation tracker

Update this file after every meaningful implementation change.

## Feature Status Legend

Use these labels consistently when tracking implementation:

```txt
not started
in progress
completed ✅
tested 🟡
```

Status rules:

- `completed ✅` means the feature has been implemented and works manually within its defined scope.
- `tested 🟡` means the feature has passed the relevant automated tests, manual flow check, RLS/security checks where applicable, and acceptance criteria.
- A feature should become `completed ✅` before it becomes `tested 🟡`.
- Do not mark a feature `tested 🟡` only because it was visually checked; it must pass the relevant verification listed in `STRUCTURE/BUILD_GUIDE/TESTING_STRATEGY.md`.

## Current Service

- Service 0: Foundation scaffold — in progress.

## Current Goal

- Complete the foundation scaffold (app scaffold, design system, PWA shell, Supabase utilities, auth) before beginning Service 1: Jobs.

## Completed

- `AGENTS.md` defines product vision, unified platform scope, and cross-border mobility principle.
- `SERVICES/` contains all service specs in one ordered location.
- `PAGES/` contains all page specs in one ordered location.
- The former split documentation structure has been collapsed.
- `DATABASE/db.md` exists as central database blueprint.
- `UI_BASE/ux_ui_base.md` exists as central UI/UX reference.
- `BUILD_GUIDE/` execution documents exist.
- `IMPLEMENTATION_START_CHECKLIST.md` defines first-build defaults and pre-code requirements.
- `ROUTES.md` now covers the unified platform services.
- `ACCEPTANCE_CRITERIA.md` now covers all ordered services and shared platform requirements.
- `PRICING.md` defines applicant, AI Apply Agent, Apply For Me, employer, provider, and migration agency pricing structure.
- `EMAIL_INTELLIGENCE.md` defines lifecycle email, digest, deadline, readiness, AI Apply Agent, Apply For Me, and conversion email behavior.
- `PWA_FIRST_WEB_APP.md` defines the PWA-first web/mobile experience, including installability, app shell, offline-aware states, push support, mobile bottom navigation, and bridge to React Native.
- `growth_hack.txt` defines the $1m MRR model, cost-effective growth channels, target audiences, marketing tools, execution strategy, and revenue mix.
- `PUBLISHING_INTELLIGENCE_ENGINE.md` defines the article, news, immigration update, newsletter, SEO, AI search, humanized writing, and content funnel system.
- `SPONSORED_ADS_MARKETPLACE.md` defines sponsored posts, ads, featured placements, newsletter sponsorships, campaign packages, sponsor verification, and trust rules.
- Environment placeholders are ready for Supabase, DeepSeek, Stripe, Paystack, Flutterwave, email, and admin MFA.
- AI provider policy is set to DeepSeek primary, Claude fallback, and OpenAI fallback via environment variables.
- Payment provider strategy is set to Stripe primary, Paystack fallback, and Flutterwave fallback/additional rail.
- Admin MFA policy is set as mandatory before public beta and mandatory for production super/platform admins.
- Service-specific open questions have been reclassified as later-phase non-blocking decisions.
- Useful template/context workflow rules migrated into `BUILD_GUIDE`.
- `STRUCTURE/MAP.md` exists as the full project planning and connection map.
- A temporary app skeleton was previously created, then intentionally removed because implementation had not officially started yet.
- Planning and architecture files live under `STRUCTURE/`.
- Central path references now point to `SERVICES/` and `PAGES/`.
- `MOBILE_STRUCTURE/` defines the React Native mobile app planning layer, including mobile scope, stack, environment, scaffold checklist, Expo routes, navigation, screens, AI workflows, notifications, payments, app store policy, analytics/crash reporting, offline behavior, testing, release planning, and web-only exclusions.
- Signia has been added as the PersonalityAI CV proof-of-work and employer deep-search layer, with service spec, page spec, routes, API actions, database blueprint, pricing notes, acceptance criteria, and UX direction.

## Unified Build Order

1. Jobs - not started
2. Universities - not started
3. Scholarships - not started
4. Fellowships - not started
5. Grants - not started
6. Competitions - not started
7. Conferences / Training - not started
8. Awards - not started
9. AI Apply Agent - not started
10. Apply For Me - not started
11. Discovery Engine - not started
12. Migration Agencies - not started

## Feature Status Board

Update this board as implementation progresses.

```txt
Foundation / app scaffold        completed ✅
Auth and role routing            completed ✅
Candidate onboarding/profile     completed ✅
Employer company foundation      completed ✅
Jobs schema and seed data        completed ✅
Admin job moderation             not started
Public job board                 completed ✅
Candidate job feed               completed ✅
Universal opportunity cards      not started
Save/apply flow                  completed ✅
Application tracking             completed ✅
Employer applicant review        completed ✅
Basic AI fit/CV/application      not started
Signia proof-of-work profiles    not started
Employer Signia deep search      not started
```

## In Progress

- Service 1: Jobs — core vertical complete. Admin moderation + AI matching next.

## Next Up

- Admin jobs moderation: `/admin/jobs` page to approve, reject, pause listings.
- Supabase migrations 006–007 must be run in the SQL editor.
- AI job fit analysis (Phase 2 of Jobs spec).
- Service 2: Universities.

## Remaining Setup Items

- Add real Supabase keys to `.env.local` when the Supabase project is created.
- Add real DeepSeek API key when AI implementation begins.
- Add real Anthropic API key when AI fallback is enabled.
- Add real OpenAI API key when second AI fallback is enabled.
- Add Stripe, Paystack, and Flutterwave keys when checkout work begins.
- Add PWA icons (192x192 and 512x512) to `public/icons/`.
- Run `npx shadcn@latest init` to complete design system setup.

## Architecture Decisions

- Scholastiar.ai is one unified opportunity and mobility platform.
- Services are implemented one after another in the required order.
- Every opportunity service must support cross-border mobility or global advancement.
- Supabase is the backend foundation.
- DeepSeek is the first AI provider.
- Anthropic Claude is the first AI fallback provider.
- OpenAI API is the second AI fallback provider.
- Use latest production DeepSeek API model IDs via environment variables, defaulting to `deepseek-v4-flash` and `deepseek-v4-pro`.
- Use environment-driven Claude and OpenAI model IDs for fallback.
- Payments use Stripe, Paystack, and Flutterwave with provider fallback.
- Pricing source of truth is `STRUCTURE/BUILD_GUIDE/PRICING.md`.
- Email intelligence source of truth is `STRUCTURE/BUILD_GUIDE/EMAIL_INTELLIGENCE.md`.
- PWA-first web app source of truth is `STRUCTURE/BUILD_GUIDE/PWA_FIRST_WEB_APP.md`.
- Growth strategy source note is `STRUCTURE/BUILD_GUIDE/growth_hack.txt`.
- Publishing intelligence source of truth is `STRUCTURE/BUILD_GUIDE/PUBLISHING_INTELLIGENCE_ENGINE.md`.
- Sponsored ads and sponsorship source of truth is `STRUCTURE/BUILD_GUIDE/SPONSORED_ADS_MARKETPLACE.md`.
- React Native mobile planning source of truth is `MOBILE_STRUCTURE/README.md`.
- Admin MFA is mandatory before public beta and mandatory for production super/platform admins.
- Implementation code should live at the repository root beside `STRUCTURE/` unless a multi-app need appears.
- Employer-created jobs require admin approval before public visibility in the first launch.
- Unverified employers can onboard but cannot publish public jobs.
- Billing can start with plan entitlement modeling before payment checkout is enabled.
- RLS is mandatory for user, provider, application, document, and messaging data.
- AI calls must be server-side.
- UI should follow `STRUCTURE/UI_BASE/ux_ui_base.md`.
- Planning docs are centralized under `STRUCTURE/`; implementation code can live outside `STRUCTURE/` to keep product planning separate from app source.
- The project is currently documentation-only by choice.
- Signia is a shared platform service connected to PersonalityAI CV, candidate profiles, documents/storage, employer review, candidate ranking, and employer search.
- Signia must preserve candidate-controlled visibility and consent before any proof item, document text, transcript, or social link becomes public or employer-searchable.

## Session Notes

- The old `templates/` context system has been migrated into `BUILD_GUIDE`.
- Future AI agents should read `STRUCTURE/BUILD_GUIDE/AI_BUILD_RULES.md` before implementation.
- On 2026-06-01, the planning folders/files were moved into `STRUCTURE/`.
- On 2026-06-01, the service/page specs were collapsed into `STRUCTURE/SERVICES/` and `STRUCTURE/PAGES/`.
- On 2026-06-03, Signia was integrated into the planning system as a candidate showcase, public portfolio, and employer deep-search feature.
- On 2026-06-20, foundation scaffold created: Node.js v24.14.1, npm 11.12.1, pnpm 11.8.0 confirmed. Next.js 16.2.9 + TypeScript + Tailwind v4 + App Router scaffolded at project root. `.env.local` created from template. Brand colors and metadata applied. PWA manifest added. `src/`, `supabase/migrations/`, `public/icons/` directories created. Build passes cleanly.
- On 2026-06-20, core dependencies installed: @supabase/supabase-js, @supabase/ssr, react-hook-form, @hookform/resolvers, zod, @tanstack/react-query, zustand, lucide-react. shadcn/ui initialised (Radix + Nova base, Tailwind v4). Base components installed: button, input, card, badge, dialog, sheet, tabs, tooltip, skeleton, progress, textarea, checkbox, select, dropdown-menu. Scholastiar green (#10B65B / oklch(0.657 0.185 149.5)) set as --primary in CSS. PWA service worker (public/sw.js) written with shell/static/dynamic caching and skip-waiting support. PWA components built: ServiceWorkerRegistration, OfflineBanner, InstallPrompt, MobileBottomTabs, PWAUpdateToast. Route groups created: (public), (candidate) with MobileBottomTabs, (employer), (admin). Root layout wired with QueryProvider, TooltipProvider, and all PWA components. Supabase utilities created: src/lib/supabase/client.ts (browser), src/lib/supabase/server.ts (server), src/lib/supabase/admin.ts (service-role, server-only). middleware.ts created with session refresh, protected-route guard, and auth-route redirect. Build passes cleanly.
- On 2026-06-20, auth, onboarding, jobs, and public job board implemented: Supabase migrations 001–005 (identity, candidate, employer, jobs, seed with 6 sponsored jobs). TypeScript DB types and ActionResult pattern. Auth pages (sign-in, sign-up/candidate/employer, forgot/reset password, verify-email, callback). Candidate onboarding 7-step flow (personal, visa, education, experience, skills, preferences, review + complete pages). Profile overview page. JobCard and SponsorshipBadge components. Public /jobs page with search + filter chips. /jobs/[jobId] detail page. /discover candidate feed page. Home page with hero + CTAs. middleware.ts fixed (correct /auth/* routes, /onboarding added to PROTECTED_PREFIXES). Button component extended with asChild via Base UI render prop. Onboarding actions rewritten to return Promise<void> (fixing redirect-in-try-catch bug). Build: 24 routes, zero TypeScript errors, clean production build.
