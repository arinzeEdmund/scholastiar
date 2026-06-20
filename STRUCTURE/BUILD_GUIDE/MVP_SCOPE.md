# Launch Scope

Status: Unified platform launch boundary

## Product Scope

Scholastiar.ai is one unified international opportunity and mobility platform.

The product includes:

- jobs
- universities
- scholarships
- fellowships
- grants
- competitions
- conferences/training
- awards
- AI Apply Agent
- Apply For Me
- Discovery Engine
- migration agencies
- candidate authentication
- employer/provider authentication
- candidate onboarding
- provider onboarding where needed
- candidate profile
- visa/mobility profile
- document storage
- AI CV generation
- AI-assisted application generation
- application tracking
- provider applicant review
- candidate ranking/matching
- PersonalityAI CV
- messaging
- notifications
- billing/subscriptions
- admin operations
- analytics
- Supabase RLS/security

## Core Opportunity Requirement

Every service must be built around cross-border opportunity. The platform should help users identify opportunities that can support working abroad, studying abroad, funded travel, relocation, visa readiness, international credibility, global networks, migration preparation, or career movement toward a country of choice.

## Required Build Order

1. Jobs
2. Universities
3. Scholarships
4. Fellowships
5. Grants
6. Competitions
7. Conferences / Training
8. Awards
9. AI Apply Agent
10. Apply For Me
11. Discovery Engine
12. Migration Agencies

## Out Of Scope For First Launch

Do not build unrelated product lines outside the ordered services above.

Examples:

- generic social networking
- unrelated course marketplace
- unrelated ecommerce
- unmanaged scraping without verification
- legal advice guarantees
- guaranteed visa/admission/job/funding claims
- speculative external automation that violates portal rules

## Launch Criteria

The platform is launchable when:

- users can sign up, onboard, and complete a reusable profile
- users can define target countries, mobility goals, documents, and opportunity preferences
- the first ordered service works end to end
- each completed service has discovery, detail pages, application support, tracking, and admin review where relevant
- every apply-able opportunity card shows estimated application effort, success/fit score, deadline/application window, save action, direct apply action when available, and subscription-aware board actions for AI Apply Agent or Apply For Me
- AI-generated outputs are reviewable and editable
- applications require proper consent before submission
- documents are stored securely
- RLS protects user, provider, application, document, and message data
- admin can moderate users, providers, opportunities, applications, documents, and reports

## Can Be Basic At First

- billing can start with simple plans
- pricing should follow `STRUCTURE/BUILD_GUIDE/PRICING.md`
- analytics can be minimal
- PersonalityAI CV can start with upload/record only
- AI recommendations can be simple but truthful
- admin tools can be utilitarian
- external automation can start as assistive rather than fully autonomous

## Must Be Production-Ready

- auth
- RLS
- document access
- AI key handling
- application submission
- user/provider data boundaries
- consent and audit logs for AI/application actions
- billing webhooks once enabled
