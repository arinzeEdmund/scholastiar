# Scholastiar.ai Mobile Structure

Status: React Native mobile planning source of truth

Purpose: Translate the main Scholastiar.ai web/platform structure into a React Native mobile app plan.

The mobile app should be applicant-first. It should help users discover international opportunities, save them, check readiness, track applications, receive alerts, manage documents, use AI Apply Agent, use Apply For Me, and read important opportunity/immigration updates from their phone.

Read these files in order:

```txt
MOBILE_APP_SCOPE.md
MOBILE_TECH_STACK.md
MOBILE_ENVIRONMENT.md
MOBILE_START_CHECKLIST.md
MOBILE_BUILD_PLAN.md
MOBILE_NAVIGATION.md
MOBILE_ROUTES.md
MOBILE_SCREENS.md
MOBILE_COMPONENT_SYSTEM.md
MOBILE_DATA_FLOW.md
MOBILE_AUTH_AND_SECURITY.md
MOBILE_NOTIFICATIONS.md
MOBILE_AI_WORKFLOWS.md
MOBILE_PAYMENTS.md
MOBILE_APP_STORE_POLICY.md
MOBILE_OFFLINE_STRATEGY.md
MOBILE_ANALYTICS_AND_CRASH_REPORTING.md
MOBILE_TESTING_STRATEGY.md
MOBILE_RELEASE_PLAN.md
MOBILE_WEB_ONLY_REMOVALS.md
```

Main platform references:

- `STRUCTURE/AGENTS.md`
- `STRUCTURE/MAP.md`
- `STRUCTURE/SERVICES/`
- `STRUCTURE/PAGES/`
- `STRUCTURE/DATABASE/db.md`
- `STRUCTURE/UI_BASE/ux_ui_base.md`
- `STRUCTURE/UI_BASE/signature_ui_base.md`
- `STRUCTURE/BUILD_GUIDE/PRICING.md`
- `STRUCTURE/BUILD_GUIDE/EMAIL_INTELLIGENCE.md`
- `STRUCTURE/BUILD_GUIDE/PWA_FIRST_WEB_APP.md`
- `STRUCTURE/BUILD_GUIDE/SPONSORED_ADS_MARKETPLACE.md`

## Mobile Principle

The mobile app is not the full web app compressed onto a phone.

The PWA-first web app should come before the full React Native app. Use it to prove mobile workflows, notification behavior, saved opportunity behavior, and Apply/AI board behavior before building native screens.

It is the user's daily opportunity command center:

```txt
Discover
-> Save
-> Check readiness
-> Prepare documents
-> Apply or delegate
-> Track
-> Receive alerts
```

Employer, provider, admin, publishing, and sponsorship management should remain web-first until the applicant mobile experience is strong.
