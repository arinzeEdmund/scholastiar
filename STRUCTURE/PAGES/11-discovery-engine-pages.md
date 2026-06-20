# Discovery Engine Pages

Status: Unified Platform Service

Source service spec: `SERVICES/11-discovery-engine.md`

## Page System Vision

The Discovery Engine page system is primarily an internal admin and operations module.

It should help Scholastiar.ai admins manage the full opportunity supply pipeline:

> Register sources -> run crawls -> extract opportunities -> verify legitimacy -> review candidates -> merge duplicates -> publish approved listings -> monitor freshness.

The public user should never see raw scraped data. Users should only see approved, structured, source-attributed, and verified opportunities inside their relevant platform sections.

## Admin Dashboard Pages

### Discovery Overview Dashboard

Route: `/admin/discovery`

Purpose: Main command center for the Discovery Engine.

Key sections:

- total discovered opportunities
- new candidates
- needs review
- risky items
- duplicates pending
- expired listings
- failed crawl jobs
- crawl health
- category coverage
- source trust summary
- publishing activity

Primary actions:

- open review queue
- run manual crawl
- add source
- view failed jobs
- view risky opportunities
- view duplicate candidates

### Category Queues Dashboard

Route: `/admin/discovery/categories`

Purpose: Show discovery queues by opportunity category.

Categories:

- jobs
- scholarships
- grants
- universities
- fellowships
- awards
- competitions
- conferences/training

Each category should show:

- new candidates
- pending review
- verified
- risky
- expired
- duplicate clusters
- assigned reviewers

Primary actions:

- open category queue
- assign reviewer
- filter by status
- export queue summary

### Category Review Queue Page

Route: `/admin/discovery/categories/[category]`

Purpose: Review candidates for one category.

Example: `/admin/discovery/categories/scholarships`

Key sections:

- candidate list
- source
- title
- provider
- deadline
- AI category confidence
- verification score
- duplicate warning
- assigned reviewer
- review status

Primary actions:

- open candidate
- approve
- reject
- assign reviewer
- bulk archive
- bulk mark needs review

## Source Management Pages

### Source Registry Page

Route: `/admin/discovery/sources`

Purpose: Manage all crawl sources.

Source list fields:

- domain/source name
- source type
- category coverage
- trust score
- crawl frequency
- last successful crawl
- failure rate
- approval rate
- status

Primary actions:

- add source
- edit source
- mark trusted
- mark blocked
- run crawl
- view crawl history

### Add Or Edit Source Page

Route: `/admin/discovery/sources/[sourceId]`

Purpose: Configure a trusted or candidate source.

Fields:

- source name
- domain
- source type
- categories covered
- crawl method
- sitemap/RSS/API URL
- seed URLs
- crawl frequency
- rate limit notes
- robots/terms notes
- trust score
- assigned reviewer
- blocked/trusted status

Primary actions:

- save source
- test crawl
- test extraction
- block source
- mark trusted

### Source Detail And Health Page

Route: `/admin/discovery/sources/[sourceId]/health`

Purpose: Inspect source performance and trust.

Key sections:

- crawl success rate
- extraction success rate
- approval rate
- rejection rate
- risky item count
- duplicate rate
- last crawl logs
- source trust history
- blocked/allowed notes

Primary actions:

- adjust crawl frequency
- re-run crawl
- review failed pages
- mark source risky
- update trust score

## Crawl Operations Pages

### Crawl Jobs Page

Route: `/admin/discovery/crawls`

Purpose: Monitor scheduled and manual crawl jobs.

Views:

- running
- scheduled
- completed
- failed
- paused
- queued

Job fields:

- source
- category
- crawl type
- started at
- finished at
- pages fetched
- candidates extracted
- errors
- status

Primary actions:

- pause job
- retry failed job
- open crawl run
- cancel queued job
- run manual crawl

### Crawl Run Detail Page

Route: `/admin/discovery/crawls/[crawlRunId]`

Purpose: Inspect a single crawl run.

Key sections:

- crawl summary
- source
- spider type
- fetched URLs
- failed URLs
- extracted candidates
- duplicate candidates
- warnings
- error logs
- runtime metrics

Primary actions:

- retry failed URLs
- send candidates to review
- re-run extraction
- download log

### Manual Crawl Launcher Page

Route: `/admin/discovery/crawls/new`

Purpose: Let admins trigger controlled manual crawls.

Inputs:

- source
- category
- crawl type
- seed URL
- depth limit
- page limit
- priority
- extraction mode

Primary actions:

- run test crawl
- run full crawl
- save as recurring source

## Candidate Review Pages

### Candidate Detail Page

Route: `/admin/discovery/candidates/[candidateId]`

Purpose: Review one extracted opportunity before publishing.

Key sections:

- extracted title
- category/subtype
- source URL
- source snapshot
- extracted description
- provider
- country/region
- deadline
- application link
- eligibility
- required documents
- benefits
- AI summary
- AI verification result
- confidence score
- duplicate candidates
- missing fields
- source attribution
- admin notes

Primary actions:

- approve and publish
- edit fields
- reject
- mark risky
- merge duplicate
- reclassify
- request AI re-analysis
- assign reviewer

### Candidate Edit Page

Route: `/admin/discovery/candidates/[candidateId]/edit`

Purpose: Correct extracted fields before approval.

Fields:

- title
- category
- subtype
- provider
- country/region
- description/summary
- eligibility
- deadline
- application link
- benefits
- required documents
- tags
- verification status

Primary actions:

- save draft
- approve
- send back to review
- preview published listing

### Source Snapshot Viewer Page

Route: `/admin/discovery/candidates/[candidateId]/snapshot`

Purpose: Compare extracted data against the original source.

Views:

- rendered snapshot
- raw text extraction
- extracted fields
- source highlights
- AI citations/snippets

Primary actions:

- confirm extraction
- flag mismatch
- re-run extraction
- return to candidate

## Verification And Quality Pages

### Verification Queue Page

Route: `/admin/discovery/verification`

Purpose: Review items needing legitimacy checks.

Filters:

- needs review
- risky
- unverified
- source checked
- provider mismatch
- suspicious payment
- unknown source
- scam report

Primary actions:

- mark verified
- mark risky
- reject
- request source confirmation
- assign verification admin

### Risk Review Page

Route: `/admin/discovery/risk`

Purpose: Handle suspicious opportunities and sources.

Risk signals:

- suspicious payment requests
- unofficial email domain
- copied content
- unrealistic funding promises
- no official provider history
- broken application links
- mismatched source/application domain

Primary actions:

- reject item
- block source
- escalate to super admin
- mark false positive
- add risk note

### Duplicate Review Page

Route: `/admin/discovery/duplicates`

Purpose: Review and merge duplicate opportunity clusters.

Cluster comparison fields:

- titles
- providers
- source URLs
- deadlines
- application links
- descriptions
- funding/salary/prize/tuition
- source trust scores

Primary actions:

- merge
- keep separate
- select canonical source
- preserve secondary references
- send to category reviewer

### Change Review Page

Route: `/admin/discovery/changes`

Purpose: Review important changes detected on published listings.

Change types:

- deadline changed
- application link changed
- eligibility changed
- funding/salary/tuition changed
- source unavailable
- reopened
- expired

Primary actions:

- approve update
- reject update
- archive listing
- re-open listing
- request re-verification

## Publishing Pages

### Publishing Queue Page

Route: `/admin/discovery/publishing`

Purpose: Manage candidates ready to publish.

Key sections:

- approved candidates
- category destination
- preview status
- required fields complete
- source attribution complete
- verification status

Primary actions:

- publish
- schedule publish
- preview listing
- return to review

### Published Opportunity Preview Page

Route: `/admin/discovery/publishing/[candidateId]/preview`

Purpose: Preview how a candidate will appear in its final section.

Preview sections:

- user-facing title
- summary
- eligibility
- deadline
- benefits
- required documents
- source attribution
- verification badge
- category tags

Primary actions:

- publish
- edit candidate
- return to review

## AI Operations Pages

### AI Extraction Results Page

Route: `/admin/discovery/ai/extractions`

Purpose: Monitor AI extraction quality.

Views:

- low-confidence extractions
- missing required fields
- failed extractions
- category mismatch
- prompt/model version

Primary actions:

- open candidate
- re-run extraction
- mark extraction correct
- flag prompt issue

### AI Verification Results Page

Route: `/admin/discovery/ai/verification`

Purpose: Monitor AI legitimacy and risk checks.

Views:

- risky items
- low-confidence items
- provider mismatch warnings
- suspicious payment warnings
- official source mismatch

Primary actions:

- open verification queue
- mark false positive
- escalate risk
- re-run verification

## Reports And Analytics Pages

### Coverage Dashboard

Route: `/admin/discovery/reports/coverage`

Purpose: Track global and category coverage.

Metrics:

- opportunities by category
- opportunities by country
- verified listings
- active listings
- expired listings
- source coverage
- category gaps

Primary actions:

- identify weak categories
- add new sources
- export report

### Freshness Dashboard

Route: `/admin/discovery/reports/freshness`

Purpose: Track stale, expired, or changed listings.

Metrics:

- listings checked today
- stale listings
- broken links
- deadline changes
- expired listings
- reopening opportunities

Primary actions:

- open change review
- archive expired listings
- re-run monitors

### Admin Activity Log Page

Route: `/admin/discovery/activity`

Purpose: Audit admin and AI actions.

Tracked actions:

- approvals
- rejections
- edits
- merges
- source trust changes
- blocked sources
- AI re-analysis
- publishing

Primary actions:

- filter by admin
- filter by category
- inspect candidate history

## Suggested MVP Page Set

For the first Discovery Engine MVP, start with:

- `/admin/discovery`
- `/admin/discovery/sources`
- `/admin/discovery/sources/[sourceId]`
- `/admin/discovery/crawls`
- `/admin/discovery/crawls/[crawlRunId]`
- `/admin/discovery/categories`
- `/admin/discovery/categories/[category]`
- `/admin/discovery/candidates/[candidateId]`
- `/admin/discovery/candidates/[candidateId]/edit`
- `/admin/discovery/verification`
- `/admin/discovery/duplicates`
- `/admin/discovery/changes`
- `/admin/discovery/publishing`
- `/admin/discovery/publishing/[candidateId]/preview`

This gives the internal team enough control to run a safe source-aware scraping pipeline before expanding into advanced AI analytics and provider intelligence.

## Page Priority

### MVP Priority

- Discovery Overview Dashboard
- Source Registry Page
- Add Or Edit Source Page
- Crawl Jobs Page
- Crawl Run Detail Page
- Category Queues Dashboard
- Category Review Queue Page
- Candidate Detail Page
- Candidate Edit Page
- Verification Queue Page
- Duplicate Review Page
- Change Review Page
- Publishing Queue Page
- Published Opportunity Preview Page

### Phase 2 Priority

- Source Detail And Health Page
- Manual Crawl Launcher Page
- Source Snapshot Viewer Page
- Risk Review Page
- AI Extraction Results Page
- AI Verification Results Page
- Freshness Dashboard
- Admin Activity Log Page

### Phase 3 Priority

- Coverage Dashboard
- Advanced source reputation views
- Delegated reviewer workload dashboards
- Provider correction request pages
- API/data export management pages
