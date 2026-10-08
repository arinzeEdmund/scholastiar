# Email Intelligence

Status: Lifecycle email source of truth

## Purpose

Scholastiar.ai should have a robust email system that acts like a personal opportunity advisor.

The email system should move users through:

```txt
discover
-> save
-> prepare
-> apply
-> delegate
-> authorize AI
-> track
-> upgrade
-> succeed or learn
```

Emails should be periodic and event-triggered, never random.

## Core Principle

Send an email only when there is a useful action for the user.

Examples:

- a strong-fit opportunity is available
- an opportunity is closing soon
- the user's readiness improved
- a missing document blocks an application
- AI Apply Agent can prepare or submit with consent
- Apply For Me is useful because the opportunity is complex or urgent
- a promo pack or plan upgrade directly helps the user's current goal

## Email Categories

### 1. Transactional Emails

Triggered immediately.

Examples:

- signup verification
- password reset
- application submitted
- application status changed
- payment receipt
- subscription changed
- security/admin alerts

### 2. Opportunity Digest Emails

Default frequency:

```txt
weekly
```

Optional active-user frequency:

```txt
daily
```

Includes:

- new opportunities by target country
- high success/fit score opportunities
- quick-apply opportunities, such as `2 min apply`
- visa/relocation-friendly opportunities
- funded opportunities
- closing-soon opportunities

### 3. Readiness Score Emails

Default frequency:

```txt
weekly or triggered by profile/document changes
```

Includes:

- readiness percentage
- missing documents
- weak profile areas
- score explanation
- next best action

Example:

```txt
You are 82% ready for 5 scholarships in Canada.
Add your transcript to reach 94%.
```

### 4. Save Recommendation Emails

Default frequency:

```txt
weekly
```

Includes:

- recommended opportunities to save
- strong target-country matches
- upcoming deadlines
- high mobility value
- fast application effort

### 5. Apply Recommendation Emails

Default frequency:

```txt
2-3 times weekly for active users
weekly for lower-activity users
```

Includes:

- saved opportunities ready to apply
- readiness above threshold
- missing information warning
- direct apply links
- AI Apply Agent board option
- Apply For Me board option

### 6. AI Apply Agent Emails

Triggered when:

- AI-ready opportunities are available
- user has eligible board items
- consent is missing
- documents are missing
- agent run needs review
- agent run completed or failed

Includes:

- opportunities ready for AI preparation
- autonomy mode
- required consent
- missing documents
- proof/status updates

### 7. Apply For Me Emails

Triggered when:

- opportunity is complex, urgent, or high value
- user adds items to Apply For Me board
- Forwarder estimate is ready
- campaign needs approval
- proof of submission is available
- campaign milestone changes

Includes:

- recommended delegation options
- estimated human effort
- campaign pack suggestion
- Forwarder status
- proof/archive links

### 8. Deadline And Urgency Emails

Triggered by deadline.

Default schedule:

```txt
7 days before deadline
3 days before deadline
24 hours before deadline
```

Suppress reminders if:

- user already applied
- user dismissed the opportunity
- user opted out
- opportunity is no longer valid

### 9. Score Detail Emails

Triggered when:

- user views/saves a high-fit opportunity
- readiness changes meaningfully
- user requests score explanation
- plan allows detailed score breakdown

Includes:

- score percentage
- positive factors
- missing factors
- document readiness
- recommended action

### 10. Promo And Conversion Emails

Default limit:

```txt
1-2 per week maximum
```

Send only when tied to user behavior.

Examples:

- user has high-fit opportunities but limited saves
- user has saved opportunities closing soon
- user has many missing documents
- user repeatedly views AI Apply Agent or Apply For Me locked features
- promo pack directly matches current category or target country

Avoid generic sales spam.

## Plan-Based Email Frequency

There is no free applicant plan (decided 2026-10-01). Emails to people without a subscription (newsletter subscribers, unfinished sign-ups) are limited to the weekly digest and conversion emails above.

### Starter

Default:

- 2-3 opportunity emails weekly
- full score breakdowns
- AI board suggestions
- readiness updates
- deadline reminders

### Pro

Default:

- active strategy emails
- AI Apply Agent queue suggestions
- Apply For Me recommendations
- deadline planning
- advanced readiness insights

## User Preferences

Users must be able to control:

- email frequency
- opportunity categories
- target countries
- digest day/time
- deadline reminder timing
- promo emails
- AI Apply Agent emails
- Apply For Me emails
- billing/security emails where legally optional

Transactional, security, and billing-critical emails may remain required where needed.

## Email Intelligence Inputs

The email engine should use:

- user profile
- visa/mobility goals
- target countries
- saved opportunities
- opportunity card metrics
- readiness scores
- success/fit scores
- application effort
- deadline dates
- missing documents
- subscription plan
- AI Apply Agent eligibility
- Apply For Me eligibility
- application history
- email opens/clicks
- upgrade behavior
- consent and notification preferences

## Conversion Logic

Upgrade prompts should be contextual.

Examples:

```txt
You have 9 strong-fit opportunities, but only 2 saves left.
Upgrade to Pro to track all of them.
```

```txt
Your saved scholarship closes in 3 days.
Premium can generate your answers and document checklist.
```

```txt
This university application may take 3 hours to complete.
Delegate it with an Apply For Me campaign pack.
```

## Guardrails

Emails must not overpromise.

Do not say:

```txt
You will get this scholarship.
You are guaranteed this job.
Your visa will be approved.
```

Prefer:

```txt
You appear strongly matched.
You are 92% ready based on your profile and documents.
This opportunity may be worth applying to.
```

## Data Model Notes

Recommended entities:

- email_templates
- email_campaigns
- email_events
- email_deliveries
- email_preferences
- email_digest_schedules
- email_suppression_rules
- email_conversion_events
- email_recommendation_snapshots

## Implementation Notes

- Start with transactional emails, weekly digest, and deadline reminders.
- Add readiness/score emails after opportunity scoring exists.
- Add AI Apply Agent and Apply For Me emails when boards exist.
- Add conversion emails only after subscription entitlements exist.
- Use provider templates but keep template metadata in the database.
- Track delivery, open, click, unsubscribe, bounce, and suppression status.
