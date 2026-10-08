"use client";

import { ArrowUp, ArrowUpRight, BadgeCheck, Lock, MapPin, Scale } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { ThemeSegmented } from "@/components/theme/theme-segmented";
import { publicFooterNav } from "@/config/navigation";
import { POPULAR_DESTINATIONS, SITE, SOCIAL_LINKS } from "@/config/site";

import { NavLink } from "./nav-link";

const TRUST = [
  { icon: BadgeCheck, label: "Verified employers and providers" },
  { icon: Lock, label: "Your documents stay private" },
  { icon: Scale, label: "Guidance, never guarantees" },
];

/** Public site footer: brand and newsletter, link columns, destinations, and a utility bar (atmosphere style). */
export function PublicFooter() {
  return (
    <footer className="grain relative overflow-hidden aurora-dark-side text-white dark:border-t dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Brand + newsletter */}
        <div className="grid gap-10 border-b border-white/10 py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="max-w-md">
            <Logo inverted className="text-2xl" />
            <p className="mt-4 text-white/70">{SITE.tagline}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {TRUST.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75"
                >
                  <Icon className="size-3.5 text-mint" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
            {SOCIAL_LINKS.length > 0 && (
              <ul aria-label="Follow Scholastiar.ai" className="mt-6 flex flex-wrap gap-2">
                {SOCIAL_LINKS.map(({ platform, url }) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1 rounded-full border border-white/10 px-3 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {platform}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 beams p-6 backdrop-blur-sm sm:p-8">
            <p className="text-lg font-semibold">New opportunities every Monday</p>
            <p className="mt-1 text-sm text-white/70">
              Scholarships, programmes, funding and deadlines that match where you want to go.
            </p>
            <div className="mt-5">
              <NewsletterForm source="footer" tone="dark" />
            </div>
          </div>
        </div>

        {/* Link columns */}
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4">
          {publicFooterNav.map((group) => (
            <div key={group.label}>
              <h2 className="text-xs font-semibold tracking-wider text-white/50 uppercase">{group.label}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      item={item}
                      hideSoonBadge
                      className="text-white/75 hover:text-white aria-disabled:text-white/45 aria-disabled:hover:text-white/45"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Destinations */}
        <div className="border-t border-white/10 py-8">
          <h2 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-white/50 uppercase">
            <MapPin className="size-3.5" aria-hidden />
            Popular destinations
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {POPULAR_DESTINATIONS.map((country) => (
              <li key={country}>
                <Link
                  href={`/search?q=${encodeURIComponent(country)}`}
                  className="inline-flex h-8 items-center rounded-full border border-white/10 px-3 text-sm text-white/75 transition-colors hover:border-mint/40 hover:bg-white/5 hover:text-white"
                >
                  {country}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Utility bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Scholastiar.ai · Visa and immigration information is guidance, not legal
            advice.
          </p>
          <div className="flex items-center gap-3">
            <ThemeSegmented />
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                })
              }
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 px-3 text-white/75 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ArrowUp className="size-3.5" aria-hidden />
              Back to top
            </button>
          </div>
        </div>
      </div>

      {/* Oversized wordmark, cropped by the footer edge */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.22em] text-center text-[19vw] leading-none font-bold text-white/[0.04] select-none"
      >
        Scholastiar<span className="text-green/30">.</span>
      </p>
    </footer>
  );
}
