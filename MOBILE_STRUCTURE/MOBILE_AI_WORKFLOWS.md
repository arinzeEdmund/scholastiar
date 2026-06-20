# Mobile AI Workflows

Status: Mobile AI behavior

## AI Provider Rule

Mobile never calls AI providers directly.

Backend provider order remains:

```txt
DeepSeek
Claude
OpenAI
```

## Mobile AI Features

- explain opportunity fit
- show success score summary
- show readiness score summary
- generate document checklist
- improve CV bullet suggestions
- draft application answers through backend
- suggest opportunities
- summarize articles/news updates
- prepare AI Apply Agent queue items
- prepare Apply For Me intake

## Consent Gates

Require user confirmation before:

- using documents for AI analysis
- generating application materials from private profile data
- adding opportunities to AI Apply Agent
- sharing data with Apply For Me staff/workflow
- sending application materials externally

## Mobile AI UX

Use:

- bottom sheets
- compact explanations
- progressive disclosure
- "why this score" views
- clear next action

Avoid long chatbot-first flows for core actions. The app should remain task-driven.

