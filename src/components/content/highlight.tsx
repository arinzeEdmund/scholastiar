/** Wraps query terms in <mark> so search results show why they matched. */
export function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const clean = terms.map((t) => t.trim()).filter((t) => t.length > 1);
  if (clean.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${clean.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-soft-green text-green-dark">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
