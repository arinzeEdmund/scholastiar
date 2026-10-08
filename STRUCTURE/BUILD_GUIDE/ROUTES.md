# Routes

Status: Canonical unified platform route map

## Public

```txt
/
/about
/how-it-works
/pricing
/blog
/blog/[slug]
/contact
/faq
/privacy
/terms
/search
/s/[handle]
```

## Auth

```txt
/auth/sign-in
/auth/sign-up/candidate
/auth/sign-up/employer
/auth/sign-up/provider
/auth/choose-role
/auth/forgot-password
/auth/reset-password
/auth/verify-email
/auth/verify-email/confirm   (route handler: consumes the emailed token, then redirects to /auth/verify-email)
```

## Candidate Core

```txt
/dashboard
/saved
/onboarding
/onboarding/personal
/onboarding/visa
/onboarding/education
/onboarding/experience
/onboarding/skills
/onboarding/preferences
/onboarding/personality-cv
/onboarding/review
/onboarding/complete
/profile
/profile/edit
/profile/experience/[experienceId]
/profile/skills
/profile/visa
/profile/preferences
/profile/documents
/signia
/signia/builder
/signia/projects/[projectId]
/signia/media
/signia/social-links
/signia/preview
/applications
/applications/[applicationId]
/applications/drafts
/applications/insights
/messages
/messages/[threadId]
/notifications
/settings
/settings/notifications
/billing
/billing/checkout
```

## Jobs

Pro plan only, inside the candidate dashboard (decided 2026-10-07). There is no public job board: the former `/jobs` and `/jobs/[jobId]/public` routes were removed. Starter candidates see these routes as a locked page with an upgrade prompt. See `SERVICES/14-jobs.md` → Positioning.

```txt
/dashboard/jobs
/dashboard/jobs/[jobId]
/dashboard/jobs/saved
/dashboard/jobs/post-study
/applications/apply/[jobId]
/applications/apply/[jobId]/review
```

## Employers

```txt
/employers
/for-employers
/employers/onboarding
/employers/onboarding/company
/employers/onboarding/hiring
/employers/onboarding/team
/employers/onboarding/complete
/employers/dashboard
/employers/company
/employers/jobs
/employers/jobs/new
/employers/jobs/[jobId]/edit
/employers/jobs/[jobId]/applicants
/employers/applications/[applicationId]
/employers/applications/[applicationId]/cv
/employers/candidates/[candidateId]
/employers/candidates/[candidateId]/personality-cv
/employers/candidates/[candidateId]/signia
/employers/signia
/employers/signia/compare
/employers/pipeline
/employers/screening-questions
/employers/messages
/employers/messages/[threadId]
/employers/notifications
/employers/analytics
/employers/jobs/[jobId]/analytics
/employers/team
/employers/settings
/employers/settings/notifications
/employers/billing
/employers/billing/checkout
/employers/work-eligibility
```

## Universities

Includes the public study catalogue (`SERVICES/21-study-catalogue.md`). Outbound "official site" links go through the `/out/[linkId]` route handler, which is not a page and is not listed here.

```txt
/programs
/programs/[levelSlug]
/programs/[levelSlug]/[fieldSlug]
/universities
/universities/search
/universities/country/[countrySlug]
/universities/[universitySlug]
/universities/[universitySlug]/programs
/universities/[universitySlug]/programs/[programSlug]
/universities/[universitySlug]/eligibility
/universities/[universitySlug]/apply
/universities/saved
/universities/compare
/universities/dashboard
/universities/applications
/universities/applications/[applicationId]
```

## Scholarships

```txt
/scholarships
/scholarships/search
/scholarships/[scholarshipSlug]
/scholarships/[scholarshipSlug]/eligibility
/scholarships/[scholarshipSlug]/apply
/scholarships/matcher
/scholarships/saved
/scholarships/applications
/scholarships/applications/[applicationId]
/scholarships/applications/[applicationId]/answers
/scholarships/deadlines
/scholarships/verification
```

## AI CV And PersonalityAI CV

```txt
/ai-cv
/ai-cv/generate
/ai-cv/[cvId]
/ai-cv/[cvId]/edit
/ai-cv/history
/personality-cv
/personality-cv/record
/personality-cv/preview
/personality-cv/settings
```

## AI Apply Agent

```txt
/apply-agent
/apply-agent/setup
/apply-agent/rules
/apply-agent/queue
/apply-agent/queue/add
/apply-agent/runs
/apply-agent/runs/[runId]
/apply-agent/performance
/apply-agent/pricing
```

## Apply For Me

```txt
/apply-for-me
/apply-for-me/board
/apply-for-me/proposals/new
/apply-for-me/proposals/[proposalId]
/apply-for-me/campaigns
/apply-for-me/campaigns/[contractId]
/apply-for-me/messages
/apply-for-me/payments
/forwarder/onboarding
/forwarder/dashboard
/forwarder/contracts
/forwarder/contracts/[contractId]
```

## Discovery Engine Admin

```txt
/admin/discovery
/admin/discovery/categories
/admin/discovery/sources
/admin/discovery/sources/[sourceId]
/admin/discovery/queue
/admin/discovery/queue/[itemId]
/admin/discovery/freshness
/admin/discovery/coverage
```

## Relocation

Public, candidate and Year Check-in screens for `SERVICES/12-relocation.md` (Pre-Arrival Processes, Post-Arrival Processes, accommodation, roommates, communities, city guide, pilots, cohorts, Handsoff).

```txt
/relocation
/relocation/[countrySlug]
/pilots/apply
/journey
/journey/setup
/journey/pre-arrival
/journey/post-arrival
/journey/steps/[stepId]
/journey/costs
/journey/travel
/journey/cohort
/journey/handsoff
/accommodation
/accommodation/[listingId]
/accommodation/[listingId]/book
/accommodation/bookings
/accommodation/bookings/[bookingId]
/roommates
/roommates/profile
/roommates/requests
/communities
/communities/[communityId]
/communities/suggest
/city-guide/[citySlug]
/pilots
/pilots/awards
/pilots/awards/vote
/pilots/[pilotId]
/pilots/bookings
/pilots/bookings/[bookingId]
/support
/support/join
/support/cases/new
/support/cases/[caseId]
```

## Relocation Operations

Pilot workspace, housing-provider workspace and relocation admin (rules library, embassies, communities approval, pilots, cohorts, accommodation verification, settlements, support cases).

```txt
/pilot/onboarding
/pilot/dashboard
/pilot/requests
/pilot/bookings/[bookingId]
/pilot/cohorts
/pilot/cohorts/[cohortId]
/pilot/cases
/pilot/earnings
/pilot/referrals
/pilot/profile
/housing/onboarding
/housing/dashboard
/housing/listings
/housing/listings/new
/housing/listings/[listingId]
/housing/bookings
/housing/bookings/[bookingId]
/housing/payouts
/admin/relocation
/admin/relocation/countries/[countryCode]
/admin/relocation/steps/[stepId]
/admin/relocation/embassies
/admin/relocation/embassies/[embassyId]
/admin/relocation/preview
/admin/relocation/reviews
/admin/relocation/costs
/admin/communities
/admin/pilots
/admin/pilots/[pilotId]
/admin/pilot-commissions
/admin/pilot-awards
/admin/cohorts
/admin/accommodation
/admin/settlements
/admin/support-cases
/admin/support-cases/[caseId]
/admin/partner-lawyers
```

## Migration Agencies

```txt
/migration-agencies
/migration-agencies/search
/migration-agencies/[agencySlug]
/migration-agencies/services/[serviceId]
/migration-agencies/book/[serviceId]
/migration-agencies/dashboard
/migration-agencies/appointments/[appointmentId]
/migration-agencies/payments
/migration-agencies/partners/onboarding
/office/dashboard
/office/services
/office/appointments
/partner-agency/dashboard
```

## Provider Portals

These are used as opportunity provider surfaces beyond employers.

```txt
/providers/onboarding
/providers/dashboard
/providers/opportunities
/providers/opportunities/new
/providers/opportunities/[opportunityId]/edit
/providers/applications
/providers/applications/[applicationId]
/providers/team
/providers/settings
```

## Admin

```txt
/admin
/admin/sign-in
/admin/users
/admin/users/[userId]
/admin/users/[userId]/profile
/admin/employers
/admin/employers/[employerId]
/admin/providers
/admin/providers/[providerId]
/admin/opportunities
/admin/jobs
/admin/universities
/admin/scholarships
/admin/applications
/admin/reports
/admin/ai-generations
/admin/ai-generations/cvs
/admin/ai-generations/applications
/admin/personality-cv
/admin/messages
/admin/notifications
/admin/subscriptions
/admin/analytics
/admin/blog
/admin/settings
```

## Shared Utility

```txt
/unauthorized
/not-found
/server-error
/maintenance
/offline
```
