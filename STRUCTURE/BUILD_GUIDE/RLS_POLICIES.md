# RLS Policies

Status: Practical access-control guide

Source: `DATABASE/db.md`, `SERVICES/106-security-rls.md`

## Global Rules

- RLS must be enabled on all user-owned and company-owned tables.
- Client code must never use service-role keys.
- Server actions and route handlers must still verify auth and ownership.
- Admin policies must be role-scoped and audited.

## Candidate Policies

Candidates can:

- read/update their own `candidate_profiles`
- manage their own education, experience, skills, preferences, visa profile
- create/read their own applications
- read messages in their own threads
- manage their own documents

Candidates cannot:

- read other candidates
- read employer private notes
- read applications not belonging to them

## Employer Policies

Employer users can:

- read companies where they have active membership
- manage company jobs according to role
- read applications submitted to their company
- read documents attached to those applications
- message candidates inside company-linked threads

Employers cannot:

- access other companies
- browse private candidate documents
- mutate candidate profiles

## Admin Policies

Admins can access operational tables according to admin role.

Admin access should be separated into:

- support admin
- moderation admin
- billing admin
- platform admin
- super admin

## Storage Policies

Storage access should map to database ownership:

- owner can read own files
- employer can read application-attached files for company applications
- admins can access only through audited support/moderation flows
- public access disabled by default

## Mandatory Policy Tests

Test that:

- candidate A cannot read candidate B profile
- employer A cannot read employer B jobs/applications
- employer can read only submitted applicant data
- unauthenticated user cannot read private tables
- documents cannot be downloaded without grant
- admin role boundaries work
