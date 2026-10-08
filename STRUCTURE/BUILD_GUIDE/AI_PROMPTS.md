# AI Prompts

Status: Central prompt architecture

## Model Configuration

Primary AI provider:

```txt
DeepSeek
```

Fallback AI providers:

```txt
Anthropic Claude
OpenAI API
```

Model policy:

```txt
Use the latest production provider models available at implementation time, with provider IDs controlled by environment variables.
```

Provider order:

```txt
deepseek -> anthropic -> openai
```

Fallback is used only when the primary provider is unavailable, rate-limited, restricted, banned for a user/context, or blocked by provider policy for an otherwise valid Scholastiar.ai workflow.

Default DeepSeek model IDs:

```txt
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_REASONING_MODEL=deepseek-v4-pro
```

Default Anthropic model IDs:

```txt
ANTHROPIC_MODEL=claude-sonnet-4-20250514
ANTHROPIC_REASONING_MODEL=claude-opus-4-20250514
```

Default OpenAI model IDs:

```txt
OPENAI_MODEL=gpt-5.5
OPENAI_REASONING_MODEL=gpt-5.5
```

Use the general model for ordinary drafting, summaries, and lightweight matching. Use the reasoning model for higher-stakes scoring explanations, application review, scholarship reasoning, and admin review assistance.

Do not hardcode model IDs in business logic. Read them from environment variables so the platform can upgrade or fail over when provider model lineups change.

Provider fallback must preserve the same prompt contract, output schema, safety requirements, and user consent rules.

## Principles

All prompts are production assets.

Prompts must be:

- centrally stored
- versioned
- structured
- testable
- truthful
- server-side only

AI must never invent qualifications, experience, documents, achievements, visa status, or employer facts.

## Prompt Modules

### Onboarding Summary

Purpose: Turn onboarding answers into structured profile intelligence.

Output:

- profile summary
- target roles
- skill signals
- profile gaps
- suggested follow-up questions

### Job Fit Analysis

Purpose: Compare candidate profile to job.

Output:

- fit score
- strengths
- gaps
- work eligibility (study visa hours, graduate visa sponsorship)
- recommended application angle

### Generate CV

Purpose: Create role-specific CV.

Inputs:

- candidate profile
- target job
- regional format
- user preferences

Output:

- structured CV sections
- summary
- experience bullets
- skills
- warnings for missing facts

### Generate Cover Letter

Purpose: Create a truthful role-specific cover letter.

### Answer Screening Question

Purpose: Generate one application answer using profile facts and job context.

### Rank Candidate

Purpose: Help employers understand candidate fit.

Output:

- score
- strengths
- concerns
- visa work conditions and permit notes
- explanation

### Message Draft

Purpose: Draft employer/candidate replies and follow-ups.

## Required Output Standards

All AI outputs should include:

- generated content
- source facts used when relevant
- missing information warnings
- confidence/readiness indicator
- safety notes where needed

## Forbidden Behavior

AI must not:

- fabricate facts
- guarantee visa outcomes
- make legal claims
- invent documents
- write discriminatory recommendations
- silently submit anything
