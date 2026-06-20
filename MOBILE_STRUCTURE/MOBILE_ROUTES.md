# Mobile Routes

Status: Expo Router route map

## Purpose

This file maps the planned React Native / Expo Router route structure.

The exact implementation may change, but the first scaffold should preserve these route groups and screen intentions.

## Route Groups

Recommended Expo Router groups:

```txt
app/
  _layout.tsx
  index.tsx
  (auth)/
  (onboarding)/
  (tabs)/
  opportunity/
  article/
  agency/
  modal/
```

## Auth Routes

```txt
app/(auth)/welcome.tsx
app/(auth)/sign-in.tsx
app/(auth)/sign-up.tsx
app/(auth)/forgot-password.tsx
app/(auth)/verify.tsx
```

## Onboarding Routes

```txt
app/(onboarding)/profile.tsx
app/(onboarding)/current-country.tsx
app/(onboarding)/destination-countries.tsx
app/(onboarding)/interests.tsx
app/(onboarding)/documents.tsx
app/(onboarding)/mobility-goals.tsx
app/(onboarding)/plan-preview.tsx
```

## Tab Routes

Use five tabs:

```txt
app/(tabs)/discover.tsx
app/(tabs)/saved.tsx
app/(tabs)/apply.tsx
app/(tabs)/alerts.tsx
app/(tabs)/me.tsx
```

## Discover Routes

```txt
app/(tabs)/discover.tsx
app/opportunity/[id].tsx
app/opportunity/search.tsx
app/opportunity/filters.tsx
app/article/[slug].tsx
app/agency/[id].tsx
```

## Saved Routes

```txt
app/(tabs)/saved.tsx
app/saved/compare.tsx
app/saved/searches.tsx
app/saved/collections/[id].tsx
```

## Apply Routes

```txt
app/(tabs)/apply.tsx
app/applications/[id].tsx
app/applications/new.tsx
app/ai-agent/index.tsx
app/ai-agent/[id].tsx
app/apply-for-me/index.tsx
app/apply-for-me/[id].tsx
app/documents/index.tsx
app/documents/[id].tsx
```

## Alerts Routes

```txt
app/(tabs)/alerts.tsx
app/alerts/[id].tsx
app/alerts/preferences.tsx
```

## Me Routes

```txt
app/(tabs)/me.tsx
app/profile/edit.tsx
app/profile/documents.tsx
app/profile/subscription.tsx
app/profile/billing.tsx
app/profile/security.tsx
app/profile/support.tsx
app/profile/settings.tsx
```

## Modal Routes

Use modals or bottom sheets for:

```txt
app/modal/filter-sheet.tsx
app/modal/plan-gate.tsx
app/modal/add-to-board.tsx
app/modal/consent.tsx
app/modal/document-picker.tsx
app/modal/report-opportunity.tsx
```

## Route Guard Rules

- unauthenticated users can view public discovery previews and articles where allowed
- authenticated users can save, track, upload documents, and receive alerts
- onboarding-incomplete users should be routed into onboarding before advanced actions
- paid-gated actions should open `plan-gate`
- AI or Apply For Me actions that use private data must open consent before execution

