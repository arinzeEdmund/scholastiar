# PWA-First Web App

Status: Progressive Web App and mobile-web source of truth

## Purpose

Scholastiar.ai should be built as a PWA-first web platform before the full React Native app is built.

The web app should behave like a serious mobile app when opened on a phone:

- installable to home screen
- mobile-app-like navigation
- fast on poor networks
- offline-aware for saved content
- push-capable where browser/platform support exists
- document-upload friendly
- action-board ready
- deadline/reminder oriented

Core strategy:

```txt
Build the web platform
-> add PWA-first mobile UX
-> let users install and use app-like workflows
-> use analytics to learn mobile behavior
-> build React Native later from proven flows
```

## Product Principle

Mobile web must not be treated as a leftover responsive layout.

Rule:

```txt
If a workflow matters on mobile, it must be designed as a first-class PWA experience.
```

PWA should support the same core applicant loop:

```txt
Discover
-> Save
-> Check readiness
-> Prepare documents
-> Apply or delegate
-> Track
-> Receive alerts
```

## PWA Feature Scope

### MVP PWA Features

- web app manifest
- install-to-home-screen support
- mobile app shell
- mobile bottom navigation for logged-in applicants
- sticky opportunity action bar
- mobile-friendly filters as sheets/drawers
- cached app shell
- cached recently viewed/saved opportunities
- cached article/news/immigration update reads
- offline-aware empty/error states
- browser push notification setup where supported
- deadline alert opt-in
- saved opportunity alert opt-in
- document upload from phone
- plan gates as mobile sheets
- AI consent sheets
- Apply For Me and AI Apply Agent board actions
- sponsored labels visible on mobile

### Later PWA Features

- deeper offline saved collections
- background sync where safe and supported
- offline article library
- saved search alerts
- richer notification preference center
- app-like onboarding tour
- PWA install analytics

## PWA Limitations

PWA is powerful, but it is not the same as React Native.

Limitations:

- push support varies by browser and platform
- background tasks are limited
- app store visibility is weaker
- biometric login is more limited
- camera/document scanning is less powerful than native
- payment behavior still depends on browser/app store rules

Therefore:

```txt
PWA = fast mobile reach and app-like web experience
React Native = later deeper native app
```

## Recommended Web Tech

Use:

```txt
Next.js App Router
React
TypeScript
Tailwind CSS
shadcn/ui
Web App Manifest
Service Worker
Workbox or next-pwa
Cache Storage
IndexedDB
TanStack Query persistence
Push API
Notification API
Supabase Auth
Vercel deployment
```

Optional libraries:

```txt
next-pwa
workbox-window
idb
localforage
@tanstack/query-persist-client
```

## Mobile PWA Navigation

Desktop web can keep normal top/side navigation.

Mobile PWA should use bottom tabs for applicant workflows:

```txt
Discover
Saved
Apply
Alerts
Me
```

This matches `MOBILE_STRUCTURE/MOBILE_NAVIGATION.md` so the future React Native app feels familiar.

## Core PWA Screens

Prioritize:

- Discover home
- Opportunity search
- Opportunity detail
- Saved opportunities
- Application tracker
- AI Apply Agent board
- Apply For Me board
- Documents
- Alerts
- Articles/news/immigration updates
- Profile
- Pricing/subscription

Keep these web-first:

- admin dashboard
- full employer dashboard
- full provider dashboard
- sponsorship campaign manager
- publishing CMS
- deep analytics dashboard
- moderation queues

## Install Prompt UX

Do not show the install prompt immediately.

Show it after meaningful engagement, such as:

- user saves an opportunity
- user views multiple opportunities
- user creates first application tracker item
- user opts into deadline reminders
- user reads multiple articles

Prompt copy example:

```txt
Add Scholastiar.ai to your phone for deadline alerts and saved opportunities.
```

Install prompt rules:

- never block the main workflow
- allow dismissal
- do not repeat aggressively
- track shown, dismissed, and installed events

## Offline And Cache Rules

Cache:

- app shell
- static assets
- recently viewed opportunities
- saved opportunities summary
- saved articles/news/immigration updates
- profile summary where safe
- document checklist metadata

Do not silently cache sensitive data beyond what is needed.

Never queue silently:

- payments
- application submission
- AI Apply Agent execution
- Apply For Me authorization
- document sharing
- employer/provider submission

Sensitive actions require online confirmation and explicit consent.

## Push Notification Rules

Use push only after opt-in.

Notification types:

- deadline reminders
- saved opportunity updates
- application status updates
- readiness/document alerts
- AI Apply Agent queue updates
- Apply For Me campaign updates
- high-fit opportunity alerts
- important article/immigration updates

Push must coordinate with email intelligence so users are not spammed.

Sponsored push notifications require strict relevance and clear labeling.

## PWA Component Requirements

Web components should include:

- InstallPrompt
- MobileBottomTabs
- StickyOpportunityActionBar
- OfflineBanner
- PushPermissionSheet
- DeadlineAlertToggle
- MobileFilterSheet
- PlanGateSheet
- AIConsentSheet
- SavedCacheStatus
- PWAUpdateToast

Opportunity detail mobile action bar:

```txt
Save
Apply
AI Agent
Apply For Me
```

## Data Flow

PWA data should use the normal backend and RLS rules.

Suggested flow:

```txt
Supabase/session
-> TanStack Query
-> persisted safe cache
-> app shell/offline state
-> mutation requires online confirmation for sensitive actions
```

Cache and offline state must not bypass:

- RLS
- consent
- plan entitlements
- sponsored labeling
- AI safety rules

## Testing Requirements

Test PWA behavior for:

- manifest validity
- service worker registration
- install prompt behavior
- app shell caching
- offline saved opportunities
- offline article reads
- mobile bottom tabs
- sticky action bar
- push permission flow where supported
- no silent sensitive action queueing
- Lighthouse PWA checks
- mobile browser QA

## Relationship To React Native

PWA should reduce mobile risk before React Native.

The PWA and React Native app should share:

- backend
- auth model
- entitlement model
- AI rules
- notification concepts
- opportunity card data
- application tracker model
- Apply For Me and AI Apply Agent board models

The PWA should prove the mobile product loops first.

React Native should later deepen the best mobile workflows with stronger native features.

