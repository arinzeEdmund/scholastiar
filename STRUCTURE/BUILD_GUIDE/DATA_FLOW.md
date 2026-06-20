# Data Flow

Status: Product data movement guide

## Core Candidate Flow

```txt
Auth
-> Onboarding
-> Candidate Profile
-> Job Matching
-> AI CV Generation
-> AI-Assisted Application
-> Application Submission
-> Employer Review
-> Messaging
-> Application Outcome
-> Application Intelligence
```

## Core Employer Flow

```txt
Auth
-> Employer Onboarding
-> Company Profile
-> Job Posting
-> Applicant Pipeline
-> Candidate Ranking
-> Messaging
-> Hiring Outcome
-> Employer Analytics
```

## AI Data Flow

```txt
User-approved profile facts
-> AI prompt pipeline
-> provider selection
-> DeepSeek primary attempt
-> Claude/OpenAI fallback if needed
-> Draft output
-> User review/edit
-> Approved artifact
-> Application or employer view
```

Raw AI output should not automatically become submitted truth. User approval matters.

## AI Provider Fallback Flow

```txt
AI request
-> classify task and risk level
-> choose preferred provider from AI_PROVIDER_ORDER
-> call provider server-side
-> if provider unavailable/restricted/rate-limited, record failure
-> retry with next eligible provider
-> validate output schema
-> store provider/model metadata
-> return draft for user review
```

Fallback must not bypass:

- user consent
- safety checks
- output schema validation
- RLS and document access rules
- audit logging for provider/model used

## Document Flow

```txt
Upload
-> Document metadata
-> Storage object
-> Access policy/grant
-> Attached to CV/application/message
-> Access log
```

## Outcome Learning Flow

```txt
Application status
-> Outcome event
-> Analytics metric
-> AI insight
-> Candidate recommendation
```

## Email Intelligence Flow

```txt
User profile and preferences
-> opportunity matches and saved items
-> readiness/success scores
-> deadline and application effort checks
-> subscription entitlement check
-> email recommendation decision
-> digest/triggered email generation
-> delivery log
-> open/click/conversion event
-> future recommendation tuning
```

Emails should be periodic and event-triggered, never random.

## PWA Mobile-Web Flow

```txt
Web session
-> app shell
-> service worker registration
-> safe cache/persisted query state
-> offline-aware saved opportunities and article reads
-> online confirmation for sensitive mutations
-> push/email alert preference coordination
```

PWA cache and offline behavior must not bypass:

- RLS
- user consent
- plan entitlements
- AI safety rules
- sponsored labeling
- payment confirmation
