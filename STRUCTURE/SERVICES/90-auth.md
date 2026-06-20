# Auth

Status: Unified Platform Service

## Feature Vision

Auth is the secure entry layer for candidates, employers, and admins.

It should support role-aware authentication, protected workspaces, onboarding routing, and strict separation between candidate, employer, and admin access.

Core promise:

> Every user enters the right experience securely, with the minimum friction needed for trust.

## Problem Being Solved

The platform needs to prevent:

- candidates entering employer flows
- employers accessing candidate-private data directly
- unauthenticated application actions
- insecure password recovery
- unverified employer activity
- accidental data exposure across roles
- admin access leakage

## Target Users

- candidates
- employer users
- employer team members
- admins
- support operators

## Core Workflows

### Candidate Registration

Candidates create an account, verify email, choose or confirm candidate role, and continue into onboarding.

### Employer Registration

Employers create an account, provide company basics, verify email, and continue into employer onboarding.

### Role-Aware Login

After login, users should route to:

- candidate dashboard
- employer dashboard
- admin dashboard
- onboarding continuation when incomplete

### Password Recovery

Users can request secure reset links and set new passwords.

### Session And Access Control

The system should protect authenticated routes and prevent role confusion.

## AI Opportunities

Auth itself should stay deterministic, but AI can support:

- suspicious signup pattern detection later
- employer domain verification suggestions
- onboarding route recommendations

## Data Model Notes

Core entities:

- auth.users
- user_profiles
- user_roles
- employer_memberships
- admin_roles
- onboarding_status
- login_audit_events

## UX Direction

Auth should feel clean, premium, and low-friction.

Important UX rules:

- one clear path for candidates
- one clear path for employers
- role detected after login
- onboarding resumes automatically
- errors are human-readable
- legal consent is explicit

## Integrations

- Supabase Auth
- Supabase RLS
- email verification
- password reset email
- employer domain verification later

## Risks And Constraints

- never expose service-role keys
- protect admin routes separately
- role changes should be controlled
- employer team access must be scoped to company
- password reset tokens must not be logged

## Later Phase Decisions (Non-Blocking)

- Should employer signup require work email?
- Should employer accounts require admin approval before posting jobs?
- Admin MFA is mandatory before public beta and mandatory for production super/platform admin access. Later work should decide whether candidate/employer MFA is optional or required for high-risk actions.

## Implementation Roadmap

### Phase 1

Build candidate, employer, and admin auth with email verification and role routing.

### Phase 2

Add employer verification, team invitations, and stronger admin access controls.

### Phase 3

Add MFA, suspicious activity logging, and advanced session management.
