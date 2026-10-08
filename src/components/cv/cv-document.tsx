import type { CvContent, CvEntry, CvFormat, CvSectionKey } from "@/data/types";
import { CV_SECTIONS } from "@/lib/cv/build";
import { cn } from "@/lib/utils";

// A CV on a paper-like sheet, styled per regional format. The same markup prints to PDF:
// "Download PDF" opens the print dialog and only the sheet is printed (globals.css → cv-print).

function Entry({ entry }: { entry: CvEntry }) {
  return (
    <div className="break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="font-semibold text-neutral-900">
          {entry.title}
          {entry.organisation && <span className="font-normal text-neutral-600"> · {entry.organisation}</span>}
          {entry.location && <span className="font-normal text-neutral-500">, {entry.location}</span>}
        </p>
        {entry.dates && <p className="text-[0.8em] whitespace-nowrap text-neutral-500">{entry.dates}</p>}
      </div>
      {entry.bullets.length > 0 && (
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-neutral-700 marker:text-neutral-400">
          {entry.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Section({ title, format, children }: { title: string; format: CvFormat; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid-page">
      <h2
        className={cn(
          "mb-2 text-[0.75em] font-bold tracking-[0.12em] uppercase",
          format === "us_resume" ? "border-b border-neutral-800 pb-0.5 text-neutral-900" : "text-[#087a3e]",
        )}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CvDocument({
  content,
  format,
  className,
}: {
  content: CvContent;
  format: CvFormat;
  className?: string;
}) {
  const { header } = content;
  const centred = format === "academic" || format === "eu_cv" || format === "africa";
  const visible = (key: CvSectionKey) => !content.hidden_sections.includes(key);

  const body: Record<CvSectionKey, React.ReactNode> = {
    summary: content.summary ? <p className="text-neutral-700">{content.summary}</p> : null,
    education: content.education.length ? (
      <div className="space-y-2.5">
        {content.education.map((e) => (
          <Entry key={e.source_id} entry={e} />
        ))}
      </div>
    ) : null,
    experience: content.experience.length ? (
      <div className="space-y-3">
        {content.experience.map((e) => (
          <Entry key={e.source_id} entry={e} />
        ))}
      </div>
    ) : null,
    skills: content.skills.length ? <p className="text-neutral-700">{content.skills.join(" · ")}</p> : null,
    certifications: content.certifications.length ? (
      <ul className="list-disc space-y-0.5 pl-5 text-neutral-700">
        {content.certifications.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    ) : null,
    languages: content.languages.length ? <p className="text-neutral-700">{content.languages.join(" · ")}</p> : null,
  };

  return (
    <article
      aria-label={`CV for ${header.name}`}
      className={cn(
        "cv-print mx-auto w-full max-w-[210mm] bg-white p-6 text-[13px] leading-relaxed text-neutral-800 shadow-xl ring-1 ring-black/5 sm:p-10",
        className,
      )}
    >
      <header className={cn("border-b border-neutral-200 pb-4", centred && "text-center")}>
        <h1 className="text-[1.9em] leading-tight font-bold tracking-tight text-neutral-900">{header.name}</h1>
        {header.headline && <p className="mt-0.5 text-[1.05em] text-neutral-600">{header.headline}</p>}
        <p className="mt-2 text-[0.85em] text-neutral-500">
          {[
            header.email,
            header.phone,
            header.location,
            header.nationality && `Nationality: ${header.nationality}`,
            ...header.links,
          ]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
      </header>
      <div className="mt-5 space-y-5">
        {content.section_order
          .filter((key) => visible(key) && body[key])
          .map((key) => (
            <Section
              key={key}
              title={key === "summary" && format === "us_resume" ? "Summary" : CV_SECTIONS[key]}
              format={format}
            >
              {body[key]}
            </Section>
          ))}
      </div>
    </article>
  );
}
