# Relocation

Status: Unified Platform Service — ordered service 12 (built before `13-migration-agencies.md`)

Decided: 2026-10-02. Pages: `PAGES/12-relocation-pages.md`. Data: `DATABASE/db.md` → Relocation Tables.

## Feature Vision

Relocation takes a student from "I've been admitted" to "I'm settled and studying" in another country — and stays with them afterwards if they want it.

It turns the scattered, country-specific, embassy-specific steps of moving abroad into one personal, tracked checklist with real costs, real offices, real maps and real people on the ground.

It has two categories:

- **Pre-Arrival Processes** — everything from admission to landing: invitation letter, documents, medical and police certificates, visa through the student's own embassy, insurance, money, packing, flight, airport pickup, first-nights hotel.
- **Post-Arrival Processes** — everything from landing to fully settled: migration registration, medical examination and fingerprinting, insurance, visa extension, SIM card, bank, transport, enrolment, moving in, embassy registration, communities, city orientation. Completion is tracked as a percentage; finishing everything earns a **100% Post-Arrival badge**.

Supporting modules:

- **Accommodation** with full booking and payment, plus **Roommates**
- **Communities** — faith communities of all faiths, fellowships, student associations, national/diaspora groups, clubs — admin-approved before they appear
- **City guide**
- **Pilots** — vetted people on the ground who guide students in person (freelance, then staff)
- **Cohorts** — students on the same route and arrival window grouped under one pilot
- **Cost estimator** — every step, booking and service carries a cost, giving a prospective student a reliable total
- **Handsoff** — finish and become a Scholastiar Alumni, or stay covered with **Year Check-in** ($600/year)

Every event in this service sends an **email and a WhatsApp message** from Scholastiar's official account, plus an in-app notification (see `100-notifications.md`).

The emotional promise:

> You will not land alone, you will not miss a deadline, and you will know what it costs before you go.

First destination: **Russia**. Every other country is added through the same rules library.

## Problem Being Solved

International students face:

- steps that differ by destination country, by city, by university — and by the embassy they apply through
- deadlines after arrival (registration, medical examination) with penalties when missed
- offices, addresses and transport they cannot find in an unfamiliar language
- accommodation scams and deposits lost to unverified landlords
- no reliable view of the total cost before committing
- payment systems that do not work across borders
- isolation in the first weeks, and nobody to call when something goes wrong later

## Target Users

- admitted students preparing to travel (pre-arrival)
- newly arrived students (post-arrival)
- settled students who want ongoing cover (Year Check-in)
- prospective students comparing the cost of studying in a country (public cost pages)
- pilots (freelance and staff)
- housing providers (university dormitories, verified landlords, homestays, private halls)
- community leaders submitting communities
- Scholastiar staff: country rules editors, settlement staff, support case handlers, admins

## Core Workflows

### 1. Journey Setup

The student creates a journey:

- destination country, city and school (prefilled from an accepted university offer — `02-universities.md`)
- visa type (e.g. student, preparatory language course)
- **country of residence and region** — used to pick the embassy or consulate they apply through, by jurisdiction (residence, not nationality)
- expected arrival date and course start date
- home currency for costs

The system builds the journey from the **layered country rules** (below). The student then reviews every step and marks it:

- **Need it** — include and track
- **Not needed** — hidden from progress (e.g. already has a valid passport)
- **Done** — already completed before joining

On any step the student can choose **Get a pilot**.

### 2. Layered Country Rules (the rules library)

Every country, embassy, visa type, city and school has its own rules. A student's checklist is assembled from layers; the most specific layer wins.

| Layer | Example | Affects |
|---|---|---|
| 1. Destination country (base) | Russia | All steps |
| 2. Embassy or consulate the student applies through | Russian embassy in Abuja vs Russian embassy in Kigali | Pre-arrival: documents, fees (local currency), appointment system, processing times, office details |
| 3. Visa type | Student vs preparatory course | Pre-arrival steps and documents |
| 4. City | Moscow vs Kazan | Post-arrival: offices, addresses, maps, transport, deadlines, costs |
| 5. School | A university that performs migration registration for its students | Post-arrival: steps handled by the school, or extra steps |

Each layer can **add** a step, **remove/hide** a step, **edit** any field of a step (documents, fee and currency, duration, deadline, office, links, instructions) and **reorder** steps.

Each step (template) records:

- category: pre-arrival or post-arrival
- phase within the category (e.g. Documents, Visa, Travel; First week, First month)
- title, plain-language description and step-by-step instructions
- documents needed (with how to obtain each, linking to the document vault)
- deadline rule (e.g. "within 7 working days of arrival", "at least 45 days before travel")
- estimated duration (time to complete) and waiting time (processing)
- one or more **locations**: office name, address, map pin, directions link, public transport notes (bus/metro routes), opening hours, phone, email, website, appointment link
- **cost lines** (see Cost Estimator)
- official source URL and **last verified date**
- whether a pilot service is available for it
- verification status: unverified, verified

#### Embassies Directory

For each destination country, every embassy and consulate abroad:

- host country and city, address, map, opening hours, contacts, appointment/booking link, visa centre if outsourced
- **jurisdiction**: which countries/regions it serves
- visa fees in local currency, processing times
- official link, last verified date

The student's residence country + region selects the embassy automatically; they can change it.

#### Rules Management (admin)

- add, edit, remove and **copy** countries, embassies, cities, schools and steps (copying an existing country is the fast way to start a new one)
- **preview as a student**: pick residence → destination → visa type → city → school and see the exact checklist and costs
- versions: draft → in review → published, with an **effective date** (e.g. a fee change from 1 January)
- change history on every rule
- office staff propose changes for their country; admins approve
- freshness: entries not verified in 90 days are flagged
- "This information is out of date" reports from students go to a review queue
- when a published rule changes, students with active journeys are notified (email + WhatsApp + in-app); their checklists update and completed steps stay completed

#### Country Activation Gate

A country, embassy layer or city is **visible to students only when active**. Activation requires:

- every published step verified against an official source (and, for post-arrival, the university international office where relevant) within the last 90 days
- embassy details verified
- emergency numbers verified
- at least one cost line per step

This applies to Russia first and to **every country activated later**. Demo/seed data is marked unverified and never activated in production.

### 3. Pre-Arrival Processes

Phases and typical steps (each country's rules decide the actual steps):

1. **Admission** — accept the offer; pay the tuition deposit if required; confirm arrival date with the school
2. **Invitation and documents** — visa invitation letter (issued through the university where the country requires it); passport validity/renewal; birth certificate if required; translations, notarisation, apostille/legalisation; recognition of foreign qualifications where required
3. **Health and clearances** — medical certificate and required tests; police clearance certificate from the home country; vaccinations
4. **Funds** — proof of funds, bank statements, sponsor letters, education loans
5. **Visa** — application form, photos, fee, appointment, biometrics, interview, tracking, collection — all from the student's own embassy layer
6. **Insurance** — health insurance if required before entry
7. **Money** — how money works in the destination (e.g. whether foreign cards work), cash to carry, sending money, informing the home bank
8. **Getting ready** — packing and climate, plug type, customs rules and prohibited items, emergency contacts, documents to carry in hand luggage
9. **Travel** — flight itinerary saved after the visa is issued; airport pickup booked; hotel for the first nights (and for the gap before moving into accommodation)

### 4. Post-Arrival Processes

Phases and typical steps:

1. **First days** — airport arrival and pickup; migration registration at the place of stay; hand documents to the international office; SIM card
2. **First weeks** — medical examination and fingerprinting where required; medical insurance policy; enrolment and student ID; moving into accommodation; bank account/card; tax/social number where needed for part-time work; transport card
3. **First months** — visa extension or residence permit; registration with the student's own embassy; doctor/clinic registration; communities joined; city orientation tour

Each step shows instructions, documents, deadline countdown, offices with **map, directions link and bus/metro routes**, opening hours, contacts, cost, and "Get a pilot".

**Progress**: Post-Arrival completion = completed ÷ needed steps, shown as a percentage. At 100% the student receives the **Post-Arrival 100% badge** (shown on their profile and journey). Pre-arrival has its own percentage.

Students can attach proof to a step (e.g. registration slip photo) — stored in the document vault, private by default.

### 5. Cost Estimator

Every step, accommodation booking, pilot service and Year Check-in has **cost lines**:

- item (e.g. visa fee, translation per page, medical certificate)
- fee type: fixed official fee, provider price, variable estimate, optional
- minimum, typical, maximum, currency
- per unit (per person, per page, per month, per day) and quantity rule
- source and last verified date
- **confidence**: high (fixed official fee verified within 90 days), medium (provider price), low (estimate)

Totals:

- per step, per phase, per category (pre-arrival, travel, post-arrival), accommodation (deposit + rent × months), living costs (city monthly cost × months), optional services (pilots, cohort price), and grand total
- shown in USD and the student's currency with a dated exchange rate
- "what's not included" (e.g. tuition unless linked from the offer, personal spending)
- **cohort price** shown alongside solo price where a cohort is available

Accuracy:

- fixed official fees can be exact when verified
- variable costs are shown as ranges; after a student completes a step they are asked **"What did you actually pay?"** — aggregated actual costs (median, spread) calibrate the typical values; admins review outliers before they affect estimates
- every total shows its confidence mix; the platform never promises an exact figure for variable costs

Public cost pages: **"Cost of studying in [country]"** with a selector for the applying-from country (embassy layer) and city — the same engine, no account needed (SEO entry point; CTA: start your journey).

### 6. Accommodation (full booking and payment)

Provider types: university dormitories, verified private landlords (through verified partners), homestays, private student halls.

Listings: photos, room types, price per month, deposit, what's included (utilities, internet), distance and travel time to campus (map), rules, availability calendar, cancellation policy, **Verified** badge (staff inspection), reviews from students who stayed.

Booking flow:

1. choose listing, room and dates
2. price breakdown: first rent, deposit, booking fee, utilities
3. pay Scholastiar (card, local payment or crypto)
4. Scholastiar holds the funds
5. provider confirms; contract issued and signed in-app
6. student moves in and confirms ("Moved in" step in Post-Arrival)
7. funds released to the provider (settlement, below)
8. ongoing rent schedule: pay monthly through the platform with reminders (email + WhatsApp)

Also: change/cancel per policy, deposit tracking, move-in checklist (inventory photos, meter readings, keys), maintenance requests, disputes (handled by Scholastiar; Year Check-in members get lawyer support).

Housing providers have their own workspace: listings, availability, bookings, contracts, payouts, reviews.

### 7. Roommates

- roommate profile: city/school, budget, move-in date, room type wanted, sleep schedule, cleanliness, smoking, guests, languages, study habits, gender preference for shared rooms; optional diet and faith fields — **private unless the student chooses to show them**
- matching with a compatibility score and reasons
- request → accept → chat
- **book together**: a shared room/apartment booking with split payments per person; each roommate signs their part of the contract

### 8. Communities

Types: faith communities of **all faiths** (churches, mosques, temples, synagogues and others), fellowships, student associations, national and diaspora groups, professional groups, sports and hobby clubs, volunteering.

Each community: name, type, description, scope (school or city), meeting times, address and map, website, WhatsApp/Telegram/Instagram links, contact email, languages, verified badge.

Rules:

- anyone (student, pilot, community leader) can **suggest** a community
- **nothing appears until an admin approves it**
- report button on every community (wrong link, inappropriate, closed)
- periodic link check; broken links go back to review
- students save communities and mark "Joined"; joining one counts towards the "Join a community" post-arrival step

Faith and identity are never used to recommend roommates, pilots or anything else unless the student explicitly chooses to share them.

### 9. City Guide

Per city: getting around (transport cards, apps, night transport), neighbourhoods near each campus, cost of living, safety advice, essential places (pharmacies, supermarkets, international and halal/African/Asian groceries, banks, SIM shops), weather and clothing, emergency numbers, local customs and useful phrases, and **guided city tours** (pilot packages).

### 10. Pilots

People on the ground who guide students in person.

**Status ladder:**

1. **Applicant** — applies at `/pilots/apply` (cities, languages, availability, experience)
2. **Verified freelancer** — after ID verification, address check, background check, interview and training; shows the **Verified** badge
3. **Staff pilot** — management offers proven freelancers an official employment contract. **Employment is handled by management outside the platform.** On the platform an admin sets the status, and the pilot shows the **Verified** and **Staff** badges

Staff pilots also handle Year Check-in cases and are based at Scholastiar offices where offices exist (`13-migration-agencies.md`).

**Services** (standard packages with platform-set prices per city, so prices stay fair and predictable):

- airport pickup
- accompaniment to migration registration / medical examination / fingerprinting / visa extension
- SIM card and bank setup
- house viewings and move-in help
- city orientation tour
- full arrival-week package
- custom request (quoted)

Solo price and **cohort price per student** for each package.

**Booking:** student requests (from a step or the pilots directory) → pilot assigned (student's choice or auto by availability, rating, language) → confirmed → on the day: **meeting check-in code** verifies both people → in progress → completed → student confirms and rates → pilot payout.

**Safety:**

- only Verified pilots are bookable
- meeting check-in codes; live status shared with the student's emergency contact if they choose
- **SOS button** during a service (alerts Scholastiar staff; shows local emergency number)
- option to request a female pilot
- pilots never keep a student's passport or documents
- incident reports, ratings, suspension and removal

**Pilot incentives** (decided 2026-10-04):

*1. Year Check-in commission — 20%.* Pilots are encouraged to recommend Year Check-in to the students they guide. A pilot earns **20% of the Year Check-in money** for every membership attributed to them ($120 on a $600 membership).

- applies to **both freelance and staff pilots** (staff pilots receive it as a bonus on top of salary)
- attribution: the pilot's personal **referral link / code** (shown in the pilot workspace and on the booking screen), or the student choosing "Recommended by" at checkout from the pilots who have served them; one pilot per membership; first valid attribution wins; admins can correct it
- renewals: the attributed pilot also earns 20% on each renewal while they remain an active Verified pilot
- earned on the amount actually paid (after discounts, excluding payment fees); paid in USD equivalent through settlement (freelancers) or added to payroll by management (staff), recorded on the platform either way
- **hold period:** commission becomes payable 30 days after payment (or once the first support case opens, when refunds stop); a refunded or charged-back membership cancels or claws back the commission
- honest selling rules: pilots must describe coverage and limits exactly as the plan page does; no pressure, no promises outside coverage; Year Check-in can never be a condition of a pilot service; misleading sales lead to clawback and suspension
- students who joined through a pilot are told so on the receipt; a pilot cannot attribute to themselves or to their own family members

*2. Best Pilot Awards — yearly.* Students vote for the pilots who served them.

- **Global Best Pilot: $10,000** — one winner worldwide
- **Country Best Pilot: $1,000** — one winner in each active country
- the global winner does not also take a country award; that country's award goes to its next-placed pilot
- **who votes:** students with at least one completed pilot booking (or cohort membership) in the award year; one vote per student per year, only for pilots who actually served them; voting opens in the last month of the award year
- **eligibility:** Verified or Staff pilot for at least 6 months of the award year, minimum completed services and average rating (set by admin), no upheld serious incident, no misleading-sales finding
- **ranking:** student votes decide; ties broken by average rating, then completed services; admin reviews the shortlist for vote fraud (duplicate accounts, vote trading, pilot-solicited votes in exchange for favours) and can disqualify, then publishes the winners
- prizes paid through settlement (freelancers) or by management (staff); winners get a permanent **Best Pilot** badge with the year on their profile
- Year Check-in sales never count towards the award: the award is about how students were looked after

### 11. Cohorts

Students running the same process are grouped so one pilot can guide them together.

- grouping keys: destination city and school, embassy (for pre-arrival tasks), **arrival window** (e.g. within 7 days), and current stage
- suggested automatically; **joining is opt-in**
- before joining, others see only first name, home country and arrival week
- one lead pilot per cohort; maximum group size per service (set by admin per city and service)
- shared schedule of group tasks: airport pickups, registration and medical visits, bank/SIM day, house viewings, city tour
- group chat (pilot + members)
- **cohort price per student** (lower than solo)
- members can leave; pilots and admins can merge, split or reassign cohorts
- cohorts continue from the last pre-arrival steps into arrival week, where shared tasks save the most time

### 12. Handsoff and Year Check-in

When a student has arrived, started school and completed Post-Arrival Processes (100%), the **Handsoff** screen offers:

**Option A — Handsoff → Alumni (free)**

- the relocation journey closes and is archived (read-only); the student receives the **Scholastiar Alumni** badge
- pilot assignments end; documents, costs and completed steps remain in their account
- the rest of the platform continues as normal (profile, jobs, applications, Starter/Pro plan)
- they can join Year Check-in later (the waiting period applies)

**Option B — Year Check-in ($600 per year)**

Scholastiar stays in charge for 12 months. A **Get help** button opens a support case; a 24/7 WhatsApp and in-app line handles emergencies.

Coverage:

| Situation | Scholastiar does | Student pays |
|---|---|---|
| Medical emergency | Calls the ambulance; sends a staff member or pilot to stay with the student (up to 8 hours per incident); translation and hospital liaison; helps file the insurance claim | All hospital and medical charges (through their insurance) |
| Legal issue | Assigns a Scholastiar partner lawyer and **covers the lawyer's basic fee** (initial consultation + up to 3 hours per case) | Court fees, fines, bail, damages, and lawyer time beyond the basic fee (at member rates) |
| Police trouble | Responds; translation; partner lawyer; contacts the student's embassy | As for legal issues |
| Accommodation dispute | Staff mediate with the landlord; lawyer letter where needed; deposit recovery; rehousing with no booking fee if they must move | Rent, deposits, moving costs |
| Lost job / job search | Our Jobs service and agency take over: priority matching, CV refresh, interview preparation, visa work-hours check | — |
| Visa or permit problem | Renewal reminders, extension coordination, document help | Government fees |
| Lost passport or documents | Police report, embassy liaison, replacement help | Official replacement fees |
| Bank or money problem | Help resolving with the bank, money transfer guidance | Bank charges |
| University problem | Liaison with the international office, fee disputes, appeals guidance | University fees |
| Wellbeing | Monthly check-in message (email + WhatsApp), referral to mental-health support | Therapy fees |

Legal help is provided only by qualified partner lawyers; Scholastiar staff coordinate but do not give legal advice themselves.

**Profit design:**

1. fair-use limits per membership year: 2 legal cases with the basic fee covered; 3 pilot accompaniments; companion up to 8 hours per medical incident
2. paid extras at member rates: extended or court representation, extra pilot hours, moving help, translation, document replacement processing
3. 14-day waiting period for non-emergency cases; issues that started before joining are excluded; **emergencies covered from day one**
4. low marginal cost: partner lawyers on bulk retainer rates; staff pilots already salaried
5. pilot-driven sales: pilots who already know the student recommend Year Check-in for a 20% commission ($120 on $600), so most acquisition cost is paid only on a sale
6. retention: annual auto-renewal with reminders (email + WhatsApp, 30/7/1 days before); no refund after the first case is opened; member discounts on pilots and accommodation booking fees
7. sold only where Scholastiar can deliver (cities with staff pilots or partners); Russia first
8. internal case costing (staff hours, lawyer fees, extras billed) for margin reporting per member

**Response targets:** emergency — within 15 minutes, 24/7; urgent — within 4 hours; standard — within 1 business day.

**Safety rule:** the Get help screen always shows the **local emergency number first** (verified per country — e.g. Russia 112, to be verified before activation). Scholastiar's help supports emergency services; it never replaces them.

**Support case flow:** open (category, description, location, attachments) → triage (priority) → assign (staff pilot, case handler, partner lawyer) → actions and timeline → resolved → student feedback. Every update sends email + WhatsApp + in-app.

### 13. Payments and Settlement

Students always pay **Scholastiar**, by:

- card (Stripe)
- local payment (Paystack, Flutterwave)
- **crypto** — Cryptomus first; the payment layer is provider-agnostic so more crypto providers can be added (`103-billing-subscriptions.md`)

Scholastiar holds funds until the service is delivered (move-in confirmed, pilot service completed).

**Settlement to providers in the destination country (Russia first):**

1. a **payout task** is created per provider payment: payee, amount in local currency (RUB), exchange rate used, bank details, due date
2. Scholastiar settlement staff in the country pay through local banks
3. staff upload proof of payment; payouts above a threshold need a second approver
4. the task closes; student and provider receive receipts (email + WhatsApp)
5. reconciliation screen: due, paid, overdue, exchange-rate gains/losses

Freelance pilots are paid through the same settlement process; staff pilots are salaried by management. Year Check-in commissions and Best Pilot prizes follow the same rules: settlement payout tasks for freelancers, payroll by management for staff (recorded on the platform).

Refunds and disputes go back through Scholastiar to the original payment method (crypto refunds in crypto).

## Notifications

Every event sends **email + WhatsApp (official Scholastiar account) + in-app**, following `100-notifications.md`. Relocation events include:

- journey created; checklist updated after a rule change
- step due soon / overdue / completed; phase completed; Pre-Arrival complete; Post-Arrival 100% badge
- visa application reminders and tracking updates
- flight itinerary saved; airport pickup confirmed; pilot on the way; pilot arrived (check-in code)
- accommodation booking received / confirmed / contract ready / move-in reminder / rent due / payment received / payout sent
- roommate request / accepted; cohort suggested / joined / schedule changed
- community approved (to the submitter); community saved
- pilot booking requested / assigned / confirmed / completed / rate your pilot
- Year Check-in commission earned / payable / paid / clawed back (to the pilot)
- Best Pilot voting open (to eligible students) / vote recorded / winners announced (everyone); award won (to the winners)
- Handsoff chosen; Alumni badge; Year Check-in purchased / renewal reminders / renewed / expired
- support case opened / assigned / updated / resolved; monthly check-in
- payment received / failed / refunded (all methods, including crypto confirmations)

## AI Opportunities

- explain each step and its documents in plain language, in the student's language
- translate office instructions and forms
- summarise rule changes for affected students
- detect inconsistencies between the student's documents and the step requirements
- calibrate cost predictions from actual cost reports
- suggest cohorts and roommate matches with reasons
- triage support cases by urgency
- draft polite messages to landlords or offices (reviewed by the student)

## Data Model Notes

Full tables in `DATABASE/db.md` → Relocation Tables. Core entities:

- rules library: relocation_countries, relocation_cities, relocation_schools, embassies, embassy_jurisdictions, process_steps, process_step_overrides, process_locations, process_cost_lines, rule_versions, rule_change_log, rule_outdated_reports, exchange_rates, emergency_numbers
- journeys: relocation_journeys, journey_steps, journey_step_proofs, actual_cost_reports, travel_itineraries
- accommodation: housing_providers, accommodation_listings, accommodation_rooms, room_availability, accommodation_bookings, booking_payment_schedules, accommodation_contracts, accommodation_reviews, maintenance_requests
- roommates: roommate_profiles, roommate_requests, roommate_groups
- communities: communities, community_links, community_saves, community_reports
- city guides: city_guides, city_guide_entries
- pilots: pilot_profiles, pilot_verifications, pilot_service_packages, pilot_bookings, pilot_booking_checkins, pilot_reviews, pilot_incidents
- pilot incentives: pilot_referral_codes, pilot_commissions, pilot_award_cycles, pilot_award_votes, pilot_awards
- cohorts: cohorts, cohort_members, cohort_tasks
- after arrival: alumni_records, year_checkin_memberships, support_cases, support_case_events, support_case_assignments, partner_lawyers
- money: payout_tasks, crypto_payments (see Billing)

## UX Direction

- one journey screen with two clear tabs: **Pre-Arrival** and **Post-Arrival**, each with its percentage
- every step is a card: status, deadline countdown, cost, location with map, "Get a pilot"
- maps embedded with a **Get directions** button (opens the device's maps app with public transport)
- costs always visible: the student never discovers a fee late
- calm, reassuring tone; urgent deadlines are clear but never alarming
- works well on phones (students use this in the street, at offices, on arrival)
- offline-friendly: instructions, addresses and the current step are cached for use without data (PWA)

## Integrations

- maps: embedded map + directions deep links (provider decided in Phase B)
- WhatsApp Business Platform (provider to be chosen) and email
- payments: Stripe, Paystack, Flutterwave, **Cryptomus** (crypto), more crypto providers later
- `02-universities.md`: accepting an offer starts the journey
- `14-jobs.md` / `20-work-eligibility.md`: Year Check-in job help (job connections need Pro); visa work-hours checks
- `13-migration-agencies.md`: offices host staff pilots and settlement staff
- `10-apply-for-me.md`: Forwarders apply on a student's behalf; **Pilots** guide students on the ground — different roles
- `102-documents-storage.md`: proofs and documents
- `100-notifications.md`, `103-billing-subscriptions.md`, `106-security-rls.md`

## Monetization

- Year Check-in: $600 per year (`PRICING.md`)
- pilot services: platform commission on freelance pilot bookings; full price on staff pilot bookings
- pilot incentive costs: 20% Year Check-in commission to the referring pilot; yearly Best Pilot Awards ($10,000 global + $1,000 per active country)
- cohort pricing (lower per student, higher per pilot hour)
- accommodation booking fee (waived for Year Check-in rehousing)
- member discounts that drive repeat bookings

## Differentiators

- embassy-specific pre-arrival rules (residence-based), not one generic checklist per country
- real offices, maps, routes and deadlines for every post-arrival step
- total cost before committing, calibrated by what students actually paid
- verified people on the ground, grouped into cohorts to cut cost
- money that works across borders (card, local payment, crypto) with local settlement
- care that continues after arrival (Year Check-in)

## Risks And Constraints

- rule accuracy: country activation gate, 90-day verification, effective dates, outdated reports
- in-person safety: verification, check-in codes, SOS, incident handling
- commission-driven mis-selling: honest selling rules, hold period, clawback, suspension
- award vote fraud: only served students vote, one vote each, admin fraud review
- accommodation scams: verified providers only, funds held until move-in
- holding money for third parties: payout tasks, proof, two-person approval, reconciliation
- legal help only from qualified partner lawyers
- sensitive data (health, legal cases, faith, location): strict access in `106-security-rls.md`
- WhatsApp requires each user's opt-in
- crypto: stablecoins first, locked quotes, provider-agnostic design
- each city depends on local staff and partners; sell only where we can deliver

## Later Phase Decisions (Non-Blocking)

- WhatsApp provider (official WhatsApp Business Platform via a BSP or direct)
- additional crypto providers after Cryptomus
- maps provider
- order of countries after Russia
- insurance partnerships
- family/dependant add-on for Year Check-in

## Implementation Roadmap

1. Rules library, embassies, country activation gate, Russia data (verified)
2. Journey, Pre-Arrival and Post-Arrival tracking, cost estimator, public cost pages
3. Pilots (apply, verify, book), cohorts, Year Check-in commission and Best Pilot Awards
4. Accommodation booking and payment, settlement, roommates
5. Communities and city guide
6. Handsoff, Alumni, Year Check-in and support cases
7. Next countries through the same library
