# Security And RLS

Status: Unified Platform Service

## Feature Vision

Security And RLS defines the access-control foundation for Scholastiar.ai.

The platform must protect candidate data, employer data, documents, messages, applications, AI generations, and billing records using Supabase Auth, PostgreSQL policies, secure storage, and server-side AI calls.

Core promise:

> Every user can only access the data they are supposed to access.

## Problem Being Solved

The platform handles sensitive data:

- personal identity
- visa information
- work history
- CVs
- application answers
- employer hiring data
- messages
- videos
- billing records
- documents

Without strict security, trust collapses.

## Target Users

- candidates
- employers
- admins
- support operators
- system services

## Core Workflows

### Role-Based Access

Roles:

- candidate
- employer_member
- employer_admin
- platform_admin
- support_admin

### Candidate Data Protection

Candidates can access their own profile, documents, CVs, applications, and messages.

Employers can only access candidate data through submitted applications or permitted candidate views.

### Relocation Data Protection (2026-10-02)

Relocation holds sensitive data: travel plans and arrival location, health and legal support cases, faith and diet preferences on roommate profiles, payout bank details.

- support cases are visible only to the student, assigned staff (case handler, staff pilot, partner lawyer) and admins; internal notes and costs are staff-only
- pilots see only the students on their bookings and cohorts, and only what the service needs (name, meeting point, contact during the service)
- roommate private fields (faith, diet) are hidden unless the student chooses to show them; they are never used for matching or recommendations without that choice
- community submissions are hidden until an admin approves them
- payout bank details are encrypted and visible only to settlement staff
- rules editors can propose changes for their country; only admins publish and activate

### Employer Data Protection

Employer members can only access their company data based on membership and role.

### Storage Security

Documents and videos require scoped storage policies.

### Server-Side AI Calls

AI API keys must never be exposed to the client.

### Admin Auditability

Admin access and sensitive actions should be logged.

### Admin MFA

Admin MFA is mandatory before public beta.

Production access rules:

- super admins require MFA from day one
- platform admins require MFA from day one
- support, moderation, and billing admins require MFA before public beta
- no production admin account should retain privileged access without MFA once the app leaves restricted internal launch

## AI Opportunities

AI should not bypass security.

Possible support:

- classify sensitive content
- detect suspicious access patterns later
- summarize audit logs for admins

## Data Model Notes

Core entities:

- user_roles
- employer_memberships
- admin_roles
- access_audit_logs
- document_access_grants
- storage_policy_mappings
- service_role_actions
- security_events

## UX Direction

Security UX should be quiet but visible where trust matters.

Important UX:

- privacy controls
- document visibility indicators
- account deletion/export later
- employer team role labels
- admin action confirmations

## Integrations

- Supabase Auth
- PostgreSQL RLS
- Supabase Storage policies
- Edge Functions
- AI services
- billing provider webhooks

## Risks And Constraints

- never expose service-role keys
- never call AI providers directly from client with secret keys
- RLS must be enabled on user data tables
- storage buckets need strict policies
- admin tools must respect roles
- billing webhooks require signature verification
- logs must not leak secrets

## First Launch Decisions

- Admin roles: support admin, moderation admin, billing admin, platform admin, super admin.
- Admin MFA is mandatory before public beta and mandatory for super/platform admins in production.
- First allowed document categories: CV/resume, cover letter, certificates, transcripts, portfolio files, reference letters, and application-specific documents. Passport/ID uploads require explicit user consent, strict access grants, and should be enabled only when a service genuinely needs them.
- Account deletion/export should be planned as a privacy requirement before public launch; minimum first implementation should support export request and deletion request workflows with admin audit.

## Implementation Roadmap

### Phase 1

Implement Supabase Auth, core roles, RLS policies, storage policies, and server-side AI calls.

### Phase 2

Add admin audit logs, employer team permissions, and document access grants.

### Phase 3

Add MFA, suspicious access alerts, and advanced privacy controls.
