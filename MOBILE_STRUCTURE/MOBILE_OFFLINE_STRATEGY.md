# Mobile Offline Strategy

Status: Offline and poor-network behavior

## MVP Offline Support

Mobile MVP should support:

- cached saved opportunities
- cached application tracker
- cached profile summary
- cached document checklist
- offline empty/error states

## Later Offline Support

Later support:

- offline article reading
- queued save actions
- queued tracker updates
- local draft notes

## Never Queue Silently

Do not silently queue sensitive actions like:

- application submission
- AI Apply Agent execution
- Apply For Me authorization
- payment
- document sharing

These require online confirmation and clear user consent.

