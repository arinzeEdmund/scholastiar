import { ArrowRight, FileText, Plane, SlidersHorizontal, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AboutForm } from "@/components/candidate/forms/about-form";
import { aboutDefaults, personalDefaults } from "@/components/candidate/forms/defaults";
import { EducationEditor, ExperienceEditor } from "@/components/candidate/forms/history-editors";
import { PersonalForm } from "@/components/candidate/forms/personal-form";
import { EditorSection, SubPageHeader } from "@/components/candidate/sub-page-header";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";

export const metadata: Metadata = { title: "Edit profile" };

const NAV = [
  { href: "#personal", label: "Personal details" },
  { href: "#about", label: "Headline and summary" },
  { href: "#education", label: "Education" },
  { href: "#experience", label: "Experience" },
  { href: "#more", label: "Skills, visa and more" },
];

const MORE = [
  {
    href: "/profile/skills",
    label: "Skills and certifications",
    text: "What you're good at, and how well",
    icon: Sparkles,
  },
  { href: "/profile/visa", label: "Visa and mobility", text: "Study status, work conditions, permits", icon: Plane },
  {
    href: "/profile/preferences",
    label: "Goals and preferences",
    text: "Roles, countries, pay and hours",
    icon: SlidersHorizontal,
  },
  { href: "/profile/documents", label: "Documents", text: "CVs, transcripts and certificates", icon: FileText },
];

export default async function EditProfilePage() {
  const { user } = await requireCandidate();
  const [profile, education, experience, countries, consent] = await Promise.all([
    repos.candidate.getProfile(user.user_id),
    repos.candidate.listEducation(user.user_id),
    repos.candidate.listExperience(user.user_id),
    repos.reference.listCountries(),
    repos.messages.getWhatsAppConsent(user.user_id),
  ]);

  return (
    <div className="space-y-6">
      <SubPageHeader
        backHref="/profile"
        backLabel="Profile"
        title="Edit profile"
        description="Each section saves on its own. Everything here feeds your CV and applications."
      />
      <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav aria-label="Profile sections" className="hidden lg:block">
          <ul className="sticky top-24 space-y-0.5 border-l">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm text-secondary-text transition-colors hover:border-green hover:text-primary-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 space-y-5">
          <EditorSection
            id="personal"
            title="Personal details"
            description="Who you are and how applications should sound."
          >
            <PersonalForm
              mode="profile"
              stickyFooter={false}
              defaults={personalDefaults(user, profile, consent)}
              countries={countries}
            />
          </EditorSection>
          <EditorSection
            id="about"
            title="Headline and summary"
            description="Your one-line pitch, a short summary and your links."
          >
            <AboutForm stickyFooter={false} defaults={aboutDefaults(profile)} />
          </EditorSection>
          <EditorSection id="education" title="Education">
            <EducationEditor records={education} countries={countries} />
          </EditorSection>
          <EditorSection
            id="experience"
            title="Experience"
            description="Open an entry to edit it with the achievement coach."
          >
            <ExperienceEditor records={experience} countries={countries} detailLinks />
          </EditorSection>
          <section id="more" aria-label="More profile sections" className="scroll-mt-24">
            <ul className="grid gap-3 sm:grid-cols-2">
              {MORE.map(({ href, label, text, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-green/50 hover:shadow-lg hover:shadow-black/5 dark:bg-white/[0.03]"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-soft-green text-green-dark dark:bg-green/10">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-primary-text">{label}</span>
                      <span className="block truncate text-xs text-secondary-text">{text}</span>
                    </span>
                    <ArrowRight
                      className="size-4 text-subtle-text transition-transform group-hover:translate-x-0.5 group-hover:text-green-dark"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
