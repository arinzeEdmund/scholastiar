# Services

Status: Unified ordered service index

Build Scholastiar.ai as one platform, but implement services one after another in this order:

1. `02-universities.md` - not started
2. `03-scholarships.md` - not started
3. `09-ai-apply-agent.md` - not started
4. `10-apply-for-me.md` - not started
5. `11-discovery-engine.md` - not started
6. `12-relocation.md` - not started
7. `13-migration-agencies.md` - not started
8. `14-jobs.md` - not started (Pro-only job connections in the dashboard; formerly 01, moved last on 2026-10-07)

School-related services only (decided 2026-10-07): Fellowships, Grants, Competitions, Conferences / Training and Awards were removed.

When implementation begins, update statuses in `STRUCTURE/BUILD_GUIDE/PROGRESS_TRACKER.md`.

Use:

- `completed ✅` for finished features
- `tested 🟡` for fully verified features

Supporting platform services:

```txt
20-work-eligibility.md
21-study-catalogue.md
90-auth.md
91-onboarding-intelligence.md
92-candidate-profile.md
93-ai-cv-generation.md
94-ai-assisted-applications.md
95-application-tracking.md
96-personality-ai-cv.md
107-signia.md
97-employers.md
98-candidate-ranking.md
99-messaging-communication.md
100-notifications.md
101-application-intelligence.md
102-documents-storage.md
103-billing-subscriptions.md
104-admin-operations.md
105-analytics.md
106-security-rls.md
```

Every service must preserve the cross-border opportunity principle: help users move toward work abroad, study abroad, funded travel, relocation, migration, international credibility, or a chosen destination country.

## Later Phase Decisions

Individual service specs may contain `Later Phase Decisions (Non-Blocking)`.

Those sections are not blockers for starting implementation. They capture choices that should be resolved when that specific service becomes active in the ordered build sequence.

## Universal Opportunity Card Requirement

Every apply-able opportunity service should use the shared opportunity card pattern.

Cards should show:

- application period or deadline
- estimated application effort, such as `2 min apply`
- success/fit score, such as `92% success score`
- save action
- direct apply action when available
- add to AI Apply Agent board when subscription allows it
- add to Apply For Me board when subscription allows it

The score must be explained as an estimate based on fit, eligibility, readiness, documents, timing, and available platform signals. It must not be presented as a guaranteed result.
