# Mobile Start Checklist

Status: Pre-scaffold mobile readiness checklist

Use this file before creating the React Native app scaffold.

## Required Local Tooling

Before implementation:

- Node.js LTS is available
- npm or pnpm is available
- Expo CLI can run through package scripts
- EAS CLI is available when build/release work begins
- iOS simulator is available on macOS where possible
- Android emulator is available or a real Android device is available
- Supabase project or local Supabase environment is available
- mobile `.env.local` is created from `MOBILE_ENVIRONMENT.md`

Recommended package manager:

```txt
pnpm
```

Fallback:

```txt
npm
```

## First Scaffold Defaults

Use:

```txt
Expo
React Native
TypeScript
Expo Router
NativeWind or Tamagui
TanStack Query
Zustand
Supabase JS
Expo SecureStore
Expo Notifications
Expo Image Picker
Expo Document Picker
```

## First Implementation Sequence

1. Create Expo app scaffold
2. Add TypeScript and Expo Router route groups
3. Add design tokens and base UI components
4. Add Supabase client/session handling
5. Add auth screens
6. Add onboarding screens
7. Add tab navigation
8. Add Jobs discovery feed
9. Add universal opportunity card
10. Add opportunity detail page
11. Add save/unsave
12. Add application tracker entry
13. Add deadline alert registration
14. Add loading, empty, and error states
15. Verify iOS and Android basic flow

## Stop Conditions

Pause implementation and update planning docs if:

- a mobile route is missing from `MOBILE_ROUTES.md`
- a feature requires a web-only admin workflow
- an AI action would expose private user data without consent
- a payment flow conflicts with app store policy
- a push notification would be sent without user opt-in
- RLS ownership rules are unclear

