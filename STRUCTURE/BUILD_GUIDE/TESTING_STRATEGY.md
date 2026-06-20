# Testing Strategy

Status: Verification guide

## Test Types

### Unit Tests

Use for:

- utility functions
- validation schemas
- data transforms
- AI output parsers
- permission helpers

### Integration Tests

Use for:

- server actions
- database queries
- Supabase policies where possible
- AI workflow wrappers

### RLS Tests

Mandatory tests:

- candidate cannot read another candidate
- employer cannot read another employer
- employer can read submitted applicant only
- document access grants work
- admin roles are scoped

### Playwright E2E Tests

Critical flows:

- candidate signup and onboarding
- employer signup and job posting
- candidate job search and application
- employer applicant review and message
- AI CV generation happy path
- unauthorized access attempts

### PWA Tests

Use for:

- web app manifest validity
- service worker registration
- install prompt behavior
- app shell caching
- offline saved-opportunity read states
- offline article read states
- mobile bottom navigation
- sticky mobile action bars
- push permission flow where supported
- Lighthouse PWA checks

### AI Output Tests

Check:

- output schema validity
- no invented facts from missing inputs
- required warnings appear
- generated CV/application answers are editable

## Build Verification

Before a feature is complete:

- lint passes
- typecheck passes
- relevant tests pass
- main user flow works manually
- RLS assumptions are verified
- PWA/mobile-web behavior is verified where the feature touches installability, offline state, cache, mobile navigation, or push

## Status Labels

Use these labels in `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md`:

- `completed ✅`: implementation is finished and the main manual flow works.
- `tested 🟡`: the completed feature has passed the relevant verification checks.

A feature can only be marked `tested 🟡` after:

- lint passes
- typecheck passes
- relevant unit/integration/E2E tests pass
- the main user flow works manually
- RLS/security assumptions are verified where applicable
- acceptance criteria are satisfied
