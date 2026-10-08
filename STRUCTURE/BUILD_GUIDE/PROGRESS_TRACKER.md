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
- In Phase A (UI Build), `completed ✅` means the screen meets the Definition Of UI Done in `STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md` against mock data. `tested 🟡` is only reachable in Phase B, once the screen is wired to the real backend.

## Build Strategy

- UI-first, adopted 2026-10-01. See `STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md`.
- Phase A: build every screen of the platform, one by one, fully interactive against a mock data layer.
- UI Freeze gate: sign-off before any backend work.
- Phase B: build the Supabase schema, RLS, auth, AI, storage, payments and email behind the same data layer interfaces, in service order.

## Current Phase

- Phase A — UI Build.

## Current Stage

- U0 Foundation — completed ✅ (2026-10-01).
- U1 Public & marketing — completed ✅ (2026-10-01).
- U2 Auth (mocked) — completed ✅ (2026-10-01).
- U3 Candidate core — completed ✅ (2026-10-02).
- U4 Shared opportunity system — completed ✅ (2026-10-07).
- U5 Candidate tools — completed ✅ (2026-10-08).
- U6 02 Universities — next, awaiting go-ahead.

## Current Goal

- U6 02 Universities: the public study catalogue (`/programs` with category tabs, level and field landing pages, programme pages with sign-up prompts), university directory and profiles, country hubs, the three apply routes, `/saved`, `/applications` (list, detail, drafts) and return-to-page after sign-up.

## Next Up

- U6 Universities, then U7 Scholarships. U6 also turns on the dashboard's "Browse all programmes", the CV preview's "Attach to an application" and real submissions from the apply workspace.

## Open Questions

- **AI usage limits per plan.** Pricing says Starter has "standard monthly credits" and Pro "higher limits" for AI CVs, essays and answers, but no numbers. `/billing` shows usage counts only until limits are set.
- **Downgrades and refunds.** Pro → Starter is scheduled for the end of the paid period with no refund (built that way in U5). Confirm, and decide what happens to a Pro student's job applications after the downgrade.
- **PersonalityAI CV video length and storage.** Recording is capped at two minutes and uploads at 200 MB in Phase A; stored playback for reviewers comes with video storage in Phase B. Confirm the limits.
- **Relocation — verify rules before activation.** Russia's pre-arrival and post-arrival steps, embassy details (starting with Nigeria and Rwanda) and emergency numbers must be checked against official sources (and university international offices) before Russia is activated — and the same for every country activated later (country activation gate in `SERVICES/12-relocation.md`). Seed data stays marked unverified.
- **WhatsApp provider.** Official WhatsApp Business Platform access (direct or through a provider) for the automated official account. Message templates need approval by WhatsApp before launch.

- **Social media icons and links (reminder).** The footer has no social links yet because no accounts exist. When the accounts are created, add each one to `SOCIAL_LINKS` in `src/config/site.ts` (platform name + URL); the footer shows them automatically. Needed before launch.
- **Contact email addresses.** The contact page and legal pages use `support@`, `employers@`, `partners@`, `press@` and `privacy@scholastiar.ai` (`src/config/site.ts`). Are these the real addresses?
- **Testimonials.** The homepage shows three placeholder quotes (`is_placeholder: true`). Real, consented testimonials are needed before launch.
- **Legal review.** `/privacy` and `/terms` are drafts and say so on the page. They need review by a qualified lawyer, plus cancellation/refund terms.
- **Brand photography.** The UI base asks for real human photography; none exists yet, so public pages use product previews instead.

## UI Freeze Gate

- [ ] every route on the UI Screen Board is `completed ✅`
- [ ] critical journeys clicked through end to end on mobile and desktop
- [ ] Playwright smoke tests pass against the mock data layer
- [ ] `src/data/types` reconciled with `DATABASE/db.md`
- [ ] open questions resolved or deferred
- [ ] user sign-off

## Pending Updates To Completed Stages

Decided 2026-10-02; completed 2026-10-02 (all done before U4):

```txt
Crypto tab at checkout (/billing/checkout) — Cryptomus, mock test payments         done       
WhatsApp number + opt-in at sign-up and onboarding (About you)                     done       
WhatsApp column in /settings/notifications (security/payment/emergency locked on)  done       
Message catalogue (email + WhatsApp + in-app) for every U0–U3 event               done       
Dev "Message outbox" showing every email and WhatsApp message sent (mock mode)     done       
```

## UI Screen Board

Mark each route `in progress` → `completed ✅` as it meets the Definition Of UI Done. Mark a stage completed only when all of its routes are completed. Add any route found in `PAGES/*.md` but missing here to both `ROUTES.md` and this board.

### U0 Foundation — completed ✅

```txt
/dev/gallery (dev only)                                completed ✅
/unauthorized                                          completed ✅
/not-found                                             completed ✅
/server-error                                          completed ✅
/maintenance                                           completed ✅
/offline                                               completed ✅
```

### U1 Public & marketing — completed ✅

```txt
/                                                      completed ✅
/about                                                 completed ✅
/how-it-works                                          completed ✅
/pricing                                               completed ✅
/blog                                                  completed ✅
/blog/[slug]                                           completed ✅
/contact                                               completed ✅
/faq                                                   completed ✅
/privacy                                               completed ✅
/terms                                                 completed ✅
/search                                                completed ✅
```

### U2 Auth (mocked) — completed ✅

```txt
/auth/sign-in                                          done       
/auth/sign-up/candidate                                done       
/auth/sign-up/employer                                 done       
/auth/sign-up/provider                                 done       
/auth/choose-role                                      done       
/auth/forgot-password                                  done       
/auth/reset-password                                   done       
/auth/verify-email                                     done       
/billing/checkout                                      done       
```

### U3 Candidate core — completed ✅

```txt
/dashboard                                             done       
/onboarding                                            done       
/onboarding/personal                                   done       
/onboarding/visa                                       done       
/onboarding/education                                  done       
/onboarding/experience                                 done       
/onboarding/skills                                     done       
/onboarding/preferences                                done       
/onboarding/personality-cv                             done       
/onboarding/review                                     done       
/onboarding/complete                                   done       
/profile                                               done       
/profile/edit                                          done       
/profile/experience/[experienceId]                     done       
/profile/skills                                        done       
/profile/visa                                          done       
/profile/preferences                                   done       
/profile/documents                                     done       
/settings                                              done       
/settings/notifications                                done       
```

### U4 Shared opportunity system — completed ✅

```txt
/dev/gallery#opportunity-card                          completed ✅
/dev/gallery#apply-workspace                           completed ✅
```

### U5 Candidate tools — completed ✅

```txt
/ai-cv                                                 completed ✅
/ai-cv/generate                                        completed ✅
/ai-cv/[cvId]                                          completed ✅
/ai-cv/[cvId]/edit                                     completed ✅
/ai-cv/history                                         completed ✅
/personality-cv                                        completed ✅
/personality-cv/record                                 completed ✅
/personality-cv/preview                                completed ✅
/personality-cv/settings                               completed ✅
/signia                                                completed ✅
/signia/builder                                        completed ✅
/signia/projects/[projectId]                           completed ✅
/signia/media                                          completed ✅
/signia/social-links                                   completed ✅
/signia/preview                                        completed ✅
/s/[handle]                                            completed ✅
/applications/insights                                 completed ✅
/messages                                              completed ✅
/messages/[threadId]                                   completed ✅
/notifications                                         completed ✅
/billing                                               completed ✅
```

### U6 02 Universities — not started

```txt
/programs                                              not started
/programs/[levelSlug]                                  not started
/programs/[levelSlug]/[fieldSlug]                      not started
/universities                                          not started
/universities/search                                   not started
/universities/country/[countrySlug]                    not started
/universities/[universitySlug]                         not started
/universities/[universitySlug]/programs                not started
/universities/[universitySlug]/programs/[programSlug]  not started
/universities/[universitySlug]/eligibility             not started
/universities/[universitySlug]/apply                   not started
/universities/saved                                    not started
/universities/compare                                  not started
/universities/dashboard                                not started
/universities/applications                             not started
/universities/applications/[applicationId]             not started
/saved                                                 not started
/applications                                          not started
/applications/[applicationId]                          not started
/applications/drafts                                   not started
```

### U7 03 Scholarships — not started

```txt
/scholarships                                          not started
/scholarships/search                                   not started
/scholarships/[scholarshipSlug]                        not started
/scholarships/[scholarshipSlug]/eligibility            not started
/scholarships/[scholarshipSlug]/apply                  not started
/scholarships/matcher                                  not started
/scholarships/saved                                    not started
/scholarships/applications                             not started
/scholarships/applications/[applicationId]             not started
/scholarships/applications/[applicationId]/answers     not started
/scholarships/deadlines                                not started
/scholarships/verification                             not started
```

### U8 Provider portals — not started

```txt
/providers/onboarding                                  not started
/providers/dashboard                                   not started
/providers/opportunities                               not started
/providers/opportunities/new                           not started
/providers/opportunities/[opportunityId]/edit          not started
/providers/applications                                not started
/providers/applications/[applicationId]                not started
/providers/team                                        not started
/providers/settings                                    not started
```

### U9 09 AI Apply Agent — not started

```txt
/apply-agent                                           not started
/apply-agent/setup                                     not started
/apply-agent/rules                                     not started
/apply-agent/queue                                     not started
/apply-agent/queue/add                                 not started
/apply-agent/runs                                      not started
/apply-agent/runs/[runId]                              not started
/apply-agent/performance                               not started
/apply-agent/pricing                                   not started
```

### U10 10 Apply For Me — not started

```txt
/apply-for-me                                          not started
/apply-for-me/board                                    not started
/apply-for-me/proposals/new                            not started
/apply-for-me/proposals/[proposalId]                   not started
/apply-for-me/campaigns                                not started
/apply-for-me/campaigns/[contractId]                   not started
/apply-for-me/messages                                 not started
/apply-for-me/payments                                 not started
/forwarder/onboarding                                  not started
/forwarder/dashboard                                   not started
/forwarder/contracts                                   not started
/forwarder/contracts/[contractId]                      not started
```

### U11 11 Discovery Engine — not started

```txt
/admin/discovery                                       not started
/admin/discovery/categories                            not started
/admin/discovery/sources                               not started
/admin/discovery/sources/[sourceId]                    not started
/admin/discovery/queue                                 not started
/admin/discovery/queue/[itemId]                        not started
/admin/discovery/freshness                             not started
/admin/discovery/coverage                              not started
```

### U12 12 Relocation — not started

```txt
/relocation                                            not started
/relocation/[countrySlug]                              not started
/pilots/apply                                          not started
/journey                                               not started
/journey/setup                                         not started
/journey/pre-arrival                                   not started
/journey/post-arrival                                  not started
/journey/steps/[stepId]                                not started
/journey/costs                                         not started
/journey/travel                                        not started
/journey/cohort                                        not started
/journey/handsoff                                      not started
/accommodation                                         not started
/accommodation/[listingId]                             not started
/accommodation/[listingId]/book                        not started
/accommodation/bookings                                not started
/accommodation/bookings/[bookingId]                    not started
/roommates                                             not started
/roommates/profile                                     not started
/roommates/requests                                    not started
/communities                                           not started
/communities/[communityId]                             not started
/communities/suggest                                   not started
/city-guide/[citySlug]                                 not started
/pilots                                                not started
/pilots/awards                                         not started
/pilots/awards/vote                                    not started
/pilots/[pilotId]                                      not started
/pilots/bookings                                       not started
/pilots/bookings/[bookingId]                           not started
/support                                               not started
/support/join                                          not started
/support/cases/new                                     not started
/support/cases/[caseId]                                not started
```

### U13 Relocation operations — not started

```txt
/pilot/onboarding                                      not started
/pilot/dashboard                                       not started
/pilot/requests                                        not started
/pilot/bookings/[bookingId]                            not started
/pilot/cohorts                                         not started
/pilot/cohorts/[cohortId]                              not started
/pilot/cases                                           not started
/pilot/earnings                                        not started
/pilot/referrals                                       not started
/pilot/profile                                         not started
/housing/onboarding                                    not started
/housing/dashboard                                     not started
/housing/listings                                      not started
/housing/listings/new                                  not started
/housing/listings/[listingId]                          not started
/housing/bookings                                      not started
/housing/bookings/[bookingId]                          not started
/housing/payouts                                       not started
/admin/relocation                                      not started
/admin/relocation/countries/[countryCode]              not started
/admin/relocation/steps/[stepId]                       not started
/admin/relocation/embassies                            not started
/admin/relocation/embassies/[embassyId]                not started
/admin/relocation/preview                              not started
/admin/relocation/reviews                              not started
/admin/relocation/costs                                not started
/admin/communities                                     not started
/admin/pilots                                          not started
/admin/pilots/[pilotId]                                not started
/admin/pilot-commissions                               not started
/admin/pilot-awards                                    not started
/admin/cohorts                                         not started
/admin/accommodation                                   not started
/admin/settlements                                     not started
/admin/support-cases                                   not started
/admin/support-cases/[caseId]                          not started
/admin/partner-lawyers                                 not started
```

### U14 13 Migration Agencies — not started

```txt
/migration-agencies                                    not started
/migration-agencies/search                             not started
/migration-agencies/[agencySlug]                       not started
/migration-agencies/services/[serviceId]               not started
/migration-agencies/book/[serviceId]                   not started
/migration-agencies/dashboard                          not started
/migration-agencies/appointments/[appointmentId]       not started
/migration-agencies/payments                           not started
/migration-agencies/partners/onboarding                not started
/office/dashboard                                      not started
/office/services                                       not started
/office/appointments                                   not started
/partner-agency/dashboard                              not started
```

### U15 14 Jobs — candidate (Pro only) — not started

```txt
/dashboard/jobs                                        not started
/dashboard/jobs/[jobId]                                not started
/dashboard/jobs/saved                                  not started
/dashboard/jobs/post-study                             not started
/applications/apply/[jobId]                            not started
/applications/apply/[jobId]/review                     not started
```

### U16 Employers — not started

```txt
/employers                                             not started
/for-employers                                         not started
/employers/onboarding                                  not started
/employers/onboarding/company                          not started
/employers/onboarding/hiring                           not started
/employers/onboarding/team                             not started
/employers/onboarding/complete                         not started
/employers/dashboard                                   not started
/employers/company                                     not started
/employers/jobs                                        not started
/employers/jobs/new                                    not started
/employers/jobs/[jobId]/edit                           not started
/employers/jobs/[jobId]/applicants                     not started
/employers/applications/[applicationId]                not started
/employers/applications/[applicationId]/cv             not started
/employers/candidates/[candidateId]                    not started
/employers/candidates/[candidateId]/personality-cv     not started
/employers/candidates/[candidateId]/signia             not started
/employers/signia                                      not started
/employers/signia/compare                              not started
/employers/pipeline                                    not started
/employers/screening-questions                         not started
/employers/messages                                    not started
/employers/messages/[threadId]                         not started
/employers/notifications                               not started
/employers/analytics                                   not started
/employers/jobs/[jobId]/analytics                      not started
/employers/team                                        not started
/employers/settings                                    not started
/employers/settings/notifications                      not started
/employers/billing                                     not started
/employers/billing/checkout                            not started
/employers/work-eligibility                            not started
```

### U17 Admin — not started

```txt
/admin                                                 not started
/admin/sign-in                                         not started
/admin/users                                           not started
/admin/users/[userId]                                  not started
/admin/users/[userId]/profile                          not started
/admin/employers                                       not started
/admin/employers/[employerId]                          not started
/admin/providers                                       not started
/admin/providers/[providerId]                          not started
/admin/opportunities                                   not started
/admin/jobs                                            not started
/admin/universities                                    not started
/admin/scholarships                                    not started
/admin/applications                                    not started
/admin/reports                                         not started
/admin/ai-generations                                  not started
/admin/ai-generations/cvs                              not started
/admin/ai-generations/applications                     not started
/admin/personality-cv                                  not started
/admin/messages                                        not started
/admin/notifications                                   not started
/admin/subscriptions                                   not started
/admin/analytics                                       not started
/admin/blog                                            not started
/admin/settings                                        not started
```

## Backend Board (Phase B)

```txt
B0  Supabase, auth, roles, RLS foundation, AI provider   not started
B1  Profiles, onboarding, documents                      not started
B2  Applications, messaging, notifications              not started
B3  AI CV, PersonalityAI CV, Signia                      not started
B4  Universities                                         not started
B5  Scholarships                                         not started
B6  Provider portals                                     not started
B7  AI Apply Agent                                       not started
B8  Apply For Me                                         not started
B9  Discovery Engine                                     not started
B10 Relocation                                           not started
B11 Migration Agencies                                   not started
B12 Jobs and employers (Pro entitlement)                 not started
B13 Billing (incl. Cryptomus), WhatsApp/email, admin ops not started
B14 Remove mock layer from production, launch readiness  not started
```

## Remaining Setup Items

- Add real Supabase keys to `.env.local` when the Supabase project is created.
- Add real DeepSeek API key when AI implementation begins.
- Add real Anthropic API key when AI fallback is enabled.
- Add real OpenAI API key when second AI fallback is enabled.
- Add Stripe, Paystack, and Flutterwave keys when checkout work begins.
- Add social media accounts to `SOCIAL_LINKS` in `src/config/site.ts` (footer shows them automatically) and brand icons for each platform.
- Confirm contact email addresses in `src/config/site.ts`.
- Replace placeholder testimonials with real, consented ones.
- Legal review of `/privacy` and `/terms`, including cancellation and refund terms.
- Done in U0: PWA icons (192/512/maskable) in `public/icons/`; shadcn/ui initialised.

## Architecture Decisions

- Study catalogue (decided 2026-10-07): Universities and Scholarships are built around a public, indexed catalogue of programmes (foundation, diploma, bachelor's, medicine, PGD/PGCert, master's, PhD, language and short courses, each marked on campus, online or blended), universities and scholarships, separated by category tabs (All · Foundation · Diploma · Bachelor's · Medicine · PGD / PGCert · Master's · PhD · Language courses · Short courses · Universities · Scholarships). Public pages show the facts plus locked previews of our features (fit score, eligibility, document readiness, funding, total cost, visa and arrival steps, AI help) to drive sign-up, and never link to university or funder websites. Fit, eligibility, saving, AI preparation, applying and tracking are inside the app. "Apply" routes: hosted on Scholastiar, partner (we submit; the university may pay a commission on enrolment, not shown to students), or the official page through a tracked `/out/[linkId]` link from inside the app only. Launch countries: Russia, then Belarus, Kazakhstan, Moldova, Georgia, Armenia, UAE, Saudi Arabia, Qatar, Kuwait. Spec: `SERVICES/21-study-catalogue.md`; tables in `DATABASE/db.md` → Study Catalogue Tables; routes `/programs`, `/programs/[levelSlug]`, `/programs/[levelSlug]/[fieldSlug]`, `/universities/[universitySlug]/programs/[programSlug]` (stage U6).
- Awards removed (decided 2026-10-07): the Awards service (`SERVICES/08-awards.md`, `PAGES/08-awards-pages.md`), its routes (`/awards/*`, `/admin/awards`), stage, acceptance criteria, provider type (`award_body`) and `opportunity_type` value were removed. Ordered services are now 02 Universities, 03 Scholarships, 09 AI Apply Agent, 10 Apply For Me, 11 Discovery Engine, 12 Relocation, 13 Migration Agencies, 14 Jobs. Stages: U5 Candidate tools, U6 Universities, U7 Scholarships, U8 Provider portals, U9 AI Apply Agent, U10 Apply For Me, U11 Discovery, U12–U13 Relocation, U14 Migration Agencies, U15 Jobs, U16 Employers, U17 Admin, U18 audit. Relocation's Best Pilot Awards are unaffected.
- School-related services only (decided 2026-10-07): Fellowships, Grants, Competitions and Conferences / Training were removed from the platform. Their service and page specs (`04`–`07`), routes (including `/admin/fellowships`, `/admin/grants`, `/admin/competitions`, `/admin/conferences`) and stages were deleted. Ordered services were then 02 Universities, 03 Scholarships, 08 Awards, 09 AI Apply Agent, 10 Apply For Me, 11 Discovery Engine, 12 Relocation, 13 Migration Agencies, 14 Jobs (file numbers kept). Stages: U5 Candidate tools, U6 Universities, U7 Scholarships, U8 Awards, U9 Provider portals, U10 AI Apply Agent, U11 Apply For Me, U12 Discovery, U13–U14 Relocation, U15 Migration Agencies, U16 Jobs, U17 Employers, U18 Admin, U19 audit. Backend B4–B6 Universities/Scholarships/Awards, then B7–B14.
- Jobs are Pro only (decided 2026-10-07): jobs are not a headline service or a promise; they are a Pro ($79) feature inside the candidate dashboard — job connections to openings employers post. Starter ($35) sees Jobs and Post-study jobs (visa sponsorship) locked with an upgrade prompt. No public job board: `/jobs` and `/jobs/[jobId]/public` were removed from `ROUTES.md`. Employer Starter ($99) and Employer Pro ($249) are unchanged; their jobs reach Pro candidates only. Jobs moved from service 01 to **14** (`SERVICES/14-jobs.md`, `PAGES/14-jobs-pages.md`) and from stage U5 to the end of the order, followed by Employers (current stage numbers: see the school-related decision above). Backend: B2 is applications/messaging/notifications; jobs and employers move near the end. Plan check: `hasJobAccess()` in `src/lib/entitlements.ts`.
- Relocation (decided 2026-10-02): new ordered service **12 Relocation** (`SERVICES/12-relocation.md`, `PAGES/12-relocation-pages.md`), built **before Migration Agencies**, which becomes service 13 (`13-migration-agencies.md`). Two categories — **Pre-Arrival Processes** and **Post-Arrival Processes** — built from a layered rules library (destination country → embassy (by the student's residence and region) → visa type → city → school; add / remove / edit / reorder per layer), admin-managed with preview, versions, effective dates, 90-day verification and a country activation gate. Every step carries offices, map, directions, transport routes, contacts, timing, deadline and costs; post-arrival progress earns a 100% badge. Includes the cost estimator (min/typical/max, confidence, calibration from actual costs, public country cost pages), accommodation with full booking and payment, roommates, communities (all faiths and groups, admin approval before listing), city guides, pilots (freelance → verified → staff; employment handled by management off-platform, shown as Verified and Staff badges), cohorts (one pilot for students on the same route and arrival window), and Handsoff → Alumni or **Year Check-in at $600/year** (coverage, limits and profit design in the spec). Russia first. UI stages U19 (Relocation) and U20 (Relocation operations); Migration Agencies → U21, Admin → U22, audit → U23; backend B14 Relocation, B15 Migration Agencies.
- Pilot incentives (decided 2026-10-04): pilots (freelance and staff) earn **20% of every Year Check-in membership** they bring in ($120 per $600, renewals included; 30-day hold, clawback on refund, honest selling rules). Yearly **Best Pilot Awards** voted by served students: **$10,000 global** and **$1,000 per active country** (global winner doesn't also take a country award). Spec in `SERVICES/12-relocation.md` §10; pages `/pilots/awards`, `/pilots/awards/vote`, `/pilot/referrals`, `/admin/pilot-commissions`, `/admin/pilot-awards`; tables pilot_referral_codes, pilot_commissions, pilot_award_cycles, pilot_award_votes, pilot_awards.
- Payments everywhere (decided 2026-10-02): every checkout offers card (Stripe), local payment (Paystack, Flutterwave) and **crypto (Cryptomus first; provider-agnostic so more crypto providers can be added)**. Students always pay Scholastiar; in Russia, Scholastiar settlement staff pay landlords and freelance pilots in roubles through local banks (payout tasks with proof and two-person approval above a threshold).
- Messages everywhere (decided 2026-10-02): every process on the platform sends an **email and a WhatsApp message from Scholastiar's official account (automated)** plus an in-app notification. WhatsApp requires each user's opt-in. Source: `SERVICES/100-notifications.md`.

- Jobs scope (decided 2026-10-01, clarified the same day): the Jobs service covers **student jobs** (part-time, holiday, campus, internship/placement — within study visa work conditions, no sponsorship) and **post-study jobs** (jobs after graduation where the employer **sponsors the graduate's work visa**; employer-confirmed sponsorship, visa route, timing, start-on-post-study-permit option and visa costs covered are required on every post-study job). General professional jobs not aimed at international graduates are out of scope. `SERVICES/20-visa-sponsored-jobs.md` became `SERVICES/20-work-eligibility.md`; `job_sponsorship_metadata` became `job_work_eligibility` plus `work_visa_routes` and `post_study_permit_types`; routes `/dashboard/jobs/visa-sponsored` → `/dashboard/jobs/post-study` and `/employers/visa-complexity` → `/employers/work-eligibility`.
- Applicant pricing (decided 2026-10-01): two paid plans only, Starter $35/month and Pro $79/month, in USD. No free plan and no Concierge plan; human-assisted help is sold through Apply For Me. Visitors can still browse public pages. Employer and provider plans are unchanged. Source: `PRICING.md`.
- Sign-up requires a plan (decided 2026-10-01): candidate sign-up is account → choose Starter or Pro → checkout → verify email → onboarding. No unsubscribed applicant accounts; unpaid accounts are sent back to checkout. `/billing/checkout` moves to stage U2 because sign-up needs it. Spec: `PAGES/90-auth-pages.md`.
- Unified saved page (decided 2026-10-01): `/saved` covers every opportunity type and is the mobile "Saved" tab target. It is built in U6 with universities, and each service stage adds its type (jobs in U15, Pro only). Spec: `PAGES/README.md` → Unified Saved Page.

- Phase A app: Next.js 16.3 (App Router, Turbopack), React 19.2, TypeScript, Tailwind v4, shadcn/ui (Radix base, Nova preset), lucide-react, React Hook Form + Zod 4, Zustand, TanStack Query, react-hot-toast, Prettier, ESLint, Playwright. Package manager: pnpm.
- Data layer: pages and server actions use only `repos` from `src/data` (interfaces in `src/data/repositories`, mock implementations in `src/data/mock`). The mock store is in-memory on the server, persisted to the gitignored `.mock-db/db.json`, and keyed by `db.md` table names. `createSeed()` deep-copies fixtures.
- Mock reads: `readList` / `readOne` honour the dev screen-state switch (loading = 8s delay, empty, error); `readSystem` (session, roles, subscriptions) ignores it. Dev tooling reads through `src/data/mock/dev.ts` so it keeps working in empty/error states.
- Mock session: the `sch_mock_session` cookie holds the user id; `getSession()` in `src/lib/session.ts` is replaced by Supabase Auth in Phase B. Dev controls live in cookies (`sch_view_state`, `sch_ai_failure`) and only work when `DATA_SOURCE=mock`; dev routes under `/dev` 404 otherwise.
- Route readiness: `src/config/routes.ts` `READY_ROUTES` lists built routes. Navigation and `RouteButton` render unbuilt routes as disabled with a tooltip naming the stage (`src/config/route-stages.ts`, generated from `ROUTES.md` by `scripts/route-stages.py`). Add each route to `READY_ROUTES` when it meets the Definition Of UI Done.
- Shells: `SurfaceShell` picks the frame per surface — `PublicShell`, `CandidateShell` (top nav ≥1024px, bottom tabs below), `SidebarShell` for employer/provider/forwarder/office/partner-agency, with a dark console variant for admin. Nav config is in `src/config/navigation.ts`; client shells resolve it themselves (icons can't cross the server/client boundary).
- Colour accessibility: brand green #10B65B fails WCAG AA behind white text (2.67:1), so filled buttons use action green #0B8743 (4.6:1), green text uses #087A3E, and #8A8F98 is for placeholders only. Recorded in `UI_BASE/ux_ui_base.md`.
- Service worker (`public/sw.js`): static assets cache-first, page navigations network-only with `/offline` fallback (no caching of private pages), non-GET requests never intercepted. Registered in production builds only; reloads only when an update replaces an existing worker.
- Theming: class-based dark mode (`.dark` on `<html>`, `@custom-variant dark`), `THEME_INIT_SCRIPT` in `src/lib/theme.ts`, `ThemeProvider` (useSyncExternalStore over localStorage + `prefers-color-scheme`) and `ThemeToggle` in `src/components/theme/`. Use theme-aware tokens only for surfaces and text.
- Section data loads use `safeLoad()` so a failed section shows `ErrorState` without breaking the page.

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
- On 2026-10-01, the build strategy was set to UI-first: Phase A builds every screen of the platform against a mock data layer, then a UI Freeze gate, then Phase B builds the backend behind the same data layer interfaces. Source of truth: `STRUCTURE/BUILD_GUIDE/UI_FIRST_BUILD_PLAN.md`. The UI Screen Board above covers every route in `ROUTES.md` (276 routes plus dev gallery entries).
- On 2026-10-01, About, Contact, Privacy, Terms, Search, Help centre, guide articles and the Guides list were redesigned with patterns from leading product sites (Stripe, Linear, Vercel, Intercom, Notion, Algolia) within the design guide: shared `TableOfContents` (scroll-spy), `ReadingProgress`, `SearchBox` ("/" shortcut), `Highlight`, `CopyLinkButton`, `PrintButton`; featured guide card; topic tiles in the contact form; legal at-a-glance summaries. Page-level newsletter forms were removed because the footer carries the sign-up on every page. Dates now format in UTC.
- On 2026-10-01, the guides filter became a floating `GuideFilterBar`: overlaps the page header, icon + label + guide count per category, solid green active state, "Showing N guides" line, sideways scroll with edge fade on phones, and the active filter scrolls into view. Fixed a mobile overflow caused by screen-reader text escaping the scroll container.
- On 2026-10-01, the public footer was redesigned (`PublicFooter`): atmosphere background, brand and trust points, newsletter panel, four link columns, popular destination chips, inline theme switch, back to top and an oversized wordmark. No social links until real accounts exist.
- On 2026-10-01, the pricing comparison was redesigned: grouped features with descriptions and real per-plan values (data in `plan_comparison_rows`), sticky plan header with prices and calls to action, highlighted Pro column, "Only differences" filter, and a mobile plan switcher with "Pro only" markers.
- On 2026-10-01, light and dark mode were added to every built screen: Light/Dark/System toggle in all headers (public, candidate, sidebar workspaces, dev pages, status pages); System follows the device setting live; choice stored in `localStorage` (`sch-theme`) and applied before first paint by an inline script; open tabs stay in sync. Brand text/surface/status tokens became CSS variables with a WCAG-checked dark palette; hardcoded `bg-white`/`text-brand-black` surfaces were replaced with theme-aware tokens; atmosphere sections stay dark in both themes. The Definition Of UI Done now requires checking both themes. Verified: 74/74 Playwright tests (including theme tests) on desktop and mobile.
- On 2026-10-01, U1 was restyled with the "Atmosphere" system inspired by `UI_DESIGN_INSPIRATION/landing_page.png`: dark green-lit homepage hero with grain and a row of example opportunity cards in a glass frame, aurora-light page headers on every public page, glass cards on dark sections, the Pro plan as a dark featured card, one solid green employer panel with light beams, and a dark call-to-action band. Fonts, colours and contrast rules are unchanged; rules recorded in `UI_BASE/ux_ui_base.md` → Atmosphere. New tokens/utilities: `mint`, `aurora-dark`, `aurora-dark-side`, `aurora-light`, `grain`, `grain-light`, `beams`, `text-gradient-mint`, `text-gradient-green`; new button variants `inverse` and `outline-inverse`.
- On 2026-10-01, U1 Public & marketing was completed: homepage, about, how it works, pricing (plans + comparison built from plan records), guides list with category filter, guide pages following the article template (short answer, sections, FAQ, sources, disclaimer, related guides, Article/FAQPage structured data), contact form, help centre (FAQ tabs), privacy and terms (marked as drafts), and search over guides, help and opportunity categories. Contact and newsletter forms save to the mock store (`contact_messages`, `newsletter_subscriptions`). Added `sitemap.xml` and `robots.txt`, a search button in the public header, `safeLoad` now re-throws Next.js control-flow errors, and the public group's `loading.tsx` was removed so unknown guides return a real 404. Verified: lint, typecheck, build and 70/70 Playwright tests (U0 + U1, desktop + mobile).
- On 2026-10-01, employer and provider prices were approved: Employer Starter $99/month (up to 3 student jobs), Employer Pro $249/month (up to 15 jobs, sponsored post-study jobs), Employer Enterprise custom; Provider Verified $149/month, Provider Pro $399/month, Provider Enterprise custom. Organisations pay at sign-up; sponsored post-study jobs need Employer Pro or Enterprise; Enterprise plans are sales-led; no annual billing at launch.
- On 2026-10-01, U2 Auth (mocked) was completed: sign-in (one generic error, demo accounts panel in mock mode), choose-role, sign-up wizards for candidates, employers and providers with a required plan, `/billing/checkout` (card via the mock Stripe gateway with test cards, or Paystack/Flutterwave), verify email, forgot and reset password. Flow: account → plan → payment → verify email → onboarding/workspace; unpaid accounts are always sent back to checkout. Employers who sponsor graduates can only choose Employer Pro (enforced in the wizard, at checkout and on the server). Passwords are hashed (scrypt); one-time tokens expire (24h verify, 1h reset) and are shown in a mock-only "Dev inbox" instead of real email. Email confirmation runs through the `/auth/verify-email/confirm` route handler. The public header shows the account menu and the next step (Finish payment / Verify your email) when signed in; Sign out works everywhere. Verified: lint, typecheck, build and 96/96 Playwright tests (U0 + U1 + U2, desktop + mobile).
- On 2026-10-02, the form action bar was redesigned for every form (`ActionBar`, `PrimaryAction`, `BackLink`, `BarHint` in `form-footer.tsx`): floating glass bar, quiet Back, a "saves when you continue" hint, and a green primary with an arrow chip. Fixed: the onboarding layout's `overflow-hidden` stopped the bar from sticking (now `overflow-x-clip`). The onboarding Review page was redesigned: a dark summary with the strength ring, sections-complete count, clickable status chips and the biggest gain; section cards with status badges, Edit buttons and amber "+N pts" fix strips; fact tiles, flags, language and skill level dots, timelines for education and experience.
- On 2026-10-02, onboarding steps were redesigned: two-column step layout with Nkechinyere's side panel (why the step matters, what to have ready; a one-line note on phones); fields grouped into titled cards with icons and a "Done" tick per section (`FormCard`). About you: identity, origin, contact (WhatsApp "Same as my phone number" + opt-in switch), languages (tap-to-choose level bar, quick-add suggestions), application voice with a live "How it sounds" example per tone. Visa: study status icon tiles, course timeline with today's position, weekly-hours stepper with quick picks, holiday and sponsorship icon tiles, months-left-on-permit callout. Country flags in every country picker. The same forms render without card chrome inside profile pages.
- On 2026-10-02, Nkechinyere's answers became **spoken**: tapping a question reads her answer aloud (browser speech synthesis, a natural English female voice where available) while the current word is highlighted in real time (spoken words solid, upcoming words faint, a progress line under the bubble); Stop/Listen on each answer, a remembered Voice on/off toggle, one answer at a time, and a fallback to plain text when a device can't speak. Built behind `useGuideVoice` so recorded audio with word timings can replace the synthetic voice later.
- On 2026-10-02, the onboarding guide card became a **welcome video player**: Nkechinyere's portrait is the cover with a play button and duration; the video plays in the card with captions on (`public/guide/nkechinyere-welcome.vtt`, generated by `scripts/guide-captions.py` from `WELCOME_SCRIPT` in `src/lib/candidate/guide.ts`). The script is word for word her three welcome chat messages (saying "Hi" instead of the student's name). Until `public/guide/nkechinyere-welcome.mp4` is added, the card shows "Video coming soon". **Open item: record and add the video.**
- On 2026-10-08, U5 Candidate tools was completed (21 screens). **AI CV** (`/ai-cv`, generate, preview, edit, history): CVs built only from the profile and tailored to a catalogue programme, scholarship, pasted description or general use, in six formats (academic, UK, EU, US, African regional, visa-conscious); key-word match against the target; a fact check that flags numbers not found in the profile (live in the editor); section order and visibility; per-line wording suggestions that never add facts; duplicate, delete, "Download PDF" via print styles; simulated AI with the dev failure switch. **PersonalityAI CV** (home, recording studio, reviewer preview, privacy settings): real camera and microphone recording (MediaRecorder) with prompt cards, mic meter, timer, retake and upload; Phase A keeps video details only; view history; visibility (applications only, also Signia, hidden). **Signia** (home, builder, project editor, media library, links, preview, public `/s/[handle]`): handle (unique, reserved words blocked), headline, About, current work, section order and switches, publish toggle, public or application-only audience; projects with problem/approach/result, skills and links; media upload (images keep an inline preview, videos keep details only); links with platform labels; per-item visibility (public, applications only, only me); portfolio strength score and skills with proof; the public page shows only public items and returns 404 when unpublished. **Billing** (`/billing`): both plans side by side, Starter → Pro upgrade through checkout (any payment method; the current plan stays active until paid), Pro → Starter scheduled for the period end (undoable), monthly usage, payment history. **Notifications** (`/notifications`): grouped by day, filter by category, open marks read, mark all read; new catalogue events deadline.reminder, matches.new, message.received, personality.viewed. **Messages** (`/messages`, `/messages/[threadId]`): conversations with admissions offices, scholarship panels and Scholastiar support; filters (all, unread, interviews) and search; status cards; interview invitations with an "Add to calendar" .ics download; replies with vault attachments; opening marks read. **Application insights** (`/applications/insights`): shortlist fit, documents to fix first, where you fit best by country, next deadlines, how you come across; performance analytics marked as Pro. Fixed along the way: grid columns with truncated text widened mobile pages (`*:min-w-0` on dashboard, AI CV, PersonalityAI CV and Signia grids), a long field label hid in-box errors on phones, and a schema exported from a server-action file. Playwright now uses Chromium's fake camera and microphone. Verified: typecheck, lint, format, build and 150/150 Playwright tests (24 new for U5).
- On 2026-10-08, the candidate dashboard was redesigned around "what should I do next?": a dark hero with one next step (finish set-up → strengthen profile → shortlist 3 programmes → start the first application, by deadline) beside a 5-stage journey tracker (profile, shortlist, apply, visa, arrive; a compact progress line on phones); a main column with **Top matches for you** (open programmes and scholarships ranked by fit, with save and the fit explanation), **Your shortlist** sorted by deadline with countdowns (amber within 30 days, red within 7) and an applications pipeline strip (drafts, submitted, interviews, offers); a compact side column with visa at a glance, profile strength and Explore opportunities. The plan moved to a header chip with "Compare with Pro". New reusable `OpportunityRow` and `DeadlineChip` (`src/components/opportunities/opportunity-row.tsx`). Job items renamed everywhere: **Student jobs** and **Post-study jobs with residency** (still Pro only, locked on Starter). Verified: typecheck, lint, format, build and 126/126 Playwright tests, light and dark, desktop and mobile.
- On 2026-10-07, U4 Shared opportunity system was completed, in the component gallery (`/dev/gallery#opportunity-card`, `#apply-workspace`). Data: study catalogue types (`src/data/types/catalogue.ts`), fictional fixtures (8 universities in Russia, Belarus, Kazakhstan, Georgia, Armenia and the UAE; 18 programmes across all 9 levels and all 3 study modes; 5 scholarships with programme, university and country links; intakes, requirements and apply routes), a `catalogue` repository (search with category-tab counts, facets, filters, sort) and an `opportunities` repository (saves and AI Apply Agent / Apply For Me board items). Logic: URL search state (`src/lib/catalogue/query.ts`), fit score with the factors behind it and document readiness from the vault (`fit.ts`), demo FX for tuition comparison (`money.ts`), viewer state (`viewer.ts`). Actions: save and board toggles (paying candidates only; jobs need Pro), simulated AI statement drafting honouring the dev AI-failure switch. Components (`src/components/opportunities/`): `OpportunityCard` (programme, university, scholarship), `FitScore` / `LockedFitScore`, `SaveButton`, `BoardMenu`, `CategoryTabs`, filter panel, filter sheet, search box, sort and active-filter chips, `LockedPreviews` (sign-up prompts), and the apply workspace (`ApplyRouteAction`, `ApplySteps`, `RequirementsChecklist`, `StatementDrafter`, `ReviewSubmit`). Visitors see locked fit, sign-up links and no university or funder links. Fixed along the way: screen-reader counts escaping the tab scroller widened the page (tab list is now `relative`), the dev header overflowed on phones, and a gallery crash in the "error" screen state (viewer now loads inside `safeLoad`). Verified: typecheck, lint, format, build and 126/126 Playwright tests (8 new for U4), light and dark.
- On 2026-10-07, Awards was removed too (see Architecture Decisions → Awards removed): specs, routes, stage, acceptance criteria, `award_body` provider type and every mention in the specs (Relocation's Best Pilot Awards kept). App: Awards gone from the Opportunities menu, footer, admin menu, dashboard and category grid; the public category grid is now Universities, Scholarships and Relocation (3 columns); the dashboard grid is 2×2 (Universities, Scholarships, Jobs, Post-study jobs). Stages now U0–U18. Verified: typecheck, lint, format, build and 118/118 Playwright tests.
- On 2026-10-07, the platform became school-related only: Fellowships, Grants, Competitions and Conferences / Training were removed (see Architecture Decisions). Deleted `SERVICES/04`–`07` and `PAGES/04`–`07`; removed their routes, admin routes, acceptance criteria, Apply Agent grant settings page, provider and organisation types (`fellowship_program`, `grant_maker`, `competition_organizer`, `conference_training_provider`), `opportunity_type` values, and every mention across the specs (AI Apply Agent, Apply For Me, Discovery Engine, pricing, publishing, sponsored ads, growth notes). Stages renumbered to U0–U19 and B0–B14. App: opportunity menu, footer, admin menu, dashboard tiles and public category grid now show Universities, Scholarships, Awards (+ Relocation on public pages, Jobs on Pro); homepage, About, How it works, pricing, sign-up and choose-role copy updated; hero preview shows a second university programme instead of a fellowship. Verified: typecheck, lint, format, build and 118/118 Playwright tests.
- On 2026-10-07, jobs became a Pro-only dashboard feature (see Architecture Decisions → Jobs are Pro only). Specs: Jobs moved from service 01 to 14 (`SERVICES/14-jobs.md`, `PAGES/14-jobs-pages.md`, with a Positioning section and a Starter locked state); build order, stage order (Jobs U20, Employers U21; Universities first at U6 with `/saved` and `/applications`), backend order, pricing, routes (public `/jobs` pages removed), roles, acceptance criteria and indexes updated. Built screens: homepage, About, How it works, FAQ, search, footer, newsletter, sign-up and choose-role copy no longer lead with jobs (site tagline: "Study, funding and relocation support…"); the public category grid shows seven categories plus Relocation; the Pro plan lists "Job connections" (new comparison row, Pro-only); the dashboard lists Jobs and Post-study jobs last with a "Pro" badge, and on Starter both are locked (dashed card, lock, "Upgrade to Pro to unlock", links to `/billing` once built, `/pricing` until then); the candidate Opportunities menu shows the same two items with a Pro badge; onboarding guide copy (and welcome captions) say "your visa guidance" instead of "the visa label on every job". Plan check: `hasJobAccess()` in `src/lib/entitlements.ts`. Verified: typecheck, lint, format, build, and Playwright (new test: Starter locked, Pro unlocked, `/jobs` returns 404).
- On 2026-10-02, the updates to completed stages were done: **crypto checkout** (third payment tab; coin and network choice, USDT/USDC stablecoins first; 15-minute locked quote, QR code, address, live status awaiting → confirming (3 confirmations) → paid; underpaid top-up and expired re-quote; mock-only test wallet; Cryptomus behind a provider-agnostic layer); **messages everywhere** — a message catalogue (`src/lib/messages/catalogue.ts`) and `notify()` send every event by email, WhatsApp (opted-in users only) and in-app (sign-up, payment succeeded/failed, verification sent, email verified, password reset requested/changed, onboarding completed, document uploaded, account deleted, contact received, newsletter subscribed); **WhatsApp opt-in** at sign-up (optional field beside an existing one, so step 1 still fits one screen) and in About you (number + explicit checkbox); **notification settings** with a WhatsApp card and a WhatsApp column (payments and security locked on; promotions never by WhatsApp); new "Profile and documents" category; unread dot on the candidate bell; dev **Message outbox** (`/dev/outbox`). Verified: lint, typecheck, build and 116/116 Playwright tests (desktop + mobile).
- On 2026-10-02, U3 Candidate core was completed: candidate data layer (profile, visa profile, education, experience, skills, certifications, preferences, documents, notification preferences, onboarding sessions, post-study permit reference list) and 20 screens. Onboarding is an 8-step interview in a focused layout (about you → study and visa → education → experience → skills → goals → PersonalityAI CV (optional) → review → complete) that saves every step and resumes where the candidate left off. The dashboard shows profile strength, a visa snapshot (key date, term-time hours, holiday work, sponsorship need), plan, goal-ordered opportunity categories and empty deadline/application panels. Profile pages share the onboarding forms; the experience editor has an achievement coach (action verb, number, result, length checks — AI rewrites come in Phase B). Document vault: drag-and-drop upload (5 MB, PDF/Word/images/text), private by default, per-file "use in applications" switch, preview/download (mock keeps files ≤1.5 MB inline), edit, delete. Settings: account and time zone, password change, appearance, plan, sign out, account deletion (type your email); notification matrix (email/in-app/push; security email always on). New demo persona Kwame Mensah (graduate on the Graduate route, onboarding part-done); Amara is now studying in London. Verified: lint, typecheck, build and 108/108 Playwright tests (U0–U3, desktop + mobile).
- On 2026-10-01, U0 Foundation was completed: app scaffold, design tokens, base components (button/badge/input/select/textarea sized for touch), seven layout shells with previews at `/dev/shells/[shell]`, PWA manifest + icons + service worker + install prompt + offline banner + update toast, mock data layer with persistence and reset, dev panel (persona, plan, screen state, AI failure, reset), utility pages (`/not-found`, `/unauthorized`, `/server-error`, `/maintenance`, `/offline`), `/dev` build status and `/dev/gallery`. `/offline` was added to `ROUTES.md`. Verified: lint, typecheck, production build and 30/30 Playwright smoke tests (`pnpm test:e2e`, desktop + mobile) all pass. Real bugs fixed during verification: icon components passed from server to client shells, fixtures mutated by the mock store (broke reset), and the service worker reloading the page on first visit.
