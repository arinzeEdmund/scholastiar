# Scholastiar.ai Signature UI Base

Status: Design inspiration synthesis and product UI direction

Purpose: Capture the strongest UI/UX ideas from the referenced job, recruitment, service, article, and employer-platform examples, then translate them into a distinct Scholastiar.ai design direction.

This file should be read with:

- `STRUCTURE/UI_BASE/ux_ui_base.md`
- `STRUCTURE/UI_BASE/UI_BASE_INSPIRATION.txt`
- `STRUCTURE/UI_BASE/UI_DESIGN_INSPIRATION/`
- `STRUCTURE/BUILD_GUIDE/COMPONENT_SYSTEM.md`

## Source Inventory

Live references reviewed:

- `https://jobbox-html-frontend.vercel.app/index-3`
- `https://www.jobberman.com/`
- `https://themeforest.net/item/jobhit-job-portal-html-template/29922683`
- `https://utouchdesign.com/themes/envato/escort/` as the requested Escort job portal reference, with ThemeForest metadata used when the direct preview was not safely available through the browser tool

Local screenshot references reviewed:

- hh.ru home/search experience
- hh.ru vacancy detail page
- hh.ru resume search page
- hh.ru employer landing page
- hh.ru employer profile page
- hh.ru services marketplace page
- hh.ru article/service landing pages
- hh.ru paid hh PRO page

## Signature Direction

Scholastiar.ai should not look like a generic job board. It should feel like a premium global mobility command center.

The visual signature:

```txt
Calm white workspace
rounded operational cards
strong search and filters
clear opportunity metadata
green mobility/progress accents
trust-first verification signals
AI/action boards as premium surfaces
editorial intelligence woven into the product
```

Design promise:

> A serious applicant can find an international opportunity, understand their readiness, and decide whether to self-apply, ask AI to prepare, or delegate execution without feeling lost.

## What To Borrow

### From JobBox

Useful patterns:

- prominent job-board hero with search
- category cards with counts
- "jobs of the day" section
- tabbed opportunity sections
- recruiter/company areas
- job cards with company logo, role, location, salary, tags, and time
- broad template coverage: jobs, recruiters, candidates, blog, pricing, auth, dashboard

Scholastiar.ai adaptation:

- use the search-first structure, but make it global mobility-first
- replace generic job categories with opportunity/migration categories
- show `application time`, `success score`, `mobility fit`, and `deadline`
- make cards work across jobs, universities, scholarships and agencies
- use tabs for "Best matches", "Fast apply", "Visa support", "Fully funded", "High readiness", and "Deadline soon"

Do not copy:

- noisy multi-section template feel
- decorative excess
- generic job-board copy

### From Jobberman

Useful patterns:

- clear regional-market trust
- strong search/filter funnel
- popular searches as quick links
- experience-level browsing
- company hiring section
- candidate profile completion nudge
- AI career tool promotion
- employer acquisition block
- job functions as a dense directory

Scholastiar.ai adaptation:

- create country-specific trust pages for applicants in Africa, Asia, Latin America, the Middle East, and other high-mobility markets
- use quick links for common searches like `Toronto student jobs`, `Germany scholarships`, `fully funded scholarships`, and `UK universities`
- convert experience-level browsing into readiness-level browsing
- make "complete your profile" a major conversion path
- promote AI tools as useful execution help, not a gimmick
- include employer/provider/migration-agency acquisition sections without distracting applicants

Do not copy:

- local-only positioning
- broad career-site tone that ignores migration complexity

### From Escort / ThemeForest Job Portal Reference

Useful patterns:

- complete job portal structure
- advanced listing filters
- login/register flows
- employer/candidate split
- dashboard inclusion
- responsive template breadth
- job, recruiter, candidate, pricing, blog, and application pages

Scholastiar.ai adaptation:

- keep the full portal completeness, but collapse it into one global opportunity system
- build reusable listing/detail/dashboard patterns once and apply them across services
- make filters deeper: country, visa support, funding, deadline, eligibility, readiness score, application effort, provider type
- treat auth and onboarding as central to personalization

Do not copy:

- old template aesthetics
- Bootstrap-era visual density
- generic candidate/recruiter separation without mobility intelligence

### From hh.ru Screenshots

Useful patterns:

- very calm white interface with thin borders
- strong top segmented control for applicant/employer mode
- simple nav with location, login, and primary action
- large search modules placed early
- compact cards with strong hierarchy
- service marketplace cards grouped by user problem
- job detail pages with sticky/action side information
- employer pages with tabs, rating, subscribe, and "I want to work here"
- paid-plan page with a distinctive premium visual treatment
- article/service pages with large hero, clear benefits, pricing, and process steps
- footer as a deep navigation system

Scholastiar.ai adaptation:

- use a segmented top switch for `Applicant`, `Employer/Provider`, and eventually `Agency`
- use a location/country selector as a first-class control
- use soft cards for services, but keep opportunity cards denser and more scannable
- create service marketplaces for `AI tools`, `Apply For Me`, `career/mobility help`, `documents`, and `migration agencies`
- use right-side trust panels on detail pages: provider verification, country, deadline, documents, mobility support, score, and actions
- give premium/AI pages a distinct darker or elevated treatment, but keep them disciplined
- use article pages as funnels into readiness score, opportunity cards, and Apply For Me campaigns

Do not copy:

- red brand language
- Russian-market assumptions
- oversized decorative art unless it supports a premium service page

## Scholastiar Signature Layouts

### 1. Global Search Hero

Use for:

- home
- Jobs
- Universities
- Scholarships
- Discovery Engine

Structure:

```txt
headline
supporting copy
search input
destination country selector
opportunity type selector
primary CTA
quick search chips
```

Example:

```txt
Find opportunities that can move you abroad
[Role, program, scholarship, keyword] [Destination country] [Opportunity type] [Search]
Germany scholarships  UK universities  Fully funded scholarships  Study in Canada
```

Design notes:

- keep the hero clean
- use white or soft background
- do not bury the search
- show the next section partially below the fold

### 2. Universal Opportunity Card

Every major opportunity card should support:

- title
- organization/provider
- logo or source mark
- destination country
- opportunity type
- deadline
- application time, such as `2 mins apply`
- success score, such as `92%`
- readiness status
- funding/visa/mobility tag
- salary/funding/benefit where relevant
- save action
- compare action
- apply action
- add to Apply For Me board
- add to AI Apply Agent board when plan allows

Visual structure:

```txt
[Logo] Title                          [Save]
Provider / Country / Type
[Visa support] [Fully funded] [Deadline soon]
2 mins apply   92% success score   84% readiness
Primary action      Secondary board actions
```

Card behavior:

- visitors and users without a plan see a basic score preview
- subscribers see full score reasoning
- blocked actions should explain the plan requirement
- sponsored cards must be clearly labeled

### 3. Opportunity Detail Page

Use a two-column layout on desktop:

```txt
main content column
right action/trust panel
```

Main column:

- title and summary
- opportunity details
- eligibility
- documents needed
- application steps
- deadlines
- benefits/funding/visa notes
- common mistakes
- related opportunities
- FAQ

Right panel:

- score
- application time
- readiness percentage
- deadline countdown
- provider verification
- country
- saved/compare
- apply
- AI Apply Agent
- Apply For Me

Mobile:

- action panel becomes sticky bottom action bar
- score/readiness moves into a compact top summary

### 4. Service Marketplace Page

Inspired by hh.ru services.

Use for:

- AI tools
- Apply For Me
- document services
- mobility support
- migration agency help
- coaching/review services

Structure:

```txt
section title
service cards grouped by problem
popular-now band
category groups
```

Service card fields:

- icon
- title
- one-line benefit
- plan/price signal
- arrow/action
- status or popularity tag

Groups:

- Popular now
- Improve your applications
- Delegate applications
- Prepare documents
- Move abroad
- Expert support
- Ratings and intelligence

### 5. Employer/Provider Landing Page

Use for:

- employer acquisition
- university/provider acquisition
- migration agency acquisition

Structure:

```txt
hero with direct promise
search/sample candidate module
choose how to participate
3-step start section
metrics/trust section
who will respond / who you reach
FAQ
CTA
```

Employer-specific cards:

- Post a job
- Buy candidate access
- Sponsor this vacancy
- Publish hiring campaign

Provider-specific cards:

- Publish opportunity
- Verify provider profile
- Sponsor program
- Receive applicants/inquiries

Agency-specific cards:

- Verify agency
- List services
- Sponsor country guide
- Receive bookings

### 6. Employer/Provider Profile Page

Use:

- logo
- organization name
- verification badge
- rating/reviews
- tabs
- subscribe/follow
- "I want to work/study/apply here"
- information sidebar
- active opportunities
- reviews/testimonials

Tabs:

- About
- Opportunities
- Reviews
- Sponsorships
- Questions

Scholastiar adaptation:

- include countries served
- migration/funding relevance
- verification status
- response speed
- application success stats where valid

### 7. Premium / AI Plan Page

Inspired by hh PRO, but adapted to Scholastiar.

Use a distinct premium surface for:

- Pro/Premium applicant plan
- AI Apply Agent
- Apply For Me campaign packs
- publishing/newsletter premium

Design direction:

- darker or higher-contrast section is allowed
- use proof-oriented benefit cards
- show before/after workflow previews
- use plan toggle
- clear price and CTA
- FAQ near the end

Benefit cards:

- more high-fit opportunities
- full score explanations
- AI-prepared materials
- faster applications
- board automation
- proof/archive
- deadline strategy

### 8. Publishing / Article Page

Use for:

- immigration updates
- opportunity guides
- news reads
- scholarship guides
- country comparison
- platform reports

Structure:

```txt
title
last updated date
short answer
table of contents
article body
related opportunities
readiness CTA
newsletter CTA
Apply For Me / AI Apply Agent CTA
sources
FAQ
```

Design notes:

- editorial, readable, calm
- side rail for related actions
- use source/date blocks for trust
- never let ads overpower the article

## Component Inspiration Library

### Top Navigation

Pattern:

```txt
logo
segmented user mode
services
resources
search
country selector
login
primary action
```

Primary action changes by mode:

- Applicant: `Create profile`
- Employer: `Post opportunity`
- Provider: `Publish opportunity`
- Agency: `List agency`

### Search Bar

Must support:

- keyword
- destination country
- opportunity type
- user location
- filters button
- saved search

Search should feel like the product's command line.

### Filter Chips

Use chips for:

- visa support
- fully funded
- no IELTS
- remote
- relocation support
- deadline soon
- fast apply
- high score
- low document burden
- beginner-friendly

### Cards

Card rules:

- 6-8px radius
- thin neutral border
- white surface
- stable height where repeated
- clear top-level hierarchy
- limited accent color
- no nested card clutter

### Badges

Use badges for:

- Verified
- Sponsored
- Visa support
- Fully funded
- Deadline soon
- AI ready
- Human support
- High fit
- Low effort
- Premium

Sponsored badges must be visually clear but not alarming.

### Side Panels

Use on detail pages for:

- score
- deadline
- actions
- provider trust
- documents needed
- quick apply options

### Empty States

Empty states should suggest next action.

Examples:

- "No saved scholarships yet. Start with fully funded matches."
- "Your AI Apply Agent board is empty. Add a high-score opportunity."
- "No documents uploaded yet. Upload your CV to improve your readiness score."

## Visual Language

### Color

Keep the existing Scholastiar base:

```txt
white
near-black
soft gray
Scholastiar green
controlled blue for secondary/action info
amber for warning/deadlines
red only for danger/errors
```

Use green for:

- progress
- verification
- success
- readiness
- selected states
- primary CTAs

Use blue sparingly for:

- secondary action
- search affordance
- neutral system links

Do not become a blue job board or a green-only product.

### Typography

Borrow the clarity of the references, but make it more premium.

Rules:

- headings should be direct and confident
- cards need compact but readable headings
- metadata should be small and calm
- action labels should be specific
- article typography should be generous and editorial

### Imagery

Use real or realistic human imagery for:

- hero sections
- country mobility stories
- employer/provider pages
- article pages

Use restrained illustration only for:

- service explainer pages
- AI/premium workflows
- onboarding

Avoid:

- generic smiling stock photos
- decorative blobs
- chaotic collage sections

## Page-Level Signature

### Applicant Home

Must show:

- global opportunity search
- popular mobility searches
- opportunity categories
- recommended opportunities
- readiness score CTA
- AI Apply Agent / Apply For Me teaser
- article/news digest
- country guides

### Jobs Page

Must show:

- search and filters
- job cards
- visa/mobility tags
- application time
- success score
- salary/location
- employer verification
- sponsored label where needed
- board actions

### Scholarship/University Pages

Must show:

- funding and deadline information
- country and institution
- eligibility
- document burden
- score/readiness
- save/apply/board actions

### AI Apply Agent Page

Must feel:

- controlled
- permission-based
- premium
- transparent

Must show:

- queue
- rules
- consent
- draft/review state
- proof/archive
- plan gate

### Apply For Me Page

Must feel:

- human-supported
- campaign-based
- trustworthy

Must show:

- campaign packs
- document checklist
- human/AI workflow
- proof of submission
- status tracking

### Sponsored Ads UI

Sponsored UI must:

- label paid placement clearly
- preserve normal relevance ranking
- never hide eligibility gaps
- never imply guaranteed migration or approval
- keep sponsor analytics separate from private user data

## Signature Interactions

### Save To Board

Every opportunity should support:

```txt
Save
Compare
Add to AI Apply Agent
Add to Apply For Me
```

Plan behavior:

- saving and board limits follow the user's plan (Starter or Pro)
- Pro unlocks deeper boards
- unavailable actions explain why

### Readiness Preview

Cards should show simple readiness.

Details unlock on detail page or paid plan:

```txt
92% success score
84% document readiness
2 mins apply
3 missing documents
```

### Country Selector

Country choice should be persistent and visible.

Use cases:

- current country
- destination country
- country comparison
- visa support
- agency recommendations

### CTA Hierarchy

Primary:

- Apply
- Check readiness
- Add to AI Agent
- Start campaign

Secondary:

- Save
- Compare
- View details
- Ask AI

Tertiary:

- Share
- Report
- Follow provider

## Mobile Signature

Mobile must be operational, not just responsive.

For the web app, this means PWA-first mobile behavior before the React Native app exists. Follow `STRUCTURE/BUILD_GUIDE/PWA_FIRST_WEB_APP.md`.

Rules:

- search first
- mobile web bottom tabs for applicant workflows
- filters in drawer/sheet
- card actions compact
- sticky detail-page action bar
- install-to-home-screen prompt after meaningful engagement
- offline-aware saved opportunities and article reads
- board actions accessible
- no giant marketing sections on functional pages
- article pages need readable line length and sticky CTA only when useful

## What Makes It Scholastiar

The signature UI is not the references. It is the combination of:

- opportunity discovery
- cross-border mobility context
- score/readiness intelligence
- AI and human execution paths
- verified providers and agencies
- editorial publishing intelligence
- paid/sponsored visibility with trust rules

Every screen should help the user answer:

```txt
Can this opportunity move me closer to the country and life I want?
Am I ready?
What do I need to fix?
Should I apply myself, use AI, or delegate it?
Can I trust this provider?
What is the next best action?
```

## Non-Negotiables

- no noisy template feel
- no hidden sponsored influence
- no vague CTAs
- no generic job-board-only design
- no AI actions without consent
- no decorative clutter
- no overuse of green
- no card inside card layouts
- no fake migration certainty
- no confusing free/paid action states

## First Build UI Priorities

When implementation starts with Jobs, prioritize:

1. top navigation with applicant/employer mode and country selector
2. global search and filters
3. universal opportunity card
4. job detail page with right action/trust panel
5. save/apply/board action states
6. readiness and success score display
7. employer verification and sponsored labels
8. candidate dashboard starter layout
9. mobile sticky action behavior
10. PWA install prompt, offline banner, and mobile bottom tabs
11. empty/loading/error states
