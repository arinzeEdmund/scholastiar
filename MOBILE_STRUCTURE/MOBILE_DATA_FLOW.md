# Mobile Data Flow

Status: Mobile data and API behavior

## Data Sources

Mobile reads from the same platform backend:

- Supabase Auth session
- Supabase profile tables
- opportunities
- saved opportunities
- applications
- documents
- notifications
- plan entitlements
- articles/news
- migration agencies

## Query Strategy

Use TanStack Query for:

- opportunity feeds
- detail pages
- saved items
- application tracker
- documents
- notifications
- articles
- subscription/entitlement state

Use optimistic updates carefully for:

- save/unsave
- mark notification read
- add to board

## Mutations

Mobile may trigger:

- save opportunity
- remove saved opportunity
- add to application tracker
- update application status
- upload document
- delete document
- add to AI Apply Agent board
- add to Apply For Me board
- update preferences
- subscribe/unsubscribe from alerts

All sensitive mutations must respect RLS and consent rules.

## Poor Network Behavior

Mobile should handle:

- slow loading
- temporary offline state
- retry
- cached saved opportunities
- cached application tracker
- queued non-sensitive actions where safe

