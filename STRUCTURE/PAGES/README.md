# Pages

Status: Unified ordered page index

The ordered page specs follow the required service build order (Jobs moved from 01 to 14 on 2026-10-07):

1. `02-universities-pages.md`
2. `03-scholarships-pages.md`
3. `09-ai-apply-agent-pages.md`
4. `10-apply-for-me-pages.md`
5. `11-discovery-engine-pages.md`
6. `12-relocation-pages.md`
7. `13-migration-agencies-pages.md`
8. `14-jobs-pages.md` (Pro only, inside the candidate dashboard)

Fellowships, Grants, Competitions, Conferences / Training and Awards pages were removed on 2026-10-07 (school-related services only).

Supporting page specs:

```txt
000-original-screen-list.md
89-public-pages.md
90-auth-pages.md
91-onboarding-pages.md
92-candidate-profile-pages.md
93-ai-cv-pages.md
94-applications-pages.md
95-personality-ai-cv-pages.md
102-signia-pages.md
96-employers-pages.md
97-messaging-pages.md
98-notifications-pages.md
99-billing-pages.md
100-admin-pages.md
101-analytics-pages.md
```

Build page surfaces only when the active ordered service needs them.

## Universal Opportunity Cards

Opportunity listing pages must use a consistent card pattern across jobs, universities and scholarships.

Each card should show:

- application period/deadline
- estimated effort, such as `2 min apply`
- success/fit score, such as `92% success score`
- save action
- direct apply action where possible
- subscription-aware `Add to AI Apply Agent Board`
- subscription-aware `Add to Apply For Me Board`

Locked board actions should explain the required plan without hiding the basic opportunity details.

## Unified Saved Page

Route: `/saved` (added 2026-10-01; mobile "Saved" tab)

Purpose: One place for everything the user has saved, across jobs, universities and scholarships. Backed by `saved_opportunities` in `DATABASE/db.md`.

Should show:

- type filter tabs (All plus each opportunity type that has saved items)
- sort by closing soonest, recently saved, or highest success/fit score
- a "closing soon" group for deadlines within 14 days
- the universal opportunity card for every item, with unsave, apply and board actions
- deadline reminder opt-in per item
- empty state that points to discovery

Build order: built in U6 with universities as the first type. Scholarships (U7) adds its type, and Jobs (U15) adds jobs for Pro candidates only. Category pages such as `/dashboard/jobs/saved` and `/universities/saved` stay as filtered views of the same data.
