"use client";

import "./globals.css";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-soft p-6 font-sans">
        <main className="max-w-md text-center">
          <p className="text-[1.35rem] font-bold text-brand-black">
            Scholastiar<span className="text-green">.</span>
          </p>
          <h1 className="mt-8 text-2xl font-bold text-primary-text">Something went wrong on our side</h1>
          <p className="mt-3 text-secondary-text">Nothing you did caused this, and your data is safe.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 h-11 rounded-lg bg-primary px-5 font-semibold text-primary-foreground hover:bg-green-hover"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
