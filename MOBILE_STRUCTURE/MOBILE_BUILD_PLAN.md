# Mobile Build Plan

Status: Mobile implementation order

## Build Order

The mobile app follows the main platform service order, but starts with mobile foundation first.

```txt
1. Mobile app scaffold
2. Environment and route groups
3. Design tokens and base components
4. Auth and onboarding
5. Candidate profile and mobility preferences
6. Notifications foundation
7. Jobs discovery
8. Universal opportunity card
9. Job detail page
10. Save/apply flow
11. Application tracker
12. Documents and checklist
13. Pricing/entitlement display
14. Analytics/crash reporting foundation
15. AI Apply Agent board
16. Apply For Me board
17. Articles/news/immigration reader
18. Universities
19. Scholarships
20. Fellowships
21. Grants
22. Competitions
23. Conferences / Training
24. Awards
25. Migration agencies
26. Payments/subscriptions refinement
27. Release hardening
```

## First Vertical Slice

First mobile vertical slice:

```txt
Auth
-> onboarding
-> jobs feed
-> job detail
-> save
-> readiness score preview
-> application tracker entry
-> deadline push notification
```

This gives the app a real user loop before adding the full platform.

## Definition Of Mobile Done

A mobile feature is done only when:

- it works on iOS and Android
- loading, empty, and error states exist
- offline/poor-network behavior is acceptable
- RLS/security expectations are respected
- push or reminder behavior is tested where applicable
- paid/locked states are clear
- accessibility labels are included for important actions
