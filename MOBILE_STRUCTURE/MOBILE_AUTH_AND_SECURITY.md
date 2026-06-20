# Mobile Auth And Security

Status: Mobile security source of truth

## Auth

Use Supabase Auth.

Mobile should support:

- email/password
- magic link or OTP where useful
- social login later if needed
- secure session persistence
- password reset

Use Expo SecureStore for sensitive local session handling where appropriate.

## RLS

Mobile must obey the same RLS rules as web.

Users can only access:

- their own profile
- their own saved opportunities
- their own applications
- their own documents
- their own notifications
- public/approved opportunities
- public/approved articles
- public/approved provider/agency profiles

## Consent

Mobile must ask consent before:

- AI uses uploaded documents
- AI prepares application content
- AI Apply Agent queues an action
- Apply For Me receives documents
- user data is sent to employer/provider/agency

## Biometric Login

Add later:

- Face ID
- Touch ID
- Android biometric unlock

Biometrics should unlock the local app session, not bypass Supabase security.

