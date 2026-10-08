/** "+234 801 555 0142" → "+2348015550142". Shared by forms and server actions. */
export function toE164(value: string) {
  return value.replace(/[\s()-]/g, "");
}

export const E164 = /^\+[1-9]\d{7,14}$/;

/** "+2348015550142" → "+234 801 555 0142" (simple grouping for display). */
export function formatPhone(e164: string) {
  const digits = e164.replace(/^\+/, "");
  const cc = digits.length > 10 ? digits.slice(0, digits.length - 10) : digits.slice(0, 1);
  const rest = digits.slice(cc.length);
  return `+${cc} ${rest.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3")}`.trim();
}
