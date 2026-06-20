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

- view public pages
- view limited public jobs
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
- apply to jobs
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
