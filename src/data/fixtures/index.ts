import "server-only";

import type {
  AuthAccount,
  AiGeneration,
  AuthToken,
  BoardItem,
  ContactMessage,
  CryptoPayment,
  DeliveryLog,
  InAppNotification,
  NewsletterSubscription,
  NotificationPreference,
  PaymentAttempt,
  SavedOpportunity,
  WhatsAppConsent,
} from "@/data/types";
import { hashPassword } from "@/lib/password";

import { paymentAttemptFixtures, planComparisonFixtures, planFixtures, subscriptionFixtures } from "./billing";
import {
  candidateProfileFixtures,
  careerPreferenceFixtures,
  certificationFixtures,
  documentFixtures,
  educationFixtures,
  onboardingSessionFixtures,
  postStudyPermitTypeFixtures,
  skillFixtures,
  visaProfileFixtures,
  workExperienceFixtures,
} from "./candidate";
import {
  applicationRouteFixtures,
  intakeFixtures,
  programFixtures,
  requirementFixtures,
  scholarshipFixtures,
  scholarshipLinkFixtures,
  universityFixtures,
} from "./catalogue";
import { articleFixtures, faqFixtures, testimonialFixtures } from "./content";
import { cvVersionFixtures } from "./cv";
import { notificationFixtures } from "./notifications";
import { threadFixtures, threadMessageFixtures } from "./threads";
import { personalityProfileFixtures, personalityVideoFixtures, personalityViewFixtures } from "./personality";
import { userProfileFixtures, userRoleFixtures } from "./identity";
import { signiaMediaFixtures, signiaProfileFixtures, signiaProjectFixtures, signiaSocialFixtures } from "./signia";
import {
  employerCompanyFixtures,
  employerMembershipFixtures,
  providerMembershipFixtures,
  providerOrganizationFixtures,
} from "./organizations";
import { countryFixtures } from "./reference";

/** Every demo persona signs in with this password (shown on the sign-in page in mock mode). */
export const DEMO_PASSWORD = "demo1234";

/**
 * The full mock database, keyed by db.md table name. Each UI stage adds the
 * collections its screens need. New collections are merged into an existing
 * local store automatically; changed fixtures need "Reset demo data".
 */
export function createSeed() {
  const demoHash = hashPassword(DEMO_PASSWORD);
  const authAccounts: AuthAccount[] = userProfileFixtures.map((profile) => ({
    user_id: profile.user_id,
    email: profile.email,
    password_hash: demoHash,
    email_verified_at: profile.created_at,
    created_at: profile.created_at,
  }));

  // Deep copy so mutations in the mock store never alter the fixtures themselves.
  return structuredClone({
    auth_accounts: authAccounts,
    auth_tokens: [] as AuthToken[],
    user_profiles: userProfileFixtures,
    user_roles: userRoleFixtures,
    countries: countryFixtures,
    employer_companies: employerCompanyFixtures,
    employer_memberships: employerMembershipFixtures,
    provider_organizations: providerOrganizationFixtures,
    provider_memberships: providerMembershipFixtures,
    plans: planFixtures,
    plan_comparison_rows: planComparisonFixtures,
    subscriptions: subscriptionFixtures,
    payment_attempts: paymentAttemptFixtures as PaymentAttempt[],
    crypto_payments: [] as CryptoPayment[],
    articles: articleFixtures,
    faq_items: faqFixtures,
    testimonials: testimonialFixtures,
    newsletter_subscriptions: [] as NewsletterSubscription[],
    contact_messages: [] as ContactMessage[],
    // U3 Candidate core
    post_study_permit_types: postStudyPermitTypeFixtures,
    candidate_profiles: candidateProfileFixtures,
    candidate_onboarding_sessions: onboardingSessionFixtures,
    candidate_visa_profiles: visaProfileFixtures,
    education_records: educationFixtures,
    work_experiences: workExperienceFixtures,
    candidate_skills: skillFixtures,
    certifications: certificationFixtures,
    career_preferences: careerPreferenceFixtures,
    documents: documentFixtures,
    notification_preferences: [] as NotificationPreference[],
    // Messages: every event sends email + WhatsApp (opted-in) + in-app
    whatsapp_consents: [
      {
        id: "wa-user-amara",
        user_id: "user-amara",
        phone_e164: "+2348015550142",
        opted_in: true,
        opted_in_at: "2026-09-01T09:00:00.000Z",
        opted_out_at: null,
        source: "sign_up",
        updated_at: "2026-09-01T09:00:00.000Z",
      },
    ] as WhatsAppConsent[],
    notifications: notificationFixtures as InAppNotification[],
    notification_delivery_logs: [] as DeliveryLog[],
    // U4 Shared opportunity system — study catalogue, saves and boards
    universities: universityFixtures,
    university_programs: programFixtures,
    program_intakes: intakeFixtures,
    program_requirements: requirementFixtures,
    scholarships: scholarshipFixtures,
    scholarship_links: scholarshipLinkFixtures,
    application_routes: applicationRouteFixtures,
    saved_opportunities: [
      {
        id: "saved-amara-public-health",
        user_id: "user-amara",
        opportunity_type: "program",
        opportunity_id: "prog-volga-public-health",
        status: "saved",
        created_at: "2026-10-01T09:00:00.000Z",
      },
    ] as SavedOpportunity[],
    board_items: [] as BoardItem[],
    // U5 Candidate tools
    cv_versions: cvVersionFixtures,
    personality_cv_profiles: personalityProfileFixtures,
    personality_cv_videos: personalityVideoFixtures,
    personality_cv_views: personalityViewFixtures,
    signia_profiles: signiaProfileFixtures,
    signia_projects: signiaProjectFixtures,
    signia_media: signiaMediaFixtures,
    signia_social_links: signiaSocialFixtures,
    message_threads: threadFixtures,
    thread_messages: threadMessageFixtures,
    ai_generations: [] as AiGeneration[],
  });
}

export type MockDb = ReturnType<typeof createSeed>;
