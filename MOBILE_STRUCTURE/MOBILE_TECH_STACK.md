# Mobile Tech Stack

Status: React Native technical direction

## Recommended Stack

Use:

```txt
React Native
Expo
TypeScript
Expo Router
NativeWind or Tamagui
Supabase Auth
Supabase PostgreSQL through server/Supabase clients
Supabase Storage
TanStack Query
Zustand for light global state
React Hook Form
Zod
Expo SecureStore
Expo Notifications
Expo Image Picker
Expo Document Picker
Expo FileSystem
Expo Updates
EAS Build
EAS Submit
Sentry or equivalent crash reporting
PostHog, Amplitude, or Mixpanel for product analytics
```

## Backend Relationship

Mobile should share the same backend foundation as web:

- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Supabase RLS
- server-side AI actions
- server-side payment checkout/session creation
- shared entitlement model

## AI Rule

Mobile must not call DeepSeek, Claude, or OpenAI directly.

The app calls backend endpoints for:

- readiness score
- success score
- document checklist
- CV/application help
- opportunity explanation
- AI Apply Agent actions
- Apply For Me preparation
- article summaries

## Payment Rule

Mobile must not hardcode final pricing.

Plan and entitlement data should come from backend records.

For digital subscriptions, prepare for:

- RevenueCat or App Store / Google Play subscription support where required
- backend checkout links where allowed
- Stripe, Paystack, and Flutterwave checkout through backend/web flows
