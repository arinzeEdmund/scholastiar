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
- admin approval is required before a first-launch job becomes public
- candidate can browse public jobs
- candidate can use personalized job feed after onboarding
- visa sponsorship, relocation, work mode, country, and employer trust signals are visible
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

## Fellowships

- user can search fellowships by country, format, career stage, sector, funding, deadline, and verification
- fellowship cards show stipend/travel support, deadline, effort, fit score, verification, and board actions
- user can build purpose/leadership profile, draft essays, manage references, and track applications
- interview preparation can be generated without fabricating experience

## Grants

- user can search grants by eligible country, applicant type, sector, funding amount, deadline, and verification
- grant cards show amount, deadline, effort, readiness score, verification, and board actions
- user can build project profile, budget basics, proposal answers, and application tracker
- grant readiness score is explained responsibly

## Competitions

- user can search competitions by country, format, field, applicant type, prize, deadline, and verification
- competition cards show prize/exposure value, deadline, effort, fit score, deliverables, verification, and board actions
- user can manage project/team workspace and submission tracker
- pitch/submission support does not fabricate traction, results, code, or portfolio work

## Conferences And Training

- user can search events by country/city, format, field, funding, visa support, certificate, deadline, and verification
- opportunity cards show event dates, funding/travel/visa signals, effort, fit score, verification, and board actions
- user can generate bios, abstracts, motivation statements, and travel support statements with review
- travel/visa readiness checklist exists without legal guarantees

## Awards

- user can search awards by country, field, stage, prize, nomination requirement, deadline, and verification
- award cards show recognition value, deadline, effort, fit score, evidence/nomination needs, verification, and board actions
- user can build achievement profiles, attach evidence, request nomination support, and track award applications
- achievement and impact claims remain user-verifiable

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
