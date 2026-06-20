# Signia

Status: Unified Platform Service

## Feature Vision

Signia is the living professional identity and proof-of-work layer inside Scholastiar.ai.

It extends the PersonalityAI CV from a video trust feature into a complete, searchable candidate showcase where users collect projects, research, documents, videos, social links, GitHub, portfolio pages, and current work in one professional profile.

Core promise:

> Employers should understand the whole candidate in one place, without bouncing between CVs, GitHub, LinkedIn, portfolio sites, video links, and scattered social profiles.

## Problem Being Solved

Hiring signals are fragmented across CVs, GitHub, LinkedIn, portfolio sites, YouTube demos, research documents, certificates, social media handles, project write-ups, and work-in-progress updates.

Candidates struggle to present the full story of what they can do. Employers lose time opening many tabs and still miss context about how the candidate thinks, communicates, builds, researches, and learns.

## Target Users

- candidates
- students and early career professionals
- researchers
- builders and technical talent
- employers
- recruiters
- hiring managers

## Product Definition

### Candidate Signia

A candidate-owned showcase attached to the PersonalityAI CV and candidate profile.

Candidates can add:

- project showcases
- video demos and introductions
- research papers
- documents and decks
- GitHub repositories
- portfolio pages
- writing samples
- certifications and proof documents
- social media handles
- current work and learning updates
- skills linked to evidence
- public shareable portfolio pages

### Employer Signia Search

An employer-side discovery and filtering system that lets hiring teams search candidates by structured profile data, uploaded evidence, media transcripts, project content, skills, work interests, and public proof.

Employers should be able to query:

- "Find candidates with AI research projects and strong communication signals."
- "Show frontend developers with video demos, GitHub projects, and portfolio pages."
- "Find candidates who have worked on fintech, climate, or healthcare projects."
- "Show candidates with leadership traits, project depth, and public writing."
- "Find researchers with uploaded papers and presentation videos."

## Core Workflows

### Signia Profile Setup

Candidate creates or activates a Signia profile from the PersonalityAI CV or profile area.

### Social And Link Hub

Candidate adds professional and social handles in one place, including LinkedIn, GitHub, personal websites, portfolios, YouTube, X/Twitter, Instagram, TikTok, Medium/Substack, Google Scholar, ORCID, Behance, and Dribbble where relevant.

Each handle should have visibility controls.

### Project Showcase

Candidate adds projects with title, summary, role/contribution, problem solved, tools, industry/domain tags, links, media, documents, outcomes, and status.

Project statuses:

- draft
- in_progress
- completed
- archived

### Media And Document Proof

Candidate uploads videos, documents, decks, screenshots, research, certificates, or work samples and attaches them to projects, skills, or the public Signia profile.

### Skill Evidence Mapping

Candidate links skills to proof items.

Examples:

- `React` -> project demo, GitHub repo, case study
- `research` -> paper, methodology note, presentation video
- `leadership` -> team project, recommendation document, project retrospective

### Public Portfolio Page

Candidate can publish a shareable Signia page with selected sections only.

### Employer Deep Search

Employer searches across candidates they are allowed to discover or review, using filters and natural language queries.

### Employer Candidate Summary

Signia produces an employer-facing summary of professional identity, strongest proof items, project depth, communication signals, skills with evidence, current interests, possible role fit, and weak or missing evidence.

## AI Opportunities

- project summary generation
- video transcript generation
- document text extraction
- skill extraction from proof items
- proof-to-skill linking suggestions
- employer natural language search
- candidate profile summary
- candidate comparison
- Signia completeness score
- portfolio page copy refinement
- content moderation and sensitive data warnings

## Data Model Notes

Core entities:

- signia_profiles
- signia_sections
- signia_social_links
- signia_projects
- signia_project_links
- signia_media_items
- signia_document_links
- signia_skill_evidence
- signia_visibility_settings
- signia_search_indexes
- signia_employer_searches
- signia_profile_views
- signia_ai_summaries

## UX Direction

Candidate UX should feel like a calm professional studio, not a noisy social feed.

Important candidate UX:

- clear profile completion
- modular sections
- drag/reorder portfolio sections
- privacy and consent controls
- attach proof to skills
- preview public and employer views
- publish/unpublish controls

Employer UX should feel like a decision-focused search cockpit.

Important employer UX:

- natural language search
- structured filters
- candidate evidence cards
- profile comparison
- saved searches
- shortlists
- source-backed AI summaries
- clear visibility boundaries

## Integrations

- PersonalityAI CV
- candidate profile
- documents and storage
- AI CV generation
- employer candidate review
- candidate ranking
- discovery engine
- messaging
- analytics
- billing and employer entitlements
- security and RLS

## Access And Consent Rules

- Candidates own their Signia profile.
- Candidates choose which sections are public, employer-visible, application-only, or private.
- Employers may only deep-search public Signia profiles, opted-in discoverable profiles, or candidates available through valid application/employer access rules.
- Sensitive documents should never become employer-searchable unless explicitly attached and consented.
- Employer search should explain which evidence was used.
- Signia must not expose protected or private characteristics as ranking filters.

## Risks And Constraints

- privacy and consent must be explicit
- employer misuse and discriminatory filtering must be prevented
- social links may expose personal data
- video/document storage costs need limits
- search indexing must respect visibility changes
- AI summaries must cite source sections and avoid unsupported claims

## Later Phase Decisions (Non-Blocking)

- Should public Signia pages be available on the free plan?
- What upload limits apply per plan?
- Should employers pay extra for deep Signia search?
- Should Signia support custom domains later?
- Should candidates be able to import GitHub/LinkedIn data directly?

## Implementation Roadmap

### Phase 1

Build candidate Signia profile, social links, project showcase, document/media attachment, public preview, and employer candidate-profile display.

### Phase 2

Add employer Signia search, saved searches, skill evidence mapping, video transcripts, document extraction, and AI summaries.

### Phase 3

Add candidate comparison, advanced semantic search, portfolio page themes, GitHub/import integrations, analytics, and employer talent pools.
