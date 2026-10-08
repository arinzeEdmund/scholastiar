import { FlaskConical, Mail } from "lucide-react";

/**
 * Mock mode only: stands in for the user's email inbox by showing the link
 * the email would contain. Never rendered when DATA_SOURCE is not "mock".
 */
export function DevInbox({ href, label }: { href: string; label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-info/40 bg-info-soft p-4 text-sm">
      <p className="flex items-center gap-1.5 font-semibold text-info">
        <FlaskConical className="size-4" aria-hidden />
        Dev inbox (mock mode only)
      </p>
      <p className="mt-1 text-secondary-text">
        No real email is sent in this prototype. Open the link it would contain:
      </p>
      {/* Plain anchor: Link would prefetch the one-time link and use it up before it's clicked. */}
      <a
        href={href}
        className="mt-2 inline-flex items-center gap-1.5 font-medium text-info underline-offset-4 hover:underline"
      >
        <Mail className="size-4" aria-hidden />
        {label}
      </a>
    </div>
  );
}
