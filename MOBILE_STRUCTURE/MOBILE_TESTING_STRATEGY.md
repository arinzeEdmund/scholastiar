# Mobile Testing Strategy

Status: Mobile verification strategy

## Test Coverage

Test:

- auth flows
- onboarding
- opportunity feed
- opportunity detail
- save/unsave
- add to tracker
- document upload
- notification registration
- locked paid states
- AI action consent gates
- RLS-sensitive access
- offline/poor-network behavior

## Platforms

Verify on:

- iOS simulator
- Android emulator
- at least one real device before production release

## Tools

Use:

- Jest where useful
- React Native Testing Library
- Expo/EAS build checks
- manual device QA
- Supabase RLS checks
- crash reporting verification
- analytics event smoke tests

## Mobile Done Rule

A mobile feature should not be marked `tested 🟡` until iOS and Android behavior is checked for the relevant flow.
