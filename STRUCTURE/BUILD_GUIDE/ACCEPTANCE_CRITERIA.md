# Acceptance Criteria

Status: Definition of done for the unified platform

## Global Definition Of Done

Every completed service must satisfy:

- service has discovery/listing, detail/profile, save/shortlist, application/start action, tracking, and admin review where relevant
- opportunity cards show application period, estimated effort, success/fit score, verification status, save action, direct apply action when available, AI Apply Agent board action, and Apply For Me board action
- success/fit scores are explained as estimates and never as guarantees
- user can review and approve AI-generated material before submission
- sensitive documents are private by default
- RLS blocks unauthorized access
- admin actions are auditable
- empty, loading, error, locked, and upgrade states exist
- mobile workflows are usable
- implementation follows `STRUCTURE/UI_BASE/ux_ui_base.md`

## Foundation

- app scaffold exists with Next.js, TypeScript, Tailwind, shadcn/ui, Supabase utilities, linting, and environment handling
- public, candidate, employer/provider, and admin layouts exist
- role-aware navigation works
- environment variables are documented and server-only secrets never reach the client
- seed data supports local testing without real personal data

## Auth

- candidate can sign up, verify email, log in, reset password, and reach onboarding
- employer/provider can sign up, verify email, log in, and reach onboarding
- admin access is isolated from public auth flows
- incorrect role access is blocked
- protected routes redirect safely
- login and role events are auditable where relevant

## Candidate And Profile

- candidate can complete onboarding
- candidate can edit profile sections
- candidate can define visa/mobility preferences and target countries
- candidate can upload and manage documents
- candidate can create a Signia profile with projects, social links, media, documents, and visibility settings
- candidate can preview public and employer Signia views before publishing
- profile data can power opportunity matching without exposing private fields unnecessarily

## Jobs

- employer can create, edit, submit, pause, and close a job
- admin approval is required before a first-launch job becomes visible to Pro candidates
- there is no public job board; visitors and search engines never see job listings
- a Pro candidate can use the personalized job feed after onboarding
- a Starter candidate sees Jobs and Post-study jobs locked, with an upgrade prompt and no listings, counts or job details, on every Jobs route
- after upgrading to Pro, both sections unlock without signing in again
- job copy says "job connections" and never promises a job
- job track (student or post-study), hours and pay, or visa sponsorship details for post-study jobs, the work eligibility label, work mode, country and employer trust signals are visible
- a post-study job cannot be published without employer-confirmed visa sponsorship and a visa route
- candidate can save jobs and add eligible jobs to AI Apply Agent or Apply For Me boards according to plan
- candidate can start and submit an application after review
- employer can view submitted applicants and move them through a basic pipeline
- expired jobs are removed from active discovery and marked closed or archived

## Universities

- student can browse universities and country study hubs
- university cards show tuition, intake/deadline, application effort, admission/fit score, verification, and board actions
- student can save, compare, and start a university application package
- application requirements, documents, fees, language, visa, and accommodation notes are visible
- admin can create, verify, update, and moderate university profiles

## Scholarships

- student can search scholarships by country, degree level, funding type, deadline, eligibility, and verification
- scholarship cards show funding, deadline, effort, success score, verification, and board actions
- student can check eligibility, save, generate draft answers, review, and track scholarship applications
- scam/risk reporting and verification states exist
- admin can moderate scholarship listings and reports

## AI Apply Agent

- user can add eligible opportunities to the AI Apply Agent board according to subscription
- board shows deadline, effort, success/fit score, missing documents, automation eligibility, consent status, and autonomy mode
- agent never submits without required consent
- external automation stops when blocked, risky, ambiguous, or not allowed
- proof and audit metadata are captured for runs

## Apply For Me

- user can add eligible opportunities to Apply For Me board according to subscription
- board shows deadline, effort, success/fit score, documents, Forwarder effort/credit estimate, and campaign readiness
- user can create a campaign from selected board items
- Forwarder access to documents is scoped and auditable
- proof of submission and dispute paths exist

## Discovery Engine

- admin can add trusted sources
- engine can ingest, normalize, deduplicate, score, and queue opportunities for review
- extracted opportunities include deadline, effort inputs, fit/success inputs, verification status, and mobility value
- human approval is required before publication at launch
- source snapshots and verification notes are auditable

## Relocation

- a student can create a journey (from an accepted offer or manually) and receives a checklist built from the layered rules: destination, the embassy for their residence country and region, visa type, city and school
- every step shows instructions, documents, deadline, duration, offices with map, directions and transport notes, contacts, costs with confidence, official source and last verified date
- students can mark steps Need it / Not needed / Done and request a pilot on any step
- Pre-Arrival and Post-Arrival progress percentages are correct; reaching 100% Post-Arrival awards the badge
- the cost estimator totals match the cost lines; public country cost pages use the same engine
- admins can add, edit, remove, copy and reorder rules per layer, preview as a student, version with effective dates, and activate a country only after the verification gate passes
- rule changes notify students with active journeys and keep their completed steps
- accommodation can be booked and paid (card, local, crypto); funds are held until move-in; payout tasks settle providers with proof
- communities appear only after admin approval
- pilots move Applicant → Verified → Staff; only Verified pilots are bookable; check-in codes and SOS work
- a Year Check-in bought through a pilot's code or "Recommended by" creates a 20% commission for that pilot (renewals too), payable after the hold and clawed back on refund
- only students served by a pilot that year can vote, once per cycle; admins confirm one global winner ($10,000) and one winner per active country ($1,000), and the global winner doesn't also take a country award
- cohorts group students by city, school, embassy and arrival window; joining is opt-in
- Handsoff produces Alumni status; Year Check-in can be bought for $600/year and support cases follow the coverage, limits and response targets
- every event sends email + WhatsApp (opted-in users) + in-app

## Migration Agencies

- users can browse offices/agencies by country, city, service type, language, verification, and availability
- users can view services, pricing, requirements, and disclaimers
- users can book appointments or submit inquiries
- document pre-check access is private and auditable
- agency/office admin and platform admin can manage listings and appointments

## Signia

- candidate can create, edit, publish, unpublish, and preview a Signia profile
- candidate can add project showcases, current work, research, videos, documents, social links, and skill evidence
- candidate controls visibility at profile, section, project, media, document, and social-link level
- public Signia pages expose only explicitly published content
- employer Signia view respects application access, opted-in discoverability, and plan entitlements
- employer Signia search supports structured filters and natural language queries without exposing private content
- AI Signia summaries cite source sections or proof items and do not invent work, skills, achievements, links, or credentials
- Signia search indexes are rebuilt or invalidated when visibility changes
- Signia profile views and employer searches are auditable
- moderation exists for unsafe public content, abusive links, and employer misuse reports

## Security

- RLS blocks unauthorized profile, application, document, message, billing, and board access
- RLS blocks private Signia sections, private proof files, and non-consented employer search access
- service-role keys and AI keys are never exposed client-side
- private documents are not public
- admin actions are auditable
- provider/employer access is scoped by membership/ownership
- AI, visa, funding, admission, and migration outputs avoid guaranteed-outcome claims

## Billing

- subscription state controls premium features server-side
- AI Apply Agent and Apply For Me board access are plan-gated
- usage limits are tracked
- checkout supports Stripe, Paystack, and Flutterwave through a provider abstraction
- provider fallback must not double-charge users
- webhook handling is idempotent once billing is enabled
- users can see plan limits and upgrade paths clearly

## Notifications And Email Intelligence

- transactional emails send for auth, billing, application, and security-critical events
- weekly opportunity digest exists as the default non-transactional email
- deadline reminders can trigger 7 days, 3 days, and 24 hours before deadlines
- readiness/score emails explain percentages responsibly
- AI Apply Agent and Apply For Me emails respect subscription entitlements and consent
- promo/conversion emails are behavior-based and capped
- users can manage email preferences by frequency, category, target country, and email type
- email delivery, engagement, suppression, and unsubscribe events are logged
- emails are periodic or event-triggered, never random

## Admin

- admin can view and moderate users, providers, opportunities, reports, AI generations, documents metadata, and applications where policy allows
- admin roles are scoped
- super admin and platform admin require MFA for production access
- all admin roles require MFA before public beta
- moderation actions create audit records
- suspicious opportunity reports can be resolved

## UX

- dashboards answer what changed, where the user stands, and what action comes next
- opportunity cards stay scannable on mobile
- buttons and labels do not overflow
- forms are accessible and validated
- empty/loading/error states exist for all data-heavy views
