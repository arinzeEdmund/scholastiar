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
```

## Candidate Core

```txt
/dashboard
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

```txt
/jobs
/jobs/[jobId]/public
/dashboard/jobs
/dashboard/jobs/[jobId]
/dashboard/jobs/saved
/dashboard/jobs/visa-sponsored
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
/employers/visa-complexity
```

## Universities

```txt
/universities
/universities/search
/universities/country/[countrySlug]
/universities/[universitySlug]
/universities/[universitySlug]/programs
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

## Fellowships

```txt
/fellowships
/fellowships/search
/fellowships/[fellowshipSlug]
/fellowships/[fellowshipSlug]/eligibility
/fellowships/[fellowshipSlug]/apply
/fellowships/matcher
/fellowships/purpose
/fellowships/leadership
/fellowships/saved
/fellowships/applications
/fellowships/applications/[applicationId]
/fellowships/applications/[applicationId]/answers
```

## Grants

```txt
/grants
/grants/search
/grants/[grantSlug]
/grants/[grantSlug]/eligibility
/grants/[grantSlug]/apply
/grants/matcher
/grants/projects
/grants/projects/[projectId]
/grants/projects/[projectId]/budget
/grants/saved
/grants/applications
/grants/applications/[applicationId]
/grants/applications/[applicationId]/proposal
/grants/deadlines
```

## Competitions

```txt
/competitions
/competitions/search
/competitions/[competitionSlug]
/competitions/[competitionSlug]/eligibility
/competitions/[competitionSlug]/apply
/competitions/matcher
/competitions/projects
/competitions/projects/[projectId]/builder
/competitions/teams/[teamId]
/competitions/saved
/competitions/applications
/competitions/applications/[applicationId]
/competitions/applications/[applicationId]/submission
```

## Conferences And Training

```txt
/conferences
/conferences/search
/conferences/[opportunitySlug]
/conferences/[opportunitySlug]/eligibility
/conferences/[opportunitySlug]/apply
/conferences/matcher
/conferences/saved
/conferences/applications
/conferences/applications/[applicationId]
/conferences/applications/[applicationId]/builder
/conferences/travel-readiness
```

## Awards

```txt
/awards
/awards/search
/awards/[awardSlug]
/awards/[awardSlug]/eligibility
/awards/[awardSlug]/apply
/awards/matcher
/awards/achievements
/awards/achievements/[achievementId]/builder
/awards/saved
/awards/applications
/awards/applications/[applicationId]
/awards/applications/[applicationId]/answers
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
/admin/fellowships
/admin/grants
/admin/competitions
/admin/conferences
/admin/awards
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
```
