Scholastiar.ai — Complete Screen & Page Architecture

PUBLIC / UNAUTHENTICATED PAGES
These are the pages visible to anyone before they log in or register.

HomePage.jsx — Landing page with hero, feature highlights, testimonials, pricing overview, and calls to action for both applicants and employers
AboutPage.jsx — Company story, mission, and team
HowItWorksPage.jsx — Step-by-step walkthrough of the platform for both user types
PricingPage.jsx — Subscription tiers for applicants and employers with feature comparison table
BlogPage.jsx — Articles on visa guides, job hunting tips, country-specific employment advice
BlogPostPage.jsx — Individual blog article view
ContactPage.jsx — Contact form and support details
PrivacyPolicyPage.jsx — Legal
TermsOfServicePage.jsx — Legal
FaqPage.jsx — Frequently asked questions for applicants and employers
ForEmployersPage.jsx — Dedicated landing page explaining the employer product and its value
JobBoardPage.jsx — Publicly browsable job listings (limited, teaser for non-logged-in users)
JobPublicDetailPage.jsx — Public view of a single job listing with a prompt to sign up to apply


AUTHENTICATION PAGES

RegisterApplicantPage.jsx — Applicant signup with role selection
RegisterEmployerPage.jsx — Employer/company signup
LoginPage.jsx — Unified login for both user types with role detection
ForgotPasswordPage.jsx — Password reset request
ResetPasswordPage.jsx — Password reset form via email token
VerifyEmailPage.jsx — Email verification confirmation screen
OnboardingTypePage.jsx — Post-registration screen asking the user whether they are an applicant or employer, in case they arrive via the generic signup path


APPLICANT ONBOARDING FLOW
This is a multi-step wizard that runs once after registration. Each step is a distinct screen within a single flow component, but they are substantial enough to be treated as individual pages.

Onboarding/PersonalInfoStep.jsx — Full name, nationality, date of birth, current location, phone, languages
Onboarding/VisaStatusStep.jsx — Current visa status, passport nationality, countries lived or worked in, willingness to relocate, target countries
Onboarding/EducationStep.jsx — Educational history, institutions, qualifications, graduation years, grades
Onboarding/WorkExperienceStep.jsx — Job history with guided prompts for responsibilities and achievements per role
Onboarding/SkillsStep.jsx — Technical skills, soft skills, tools, certifications, and proficiency levels
Onboarding/PreferencesStep.jsx — Job type preferences, industries, seniority level, salary expectations, remote vs on-site preference
Onboarding/PersonalityAICVStep.jsx — Guided PersonalityAI CV creation: prompt display, recording interface or text input for avatar generation
Onboarding/ReviewStep.jsx — Full profile review before finalising onboarding
Onboarding/CompletePage.jsx — Onboarding complete confirmation with next steps


APPLICANT DASHBOARD SCREENS

ApplicantDashboard.jsx — Main applicant dashboard (detailed below in dashboard section)
JobFeedPage.jsx — Full personalised job discovery feed with filters, search, and match scores
JobDetailPage.jsx — Full detail view of a single job listing with AI match analysis, apply button, and visa sponsorship breakdown
ApplyPage.jsx — The application flow: AI-generated CV preview, AI-answered screening questions, cover letter, PersonalityAI CV attachment toggle, review and submit
CVGeneratorPage.jsx — Standalone CV generator where user can paste any job description and instantly generate a tailored CV
CVPreviewPage.jsx — Full-screen formatted preview of a generated CV with download and edit options
CVEditorPage.jsx — Manual editor for a generated CV with AI suggestion sidebar
CVHistoryPage.jsx — Archive of all CVs previously generated, with the job they were generated for
ApplicationsPage.jsx — Full list of all submitted applications with status, date, and quick actions
ApplicationDetailPage.jsx — Single application detail: job summary, submitted CV, submitted answers, employer communications, status timeline
MessagesPage.jsx — Inbox for all employer communications
MessageThreadPage.jsx — Individual conversation thread with a specific employer
PersonalityAICVPage.jsx — View, re-record, or regenerate the user's PersonalityAI CV
ProfilePage.jsx — View and edit the full applicant profile
ProfileEditPage.jsx — Dedicated editing interface for each profile section
SavedJobsPage.jsx — Bookmarked job listings the user has saved for later
ApplicationInsightsPage.jsx — Performance analytics: response rates, match score trends, improvement suggestions
NotificationsPage.jsx — All platform notifications in one place
SubscriptionPage.jsx — Current plan, upgrade options, billing history
SettingsPage.jsx — Account settings: email, password, notification preferences, privacy controls, account deletion


EMPLOYER ONBOARDING FLOW

EmployerOnboarding/CompanyInfoStep.jsx — Company name, registration country, industry, company size, website, logo upload
EmployerOnboarding/HiringInfoStep.jsx — Types of roles typically hired for, typical seniority levels, visa sponsorship capability and countries
EmployerOnboarding/TeamStep.jsx — Invite other team members to the employer account with role assignments
EmployerOnboarding/CompletePage.jsx — Onboarding confirmation and prompt to post first job


EMPLOYER DASHBOARD SCREENS

EmployerDashboard.jsx — Main employer dashboard (detailed below)
JobListingsPage.jsx — All active, paused, and closed job listings with status and applicant counts
CreateJobPage.jsx — Full job listing creation form with AI-assisted description writing, screening question builder, visa sponsorship toggle, and preview
EditJobPage.jsx — Edit an existing job listing
JobApplicantsPage.jsx — All applicants for a specific job, ranked by AI match score, with filters and pipeline columns
CandidateProfilePage.jsx — Full view of a single candidate: written CV, PersonalityAI CV, profile summary, AI compatibility report, and communication tools
PipelinePage.jsx — Kanban-style hiring pipeline across all active jobs: Applied, Reviewed, Shortlisted, Interviewed, Offered, Rejected
EmployerMessagesPage.jsx — Inbox for all candidate communications
EmployerMessageThreadPage.jsx — Individual conversation with a specific candidate
ScreeningQuestionsPage.jsx — Library of saved screening question sets the employer can reuse across job postings
EmployerAnalyticsPage.jsx — Hiring funnel analytics: applications received, response rates, time-to-hire, candidate source breakdown
EmployerSettingsPage.jsx — Company profile, billing, team member management, notification preferences
EmployerSubscriptionPage.jsx — Current employer plan, upgrade options, invoice history
VisaComplexityPage.jsx — Reference tool showing visa complexity ratings for applicants by nationality and target country


SHARED / UTILITY SCREENS

SearchResultsPage.jsx — Global search results across jobs, companies, and blog content
NotFoundPage.jsx — 404 error page
ServerErrorPage.jsx — 500 error page
MaintenancePage.jsx — Maintenance mode screen
UnauthorisedPage.jsx — 403 page for authenticated users attempting to access restricted areas


ADMIN PANEL SCREENS

AdminDashboard.jsx — Platform-wide overview for Scholastiar.ai internal team
AdminUsersPage.jsx — All registered users (applicants and employers) with management tools
AdminJobsPage.jsx — All job listings with moderation controls
AdminReportsPage.jsx — Reported listings or users awaiting review
AdminSubscriptionsPage.jsx — Revenue overview, active subscriptions, churn data
AdminBlogPage.jsx — Blog post creation and management
AdminSettingsPage.jsx — Platform configuration settings


TOTAL PAGE COUNT: 79 screens

DASHBOARDS — DETAILED BREAKDOWN
There are four distinct dashboards in this platform, each serving a fundamentally different user with a different set of priorities.

Dashboard 1 — Applicant Main Dashboard ApplicantDashboard.jsx
This is the first screen an applicant sees after logging in. Its job is to give them a complete picture of where they stand and what to do next, without requiring them to navigate anywhere else to get oriented.
It contains a profile completion indicator showing the percentage of their profile filled and which sections are still incomplete, with a direct link to fill each gap. It shows a count of new job matches since their last visit — roles the AI has identified as strong fits based on their profile — displayed as cards they can immediately browse or save. It surfaces their three most recent applications with current status badges so they can see at a glance whether employers have viewed their submissions. It includes a PersonalityAI CV status block — either a prompt to create it if they have not yet, or a preview thumbnail with a view count showing how many employers have watched it. It shows a quick-action bar for the most common tasks: generate a CV, browse jobs, view messages, update profile. And it displays an insights alert if the AI has detected a pattern worth the user's attention, such as a low response rate or a profile section that is consistently weak relative to the roles they are targeting.

Dashboard 2 — Employer Main Dashboard EmployerDashboard.jsx
The employer dashboard is command-centre focused. It shows the total number of active job listings, the number of new applicants received in the last seven days, the number of candidates currently awaiting a response at each pipeline stage, and a running count of interviews scheduled. It surfaces the top three highest-scoring candidates across all active roles as highlighted cards, with a one-click path to their full profile. It includes a hiring pipeline summary — a compact view of how many candidates are in each stage across all jobs — so the hiring manager can see where bottlenecks are forming. It shows recent messages from candidates with unread counts. It also displays a visa complexity alert if any active listings have attracted a high volume of applicants whose visa situations require more complex sponsorship paths, flagging this early so the employer is not surprised later in the process.

Dashboard 3 — Application Intelligence Dashboard ApplicationInsightsPage.jsx
This is a dedicated analytics dashboard for applicants on the premium plan. It is separate from the main dashboard because its purpose is retrospective and strategic rather than operational.
It shows the user's application history as a timeline, with response rate calculated across all applications and broken down by country, industry, job type, and seniority level. It identifies which combinations are generating the most interest and which are generating silence. It shows average AI match scores for roles the user has applied to, highlighting whether they are consistently applying to roles where they are a strong match or stretching beyond their current profile. It surfaces specific AI recommendations — not generic tips, but observations derived from the user's own data, such as "your applications to senior product roles in Germany have a 0% response rate; your profile lacks the German-language proficiency typically required at this level" or "roles requesting React Native experience have your highest response rate; consider targeting more of these." It tracks how the user's profile strength has changed over time as they add skills and experience.

Dashboard 4 — Employer Analytics Dashboard EmployerAnalyticsPage.jsx
This is the employer's equivalent of the intelligence dashboard. It gives hiring managers and HR teams a data-driven view of their recruitment performance.
It shows the full hiring funnel for each active and recently closed job: how many total applicants, how many were reviewed, shortlisted, interviewed, and offered. It calculates time-to-hire for completed roles and flags if current open roles are taking longer than average. It breaks down where applicants are coming from — direct platform discovery, organic search, PersonalityAI CV browse, employer profile page. It shows the geographic distribution of applicants for roles offering visa sponsorship, and highlights which nationalities are applying most frequently, useful for employers who want to understand the international talent pool they are reaching. It tracks candidate drop-off points — where in the application process applicants abandon — so the employer can identify if their screening questions are too long or their job descriptions are deterring qualified candidates.

Summary Table
#DashboardUserLocation1Applicant Main DashboardJob seekerPost-login home2Employer Main DashboardHiring managerPost-login home3Application Intelligence DashboardPremium applicantInsights section4Employer Analytics DashboardEmployer (paid tier)Analytics section

Grand Total: 79 pages across 4 dashboards. Of those 79, approximately 49 belong to the applicant experience, 18 to the employer experience, 7 to the admin panel, and 5 are shared utility screens. The onboarding flows alone account for 13 screens split across both user types, which signals how much of the platform's value is front-loaded into the quality of the data it collects before any job search or hiring even begins.