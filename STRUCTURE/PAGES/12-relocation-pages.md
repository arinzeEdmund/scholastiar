# Relocation Pages

Status: Unified Platform Service — ordered service 12

Source service spec: `SERVICES/12-relocation.md`

## Page System Vision

One journey, two categories — **Pre-Arrival Processes** and **Post-Arrival Processes** — with costs, offices, maps and people on the ground at every step. Built phone-first: students use these screens at embassies, airports and offices.

Every action that changes state sends email + WhatsApp + in-app messages (`SERVICES/100-notifications.md`). Every checkout offers card, local payment and crypto (`SERVICES/103-billing-subscriptions.md`).

## Public Pages

### Relocation Overview

Route: `/relocation`

Purpose: Explain the service to prospective and admitted students.

Key sections: how it works (pre-arrival → post-arrival → handsoff), active countries, cost estimator teaser, pilots and cohorts, accommodation, Year Check-in, FAQs.

Primary actions: see the cost of a country; start my journey (sign up / sign in); become a pilot.

### Country Cost Page

Route: `/relocation/[countrySlug]`

Purpose: "Cost of studying in [country]" — public cost estimate from the same engine as the journey.

Key sections: applying-from country selector (picks the embassy layer); city selector; total range (min / typical / max) in the visitor's currency; breakdown by Pre-Arrival, Travel, Post-Arrival, Accommodation, Living costs, Optional services (solo vs cohort); confidence per line; last verified dates; what's not included.

Primary actions: start my journey with these settings; compare cities.

States: country not active ("Coming soon — notify me").

### Become A Pilot

Route: `/pilots/apply`

Purpose: Recruit freelance pilots.

Inputs: name, contact (email, WhatsApp), city, languages, availability, experience, ID upload, references, consent to background check.

Primary actions: submit application; track status after submitting (signed in).

## Candidate Pages

### Journey Home

Route: `/journey`

Purpose: Command centre for the move.

Key sections: destination, school, embassy and arrival countdown; **Pre-Arrival** and **Post-Arrival** progress rings with percentages; next 3 steps with deadlines; cost summary (paid so far vs estimated total); accommodation status; assigned pilot / cohort; Post-Arrival 100% badge when earned.

Primary actions: open a step; get a pilot; view costs; open cohort; go to Handsoff (when eligible).

States: no journey yet → setup prompt (from an accepted offer, prefilled).

### Journey Setup

Route: `/journey/setup`

Purpose: Build the student's personal checklist.

Steps:

1. destination, city, school (prefilled from an accepted university offer)
2. visa type
3. country of residence and region → embassy picked by jurisdiction (changeable)
4. arrival date, course start, home currency
5. review generated steps: mark **Need it / Not needed / Done**; choose **Get a pilot** where wanted

Primary actions: create journey; edit later.

### Pre-Arrival Processes

Route: `/journey/pre-arrival`

Purpose: Track everything before landing.

Key sections: progress percentage; phases (Admission, Invitation and documents, Health and clearances, Funds, Visa, Insurance, Money, Getting ready, Travel) with step cards: status, deadline, duration, cost, embassy/office, "Get a pilot"; filter: to do / done / not needed.

Primary actions: open step; mark done; change need/not needed; request pilot.

### Post-Arrival Processes

Route: `/journey/post-arrival`

Purpose: Track everything after landing, to 100%.

Key sections: progress percentage and badge progress; phases (First days, First weeks, First months) with deadline countdowns ("register within 7 working days"); step cards with office, map preview, cost and "Get a pilot".

Primary actions: open step; mark done with optional proof; request pilot.

States: 100% → badge celebration and Handsoff prompt.

### Step Detail

Route: `/journey/steps/[stepId]`

Purpose: Everything needed to complete one step.

Key sections: plain-language explanation; step-by-step instructions; documents needed (with links to the document vault and how to obtain each); deadline and duration; **locations**: office name, address, embedded map, **Get directions**, bus/metro routes, opening hours, phone, email, website, appointment link; cost lines with confidence; official source and last verified date; cohort tasks for this step; notes.

Primary actions: mark done; upload proof; "What did you actually pay?" (after done); get a pilot; report out-of-date information; translate.

### Costs

Route: `/journey/costs`

Purpose: Total cost and spending tracker.

Key sections: estimated total (min / typical / max) in home currency and USD; breakdown by category; paid so far (from bookings and reported actuals); solo vs cohort comparison; confidence mix; exchange rate date.

Primary actions: report actual costs; change currency; export summary (PDF) for sponsors/family.

### Travel

Route: `/journey/travel`

Purpose: Flight, airport pickup and first-nights hotel.

Key sections: flight itinerary (add manually or upload ticket — after visa issued); airport pickup (solo or cohort, pilot assigned); hotel for first nights / gap before move-in (partner links and saved reservation); arrival-day plan.

Primary actions: save itinerary; book pickup; save hotel; share arrival plan with emergency contact.

### Cohort

Route: `/journey/cohort`

Purpose: Travel and settle together with students on the same route.

Key sections: suggested cohorts (city, school, embassy, arrival window, size, lead pilot, price per student); joined cohort: members (first name, home country, arrival week), shared schedule, group chat, pilot.

Primary actions: join; leave; message the group; view shared tasks.

### Handsoff

Route: `/journey/handsoff`

Purpose: Close the journey or stay covered.

Key sections: journey summary (steps completed, costs, badge); two choices: **Handsoff → Alumni (free)** and **Year Check-in ($600/year)** with coverage table, limits and response times.

Primary actions: become alumni; join Year Check-in (with "Recommended by" listing the pilots who served them).

States: not eligible yet (shows remaining post-arrival steps).

### Accommodation Search

Route: `/accommodation`

Purpose: Find verified places to live.

Key sections: filters (city, near school, type: dormitory / private / homestay / hall, price, room type, move-in date, verified only); map and list; travel time to campus.

Primary actions: open listing; save listing.

### Accommodation Listing

Route: `/accommodation/[listingId]`

Key sections: photos, rooms and prices, deposit, what's included, rules, availability, cancellation policy, location and campus travel time, Verified badge, reviews, provider info.

Primary actions: book a room; book with roommates; ask a question.

### Accommodation Booking

Route: `/accommodation/[listingId]/book`

Key sections: room and dates; roommates (optional, split payment); price breakdown (first rent, deposit, booking fee, utilities); policy; payment (card / local / crypto).

Primary actions: pay and request booking.

### My Accommodation Bookings

Route: `/accommodation/bookings`

Key sections: active and past bookings with status (requested, confirmed, contract ready, moved in, ended), next rent due.

### Accommodation Booking Detail

Route: `/accommodation/bookings/[bookingId]`

Key sections: status timeline; contract (view, sign); payment schedule and receipts; move-in checklist (inventory photos, meter readings, keys); maintenance requests; deposit status; dispute.

Primary actions: sign contract; confirm move-in; pay rent; request maintenance; open dispute.

### Roommates

Route: `/roommates`

Key sections: matches with compatibility score and reasons; filters.

Primary actions: send request; open chat; book together.

### Roommate Profile

Route: `/roommates/profile`

Inputs: city/school, budget, move-in date, room type, habits, languages, preferences; optional private fields (diet, faith) with visibility control.

### Roommate Requests

Route: `/roommates/requests`

Key sections: received and sent requests; accepted roommates; group.

### Communities

Route: `/communities`

Key sections: filters (city, school, type — faith (all faiths), fellowship, student association, national/diaspora, professional, sports and hobby, volunteering); cards with links (website, WhatsApp, Telegram).

Primary actions: save; mark joined; suggest a community.

### Community Detail

Route: `/communities/[communityId]`

Key sections: description, meeting times, address and map, links, languages, verified badge.

Primary actions: join via link; save; report.

### Suggest A Community

Route: `/communities/suggest`

Inputs: name, type, scope, description, meeting times, address, links, contact. Note: appears only after admin approval.

### City Guide

Route: `/city-guide/[citySlug]`

Key sections: getting around, neighbourhoods near campuses, cost of living, safety, essential places, weather and clothing, emergency numbers, customs and phrases, guided tours.

Primary actions: book a city tour; save places.

### Pilots Directory

Route: `/pilots`

Key sections: pilots in the student's city with photo, Verified / Staff badges, languages, services, rating, completed services.

Primary actions: view pilot; book a service.

### Pilot Profile

Route: `/pilots/[pilotId]`

Key sections: bio, badges, languages, services and prices (solo / cohort), availability, reviews.

Primary actions: book a service.

### My Pilot Bookings

Route: `/pilots/bookings`

### Pilot Booking Detail

Route: `/pilots/bookings/[bookingId]`

Key sections: service, date, meeting point and map, pilot, **meeting check-in code**, status, payment, live status sharing, **SOS**.

Primary actions: confirm completion; rate; report an incident; SOS.

### Year Check-in Home

Route: `/support`

Purpose: Membership and help.

Key sections: membership status, renewal date, usage against limits (legal cases, pilot accompaniments); **Get help** (local emergency number shown first); open and past cases; monthly check-in.

Primary actions: get help; renew; view coverage.

States: not a member → coverage and join.

### Join Year Check-in

Route: `/support/join`

Key sections: coverage table, what you pay, limits, waiting period, response times, renewal and refund terms; payment (card / local / crypto).

### New Support Case

Route: `/support/cases/new`

Inputs: category (medical, legal, police, accommodation, job, visa/permit, lost documents, bank/money, university, wellbeing, other), urgency, description, location, attachments. Emergency categories show the local emergency number first.

### Support Case Detail

Route: `/support/cases/[caseId]`

Key sections: status timeline, assigned handler / staff pilot / partner lawyer, messages, documents, costs covered vs payable extras.

Primary actions: reply; upload; approve a payable extra; close and rate.

### Best Pilot Awards

Route: `/pilots/awards`

Purpose: Public page for the yearly awards.

Key sections: Global Best Pilot ($10,000) and Country Best Pilot ($1,000 per active country); current winners and past years; how voting works; countdown to voting.

### Vote for Best Pilot

Route: `/pilots/awards/vote`

Purpose: Students vote for one pilot who served them this year.

Key sections: the pilots who served the student (photo, services, dates); one vote per year; confirmation.

Primary actions: vote; change vote until voting closes.

Rules: only students with a completed booking or cohort membership in the award year; only pilots who served them.

## Pilot Workspace Pages

### Pilot Onboarding

Route: `/pilot/onboarding`

Purpose: Verification progress (ID, address, background check, interview, training) and status: Applicant → Verified → Staff.

### Pilot Dashboard

Route: `/pilot/dashboard`

Key sections: today's services, upcoming bookings, cohorts, requests waiting, rating, earnings (freelancers), Year Check-in referrals and commission this year, Best Pilot Awards standing (votes are hidden until results).

### Pilot Requests

Route: `/pilot/requests`

Primary actions: accept; decline.

### Pilot Booking Detail

Route: `/pilot/bookings/[bookingId]`

Key sections: student(s), service, meeting point, check-in code entry, checklist for the service, notes, incident report.

Primary actions: check in; complete; report incident.

### Pilot Cohorts

Route: `/pilot/cohorts`

### Pilot Cohort Detail

Route: `/pilot/cohorts/[cohortId]`

Key sections: members, shared schedule, group chat, task status per member.

### Pilot Support Cases

Route: `/pilot/cases`

Purpose: Staff pilots only — Year Check-in cases assigned to them.

### Pilot Earnings

Route: `/pilot/earnings`

Purpose: Freelance payouts (from settlement tasks) and history. Staff pilots see completed work only (salaried). Both see Year Check-in commissions (pending in hold, payable, paid, clawed back) and award prizes.

### Pilot Referrals

Route: `/pilot/referrals`

Purpose: Earn 20% on every Year Check-in membership a pilot brings in.

Key sections: referral link, code and QR; what to say (approved coverage summary and honest selling rules); students referred and their status (joined, renewed, refunded); commission per membership with hold dates; this year's total.

Primary actions: copy link; share by WhatsApp; show QR.

### Pilot Profile Settings

Route: `/pilot/profile`

## Housing Provider Pages

### Housing Onboarding

Route: `/housing/onboarding`

Inputs: provider type, organisation or landlord details, verification documents, payout details (local bank), cities.

### Housing Dashboard

Route: `/housing/dashboard`

Key sections: occupancy, upcoming move-ins, booking requests, rent due, payouts, reviews.

### Housing Listings

Route: `/housing/listings`

### New Listing

Route: `/housing/listings/new`

### Listing Editor

Route: `/housing/listings/[listingId]`

Key sections: details, photos, rooms and prices, availability calendar, rules, cancellation policy, verification status.

### Housing Bookings

Route: `/housing/bookings`

### Housing Booking Detail

Route: `/housing/bookings/[bookingId]`

Primary actions: confirm; issue contract; confirm move-in; respond to maintenance; handle disputes.

### Housing Payouts

Route: `/housing/payouts`

Key sections: payouts due, paid (with proof), currency and exchange rate.

## Admin Pages

### Relocation Overview

Route: `/admin/relocation`

Key sections: countries with status (draft, in review, active), freshness (entries older than 90 days), outdated reports, rule changes pending, journeys active per country.

### Country Rules Editor

Route: `/admin/relocation/countries/[countryCode]`

Key sections: base steps by category and phase; layers (embassies, visa types, cities, schools) with their overrides; emergency numbers; activation checklist (verification gate).

Primary actions: add / edit / remove / reorder steps; add layer; copy country; submit for review; publish with effective date; activate.

### Step Editor

Route: `/admin/relocation/steps/[stepId]`

Key sections: content, documents, deadline rule, duration, locations (map pin, transport notes, hours, contacts), cost lines, source and verification, overrides by layer, version history.

### Embassies

Route: `/admin/relocation/embassies`

### Embassy Editor

Route: `/admin/relocation/embassies/[embassyId]`

Key sections: location, contacts, appointment link, jurisdiction, fees, processing times, verification.

### Preview As Student

Route: `/admin/relocation/preview`

Inputs: residence country and region, destination, visa type, city, school. Output: the exact checklist and costs a student would see.

### Rules Review Queue

Route: `/admin/relocation/reviews`

Key sections: proposed changes from office staff, student outdated reports, stale entries.

Primary actions: approve; reject; edit; mark verified.

### Cost Calibration

Route: `/admin/relocation/costs`

Key sections: actual cost reports vs typical values per line, outliers, exchange rates.

Primary actions: accept calibration; exclude outlier; update rates.

### Communities Approval

Route: `/admin/communities`

Primary actions: approve; reject; edit; verify; handle reports.

### Pilots

Route: `/admin/pilots`

### Pilot Detail

Route: `/admin/pilots/[pilotId]`

Key sections: application, verification checks, status (Applicant / Verified / Staff), services, bookings, ratings, incidents.

Primary actions: verify; set Staff status (employment handled by management); suspend.

### Pilot Commissions

Route: `/admin/pilot-commissions`

Key sections: Year Check-in commissions by pilot and country (pending, payable, paid, clawed back), attribution disputes, mis-selling reports.

Primary actions: correct attribution; approve payable commissions (creates payout tasks for freelancers, payroll export for staff); claw back.

### Pilot Awards

Route: `/admin/pilot-awards`

Key sections: award cycle (dates, prize amounts, eligibility thresholds), live vote counts per country, shortlist with ratings and incidents, fraud signals (duplicate accounts, vote clusters).

Primary actions: open/close voting; disqualify; confirm winners (global $10,000, country $1,000 each); publish; create prize payouts.

### Cohorts

Route: `/admin/cohorts`

Primary actions: create, merge, split, assign pilot, set group size limits.

### Accommodation

Route: `/admin/accommodation`

Primary actions: verify providers and listings; handle disputes.

### Settlements

Route: `/admin/settlements`

Key sections: payout tasks (due, paid, overdue), proof uploads, two-person approval, reconciliation and exchange rates.

### Support Cases

Route: `/admin/support-cases`

### Support Case Console

Route: `/admin/support-cases/[caseId]`

Key sections: case timeline, SLA timer, assignments (handler, staff pilot, partner lawyer), covered vs payable costs, internal notes, internal cost tracking.

### Partner Lawyers

Route: `/admin/partner-lawyers`

Key sections: lawyers per city, specialisms, retainer terms, cases.

## Suggested MVP Page Set

- `/relocation`, `/relocation/[countrySlug]`
- `/journey`, `/journey/setup`, `/journey/pre-arrival`, `/journey/post-arrival`, `/journey/steps/[stepId]`, `/journey/costs`
- `/accommodation`, `/accommodation/[listingId]`, `/accommodation/[listingId]/book`, `/accommodation/bookings/[bookingId]`
- `/pilots`, `/pilots/[pilotId]`, `/pilots/bookings/[bookingId]`, `/pilots/apply`
- `/journey/handsoff`, `/support`, `/support/join`, `/support/cases/[caseId]`
- admin rules editor, embassies, preview, settlements, communities approval, pilots

## Page Priority

### MVP Priority

Journey, Pre-Arrival, Post-Arrival, Step Detail, Costs, Country Cost Page, Accommodation booking, Pilots booking, Handsoff, Year Check-in, admin rules library and settlements.

### Phase 2 Priority

Roommates, Cohorts, City Guide, housing provider self-service, partner lawyers directory.
