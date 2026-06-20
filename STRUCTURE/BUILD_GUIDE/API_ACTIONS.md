# API Actions

Status: Server action and route handler plan

## Principles

- Validate input with Zod.
- Authenticate before action.
- Authorize ownership before mutation.
- Keep actions focused.
- Return predictable response shapes.
- Use server-side AI calls only.
- Parse request input before business logic.
- Never trust client-provided ownership fields.
- Use database transactions for multi-step mutations.
- Return typed errors that the UI can display calmly.
- Log security-relevant failures without leaking secrets.
- Keep large generated artifacts in storage when appropriate; keep metadata in the database.

## Response Shape

Recommended response shape:

```txt
{
  ok: boolean
  data?: unknown
  error?: {
    code: string
    message: string
    fieldErrors?: Record<string, string[]>
  }
}
```

## Authorization Checklist

Before mutation:

- user is authenticated
- user has correct role
- user owns the record or belongs to the employer company
- target record is in a mutable state
- action is allowed by the current plan/usage limits if relevant

## Auth/Profile Actions

- createCandidateProfile
- createEmployerCompany
- updateOnboardingStep
- completeOnboarding
- updateCandidateProfile
- updateVisaProfile
- uploadCandidateDocument

## Job Actions

- createJob
- updateJob
- publishJob
- pauseJob
- closeJob
- saveJob
- unsaveJob
- calculateJobMatch

## Opportunity Card Actions

These actions should eventually support all apply-able opportunity categories: jobs, universities, scholarships, fellowships, grants, competitions, conferences/training, and awards.

- calculateOpportunitySuccessScore
- calculateOpportunityApplicationEffort
- saveOpportunity
- unsaveOpportunity
- addOpportunityToAIApplyBoard
- removeOpportunityFromAIApplyBoard
- addOpportunityToApplyForMeBoard
- removeOpportunityFromApplyForMeBoard
- checkOpportunityBoardEligibility

Board actions must enforce subscription access, usage limits, user consent requirements, and document access boundaries server-side.

## AI Actions

- chooseAIProvider
- executeAIRequestWithFallback
- recordAIProviderAttempt
- recordAIProviderFailure
- generateCV
- regenerateCVSection
- generateCoverLetter
- answerScreeningQuestion
- reviewApplicationPackage
- rankCandidateForJob
- summarizeCandidateForEmployer
- generateSigniaProfileSummary
- generateSigniaProjectSummary
- extractSigniaSkillEvidence
- searchSigniaProfiles

AI actions must use the server-side provider abstraction. DeepSeek is primary; Anthropic Claude and OpenAI are fallback providers when DeepSeek is unavailable, rate-limited, restricted, or blocked for a valid workflow. Fallback attempts must preserve the same output schema and safety rules.

## Application Actions

- createApplicationDraft
- updateApplicationAnswer
- attachCVToApplication
- submitApplication
- updateApplicationStatus
- withdrawApplication

## Employer Actions

- inviteEmployerMember
- updateEmployerMemberRole
- createScreeningQuestionSet
- moveApplicantStage
- addEmployerNote
- saveSigniaSearch
- shortlistSigniaCandidate
- recordSigniaProfileView

## Signia Actions

- createSigniaProfile
- updateSigniaProfile
- publishSigniaProfile
- unpublishSigniaProfile
- updateSigniaVisibility
- createSigniaProject
- updateSigniaProject
- deleteSigniaProject
- addSigniaSocialLink
- updateSigniaSocialLink
- deleteSigniaSocialLink
- attachSigniaMediaItem
- attachSigniaDocument
- linkSigniaSkillEvidence
- reorderSigniaSections

Signia actions must enforce candidate ownership, per-section visibility, employer access boundaries, storage limits, and consent before content becomes public or searchable.

## Messaging Actions

- createMessageThread
- sendMessage
- sendInterviewInvitation
- markThreadRead

## Notification And Email Actions

- createNotification
- markNotificationRead
- updateNotificationPreferences
- sendTransactionalEmail
- generateOpportunityDigest
- sendOpportunityDigest
- sendDeadlineReminder
- sendReadinessScoreEmail
- sendSaveRecommendationEmail
- sendApplyRecommendationEmail
- sendAIApplyAgentEmail
- sendApplyForMeEmail
- sendConversionEmail
- recordEmailDeliveryEvent
- recordEmailEngagementEvent
- suppressEmailForUser

## Billing/Admin Actions

- createCheckoutSession
- createProviderCheckoutSession
- choosePaymentProvider
- retryCheckoutWithFallbackProvider
- getAvailablePlans
- getUserEntitlements
- consumeUsageCredit
- createApplyForMeCampaignPurchase
- handleBillingWebhook
- handleStripeWebhook
- handlePaystackWebhook
- handleFlutterwaveWebhook
- createModerationReport
- resolveModerationReport
- suspendUser
- verifyEmployer

Payment actions must prevent duplicate charges by creating idempotent checkout/payment intents and storing provider attempts before redirecting or authorizing payment.
