# User Roles And Permissions

Status: Role matrix

## Roles

- guest
- candidate
- employer_owner
- employer_admin
- recruiter
- hiring_manager
- employer_viewer
- support_admin
- moderation_admin
- billing_admin
- platform_admin
- super_admin

## Guest

Can:

- view public pages (no job listings: jobs are Pro only, inside the dashboard)
- sign up/sign in

Cannot:

- apply
- message
- view private data

## Candidate

Can:

- manage own profile
- upload own documents
- generate CVs
- apply to jobs (Pro plan only; Starter sees Jobs locked with an upgrade prompt)
- view own applications
- message employers through applications

## Employer Roles

Owner/Admin can:

- manage company profile
- manage billing
- invite team members
- create/edit jobs
- review applicants

Recruiter/Hiring Manager can:

- manage assigned jobs
- review applicants
- message candidates
- move pipeline stages

Viewer can:

- view assigned jobs/applications
- not mutate key records

## Relocation Roles (2026-10-02)

Pilot:

- status Applicant → Verified (freelance) → Staff (set by an admin; employment is handled by management off-platform)
- sees and manages only their own bookings, cohorts and (staff only) assigned Year Check-in cases
- sees only their own referral code, referred students' membership status (not their cases) and their own commissions and award results; cannot see vote counts or who voted

Housing provider owner / member:

- manages their listings, availability, bookings, contracts and payouts

Settlement staff:

- processes payout tasks in their country, uploads proof; a second approver is required above the threshold

Case handler:

- triages and manages Year Check-in support cases

Rules editor:

- proposes changes to country rules, embassies, cities and schools for assigned countries; admins approve, publish and activate

## Admin Roles

Support admin:

- user support and troubleshooting

Moderation admin:

- reports, jobs, flagged content

Billing admin:

- subscriptions and invoices

Platform admin:

- operational control

Super admin:

- all platform controls

## Rule

Permissions must be enforced in both server code and RLS.
