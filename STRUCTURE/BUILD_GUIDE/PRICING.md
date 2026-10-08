# Pricing

Status: Monetization source of truth

## Pricing Philosophy

Scholastiar.ai pricing should feel like users are paying for application power, mobility support, and execution help rather than simple content access.

Core principle:

> Public discovery pages help people find opportunities. Paid plans help users prepare better, apply faster, automate safely, and get human support when the stakes are high.

Pricing should support:

- applicants and candidates
- AI Apply Agent users
- Apply For Me customers
- employers
- universities and opportunity providers
- migration agencies and offices

## Applicant Plans

### Starter

Purpose: For applicants who want organization, AI help, and access to the application boards.

Price (decided 2026-10-01):

```txt
$35/month (USD)
```

Includes:

- more saved opportunities
- full opportunity card details
- application effort labels
- success/fit score explanations
- deadline reminders
- document checklist
- 25 tailored AI CVs and 250 AI essays and application answers a month (decided 2026-10-08)
- multiple CV versions
- AI fit analysis
- published Signia portfolio page and social link hub
- Signia project showcases with proof attachments
- AI Apply Agent board access
- Apply For Me board access
- advanced application tracker
- application deadline dashboard
- country and mobility recommendations
- document readiness checks

### Pro

Purpose: For heavy applicants who need high-volume preparation and stronger support.

Price (decided 2026-10-01):

```txt
$79/month (USD)
```

Includes everything in Starter, plus:

- unlimited tailored AI CVs, essays and application answers
- priority scoring and readiness checks
- scholarship essay support
- interview preparation
- advanced application intelligence
- AI Apply Agent queue credits
- Apply For Me campaign preparation
- expanded document storage
- expanded Signia video/document storage
- AI-assisted Signia project summaries
- priority support
- proof/archive workspace
- job connections (Pro only): student jobs that fit your study visa hours, and post-study jobs with visa sponsorship, inside the dashboard. A way to get connected to employers — never a promise of a job.

### Jobs Are Pro Only (decided 2026-10-07)

Jobs are not a headline service and not something the company promises to provide. They are a Pro feature inside the candidate dashboard: the ability to get connected to job openings that employers post.

- Pro ($79): full access to Jobs and Post-study jobs (visa sponsorship): browse, save and apply.
- Starter ($35): both sections are visible in the dashboard but locked; opening either shows an "Upgrade to Pro" prompt and no listings.
- There is no public job board. Marketing pages mention jobs only as a Pro feature, worded as job connections with no promise of employment.
- Employer plans are unchanged; employers' jobs are shown to Pro candidates only.

### Downgrading From Pro (decided 2026-10-08)

- Pro → Starter takes effect at the end of the paid period; no refund. The student keeps Pro until then and can undo it.
- Before confirming, the student sees exactly what changes: the job section turns off; job applications already sent stop updating in the app and employers' replies reach them by email only; tailored CVs drop to 25 a month; interview preparation, essay support, application intelligence and priority support end. What stays (profile, CVs, Signia, saved items) is shown too, and "Keep Pro" is the primary action.

### Plan Structure Decision (2026-10-01)

Applicants have exactly two plans, both paid: Starter ($35/month) and Pro ($79/month), in USD. There is no free applicant plan.

- Visitors can still browse public pages (see `USER_ROLES_AND_PERMISSIONS.md` → Guest).
- Human-assisted help (human review, Forwarder matching, campaign planning) is bought through Apply For Me pricing below.
- Local-currency display for Paystack/Flutterwave checkout is a Phase B decision.
- Every applicant chooses Starter or Pro during sign-up, before onboarding (see `PAGES/90-auth-pages.md`). There is no unsubscribed applicant account.

## AI Apply Agent Add-On

The AI Apply Agent can be sold as part of higher plans or as an add-on.

### Agent Lite

Includes:

- AI Apply Agent board access
- AI-prepared drafts
- user manually submits
- limited queue items
- basic proof/status tracking

### Agent Pro

Includes:

- review-then-apply for hosted/platform applications
- more queue items
- rules engine
- consent tracking
- document readiness checks
- proof capture

### Agent Max

Includes:

- higher queue limits
- multi-category applications
- priority execution
- advanced rules
- human fallback suggestions
- deeper application analytics

## Apply For Me Pricing

Apply For Me should support campaign-based pricing in addition to subscription entitlements.

### Single Application

Suggested range:

```txt
$5-$25/application
```

Best for:

- one job application
- one scholarship application
- one university inquiry/application

### Campaign Packs

Suggested ranges:

```txt
10 applications: $49-$149
30 applications: $120-$399
50 applications: $250-$699
100 applications: custom
```

Use cases:

- apply to 30 student jobs in Toronto
- apply to 20 scholarships in Europe
- apply to 10 universities in Russia

### Concierge Campaign

Pricing:

```txt
custom
```

Includes:

- human Forwarder
- AI preparation support
- review-before-submit option
- follow-up support
- proof of submission
- application status reporting
- document review

## Recruitment Commission (draft, 2026-10-07)

Partner universities may pay Scholastiar a commission when a student it supported enrols (the model used by ApplyBoard, IDP, KEG, Adventus and Uni-Quest). Rates and terms are set per agreement. No partner label or fee notice is shown to students (decided 2026-10-07); commission never changes fit scores or eligibility results. See `SERVICES/21-study-catalogue.md`.

## Employer Plans

Decided 2026-10-01: employers pay at sign-up. There is no free trial. Prices in USD, billed monthly; annual billing may be added later.

### Employer Starter

Price:

```txt
$99/month (USD)
```

Includes:

- up to 3 active student jobs
- applicant pipeline
- screening questions
- basic AI candidate ranking
- messaging
- 2 team seats

### Employer Pro

Price:

```txt
$249/month (USD)
```

Includes everything in Employer Starter, plus:

- up to 15 active jobs
- post-study jobs with visa sponsorship (Pro and Enterprise only)
- full AI ranking with reasons and candidate summaries
- work eligibility tools (student hours, sponsorship details)
- Signia evidence highlights and limited Signia search across opted-in candidates
- applicant analytics
- employer branding
- 5 team seats

### Employer Enterprise

Pricing:

```txt
custom (talk to sales)
```

Includes everything in Employer Pro, plus:

- unlimited jobs
- advanced Signia search, saved searches and candidate comparison
- integrations
- audit logs
- custom billing and roles
- dedicated support

## Provider Plans

Provider plans apply to universities, colleges, scholarship providers, and other verified school-related opportunity providers.

Decided 2026-10-01: providers pay at sign-up. There is no free claim plan. Prices in USD, billed monthly.

### Provider Verified

Price:

```txt
$149/month (USD)
```

Includes:

- verification badge
- up to 10 active opportunities
- receive applications or enquiries
- basic applicant dashboard
- 2 team seats

### Provider Pro

Price:

```txt
$399/month (USD)
```

Includes everything in Provider Verified, plus:

- unlimited opportunities
- AI applicant summaries
- messaging
- analytics
- priority verification
- 10 team seats

### Provider Enterprise

Pricing:

```txt
custom (talk to sales)
```

Includes everything in Provider Pro, plus:

- multiple teams or campuses
- bulk opportunity uploads
- API and integration support
- custom review flows
- dedicated support

### Organisation Plan Decisions (2026-10-01)

- Employers and providers choose a paid plan at sign-up and pay before onboarding, like applicants.
- Enterprise plans are sales-led: "Talk to sales" instead of self-serve checkout.
- Posting post-study jobs with visa sponsorship requires Employer Pro or Enterprise.
- Employer jobs reach candidates on the Pro plan only (decided 2026-10-07; see Jobs Are Pro Only above).
- Annual billing is not offered at launch.

## Migration Agency / Office Pricing

Migration agencies and Scholastiar offices may monetize through service bookings.

Examples:

- document pre-check fee
- visa guidance appointment
- university application support package
- work visa consultation
- relocation planning session
- translation/legalization coordination fee

Pricing can be:

- fixed per service
- country-specific
- consultant-specific
- package-based
- custom quote

## Sponsored Ads And Sponsorship Pricing

Sponsored placements are B2B monetization products for verified employers, universities, opportunity providers, migration agencies, training providers, and approved partners.

Source of truth:

```txt
STRUCTURE/BUILD_GUIDE/SPONSORED_ADS_MARKETPLACE.md
```

Suggested starting ranges:

```txt
Sponsored job boost:             $29-$199 per post
Featured employer profile:       $99-$499/month
Sponsored university program:    $99-$999/month
Featured migration agency:       $99-$999/month
Newsletter sponsorship:          $99-$999 per send
Sponsored article/guide:         $300-$3,000+
Country page sponsorship:        $299-$2,500/month
Hiring campaign package:         $499-$5,000+
Provider campaign package:       $499-$10,000+
Enterprise sponsorship:          custom
```

Trust rules:

- sponsors must be verified before paid placement
- sponsored content must be clearly labeled
- sponsored content must still pass moderation
- private user data and individual readiness scores must not be shared with sponsors unless the user explicitly applies, submits an inquiry, books a service, or gives consent
- no sponsored content may claim guaranteed visa approval, guaranteed admission, guaranteed scholarship, or guaranteed job placement

Sponsored products can be sold as one-time boosts, recurring featured profiles, campaign packages, newsletter placements, sponsored guides, or enterprise sponsorships.

## Relocation Pricing (decided 2026-10-02)

Source: `SERVICES/12-relocation.md`.

### Year Check-in — $600 per year

Ongoing support after a student has settled. Covers: medical emergency coordination (ambulance called, a companion up to 8 hours per incident, hospital liaison — not hospital charges); a partner lawyer with the **basic fee covered** (consultation + up to 3 hours per case — other legal costs paid by the student); police trouble response; accommodation dispute mediation and rehousing with no booking fee; job search through the Jobs service and agency; visa/permit, lost documents, bank and university help; monthly check-ins.

Fair use per membership year: 2 legal cases with the basic fee covered; 3 pilot accompaniments. 14-day waiting period for non-emergency cases (emergencies covered from day one); issues that started before joining are excluded. Annual auto-renewal with reminders; no refund after the first case is opened. Paid extras at member rates: extended or court legal representation, extra pilot hours, moving help, translation, document replacement processing.

### Pilot Services

Standard packages with platform-set prices per city (airport pickup, registration and medical accompaniment, SIM and bank setup, house viewing, move-in help, city tour, arrival-week package; custom quotes). Each package has a solo price and a lower **cohort price per student**. Platform commission on freelance pilot bookings; staff pilot bookings are full revenue. Year Check-in members get a discount.

### Pilot Incentives

- **Year Check-in commission:** the referring pilot (freelance or staff) earns **20%** of the Year Check-in amount paid — $120 per $600 membership, also on renewals. Payable after a 30-day hold (or when the first case opens); clawed back on refund. Scholastiar keeps $480 per referred membership.
- **Best Pilot Awards (yearly, voted by students):** Global Best Pilot **$10,000**; Country Best Pilot **$1,000** per active country. The global winner does not also take a country award.

### Accommodation

Booking fee per booking (waived for Year Check-in rehousing). Rent and deposits are passed through to the provider via settlement.

### Handsoff → Alumni

Free.

## Payment Provider Strategy

Use:

1. Stripe
2. Paystack
3. Flutterwave
4. Cryptomus (crypto — decided 2026-10-02; more crypto providers can be added)

Every checkout offers card, local payment and crypto (`SERVICES/103-billing-subscriptions.md`).

Routing:

- Stripe is primary.
- Paystack is first fallback and local/African payment rail where supported.
- Flutterwave is second fallback and additional Africa/global payment rail.

Provider fallback must not double-charge users.

## Public Versus Paid Rule

There is no free applicant plan. Public pages stay open to visitors for discovery.

Paid plans unlock:

- higher AI usage
- success/fit explanations
- deeper email intelligence
- more frequent opportunity strategy emails
- AI Apply Agent board access
- Apply For Me board access
- application tracking depth
- document readiness
- human review
- automation
- proof/archive features
- advanced analytics

## Email Intelligence By Plan

### Starter

- 2-3 opportunity emails weekly
- full score breakdowns
- AI Apply Agent board suggestions
- readiness updates
- deadline reminders

### Pro

- active strategy emails
- AI Apply Agent queue suggestions
- Apply For Me recommendations
- deadline planning
- advanced readiness insights

## Pricing Implementation Notes

Database should support:

- plans
- prices
- subscriptions
- usage limits
- usage events
- feature entitlements
- payment provider customers
- payment attempts
- invoices
- checkout sessions
- campaign purchases
- credits

Pricing should be environment/config driven enough to change without rewriting product logic.

Do not hardcode final prices into UI components. Use plan/price records.
