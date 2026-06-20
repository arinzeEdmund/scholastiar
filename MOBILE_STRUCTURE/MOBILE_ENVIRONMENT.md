# Mobile Environment

Status: Mobile environment variable and setup plan

## Purpose

This file defines the mobile app environment configuration expected for a React Native / Expo build.

Mobile public variables must be safe to expose in a client app. Secrets must stay on the backend.

## Public Expo Variables

Use `EXPO_PUBLIC_` only for values safe in a mobile bundle.

```txt
EXPO_PUBLIC_APP_NAME=Scholastiar.ai
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_SITE_URL=https://scholastiar.ai
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SUPPORT_EMAIL=
EXPO_PUBLIC_DEFAULT_DESTINATION_COUNTRY=
```

## Backend-Only Secrets

Never place these in the mobile app:

```txt
SUPABASE_SERVICE_ROLE_KEY
DEEPSEEK_API_KEY
ANTHROPIC_API_KEY
OPENAI_API_KEY
STRIPE_SECRET_KEY
PAYSTACK_SECRET_KEY
FLUTTERWAVE_SECRET_KEY
EMAIL_PROVIDER_API_KEY
ADMIN_MFA_SECRET
```

## Mobile Service Keys

Add later where needed:

```txt
SENTRY_DSN or EXPO_PUBLIC_SENTRY_DSN
POSTHOG_API_KEY or EXPO_PUBLIC_POSTHOG_KEY
REVENUECAT_PUBLIC_SDK_KEY_IOS
REVENUECAT_PUBLIC_SDK_KEY_ANDROID
EAS_PROJECT_ID
```

Public analytics keys are allowed only if configured for client-safe usage.

## Environment Files

Recommended local files:

```txt
.env
.env.local
.env.preview
.env.production
```

Do not commit real secrets.

## Runtime Config

Mobile should fetch dynamic config from the backend for:

- active plans
- pricing
- feature entitlements
- supported countries
- AI availability
- payment provider availability
- notification preferences
- sponsored placement rules

