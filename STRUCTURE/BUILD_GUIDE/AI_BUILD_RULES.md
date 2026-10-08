# AI Build Rules

Status: Instructions for AI coding agents

## Required Context

Before building, read from the repository root:

1. `STRUCTURE/AGENTS.md`
2. `STRUCTURE/MAP.md`
3. `STRUCTURE/BUILD_GUIDE/MASTER_BUILD_PLAN.md`
4. `STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md` (active build strategy)
5. `STRUCTURE/BUILD_GUIDE/MVP_SCOPE.md`
6. `STRUCTURE/DATABASE/db.md`
7. `STRUCTURE/UI_BASE/ux_ui_base.md`
8. relevant service spec in `STRUCTURE/SERVICES/`
9. relevant page spec in `STRUCTURE/PAGES/`
10. `STRUCTURE/BUILD_GUIDE/IMPLEMENTATION_START_CHECKLIST.md`
11. `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md`

## Scope Rules

- Build Scholastiar.ai as one unified platform.
- Follow the ordered service sequence exactly.
- Work one service unit at a time.
- Prefer small verified increments.
- Do not mix unrelated domains in one change.
- If a change cannot be verified end to end quickly, split it.
- Do not infer or invent product behavior that is not defined in the specs.

## Build Phase Rules

The project is built UI-first. Check `PROGRESS_TRACKER.md` for the current phase and stage before writing code.

Phase A — UI Build:

- Build one screen at a time, in the stage order in `UI_FIRST_BUILD_PLAN.md`.
- Pages and components read and write only through `src/data` repositories and `src/lib/actions`. They never import fixtures and never call Supabase.
- Keep production contracts even when the data is mocked: Zod validation, `ActionResult<T>`, toast feedback, Server Components where production would use them.
- Shape domain types after `DATABASE/db.md`. If a screen needs a field `db.md` lacks, add it to `db.md` in the same session.
- Simulate AI, uploads, payments, realtime and email with the documented stand-ins. Never add real provider calls in Phase A.
- Dev switchers and the mock layer must only be active when `DATA_SOURCE=mock`.
- A screen is done only when it meets the Definition Of UI Done. Update its row on the UI Screen Board.

Phase B — Backend Build:

- Do not start before the UI Freeze gate is checked off in `PROGRESS_TRACKER.md`.
- Wire one domain at a time by implementing `src/data/supabase/<domain>` against the existing interface. Avoid reworking screens.
- All architecture invariants, RLS rules and AI rules below apply in full.

## Unified Service Sequence

1. Universities
2. Scholarships
3. AI Apply Agent
4. Apply For Me
5. Discovery Engine
6. Relocation
7. Migration Agencies
8. Jobs (Pro-only job connections in the candidate dashboard; moved last on 2026-10-07)

## Cross-Border Opportunity Rule

Every opportunity service must support international mobility. Jobs, universities, scholarships, AI application systems, discovery, and migration agencies should help users move toward work abroad, study abroad, funded travel, relocation, migration, international credibility, or a chosen destination country.

## When To Split Work

Split implementation if it combines:

- unrelated product domains
- UI and database work that cannot be verified together
- multiple unrelated API actions
- major RLS changes plus feature UI
- speculative behavior not clearly defined in docs

## Missing Requirements

If requirements are unclear:

- check the relevant `STRUCTURE/SERVICES/` and `STRUCTURE/PAGES/` docs
- check `STRUCTURE/BUILD_GUIDE/MVP_SCOPE.md`
- add unresolved items to `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md`
- ask for clarification before implementing risky behavior

Do not quietly invent missing business logic.

## Architecture Invariants

The codebase must never violate these rules:

- RLS is the real access boundary for user/company/opportunity data.
- Service-role keys never run in client code.
- AI provider keys never run in client code.
- AI generation happens server-side.
- Candidate private data is not visible to employers, universities, funders, providers, agencies, or forwarders except through permitted views.
- Employer and provider data is scoped by memberships/ownership rules.
- Documents are private by default.
- User consent is required before submitting applications or sharing sensitive documents.
- Admin actions that affect users, providers, opportunities, applications, billing, or documents are auditable.
- AI must never claim guaranteed visa, admission, funding, employment, migration, or award outcomes.

## Technical Rules

- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind CSS and shadcn/ui.
- Use Supabase Auth, PostgreSQL, Storage, Realtime, and RLS.
- Do not introduce Firebase.
- Keep AI calls server-side.
- Validate inputs with Zod.
- Use React Hook Form for complex forms.
- Use TanStack Query for server state where useful.
- Use Zustand only for global client state.
- Keep modules small and single-purpose.
- Fix root causes instead of layering workarounds.
- Validate unknown external input at system boundaries.
- Keep route handlers and server actions focused.
- Enforce auth and ownership before mutations.

## UI Rules

- Follow `STRUCTURE/UI_BASE/ux_ui_base.md`.
- Use Scholastiar green as an accent.
- Keep dashboards calm and scannable.
- Use mobile-first layouts.
- Do not create noisy decorative interfaces.

## Toast / User Feedback Rules

- Every interactive mutation (save, apply, post, moderate, upload, trigger) must give loading → success/error feedback via `react-hot-toast`.
- Use the `toast.loading(…)` → `toast.success/error(…, { id })` pattern described in `COMPONENT_SYSTEM.md`.
- Mutating server actions called from client components must return `ActionResult<T>`, not `Promise<void>`. They must not call `redirect()` on the success path; client components handle navigation via `router.push()`.
- Never mount a second `<Toaster />`. The one in `src/app/layout.tsx` covers all routes.
- Use canonical design token classes in all new components (e.g. `text-green`, `bg-soft-green`, `text-primary-text`). Never use hardcoded hex colours like `text-[#10B65B]`.

## AI Rules

- AI must not fabricate facts.
- AI output must be reviewable and editable.
- Store prompt/generation metadata.
- Track source facts where possible.
- Treat visa, immigration, funding, admission, and legal content as guidance, not guaranteed advice.

## Progress Rules

After meaningful implementation:

- update relevant docs if architecture/scope changed
- update `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md`
- run relevant checks/tests
- explain what changed and what remains

## Before Moving To The Next Stage (Phase A)

1. Every screen in the stage meets the Definition Of UI Done in `UI_FIRST_BUILD_PLAN.md`.
2. Every screen in the stage is marked on the UI Screen Board.
3. `pnpm build` and lint pass.
4. Any spec, route or `db.md` changes found while building are written back.

## Before Moving To The Next Service (Phase B)

Before moving on:

1. The current service works end to end within its defined scope.
2. No architecture invariant was violated.
3. Relevant acceptance criteria pass.
4. RLS assumptions are verified for affected data.
5. `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md` reflects the completed work.
6. Build/test commands pass where available.
