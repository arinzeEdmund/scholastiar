# Study Catalogue (Programmes, Universities And Scholarships)

Status: Reviewed 2026-10-07 (decisions below applied). Supporting platform service for `SERVICES/02-universities.md` and `SERVICES/03-scholarships.md`. Pages live in `PAGES/02-universities-pages.md` and `PAGES/03-scholarships-pages.md`. Data: `DATABASE/db.md` → Study Catalogue Tables.

## Decision

Scholastiar.ai lists thousands of higher-education programmes, universities and scholarships in one searchable catalogue, the model used by Studyportals, IDP, ApplyBoard, Shiksha, Leverage Edu and others. When a student wants to apply, the platform sends them to the right place:

- the scholarship's or programme's **application page on Scholastiar.ai** if it is set up on our system, or
- the **university's or funder's own application page** if it is not — reached only from inside the app, never from public pages.

Search is **public** and indexed by search engines. Public pages exist to show what Scholastiar can do for the student and get them to sign up; fit, preparation, applying and tracking are **inside the app** for paying students.

## Why

- Public programme pages are how every competitor attracts students: people search "MSc Data Science in Germany" or "fully funded scholarships for Nigerians", land on a listing, and sign up.
- A catalogue that hides behind a login gets no search traffic.
- Our difference is what happens after the listing: fit for *this* student, AI-prepared applications, tracking, then visa, relocation and settling in (`SERVICES/12-relocation.md`). Competitors mostly stop at "accepted".

## What The Catalogue Contains

### Programmes

Every higher-education programme type, each tied to one university:

- Foundation and pathway programmes
- Diplomas and HND
- Bachelor's degrees (BSc, BA, BEng, LLB and others)
- Medicine and other long first degrees (MBBS, MD, general medicine, dentistry, pharmacy)
- Postgraduate diplomas and certificates (PGD, PGDip, PGCert)
- Master's degrees (MSc, MA, MBA, MRes, LLM, MEng and others)
- PhDs and doctorates
- Language and preparatory courses
- Short courses (summer schools, professional certificates)

Each programme is marked on campus, online or blended.

### Category Tabs

Every catalogue search (`/programs`, landing pages, country hubs, university pages) separates results with category tabs, each with a result count:

```txt
All · Foundation · Diploma · Bachelor's · Medicine · PGD / PGCert · Master's · PhD · Language courses · Short courses · Universities · Scholarships
```

- Programme tabs show programme cards; on campus / online / blended is a filter and a badge on each card.
- The Universities tab shows university cards; the Scholarships tab shows scholarship cards.
- The active tab is kept in the URL so it can be shared and indexed.
- Every category is in the first release.

### Universities

Universities, colleges and institutes, each with a profile and its programmes (`SERVICES/02-universities.md` → University Profile Pages).

### Scholarships

Scholarships with eligibility, benefits and deadlines (`SERVICES/03-scholarships.md`). A scholarship can be linked to:

- specific programmes,
- a whole university, or
- a country or region only (for example government scholarships).

Programme pages show the scholarships linked to them; scholarship pages show the programmes they fund.

## Public Versus In-App

| Public (visitors and search engines) | Inside the app (Starter and Pro) |
|---|---|
| Search, filters and sort | Fit score and its explanation for the signed-in student |
| Programme pages | Eligibility check against the student's profile |
| University pages | Document readiness for this programme |
| Scholarship pages | Save, compare and deadline reminders |
| Fees, intakes, deadlines, entry requirements, language of instruction | AI-prepared statements, answers and CV for this programme |
| Linked scholarships | Applying (all three routes) and tracking every application |
| "Last checked" date and verification badge | AI Apply Agent and Apply For Me board actions |

Rules:

- Public pages never show another student's data, a fit score or eligibility result for the visitor, or anything that needs a profile.
- Public pages never show links to the university's or funder's website or application page. The official application page is only reached from inside the app (official route below).
- Public pages show what Scholastiar adds, to get the visitor to sign up (Sign-Up Prompts below).
- Public pages are server-rendered with structured data (`EducationalOccupationalProgram`, `CollegeOrUniversity`, `MonetaryGrant`) and are listed in the sitemap.

## Sign-Up Prompts On Public Pages

The goal of every public programme, university and scholarship page is to help the visitor evaluate the option and see why they should do it with Scholastiar. Each page shows locked previews of our features, each opening sign-up and returning to the same page:

- **Your fit score** — a blurred score with "See how well you fit this programme"
- **Eligibility check** — "Check if you meet the entry requirements" (needs a profile)
- **Document readiness** — the number of documents the programme asks for, and "See which ones you already have"
- **Scholarships that could fund this** — the count of linked scholarships, with names visible and eligibility locked
- **Total cost estimate** — tuition plus living and relocation costs for the city (`SERVICES/12-relocation.md` cost estimator), with the student-specific breakdown locked
- **Visa and arrival steps** — a preview of the Pre-Arrival and Post-Arrival steps for that country
- **AI application help** — "We draft your statement and answers from your profile"
- **Compare and save** — compare with other programmes, save and get deadline reminders

The facts a student needs to judge a programme (level, duration, tuition, intakes, deadlines, language, entry requirements) stay visible to everyone.

## The Apply Button: Three Routes

Every programme and scholarship has one application route, chosen in this order:

1. **Hosted on Scholastiar** — the university or funder takes applications through our system (set up in the provider portal). The student applies inside Scholastiar with their profile, documents and AI-prepared answers. Status updates arrive in the platform.
2. **Partner** — Scholastiar has a recruitment agreement with the university. The student prepares and approves the application inside Scholastiar; Scholastiar submits it to the university for them (with explicit consent), tracks the response and supports the offer, visa and arrival steps.
3. **Official page** — everything else. "Apply" opens a preparation step inside Scholastiar (requirements, documents, AI drafts), then sends the signed-in student to the exact official application page through a tracked link. This link only exists inside the app. The application is added to their tracker as "Started on the official site".

What each person sees when they press Apply:

- **Visitor:** sign-up, then they return to the same programme or scholarship after checkout and onboarding.
- **Starter or Pro student:** the route above. Plan limits on AI credits and boards still apply (`BUILD_GUIDE/PRICING.md`).

For the official route:

- Outbound links go through a route handler (`/out/[linkId]`) that records the click and redirects. It is not a page and is not indexed.
- Three days after the click, the student is asked "Did you submit your application?" (in-app; email and WhatsApp per notification settings). Yes → status "Submitted (official site)". Not yet → reminder before the deadline.
- The tracker never claims we submitted something we did not.

## Recruitment Partnerships And Commission

- Partner universities may pay Scholastiar a commission when a student it supported enrols. This is the main revenue model of the competitors on this list and is recorded in `BUILD_GUIDE/PRICING.md` → Recruitment Commission.
- No partner label or fee notice is shown to students (decided 2026-10-07). Partner programmes look like any other programme; the apply button reads "Apply with Scholastiar".
- Commission never changes fit scores or eligibility results. Paid placement is only allowed in sponsored slots (`BUILD_GUIDE/SPONSORED_ADS_MARKETPLACE.md`).
- First partners: Russian universities, in line with Relocation's Russia-first launch.

## Search

Filters:

- what to study: field and subject, programme name, degree type and level
- where: country, city, university
- money: tuition range (shown in the student's currency, with the original), application fee, scholarships available, fully funded only
- when: intake month, application deadline, duration
- how: language of instruction, study mode (on campus, online, blended), part-time or full-time
- entry: minimum qualification, English test accepted, entrance exam required
- trust: verified only

Sort: best fit (signed in), relevance, deadline soonest, tuition low to high, recently updated.

Results show programme cards (the universal opportunity card, `PAGES/README.md`): programme name, university, country and city, level, duration, tuition, intake and deadline, language, on campus / online / blended badge, linked scholarship count, verification badge, and, when signed in, the fit score and save button (a locked fit score preview for visitors).

Landing pages for search engines:

- `/programs/[levelSlug]` — for example `/programs/masters`
- `/programs/[levelSlug]/[fieldSlug]` — for example `/programs/masters/data-science`
- country hubs (`/universities/country/[countrySlug]`) list programmes and scholarships for that country

A landing page is indexed only when it has at least 10 live listings, so thin pages never reach search engines.

## Data: Sources, Accuracy And Freshness

Sources, in order of trust:

1. the institution or funder itself, through the provider portal or a partner data feed (verified)
2. the official website, captured by the Discovery Engine and reviewed by an admin (`SERVICES/11-discovery-engine.md`)
3. admin manual entry from official documents

Never:

- copy listings, descriptions or databases from Studyportals, IDP, ApplyBoard or any other aggregator. Their terms forbid it and, in the UK and EU, databases have their own legal protection. Facts such as a fee or a deadline may be used when taken from the official source.
- publish a listing without an official source URL.

Every programme and scholarship stores:

- the official source URL for each fact group (fees, requirements, deadlines)
- `last_verified_at` and who verified it
- a verification state: verified (from the institution or funder), checked (reviewed against the official site), unverified (captured, not yet reviewed — never public), outdated

Freshness:

- re-check every listing at least every 12 months and before each intake's application window opens
- a listing becomes "outdated" when it passes its re-check date; outdated listings stay public with a warning and drop in sort order
- a passed deadline shows "Closed for this intake" and the next intake if known
- "Report incorrect information" on every public page creates an admin review task
- the same programme captured twice is merged by university + programme name + level

## Launch Scope

Quality over quantity. Studyportals took about 15 years to reach its size.

- Launch with Russia, then, in this order: Belarus, Kazakhstan, Moldova, Georgia, Armenia, UAE, Saudi Arabia, Qatar, Kuwait (decided 2026-10-07). Relocation activates each country through its own country activation gate (`SERVICES/12-relocation.md`).
- Every launch listing is checked against its official source.
- Grow through provider uploads, partner feeds and the Discovery Engine, not bulk imports from other sites.
- Mock data in Phase A follows `BUILD_GUIDE/SEED_DATA.md`: realistic but fictional or clearly sample programmes, no copied listings.

## Build Plan

- **U6 Universities:** catalogue search (`/programs`) with category tabs, programme pages with sign-up prompts, level and field landing pages, university directory and profiles, country hubs, the three apply routes, the outbound route handler and tracker entries, sitemap and structured data.
- **U7 Scholarships:** scholarship search and pages, programme ↔ scholarship links, hosted and official scholarship routes.
- **U8 Provider portals:** universities and funders upload and update programmes and scholarships, and switch on hosted applications.
- **U11 Discovery Engine:** captured listings, review queue and freshness checks.
- **U17 Admin:** catalogue data console, verification queue, reports of incorrect information, partner agreements.
- **Backend (B4–B6):** catalogue tables, search index, and the commission ledger for partner enrolments.

## Open Questions

- Which search engine powers the catalogue in Phase B (Postgres full-text first, or a hosted search service)?
- Commission rates and contract terms with partner universities.
