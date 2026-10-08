# Universities Pages

Status: Unified Platform Service

Source service spec: `SERVICES/02-universities.md`

## Page System Vision

The Universities product should be treated as a full platform module, not a single page.

It needs public discovery pages, authenticated student workspace pages, AI application pages, communication pages, document and translation pages, premium support pages, university representative pages, and admin operations pages.

The goal is to let a student move from:

> I want to study abroad.

to:

> I found the right universities, generated tailored applications, submitted them, tracked responses, handled documents, and prepared for visa/enrollment.

inside one connected experience.

## Public Discovery Pages

Study catalogue (draft 2026-10-07): the public pages below are indexed by search engines and work for visitors. Fit scores, eligibility, saving and applying need a signed-in Starter or Pro account. See `SERVICES/21-study-catalogue.md`.

### Programme Search Page

Route: `/programs`

Purpose: Public search across every programme in the catalogue — foundation, diploma, bachelor's, medicine, PGD, master's, PhD, language and short courses — plus universities and scholarships.

Key sections:

- search box (programme, subject or university)
- category tabs with counts: All · Foundation · Diploma · Bachelor's · Medicine · PGD / PGCert · Master's · PhD · Language courses · Short courses · Universities · Scholarships
- filters: level, field, country, city, tuition range, scholarships available, fully funded only, intake month, deadline, duration, language of instruction, study mode, full-time or part-time, minimum qualification, English test accepted, verified only
- sort: best fit (signed in), relevance, deadline soonest, tuition low to high, recently updated
- result count and active filter chips
- programme cards: programme name, award, university, city and country, duration, tuition, next intake and deadline, language, on campus / online / blended badge, linked scholarships, verification badge; fit score and save when signed in, a locked fit score preview for visitors
- empty state with suggestions to widen filters

Primary actions:

- open programme
- save (sign in prompt for visitors)
- compare (signed in)

### Programme Landing Pages

Routes: `/programs/[levelSlug]`, `/programs/[levelSlug]/[fieldSlug]`

Purpose: Search-engine entry pages such as "Master's degrees" or "Master's in Data Science", showing the programme search pre-filtered, a short official-source-based introduction, top countries, linked scholarships and related fields. Indexed only with at least 10 live listings.

### Universities Home Page

Route: `/universities`

Purpose: Entry point into the global university admissions system.

This page should introduce the university application experience as a practical search and action surface, not only as a marketing page.

Key sections:

- global university search bar
- study by country entry points
- popular destinations
- program or course search
- tuition range filters
- degree level filters
- AI university matching prompt
- featured country hubs
- recently added universities
- call to create student profile or start matching

Primary actions:

- search universities
- explore countries
- start AI matching
- upload academic profile
- continue existing applications

### Country Study Hub Page

Route: `/universities/countries/[countrySlug]`

Example: `/universities/countries/russia`

Purpose: A complete destination guide for studying in a specific country.

For Russia, this page should feel like:

> Everything you need to understand and apply to Russian universities.

Key sections:

- country overview
- education system overview
- popular programs
- list of universities
- tuition ranges
- living cost estimates
- intake seasons
- application deadlines
- language requirements
- student visa overview
- document legalization requirements
- translation requirements
- accommodation information
- student work rights
- post-study options
- city comparisons
- safety and student life notes
- human support option
- country-specific FAQ

Primary actions:

- browse universities in this country
- filter by course, tuition, and intake
- start country-specific application package
- request human guidance
- view visa checklist

### University Directory Page

Route: `/universities/search`

Purpose: Search and filter all universities globally.

Filters:

- country
- city
- tuition range
- course or program
- degree level
- language of instruction
- intake season
- deadline
- accommodation availability
- scholarship availability
- visa friendliness
- admission difficulty
- English-taught availability
- application fee
- accreditation status
- living cost range

University cards should show:

- university name
- country and city
- photo
- tuition range
- top programs
- intake availability
- language of instruction
- application deadline
- estimated application effort
- success/admission fit score with responsible tooltip
- verified status
- quick fit indicator
- shortlist button
- compare button
- add to AI Apply Agent board, gated by subscription
- add to Apply For Me board, gated by subscription

Primary actions:

- open university profile
- shortlist
- compare
- apply
- ask AI if this university fits

### University Profile Page

Route: `/universities/[universitySlug]`

Purpose: Main information and application page for a specific university.

This page should be rich, trustworthy, and action-oriented.

Key sections:

- university overview
- history
- location and city context
- official photos
- campus videos
- student vlog links
- official website, admissions email, phone numbers, WhatsApp or Telegram contacts and social handles — signed-in students only; never on the public page (`SERVICES/21-study-catalogue.md`)
- verified profile badge/status
- programs offered
- tuition by program
- admission requirements
- required documents
- deadlines and intakes
- language requirements
- accommodation details
- estimated living cost
- application fee
- processing timeline
- accreditation or recognition
- immigration notes
- reviews and testimonials later
- FAQ

Primary actions:

- apply to this university
- add to shortlist
- compare
- email admissions
- generate inquiry email
- view required documents
- request human support
- report incorrect information

### Program Detail Page

Route: `/universities/[universitySlug]/programs/[programSlug]`

Purpose: Show details for a specific program at a university. Public and indexed; MVP (draft 2026-10-07).

Apply button by route (`SERVICES/21-study-catalogue.md` → The Apply Button):

- Hosted: "Apply on Scholastiar"
- Partner: "Apply with Scholastiar" (no partner label or fee notice)
- Official: "Prepare and apply" (preparation step inside the app, then the official application page through a tracked link)
- Visitors: every variant leads to sign-up and returns here

Also shows: linked scholarships, "last checked" date and verification badge, "Report incorrect information", and the locked sign-up prompts (fit score, eligibility, document readiness, funding, total cost, visa and arrival steps, AI help). No link to the university's website or application page on the public page.

Example: Medicine at Kazan Federal University.

Key sections:

- program overview
- degree level
- duration
- language of instruction
- tuition
- application fee
- intake periods
- admission requirements
- required academic background
- entrance exams if any
- required documents
- career outcomes
- accreditation notes
- application deadline
- related programs
- AI fit analysis

Primary actions:

- apply to this program
- add to shortlist
- compare with other programs
- generate SOP for this program
- ask AI about admission chance

### Student Reviews And Vlogs Page

Route: `/universities/[universitySlug]/student-life`

Purpose: Make university profiles feel real and trustworthy.

Content:

- student vlogs
- campus videos
- reviews
- city experience
- accommodation experience
- international student comments
- safety and lifestyle notes
- program-specific experiences

Primary actions:

- watch video
- read reviews
- submit review later
- report inaccurate content

## Student Workspace Pages

### Student Journey Dashboard

Route: `/universities/dashboard`

Purpose: High-level command center for the student's study-abroad journey.

Sections:

- profile completeness
- shortlisted universities
- active applications
- pending documents
- unread admissions messages
- upcoming deadlines
- AI recommendations
- translation requests
- human support tickets
- offers received
- visa and pre-departure next steps

Primary actions:

- continue application
- upload missing document
- reply to university
- review AI suggestion
- request support

### Smart Shortlist Page

Route: `/universities/shortlist`

Purpose: Student's selected universities and AI-recommended application strategy.

Key sections:

- shortlisted universities
- grouped by country
- grouped by safe, moderate, and ambitious
- tuition comparison
- deadline comparison
- required document comparison
- admission probability estimate
- missing profile information
- AI recommendation summary

Primary actions:

- remove from shortlist
- compare selected universities
- generate application packages
- start bulk apply
- request human review of shortlist

### University Comparison Page

Route: `/universities/compare`

Purpose: Side-by-side comparison of universities and programs.

Compare by:

- tuition
- country and city
- program duration
- language of instruction
- deadline
- intake
- accommodation
- living cost
- required documents
- admission difficulty
- visa friendliness
- accreditation
- response time
- total estimated first-year cost

Primary actions:

- choose best option
- add or remove universities
- apply to selected
- export or share comparison
- request AI recommendation

### Application Tracker Dashboard

Route: `/universities/applications`

Purpose: Student's full admissions pipeline.

Views:

- all applications
- by country
- by status
- by deadline
- by required action
- by university response

Statuses:

- shortlisted
- documents pending
- application drafted
- ready for review
- submitted
- university contacted
- awaiting response
- additional documents requested
- admission offered
- rejected
- deferred
- visa stage
- enrollment confirmed

Primary actions:

- open application
- view next action
- update status
- check inbox
- upload missing documents

### Application Detail Page

Route: `/universities/applications/[applicationId]`

Purpose: Full operational view for one application.

Key sections:

- university and program details
- current status
- timeline
- documents
- generated application package
- email thread
- AI review results
- human review notes
- fees and payment notes
- next steps
- visa and enrollment checklist if admitted

Primary actions:

- update status
- send email
- generate document
- upload missing file
- request support
- move to visa stage

## AI Application Pages

### AI University Matcher Page

Route: `/universities/matcher`

Purpose: Conversational or adaptive page where students describe what they want and receive recommended universities.

Inputs:

- desired country or region
- course
- degree level
- budget
- academic background
- language preference
- preferred intake
- visa concerns
- accommodation needs
- career goals

Outputs:

- recommended universities
- fit scores
- admission chance estimate
- affordability score
- visa friendliness score
- safe, moderate, and ambitious grouping
- explanation for each recommendation
- suggested application strategy

Primary actions:

- shortlist recommendations
- start bulk application
- refine preferences
- save matching profile

### Bulk Application Builder Page

Route: `/universities/apply/bulk`

Purpose: Create multiple applications at once while keeping every application unique.

Flow:

- select universities and programs
- confirm student profile
- confirm documents
- answer guided questions
- choose application package type
- generate unique documents per university
- review each package
- approve and send applications

Key sections:

- selected universities
- required documents by university
- missing documents
- AI personalization status
- application package preview
- warnings and issues
- payment or credits when needed

Primary actions:

- generate packages
- review application package
- approve application
- send inquiries or applications
- save as draft

### Single Application Builder Page

Route: `/universities/apply/[applicationId]`

Purpose: Build and manage one university application.

Key sections:

- university and program summary
- application status
- required documents
- student profile facts used
- generated documents
- AI quality review
- communication history
- notes
- payment and application fee tracking
- next steps

Primary actions:

- generate SOP
- generate inquiry email
- upload documents
- run AI review
- send application
- request human review

### Guided Document Builder Page

Route: `/universities/documents/builder`

Purpose: AI-guided flow for creating admissions documents.

Document types:

- statement of purpose
- motivation letter
- personal statement
- study plan
- academic CV
- research proposal
- supervisor email
- scholarship essay
- gap explanation
- sponsor explanation
- admission inquiry email

Flow:

- choose document type
- choose university or program
- answer guided questions
- AI generates draft
- student edits
- AI reviews for accuracy
- save to document vault
- attach to application

Important rule: show factual confirmation before finalizing.

Primary actions:

- generate document
- regenerate with changes
- edit manually
- save version
- attach to application
- request human review

### AI Application Review Page

Route: `/universities/applications/[applicationId]/review`

Purpose: Pre-submission quality control.

AI checks:

- missing documents
- inconsistent information
- unsupported claims
- generic language
- wrong university or course name
- grammar issues
- weak motivation
- repeated content across bulk applications
- visa-sensitive statements
- country-specific red flags

Primary actions:

- fix issues
- regenerate weak sections
- confirm factual accuracy
- approve application
- request human review

## Communication Pages

### Admissions Inbox Page

Route: `/universities/inbox`

Purpose: Platform-managed email communication with universities.

Features:

- dedicated student admissions email
- email threads by university
- sent and received messages
- AI summaries
- translation
- AI reply drafting
- attachments
- unanswered message tracking
- official response saving
- escalation to human support

Primary actions:

- compose email
- reply
- translate message
- summarize thread
- generate response
- attach documents
- link email to application

### Email Compose Page Or Modal

Route: `/universities/inbox/compose`

Purpose: Send professional admissions emails.

Inputs:

- recipient university
- email address
- selected program
- message type
- attachments
- AI draft option

Message types:

- admission inquiry
- document submission
- follow-up
- missing document response
- supervisor outreach
- offer clarification
- scholarship inquiry

Primary actions:

- generate email
- edit
- send
- save draft

## Document And Translation Pages

### Document Vault Page

Route: `/universities/documents`

Purpose: Secure storage for all student admissions documents.

Document categories:

- passport
- transcripts
- certificates
- CVs
- SOPs
- recommendation letters
- language tests
- financial documents
- translations
- legalized documents
- admission letters
- visa documents

Features:

- upload document
- tag document by type
- link document to applications
- show missing required documents
- show translation and legalization status
- version history
- access and security indicators

Primary actions:

- upload
- preview
- attach to application
- request translation
- request human review

### Translation Services Page

Route: `/universities/translation`

Purpose: Manage document and communication translation.

Features:

- request translation
- choose document
- choose source and target language
- AI preview translation
- certified translation request
- translation status
- cost estimate
- attach translated document to application

Primary actions:

- request translation
- view translated file
- attach to application
- request certification

## Immigration And Journey Pages

### Visa And Immigration Guidance Page

Route: `/universities/visa/[countrySlug]`

Purpose: Country-specific student visa guidance.

Key sections:

- visa overview
- required documents
- proof of funds
- embassy appointment guidance
- medical insurance
- legalization or apostille
- arrival registration
- student work rights
- renewal rules
- post-study options
- disclaimers
- human guidance option

Primary actions:

- create visa checklist
- attach admission letter
- request human support
- save guidance to journey dashboard

### Cost Calculator Page

Route: `/universities/cost-calculator`

Purpose: Estimate total study-abroad cost.

Inputs:

- country
- city
- university
- program
- tuition
- accommodation
- living cost
- visa fee
- translation cost
- insurance
- travel estimate
- application fees

Outputs:

- estimated first-year cost
- monthly living cost
- total application budget
- affordability warning
- sponsor or family summary

Primary actions:

- save estimate
- compare costs
- share with sponsor
- add to university comparison

### Offer Comparison Page

Route: `/universities/offers`

Purpose: Compare admission offers after acceptance.

Compare:

- university
- program
- tuition
- scholarship or discount
- city
- accommodation
- deadline to accept
- visa timeline
- total cost
- long-term career value
- risk level

Primary actions:

- accept planning
- request human review
- move selected offer to visa stage
- generate sponsor or family summary

### Family Or Sponsor View

Route: `/universities/sponsor`

Purpose: A simplified page for parents or sponsors to understand progress and costs.

Shows:

- student application summary
- universities applied to
- offers received
- estimated costs
- required sponsor documents
- payment timeline
- upcoming deadlines

Primary actions:

- view cost breakdown
- upload sponsor document
- approve support information
- download or share summary

### Pre-Departure Checklist Page

Route: `/universities/pre-departure/[countrySlug]`

Purpose: Guide admitted students after offer acceptance.

Checklist:

- accept admission offer
- pay required fees
- receive invitation or admission letter
- prepare visa documents
- book embassy appointment
- arrange translation or legalization
- book accommodation
- purchase insurance
- plan travel
- prepare arrival documents
- understand arrival registration

Primary actions:

- mark tasks complete
- upload evidence
- request support
- download checklist

## Premium And Support Pages

### Human Support Page

Route: `/universities/support`

Purpose: Request help from verified human agents.

Support types:

- document review
- application strategy
- university follow-up
- translation coordination
- visa checklist support
- PhD proposal review
- scholarship essay review
- rejection follow-up
- country-specific guidance

Primary actions:

- request support
- choose support category
- attach application or documents
- book consultation
- view support ticket status

### Premium Plans And Checkout Page

Route: `/universities/pricing`

Purpose: Monetize premium university services.

Plan examples:

- Basic
- AI Application Plan
- Bulk Apply Plan
- Premium Human Support
- PhD / Research Plan

Paid add-ons:

- bulk application credits
- AI document generation
- human review
- certified translation
- supervisor outreach
- visa readiness review
- priority support

Primary actions:

- choose plan
- buy credits
- upgrade
- view included services

## University Representative Pages

### University Representative Portal

Route: `/universities/representative`

Purpose: Allow verified universities to manage their own profiles later.

Features:

- claim university profile
- update programs
- update tuition
- update deadlines
- manage contact details
- respond to student inquiries
- view applicant leads
- verify official information

Primary actions:

- request verification
- edit profile
- respond to inquiries
- view applications

## Admin And Operations Pages

### Admin University Data Console

Route: `/admin/universities`

Purpose: Internal operations page for the Scholastiar team.

Features:

- create and edit universities
- verify data
- manage programs
- manage tuition
- manage contacts
- review reported errors
- source tracking
- verification timestamps
- approve university representative claims

Primary actions:

- add university
- update data
- mark verified
- review flagged information

### Admin Applications Console

Route: `/admin/university-applications`

Purpose: Internal support and operations page.

Features:

- view student applications
- support ticket linkage
- translation status
- human review status
- email issue monitoring
- application package status
- escalation management

Primary actions:

- assign human agent
- review application issue
- update support status
- flag risky application

### Admin Human Support Console

Route: `/admin/university-support`

Purpose: Manage human agent workflows.

Features:

- support requests
- agent assignment
- SLA tracking
- student documents
- internal notes
- reviewed applications
- translation coordination

Primary actions:

- assign ticket
- respond to student
- mark reviewed
- escalate

### Admin Translation Console

Route: `/admin/university-translations`

Purpose: Manage translation workflows.

Features:

- translation requests
- source documents
- target language
- certification status
- assigned translator
- delivery deadline
- payment status

Primary actions:

- assign translator
- upload translated file
- mark certified
- return to student

## Suggested MVP Page Set

For the first country MVP, do not build all pages immediately.

Start with (routes as in `BUILD_GUIDE/ROUTES.md`):

- `/programs`
- `/programs/[levelSlug]`
- `/programs/[levelSlug]/[fieldSlug]`
- `/universities/[universitySlug]/programs/[programSlug]`
- `/universities`
- `/universities/countries/[countrySlug]`
- `/universities/search`
- `/universities/[universitySlug]`
- `/universities/matcher`
- `/universities/shortlist`
- `/universities/apply/bulk`
- `/universities/applications`
- `/universities/applications/[applicationId]`
- `/universities/documents`
- `/universities/documents/builder`
- `/universities/inbox`
- `/universities/support`
- `/universities/pricing`
- `/admin/universities`

This gives the product enough shape to feel real and premium without trying to build the entire global system at once.

## Page Priority

### MVP Priority

- Programme Search Page
- Programme Landing Pages
- Program Detail Page
- Universities Home Page
- Country Study Hub Page
- University Directory Page
- University Profile Page
- AI University Matcher Page
- Smart Shortlist Page
- Bulk Application Builder Page
- Application Tracker Dashboard
- Application Detail Page
- Document Vault Page
- Guided Document Builder Page
- Admissions Inbox Page
- Human Support Page
- Premium Plans And Checkout Page
- Admin University Data Console

### Phase 2 Priority

- AI Application Review Page
- Single Application Builder Page
- Translation Services Page
- Visa And Immigration Guidance Page
- Cost Calculator Page
- Offer Comparison Page
- Email Compose Page Or Modal

### Phase 3 Priority

- Student Journey Dashboard
- Family Or Sponsor View
- Pre-Departure Checklist Page
- Student Reviews And Vlogs Page
- University Representative Portal
- Admin Applications Console
- Admin Human Support Console
- Admin Translation Console
