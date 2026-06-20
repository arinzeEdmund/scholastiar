# Discovery Engine

Status: Unified Platform Service

## Feature Vision

The Scholastiar.ai Discovery Engine is the internal AI-powered web discovery, crawling, scraping, verification, enrichment, and publishing system that keeps the platform's opportunity database fresh, trusted, and globally useful.

It should routinely discover and process opportunities across:

- jobs
- scholarships
- grants
- universities
- fellowships
- awards
- competitions
- conferences and training

This is primarily an admin and operations infrastructure system, not a public user feature first.

The engine should prioritize opportunities that have real cross-border value: study abroad, work abroad, relocation support, migration pathways, funded travel, global exposure, target-country credibility, or practical movement from one country toward another country of choice.

The core purpose:

> Scholastiar.ai should not depend only on manual opportunity posting. The platform should continuously discover global opportunities, verify them, structure them, and prepare them for users.

The strongest product magic:

> Users see fresh, trusted, well-organized opportunities every day, while admins get an intelligent operations system that turns the chaotic web into clean platform-ready opportunity data.

## Problem Being Solved

Opportunity data across the internet is fragmented, messy, duplicated, stale, and often risky.

The platform needs to solve:

- manual opportunity collection being too slow
- outdated deadlines
- broken application links
- duplicate listings across many websites
- fake scholarships, grants, awards, and events
- unclear legitimacy of employers, funders, and providers
- unstructured data that cannot power matching
- opportunity pages that are too long or poorly formatted
- wrong category classification
- missing eligibility fields
- missing document requirements
- inconsistent tuition, funding, salary, or prize information
- lack of admin approval workflow
- lack of source trust scoring
- lack of daily freshness monitoring

The Discovery Engine should make opportunity supply scalable without sacrificing trust.

## Target Users

Primary internal users:

- super admins
- content admins
- verification admins
- category reviewers
- data quality reviewers
- AI review agents
- lower/delegated admins

Secondary platform beneficiaries:

- job seekers
- scholarship applicants
- grant applicants
- university applicants
- fellowship applicants
- award applicants
- competition participants
- conference/training applicants
- employers and opportunity providers

## Core Workflows

### End-To-End Discovery Pipeline

Recommended pipeline:

```txt
Source registry
-> Scheduler
-> Crawl
-> Fetch
-> Extract
-> Normalize
-> Classify
-> Deduplicate
-> Verify legitimacy
-> AI enrich
-> Score confidence
-> Route to review queue
-> Human/admin approval
-> Publish
-> Monitor updates
```

The engine should run routinely, for example every 24 hours, with higher-priority sources checked more often.

### Opportunity Categories

The engine should classify scraped data into:

- job
- scholarship
- university
- grant
- fellowship
- award
- competition
- conference/training

It should also detect subtypes.

Examples:

- scholarships: fully funded, partial, tuition waiver, government, university, foundation
- grants: NGO, startup, research, climate, health, education, arts
- conferences/training: academic conference, summit, bootcamp, workshop, academy, funded event
- competitions: hackathon, startup competition, essay competition, case competition, innovation challenge
- jobs: visa-sponsored, relocation-friendly, remote, graduate role, internship
- universities: public, private, medical, technical, research, English-taught programs

### Data Extraction

Every opportunity should capture:

- title
- description
- official source URL
- provider or organization
- country or region
- eligibility
- deadline
- application link
- required documents
- benefits
- fees if any
- contact information if available
- source date
- last verified date
- category
- subtype
- mobility value
- target country or region
- travel, visa, relocation, funding, or settlement signals
- estimated application effort inputs
- application period/window
- success/fit scoring inputs
- AI Apply Agent eligibility signals
- Apply For Me suitability signals
- tags
- confidence score
- verification status

Jobs should additionally capture:

- role title
- employer
- location
- visa sponsorship indicators
- salary if available
- job type
- requirements
- application link
- deadline

Universities should additionally capture:

- university name
- country and city
- programs
- tuition ranges
- admission requirements
- official contacts
- admission links
- deadlines and intakes
- accreditation or recognition notes

Scholarships, grants, and fellowships should additionally capture:

- funding amount
- coverage
- eligible countries
- eligible degree or stage
- application questions if available
- required essays/documents
- selection criteria

### Verification And Legitimacy Layer

The Discovery Engine should never blindly publish scraped data.

Each item should be scored for legitimacy based on:

- official domain quality
- whether the source is a known institution
- whether the application link matches the provider
- whether payment is requested suspiciously
- whether deadlines are realistic
- whether content appears copied or duplicated
- whether the provider has verifiable history
- whether contact emails use official domains
- whether social links and official pages match
- whether other trusted sources mention it
- whether the listing has scam-like wording
- whether the source has historically produced approved listings

Verification statuses:

- verified
- source checked
- needs review
- unverified
- risky
- rejected
- expired

### Human/Admin Review Workflow

Admin users should be able to:

- review newly discovered opportunities
- approve or reject listings
- edit extracted fields
- merge duplicates
- assign or correct category
- correct wrong classifications
- mark sources as trusted or blocked
- flag scams
- request AI re-analysis
- delegate review to lower admins
- view scraping logs
- view source snapshots
- see what changed since last scrape
- publish approved items into the proper section

Suggested roles:

- super admin
- content admin
- verification admin
- scholarship reviewer
- university reviewer
- jobs reviewer
- grants reviewer
- fellowships reviewer
- awards reviewer
- competitions reviewer
- conferences reviewer
- data quality reviewer

### Delegated Admin System

The system should support category-based review permissions.

Examples:

- Scholarship reviewer only reviews scholarships.
- University reviewer only verifies university profiles.
- Jobs reviewer checks visa sponsorship and employer legitimacy.
- Grants reviewer checks funder legitimacy.
- Super admin sees and overrides everything.

This keeps operations scalable and controlled.

### Duplicate Detection

The engine should detect duplicate opportunities across websites by comparing:

- title
- provider
- deadline
- application URL
- canonical source URL
- description similarity
- country
- funding amount, salary, prize, or tuition
- source domains

Duplicate handling:

- merge duplicate records
- keep the most official source as primary
- preserve secondary references
- increase confidence when multiple trusted sources confirm the item
- send uncertain duplicate clusters to admin review

### Source Reputation System

Each source should have a trust profile.

Source fields:

- domain
- source type
- trust score
- category coverage
- crawl frequency
- last successful crawl
- failure rate
- historical accuracy
- approval rate
- blocked or risky status
- robots/terms notes

Trusted sources can move faster through the pipeline. Unknown or risky sources require stronger review.

### Freshness And Expiry Monitoring

After publication, the engine should monitor listings for:

- source page availability
- deadline changes
- broken application links
- changed requirements
- expired opportunities
- reopened application cycles
- changed funding, salary, tuition, or prize details

Listing statuses:

- active
- closing soon
- expired
- needs update
- source unavailable
- archived
- reopened

### Admin Discovery Console

Core admin views:

- newly discovered opportunities
- needs review
- verified opportunities
- risky opportunities
- duplicate candidates
- expired listings
- failed crawl jobs
- trusted sources
- blocked sources
- category queues
- AI review results
- human approval history
- source freshness dashboard
- global coverage dashboard

Admin actions:

- approve
- reject
- edit
- merge
- reclassify
- mark verified
- mark risky
- archive
- assign reviewer
- re-run crawl
- re-run AI extraction
- publish to section

## Scraping And Crawling Architecture

### Best-Practice Crawl Strategy

The best approach is not one giant uncontrolled scraper. Use a layered, source-aware crawling system.

Recommended strategy:

1. Source-first crawling: Maintain a registry of trusted and candidate sources instead of randomly crawling the whole web.
2. Sitemap/RSS/API first: Prefer official APIs, RSS feeds, sitemaps, JSON-LD, and structured data before raw HTML scraping.
3. Category-specific spiders: Use separate spiders for jobs, scholarships, grants, universities, fellowships, awards, competitions, and conferences.
4. Domain-specific adapters: Build custom extraction adapters for high-value sources with stable formats.
5. Generic fallback extractor: Use AI-assisted extraction for unfamiliar pages only after the safer structured methods fail.
6. Respectful scheduling: Crawl based on source priority, freshness needs, rate limits, and robots/terms constraints.
7. Human-in-the-loop publishing: Do not publish low-confidence or risky items without review.

### Spider Design

Each spider should be small, category-aware, and source-aware.

Recommended spider layers:

```txt
Seed discovery spider
-> Listing page spider
-> Detail page spider
-> Change monitor spider
-> Link health spider
-> Source reputation updater
```

Seed discovery spider:

- discovers new candidate listing pages from trusted domains, sitemaps, RSS, search APIs, and admin-submitted sources
- avoids uncontrolled deep crawling

Listing page spider:

- extracts lists of opportunity URLs
- follows pagination
- records candidate detail URLs
- detects category and source type

Detail page spider:

- fetches the opportunity page
- extracts structured content
- captures source snapshot
- stores raw HTML/text where legally appropriate
- sends data to the extractor pipeline

Change monitor spider:

- revisits published opportunities
- detects deadline, requirement, link, or status changes
- creates update tasks for admins when changes are important

Link health spider:

- checks application links and source availability
- flags broken or redirected links

Source reputation updater:

- updates source trust metrics based on success rate, approval rate, and risk reports

### Crawler Scheduling

Use a priority queue instead of a flat 24-hour cron for everything.

Suggested crawl frequencies:

- high-priority trusted job sources: every 6-12 hours
- scholarship/grant/fellowship sources near deadline season: every 12-24 hours
- university pages: weekly or monthly unless monitored for intakes
- conferences/competitions/awards: every 24-72 hours depending on source activity
- risky or unknown sources: crawl only when admin-approved

Scheduling factors:

- source trust score
- historical update frequency
- category urgency
- deadline proximity
- last crawl success
- admin priority
- rate-limit rules
- crawl budget

### Extraction Method

Use a multi-stage extractor:

```txt
Structured extraction
-> DOM/rule extraction
-> Readability/main-content extraction
-> AI structured extraction
-> Validation
```

Structured extraction:

- JSON-LD
- schema.org JobPosting/Event/EducationalOrganization where available
- RSS/feed metadata
- official API fields

DOM/rule extraction:

- source-specific selectors for known sources
- stable custom adapters for high-value domains

Readability extraction:

- main article/body text extraction
- removes navigation, footer, ads, and unrelated content

AI structured extraction:

- converts messy text into typed opportunity fields
- returns confidence and missing fields
- must cite source snippets/locations internally for admin review

Validation:

- required fields by category
- deadline parsing
- URL validation
- email domain checks
- country normalization
- currency normalization
- duplicate checks

### Crawler Technical Stack Recommendation

For a production build, use:

- Playwright only for JavaScript-heavy pages
- lightweight HTTP fetching for normal pages
- queue-based workers for crawl jobs
- PostgreSQL for source registry, crawled items, review queues, and status history
- object storage for snapshots and extracted artifacts
- scheduled jobs or workers for recurring crawls
- AI extraction pipeline for messy pages
- admin dashboard for review and approvals

Avoid using browser automation for every page. It is slower, more expensive, and more fragile. Use Playwright selectively.

### Politeness And Compliance

The crawler should:

- respect robots.txt where required
- obey source rate limits
- use clear user-agent identification
- prefer official APIs and feeds
- avoid login-only or private content without permission
- avoid bypassing access controls
- store source URLs and timestamps
- attribute official sources
- summarize rather than republish long copyrighted text
- avoid copying full pages
- allow sources to be blocked

### Failure Handling

The system should handle:

- network errors
- DNS failures
- blocked requests
- JavaScript rendering failures
- changed page structure
- parsing failures
- invalid dates
- duplicate collisions
- AI extraction uncertainty

Failures should create structured logs and review tasks, not silent data corruption.

## AI Opportunities

### AI Classification

AI should classify raw pages into the correct category and subtype.

It should detect whether a page is:

- actual opportunity
- article about an opportunity
- expired listing
- duplicate listing
- general information page
- risky/scam-like page
- irrelevant content

### AI Enrichment

AI can generate:

- clean opportunity summaries
- eligibility summaries
- deadline urgency labels
- required document checklists
- category tags
- country tags
- degree/stage tags
- difficulty estimates
- scam risk notes
- user-facing descriptions
- extracted application questions
- benefit breakdowns
- who this is best for summaries

### AI Verification Support

AI should assist with:

- scam signal detection
- official source matching
- suspicious payment language
- mismatch between provider and application link
- missing legitimacy signals
- copied content detection signals
- confidence scoring

AI should support human reviewers, not replace them for risky items.

### AI Change Detection

When a source page changes, AI can summarize:

- what changed
- whether the deadline changed
- whether requirements changed
- whether the application link changed
- whether the item should be re-reviewed

## Data Model Notes

Core entities may include:

- discovery_sources
- source_trust_profiles
- crawl_jobs
- crawl_runs
- crawl_logs
- crawled_pages
- source_snapshots
- extracted_opportunities
- opportunity_candidates
- opportunity_duplicates
- opportunity_verifications
- opportunity_reviews
- opportunity_review_assignments
- opportunity_publish_records
- opportunity_change_events
- opportunity_categories
- opportunity_tags
- blocked_sources
- trusted_sources
- ai_extraction_results
- ai_verification_results
- admin_review_notes

Important modeling principles:

- keep raw candidates separate from published opportunities
- store source URL, crawl timestamp, and extraction version
- preserve status history
- preserve admin approval history
- track which AI model/prompt generated extracted fields
- track confidence at field level where possible
- support multiple sources confirming one opportunity
- store canonical opportunity records separately from duplicate references
- support delegated category review queues

## UX Direction

This is mostly an admin UX.

The experience should feel operational, controlled, and high-trust.

Important admin surfaces:

- discovery dashboard
- source registry
- crawl run logs
- new candidates queue
- category review queues
- duplicate review queue
- risky opportunities queue
- expired/changed listings queue
- source trust dashboard
- opportunity editor
- AI extraction preview
- source snapshot viewer
- approval history
- delegated reviewer assignment

Public-facing outputs should feel:

- fresh
- verified
- well summarized
- clearly categorized
- deadline-aware
- source-attributed
- trustworthy

## Integrations

Potential integrations:

- DeepSeek AI for extraction, enrichment, classification, and verification support
- Vercel AI SDK for structured AI outputs
- Supabase PostgreSQL for discovery data and review queues
- Supabase Storage for source snapshots and artifacts
- Supabase Auth and RLS for admin roles
- scheduled workers or edge functions for recurring jobs
- Playwright for JavaScript-heavy sites
- HTTP clients for normal crawling
- official APIs, RSS feeds, and sitemaps where available
- email/slack-style alerts later for failed crawls or urgent review queues

## Monetization And Premium Services

The Discovery Engine is internal infrastructure, but it enables revenue by powering:

- premium verified opportunity database
- daily updated listings
- advanced matching
- fresh scholarship/grant/fellowship/job alerts
- deadline intelligence
- verified university profiles
- employer and provider confidence
- provider-hosted opportunity distribution

Future monetizable provider-side services:

- verified provider profiles
- sponsored verified listings
- hosted application pages
- premium analytics for providers
- API access to verified opportunity data later

## Differentiators

The Discovery Engine makes Scholastiar.ai unique because it combines:

- routine global opportunity discovery
- category-specific crawlers
- AI extraction and enrichment
- legitimacy scoring
- source reputation scoring
- duplicate detection
- admin approval workflow
- delegated reviewer queues
- freshness and expiry monitoring
- structured publishing into every platform section

Strong differentiator:

> Scholastiar.ai does not only collect links. It turns raw web opportunity data into verified, structured, AI-ready application infrastructure.

## Risks And Constraints

Key risks:

- scraping prohibited sources
- blocked crawlers
- outdated or incorrect data
- AI extraction hallucinations
- fake opportunities passing review
- duplicate records
- copyrighted content overuse
- excessive crawl costs
- source layout changes breaking extractors
- admin review backlog
- publishing unverified data

Important constraints:

- prefer official sources, APIs, RSS, sitemaps, and structured data
- avoid bypassing access controls
- respect robots/terms requirements
- do not publish risky data without review
- show source attribution and verification status
- summarize rather than copying long source text
- keep raw candidates separate from public records
- require admin approval for low-confidence items

## Later Phase Decisions (Non-Blocking)

- Which categories should Discovery Engine support first?
- Which trusted sources should be seeded first?
- Should jobs, scholarships, grants, and fellowships be the first crawl targets?
- What crawl frequency is acceptable per source?
- Which crawler framework should be used in production?
- Where should source snapshots be stored?
- What confidence threshold allows auto-publishing from trusted sources?
- Should any category ever support auto-publish, or should all publishing require human approval?
- What admin roles are needed first?
- How should source owners request removal or correction?
- What legal review is needed before large-scale crawling?

## Implementation Roadmap

### Phase 1: Controlled Discovery MVP

Build:

- source registry
- trusted source seed list
- scheduled crawl jobs
- HTTP fetcher
- basic sitemap/RSS support
- AI extraction
- category classification
- duplicate detection
- verification score
- admin review queue
- manual approve/reject/edit
- publish into relevant category
- crawl logs

Recommended first categories:

- scholarships
- grants
- fellowships
- visa-sponsored jobs

### Phase 2: Source-Aware Crawling

Build:

- category-specific spiders
- source-specific adapters
- source trust profiles
- crawl priority queue
- link health checks
- source snapshots
- extraction versioning
- field-level confidence

### Phase 3: Verification And Quality Control

Build:

- legitimacy scoring
- scam risk detection
- duplicate clustering
- source reputation updates
- delegated admin review queues
- risky opportunity workflow
- blocked/trusted source controls

### Phase 4: Freshness Monitoring

Build:

- deadline change monitoring
- broken link detection
- expired listing automation
- reopened opportunity detection
- AI change summaries
- admin change review queue

### Phase 5: Expanded Categories

Expand to:

- awards
- competitions
- conferences/training
- universities

### Phase 6: Provider And Data Intelligence Layer

Build:

- provider verification
- provider correction requests
- coverage dashboard
- freshness score dashboard
- provider analytics
- API-ready verified opportunity data later
