# Onboarding Pages

Status: Unified Platform Service

Source service spec: `SERVICES/91-onboarding-intelligence.md`

## Page System Vision

Onboarding is the intelligence engine of the unified platform.

It should feel like a guided career interview, not an administrative form. The goal is to build a reusable employment profile that powers job matching, AI CV generation, AI application answers, PersonalityAI CV, and employer ranking.

## Candidate Pages

### Candidate Onboarding Start Page

Route: `/onboarding`

Purpose: Introduce the intelligent onboarding flow and explain what will be collected.

Primary actions:

- start onboarding
- continue existing onboarding

### Personal Info Step

Route: `/onboarding/personal`

Purpose: Collect identity, location, nationality, contact, and language information.

Inputs:

- full name
- nationality
- date of birth
- current location
- phone
- languages
- preferred communication style

### Visa Status Step

Route: `/onboarding/visa`

Purpose: Understand international mobility and sponsorship needs.

Inputs:

- passport nationality
- current visa status
- countries lived/worked in
- target countries
- relocation willingness
- sponsorship needs
- work authorization notes

### Education Step

Route: `/onboarding/education`

Purpose: Collect structured education history.

Inputs:

- institutions
- qualifications
- fields of study
- graduation dates
- grades/classification
- certifications

### Work Experience Step

Route: `/onboarding/experience`

Purpose: Collect job history with AI-guided achievement prompts.

Inputs:

- company
- role
- dates
- responsibilities
- measurable achievements
- tools used
- industry context

### Skills Step

Route: `/onboarding/skills`

Purpose: Capture technical skills, soft skills, tools, certifications, and proficiency.

Primary actions:

- add skill
- rate proficiency
- import from CV later

### Preferences Step

Route: `/onboarding/preferences`

Purpose: Learn job goals and work preferences.

Inputs:

- target roles
- industries
- seniority
- salary expectations
- work mode
- location preferences
- visa/relocation preferences

### PersonalityAI CV Step

Route: `/onboarding/personality-cv`

Purpose: Introduce and optionally create the user's PersonalityAI CV.

Primary actions:

- record video
- answer guided prompts
- skip for later

### Review Step

Route: `/onboarding/review`

Purpose: Let the user review the full profile before completion.

Primary actions:

- edit section
- complete onboarding

### Onboarding Complete Page

Route: `/onboarding/complete`

Purpose: Confirm onboarding completion and route to dashboard.

Primary actions:

- go to dashboard
- browse jobs
- generate CV

## Employer Pages

### Employer Onboarding Start Page

Route: `/employers/onboarding`

Purpose: Start employer setup.

### Company Info Step

Route: `/employers/onboarding/company`

Purpose: Collect company identity and public profile basics.

Inputs:

- company name
- registration country
- industry
- size
- website
- logo

### Hiring Info Step

Route: `/employers/onboarding/hiring`

Purpose: Understand hiring needs and sponsorship capability.

Inputs:

- roles hired for
- seniority levels
- visa sponsorship capability
- sponsorship countries
- remote/relocation policy

### Team Step

Route: `/employers/onboarding/team`

Purpose: Invite hiring team members and assign roles.

### Employer Onboarding Complete Page

Route: `/employers/onboarding/complete`

Purpose: Route employer to dashboard or first job post.

## Suggested MVP Page Set

- `/onboarding`
- `/onboarding/personal`
- `/onboarding/visa`
- `/onboarding/education`
- `/onboarding/experience`
- `/onboarding/skills`
- `/onboarding/preferences`
- `/onboarding/personality-cv`
- `/onboarding/review`
- `/onboarding/complete`
- `/employers/onboarding`
- `/employers/onboarding/company`
- `/employers/onboarding/hiring`
- `/employers/onboarding/team`
- `/employers/onboarding/complete`

## Page Priority

### MVP Priority

- Candidate Onboarding Start Page
- Personal Info Step
- Visa Status Step
- Education Step
- Work Experience Step
- Skills Step
- Preferences Step
- Review Step
- Employer Company Info Step
- Employer Hiring Info Step

### Phase 2 Priority

- PersonalityAI CV Step
- Employer Team Step
- Onboarding Intelligence Review/Insights Page
