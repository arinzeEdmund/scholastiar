import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Check,
  Compass,
  GraduationCap,
  HeartHandshake,
  Home,
  Landmark,
  Plane,
  Scale,
  ShieldCheck,
  X,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { RouteButton } from "@/components/layout/route-button";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarketingSection } from "@/components/marketing/section";
import { isRouteReady } from "@/config/routes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "Why Scholastiar.ai exists: to take the repetition and guesswork out of building a life abroad.",
};

const WITHOUT = [
  "Rewrite your CV and answers for every single application",
  "Piece together visa, cost and arrival steps for a new country on your own",
  "Track deadlines and documents across spreadsheets and inboxes",
  "Apply alone, with little idea why applications fail",
];

const WITH = [
  "Explain yourself once — every application is prepared from one profile",
  "Visa, cost and arrival steps for your destination, in one plan",
  "Deadline reminders and readiness checks for every opportunity",
  "Apply yourself, with AI Apply Agent, or with a verified person",
];

const JOURNEY = [
  {
    icon: GraduationCap,
    title: "Choose where to study",
    text: "Universities and programmes abroad, with student visa guidance.",
  },
  { icon: Award, title: "Fund it", text: "Scholarships matched to your eligibility." },
  {
    icon: Plane,
    title: "Prepare to move",
    text: "Pre-arrival steps, costs, travel and housing for your destination.",
  },
  {
    icon: Briefcase,
    title: "Get connected to work",
    text: "On Pro, job openings that fit your visa. A connection, not a promise.",
  },
  { icon: Home, title: "Settle in", text: "Verified migration agencies for document checks and visa guidance." },
];

const PRINCIPLES = [
  {
    icon: Compass,
    title: "Every opportunity is a path",
    body: "A university programme or scholarship is a route to a new country. We show the visa, funding and relocation details that decide whether it can work for you.",
  },
  {
    icon: HeartHandshake,
    title: "Explain yourself once",
    body: "Your profile keeps learning from every application, so you never fill in the same details twice.",
  },
  {
    icon: Scale,
    title: "Honest by default",
    body: "No guaranteed visas or admissions. AI improves how your real experience is presented; it never invents it.",
  },
  {
    icon: ShieldCheck,
    title: "Trust is earned",
    body: "Organisations are verified, your documents are private by default, and nothing is submitted without your consent.",
  },
];

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: "Students and graduates",
    text: "Study, fund, work and stay — with one profile.",
    href: "/how-it-works",
  },
  {
    icon: Building2,
    title: "Employers",
    text: "Hire international students and sponsor graduates.",
    href: "/for-employers",
  },
  {
    icon: Landmark,
    title: "Universities and funders",
    text: "Receive complete, prepared applications.",
    href: "/contact?topic=partnerships",
  },
  {
    icon: Home,
    title: "Migration agencies",
    text: "Offer verified support to people moving abroad.",
    href: "/migration-agencies",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="grain overflow-hidden aurora-dark text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-semibold text-mint">About Scholastiar.ai</p>
          <h1 className="mt-4 max-w-4xl text-4xl leading-tight font-bold text-balance sm:text-6xl">
            Building a life abroad shouldn&apos;t feel like <span className="text-gradient-mint">a second job.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            International students face visa uncertainty, unfamiliar CV norms and the same forms again and again — often
            with little response. Scholastiar.ai exists to remove that repetition and guesswork, from the first
            application to settling into a new country.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <RouteButton href="/how-it-works" size="lg">
              See how it works
              <ArrowRight aria-hidden />
            </RouteButton>
            <RouteButton href="/contact" size="lg" variant="outline-inverse">
              Talk to us
            </RouteButton>
          </div>
        </div>
      </section>

      <MarketingSection eyebrow="Why we exist" title="The difference one profile makes">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border bg-soft p-6 sm:p-8">
            <p className="text-sm font-semibold text-secondary-text">Applying abroad on your own</p>
            <ul className="mt-5 space-y-3">
              {WITHOUT.map((item) => (
                <li key={item} className="flex gap-3 text-secondary-text">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-soft">
                    <X className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-green/40 bg-card p-6 shadow-lg shadow-black/5 sm:p-8 dark:shadow-black/40">
            <p className="text-sm font-semibold text-green-dark">With Scholastiar.ai</p>
            <ul className="mt-5 space-y-3">
              {WITH.map((item) => (
                <li key={item} className="flex gap-3 text-primary-text">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection
        tone="aurora"
        eyebrow="One platform"
        title="Built for the whole journey"
        description="Most tools help with one step. Scholastiar.ai follows you from choosing a programme to staying and working after you graduate."
      >
        <ol className="relative grid gap-6 lg:grid-cols-5 lg:gap-4">
          {/* Connecting line behind the step markers */}
          <div
            aria-hidden
            className="absolute top-5 bottom-5 left-5 w-px bg-gradient-to-b from-green/60 via-green/30 to-green/60 lg:right-[10%] lg:bottom-auto lg:left-[10%] lg:h-px lg:w-auto lg:bg-gradient-to-r"
          />
          {JOURNEY.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
              <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-4 border-soft bg-green-action text-white shadow-md">
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="rounded-xl border bg-card p-4 lg:w-full">
                <p className="text-xs font-semibold text-green-dark">Step {index + 1}</p>
                <p className="mt-1 font-semibold text-primary-text">{title}</p>
                <p className="mt-1 text-sm text-secondary-text">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </MarketingSection>

      <MarketingSection tone="dark" eyebrow="What we believe" title="The principles behind every feature">
        <ul className="grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map(({ icon: Icon, title, body }, index) => (
            <li key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-7">
              <div className="flex items-center justify-between">
                <Icon className="size-6 text-mint" aria-hidden />
                <span className="text-sm font-semibold text-white/40 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-white/70">{body}</p>
            </li>
          ))}
        </ul>
      </MarketingSection>

      <MarketingSection eyebrow="Who we serve" title="One platform, four sides">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map(({ icon: Icon, title, text, href }) => {
            const ready = isRouteReady(href);
            const body = (
              <>
                <span className="flex size-10 items-center justify-center rounded-lg bg-soft-green text-green-dark">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="mt-4 flex items-center justify-between gap-2 font-semibold text-primary-text">
                  {title}
                  {ready ? (
                    <ArrowRight
                      className="size-4 text-subtle-text transition-transform group-hover:translate-x-0.5 group-hover:text-green-dark"
                      aria-hidden
                    />
                  ) : (
                    <span className="rounded-full bg-neutral-soft px-1.5 py-px text-[0.625rem] font-semibold tracking-wide text-secondary-text uppercase">
                      Soon
                    </span>
                  )}
                </span>
                <span className="mt-1 text-sm text-secondary-text">{text}</span>
              </>
            );
            const className = cn(
              "group flex h-full flex-col rounded-xl border bg-card p-5 transition-all",
              ready && "hover:-translate-y-0.5 hover:border-green/60 hover:shadow-lg hover:shadow-black/5",
            );
            return (
              <li key={title}>
                {ready ? (
                  <Link href={href} className={className}>
                    {body}
                  </Link>
                ) : (
                  <div className={className}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </MarketingSection>

      <CtaBand
        title="Questions about Scholastiar.ai?"
        description="Partnerships, press or anything else — our team reads every message."
        actions={
          <>
            <RouteButton href="/contact" size="lg">
              Contact us
            </RouteButton>
            <RouteButton href="/faq" size="lg" variant="outline-inverse">
              Help centre
            </RouteButton>
          </>
        }
      />
    </>
  );
}
