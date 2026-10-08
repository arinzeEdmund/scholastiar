# Scholastiar.ai UX/UI Base

Status: Master UX/UI Reference

Scope: Entire Scholastiar.ai product ecosystem

## Brand Essence

Scholastiar.ai should feel like a calm, intelligent, premium international opportunity platform.

The product should communicate:

- trust
- clarity
- progress
- global ambition
- human support
- AI intelligence
- professional seriousness
- emotional reassurance

The core feeling:

> A calm intelligent assistant is guiding me through a serious international opportunity process.

Scholastiar.ai should not feel like a noisy job board, generic SaaS dashboard, government form, or chaotic agency website.

## Visual Identity

The visual identity is based on:

- white/light backgrounds
- near-black text
- Scholastiar green accent
- generous whitespace
- real human photography
- clean cards and panels
- thin borders
- premium editorial spacing
- dark high-contrast sections used selectively

The logo direction:

```txt
Scholastiar.
```

The green dot is a key brand signal. It should influence the UI as a recurring accent for progress, approval, verification, opportunity, and action.

## Color System

### Primary Colors

Use a restrained black, white, and green foundation.

Recommended base palette:

```txt
Brand Black: #050505
Near Black: #171717
Primary Text: #1E1E1E
Secondary Text: #5F6368
Muted Text: #8A8F98
Background: #FFFFFF
Soft Background: #F7F9F7
Soft Green Background: #EAF6F0
Border: #E5E7EB
Scholastiar Green: #10B65B
Green Hover: #0E9F50
Green Dark: #087A3E
```

Green should be a signal color, not a wall of color.

Accessibility note (decided 2026-10-01): Scholastiar Green #10B65B has only 2.67:1 contrast with white text, below WCAG AA. Use it for signals (logo dot, progress, icons, badges, focus rings), not as a fill behind text. Filled primary buttons use Action Green #0B8743 (4.6:1 with white). Green text uses Green Dark #087A3E. Muted Text #8A8F98 is for placeholders and non-essential decoration only; use Secondary Text #5F6368 for readable small text.

Use green for:

- primary CTAs
- success states
- verified badges
- progress markers
- AI-ready states
- selected filters
- active steps
- key icons

Do not overuse green for:

- entire page backgrounds
- every card border
- large blocks of text
- decorative gradients

### Supporting Status Colors

Use status colors sparingly:

```txt
Success: green
Warning: amber
Danger: red
Info: restrained blue or neutral
Disabled: light gray
```

Status colors should never compete with Scholastiar green.

## Typography

Typography should be clear, modern, and highly readable.

Direction:

- bold headings
- compact but readable body text
- strong information hierarchy
- no overly decorative fonts
- no negative letter spacing
- no viewport-based font scaling

Recommended style:

- H1: large, confident, simple
- H2: strong section title
- H3: compact dashboard/card title
- Body: readable and calm
- Labels: small, clear, slightly muted
- Helper text: concise and supportive

Headlines should be direct.

Good:

```txt
Your strongest student job matches
Generate a CV for this role
Complete your visa work conditions
```

Avoid:

```txt
Unlock your future with our revolutionary AI-powered ecosystem
```

## Layout And Spacing

The UI should use generous spacing on marketing and onboarding pages, and tighter structured spacing in dashboards.

Rules:

- use whitespace to reduce anxiety
- keep pages visually calm
- avoid crowded hero sections
- avoid deeply nested cards
- use full-width sections or clean constrained layouts
- dashboards should be scannable and operational
- mobile layouts must be first-class

Recommended layout patterns:

- public pages: editorial sections with strong hero and real imagery
- candidate dashboard: focused command center
- employer dashboard: operational hiring workspace
- admin dashboard: dense but controlled data console
- onboarding: step-by-step guided flow
- AI tools: editor + preview + suggestion/sidebar layout

## Component Principles

Components should feel polished, useful, and consistent.

Use:

- 6-8px border radius for cards and panels
- thin neutral borders
- subtle shadows only for elevation
- clear active/focus states
- simple iconography
- stable dimensions for buttons, filters, cards, and status pills

Avoid:

- decorative bokeh/orbs
- excessive gradients
- heavy shadows
- nested cards inside cards
- oversized dashboard headings
- unclear icon-only actions without tooltips

## Buttons And Actions

Button hierarchy:

- Primary: green filled button
- Secondary: white/neutral button with border
- Tertiary: text button
- Destructive: red or neutral-danger styling

Primary buttons should be reserved for the main action on a screen.

Examples:

- Generate CV
- Apply Now
- Save Profile
- Submit Application
- Book Appointment
- Approve And Publish

Rules:

- never place too many primary buttons in one section
- icon buttons should use familiar icons
- destructive actions require confirmation
- button text should be action-specific

Avoid vague labels:

```txt
Submit
Continue
Click here
```

Prefer specific labels:

```txt
Submit Application
Continue To Review
Generate Tailored CV
```

## Cards And Surfaces

Cards should be used for repeated objects and genuinely framed tools.

Good card uses:

- job cards
- candidate cards
- application cards
- CV version cards
- university/scholarship cards in the unified platform
- pricing cards
- notification items

Avoid using cards for every page section.

Cards should include:

- clear title
- useful metadata
- one primary action
- secondary actions when needed
- status or badge where relevant

## Universal Opportunity Card Pattern

Every card that displays an apply-able opportunity, including jobs, universities and scholarships, should show enough decision information for the user to act quickly.

Opportunity cards should include:

- opportunity title
- provider, employer, host, funder, organizer, or institution
- country/region and mobility value
- deadline or intake/application window
- estimated application effort, such as `2 min apply`, `15 min apply`, or `1 hour prep`
- success score or fit score, such as `92% success score`, with responsible tooltip copy explaining it is an estimate, not a guarantee
- funding, salary, prize, stipend, travel, relocation, work-eligibility, or visa-support signals where relevant
- verification/trust status
- save action
- direct apply action when available
- add to AI Apply Agent board when the user's subscription allows it
- add to Apply For Me board when the user's subscription allows it

If the user's plan does not include AI Apply Agent or Apply For Me, the card should show a clear upgrade or locked-state affordance without blocking ordinary save/view actions.

Success score must never imply guaranteed admission, hiring, funding, visa approval, award selection, or migration outcome. It should be framed as a profile-and-readiness estimate based on eligibility, deadline, documents, fit, and historical/platform signals where available.

## Forms And Onboarding

Forms should feel guided, not administrative.

Rules:

- ask one conceptual group at a time
- use helper text to reduce uncertainty
- save progress automatically
- show why sensitive information is needed
- validate gently
- support mobile input properly
- avoid overwhelming users with long forms

Tone:

- supportive
- clear
- calm
- never blaming

Example:

```txt
This helps us show jobs that fit your study visa's working hours.
```

Not:

```txt
You must complete all visa fields.
```

## Dashboard UX

Dashboards should answer:

> Where am I now, what changed, and what should I do next?

Candidate dashboard should prioritize:

- profile completeness
- new strong job matches
- active applications
- recent employer messages
- CV/PersonalityAI CV status
- next best actions

Employer dashboard should prioritize:

- active jobs
- new applicants
- highest-fit candidates
- pipeline bottlenecks
- unread messages
- work eligibility questions (student hours, graduate visa sponsorship)

Admin dashboard should prioritize:

- queues
- alerts
- moderation tasks
- system health
- revenue/support indicators

Avoid decorative dashboard widgets with no action.

## AI Interaction UX

AI should feel like a professional assistant, not a magic trick.

AI output must be:

- reviewable
- editable
- traceable to user facts when possible
- clearly labeled
- never silently submitted
- honest about missing information

AI screens should include:

- generated draft
- source facts used
- confidence or readiness indicator
- edit controls
- regenerate controls
- final approval action

Truthfulness rule:

> AI can improve expression, structure, and relevance. It must not create fake qualifications, documents, achievements, or experiences.

Use AI disclaimers where needed, but keep them concise.

## Candidate Experience

Candidate UX should feel emotionally supportive and empowering.

Candidates often arrive tired, rejected, anxious, or overwhelmed. The UI should reduce cognitive load.

Candidate patterns:

- show next best action
- show progress
- show job fit clearly
- explain visa work rules and permit context calmly
- make AI suggestions actionable
- keep application history visible
- let users save drafts
- make Signia feel like a calm portfolio studio with projects, proof, media, and visibility controls

Avoid:

- shame-based completion prompts
- noisy job feeds
- unclear visa-hours or permit labels
- generic AI language
- turning Signia into a noisy social feed or unstructured link dump

## Employer Experience

Employer UX should feel quiet, efficient, and decision-focused.

Employers need to:

- post jobs quickly
- review candidates quickly
- understand fit
- understand work eligibility indicators
- communicate
- move candidates through pipeline

Employer pages should use:

- dense but clean tables/lists
- strong filters
- candidate summaries
- clear pipeline stages
- fast actions
- AI explanations
- Signia evidence cards that summarize projects, media, documents, social links, and proof-backed skills

Avoid marketing-style composition inside employer tools.

Employer Signia search should feel like a focused talent intelligence workspace: natural language query, structured filters, evidence-backed result cards, saved searches, shortlists, and clear privacy boundaries.

## Admin Experience

Admin UX should be more dense and operational than candidate UX.

Admin tools should prioritize:

- queues
- filters
- audit trails
- status changes
- review decisions
- role-based permissions
- safe destructive actions

Admin UI can be compact, but it must never be confusing.

Every admin action that affects users, billing, jobs, employers, documents, or moderation should be auditable.

## Trust And Verification UI

Trust is central to Scholastiar.ai.

Use trust indicators for:

- verified employers
- student jobs that fit study visa hours and post-study jobs with employer-confirmed visa sponsorship
- AI-reviewed applications
- completed profile sections
- verified partner agencies in the unified platform
- safe/approved listings
- secure document access

Badge styles should be restrained:

- green for verified/safe
- amber for needs review/uncertain
- red for risky/blocked
- gray for pending/unknown

Never make an unverified item look official.

## International Mobility UX

The platform must be globally aware.

Consider:

- countries and regions
- study visa work conditions, post-study permits and work visa sponsorship
- relocation preferences
- currency
- date formats
- phone formats
- language comfort
- regional CV norms
- mobile-first usage in many markets

Do not present visa guidance as legal advice unless licensed experts are involved.

Use language like:

```txt
Visa guidance
Work eligibility indicator
Work authorization requirement
```

Avoid:

```txt
Guaranteed visa
Legal immigration approval
```

## Mobile Rules

Mobile-first is mandatory.

PWA-first web behavior is part of the core web UI. Use `STRUCTURE/BUILD_GUIDE/PWA_FIRST_WEB_APP.md` for installability, mobile app shell, offline-aware states, browser push, and mobile web navigation.

Mobile UX rules:

- primary actions must remain easy to reach
- logged-in mobile web users should get app-like bottom navigation where appropriate
- forms should be split into short steps
- tables should become cards or structured lists
- filters should use drawers/sheets
- text must not overflow buttons/cards
- job/application cards must remain scannable
- recording/upload flows must work smoothly
- install prompts should appear only after meaningful engagement
- offline states should explain what cached content is available

Never assume desktop is the primary device.

## Accessibility

Minimum accessibility expectations:

- sufficient color contrast
- visible focus states
- keyboard navigability
- labels for form fields
- alt text for meaningful images
- readable font sizes
- no color-only status meaning
- error messages near fields
- buttons with clear names

Green status should include text or icon, not color alone.

## Light And Dark Mode

Adopted 2026-10-01. Every screen supports a light and a dark theme.

- Users choose Light, Dark or System from the theme toggle in every header. System (the default) follows the device setting and updates live when it changes.
- The choice is remembered per browser (`localStorage`) and applied before the first paint, so pages never flash the wrong theme. Phase B may also store it on the user profile.
- Build with theme-aware tokens only: `bg-background`, `bg-card`, `bg-soft`, `bg-soft-green`, `text-primary-text`, `text-secondary-text`, `text-green-dark`, `border`, status tokens. Never use `bg-white` or `text-brand-black` for page surfaces or body text.
- Constants that never change: Brand Black, Near Black, Scholastiar Green, Action Green (`primary`), Green Deep (solid green panels), Mint. Atmosphere dark surfaces stay dark in both themes.
- Dark palette: background `#0B0D0C`, cards `#131715`, soft `#101412`, soft green `#0E2419`, border `#262C29`, primary text `#ECEFED`, secondary text `#A1A9A4`, green text `#3DD27F`. Every text pairing meets WCAG AA.
- Green is still a signal, not a wall, in dark mode. Filled buttons stay Action Green with white text.
- Each screen must be checked in both themes before it is marked done.

## Atmosphere: Gradients, Glow And Grain

Adopted 2026-10-01 for public and marketing surfaces, inspired by `UI_DESIGN_INSPIRATION/landing_page.png` and translated into the Scholastiar palette. Fonts, spacing and colour tokens stay as defined above.

Principle: green is a light source, never a wall. Dark surfaces are Brand Black lit by green glows; light surfaces are soft neutrals with faint green blooms.

Building blocks (CSS utilities in `src/app/globals.css`):

- `aurora-dark`: page heroes and closing calls to action. Brand Black with a green glow rising from below.
- `aurora-dark-side`: dark showcase sections. A quieter glow from one side.
- `aurora-light`: page headers and highlight sections. Soft background with green blooms in opposite corners.
- `grain` / `grain-light`: subtle film grain over dark / light atmosphere surfaces.
- `beams`: diagonal light beams across a solid or dark panel.
- `text-gradient-mint` (on dark) and `text-gradient-green` (on light, large headings only): one emphasis phrase per page at most.
- Mint `#7EE2A8`: highlight tint of brand green, used only on dark surfaces (eyebrows, icons, badges).

Rules:

- Use at most one solid green panel per page (Green Dark `#087A3E` with `beams`), for the most important secondary audience call to action.
- On dark surfaces, cards become glass: `bg-white/5`, `border-white/10`. Content cards that must be read (opportunity cards) stay white.
- The featured pricing plan is a dark `aurora-dark` card; other plans stay white.
- On dark and solid green surfaces, use the `inverse` (white) and `outline-inverse` button variants; the primary green button stays the main action on dark heroes.
- Atmosphere is for public and marketing surfaces. Product dashboards, forms, editors and admin tools stay calm and flat.
- Glows are static. No animated orbs, bokeh or moving gradients.
- Text on atmosphere surfaces must still meet contrast rules: white or `white/70`+ on dark, mint and brand green allowed as text on Brand Black.

## Motion And Animation

Motion should be subtle and purposeful.

Use motion for:

- onboarding step transitions
- progress feedback
- AI generation loading
- panel open/close
- success confirmation

Avoid:

- constant background animation
- distracting hover effects
- slow page transitions
- decorative motion without function

Motion should make the interface feel responsive, not theatrical.

## Image And Media Direction

Use real, human, globally relevant imagery.

Images should show:

- students
- professionals
- employers
- offices
- travel/mobility context
- real collaboration
- document/application moments

Avoid:

- generic stock-photo smiles
- dark blurry hero images
- abstract AI robot imagery
- unrealistic futuristic visuals
- purely decorative illustrations when real context matters

For PersonalityAI CV and employer/candidate pages, media should be functional and inspectable.

## Empty States

Empty states should guide action.

Good examples:

```txt
No applications yet. Start with one of your strongest job matches.
```

```txt
Your document vault is empty. Upload a CV or certificate to reuse it in applications.
```

Empty states should include:

- short explanation
- primary action
- optional secondary action

## Loading States

Loading states should communicate progress.

For AI generation:

- show what the AI is doing
- avoid fake precision
- allow cancellation when possible

Examples:

```txt
Analyzing the job description
Matching your experience to role priorities
Drafting your tailored CV
```

## Error States

Error states should be calm and recoverable.

Good error messages:

- say what happened
- say what to do next
- avoid blaming the user

Example:

```txt
We could not upload this file. Try a PDF under 10MB or choose another document.
```

## Form Fields And Validation Errors

Decided 2026-10-01. Every form uses contained fields (`BoxField` in `src/components/forms/box-field.tsx`):

- The label sits inside the box, top-left, in small secondary text. It turns green while the field is focused.
- Focus: green border and a soft green ring on the box.
- Validation error: a small alert icon and a short message (9px, soft red `danger-text`: #ef5b5b light, #f6b8b8 dark) inside the box, top-right, on the label row (`FieldErrorText`). The label, border and input never turn red, and there is no red text under the field.
- Checkbox rows (e.g. accepting the terms) are boxes too: the error sits inside the box on the right ("Required").
- Keep field error messages short enough to fit on the label row ("Enter a valid email.", "Use at least 8 characters."). Longer guidance belongs in the hint below the box, which is hidden while an error shows.
- Option groups (radio tiles, checkboxes) have no box: show the same small icon and message under the group (`InlineError`).
- Form-level failures (wrong password, declined card) use `FormAlert`: a soft tinted panel with an icon, no border.
- Controls inside a box use `boxControl` classes and `boxControlProps(id, error)`, which links the error with `aria-describedby` and sets `aria-invalid`.

## Page Template Patterns

### Public Page Pattern

Use:

- clear hero
- real image or product signal
- primary CTA
- trust indicators
- concise sections
- strong footer

### Dashboard Pattern

Use:

- top summary row
- primary next action
- status cards
- recent activity
- contextual recommendations

### Editor Pattern

Use:

- main content area
- AI sidebar
- version/history controls
- review/approve action

### Detail Page Pattern

Use:

- title and key status
- metadata
- main content
- side panel for actions
- timeline/activity where relevant

## Component Naming Guidance

Use clear domain names:

```txt
JobCard
ApplicationTimeline
WorkEligibilityBadge
CandidateFitScore
AICVPreview
PersonalityCVPlayer
EmployerPipelineBoard
DocumentVaultItem
```

Avoid vague names:

```txt
BigCard
InfoBox
CoolSection
MagicPanel
```

## Do And Do Not

Do:

- keep layouts calm and premium
- make next actions obvious
- show trust and verification clearly
- make AI output editable
- use real user context
- design mobile first
- keep the active service focused and mobility-aware

Do not:

- create noisy dashboards
- overuse green
- use fake AI hype language
- hide important visa constraints
- make admin tools too decorative
- use cards inside cards
- submit AI-generated content without review
- imply visa/legal guarantees

## Implementation Notes

Recommended frontend stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Hook Form
- Zod
- Zustand
- TanStack Query

Design should remain consistent across:

- ordered opportunity services
- unified education, employment, funding, recognition, automation, and migration support
- admin tools
- provider/employer systems
- AI workflows

This file should be treated as the primary UI/UX reference before building any new Scholastiar.ai interface.
