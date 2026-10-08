/** "GH" → 🇬🇭 (regional indicator symbols). Platforms without flag emoji show the two letters. */
export function flag(iso2: string | null | undefined) {
  if (!iso2 || iso2.length !== 2) return "";
  return String.fromCodePoint(...[...iso2.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}
