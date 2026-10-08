import type { UniversityProgram } from "@/data/types";

// Demo exchange rates for comparing tuition across currencies (Phase B: a daily rates feed).
const USD_PER_UNIT: Record<string, number> = { USD: 1, EUR: 1.08, GBP: 1.27, RUB: 0.011, AED: 0.272, KZT: 0.002 };

export function toUsd(amount: number, currency: string): number {
  return Math.round(amount * (USD_PER_UNIT[currency] ?? 1));
}

/** Tuition per year in USD, for filtering and sorting programmes of different lengths. */
export function yearlyTuitionUsd(program: UniversityProgram): number {
  const years = Math.max(program.duration_months / 12, 1);
  const perYear =
    program.tuition_period === "year"
      ? program.tuition_amount
      : program.tuition_period === "semester"
        ? program.tuition_amount * 2
        : program.tuition_amount / years;
  return toUsd(perYear, program.tuition_currency);
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

const PERIOD = { year: "/ year", semester: "/ semester", total: "total" } as const;

export function formatTuition(
  program: Pick<UniversityProgram, "tuition_amount" | "tuition_currency" | "tuition_period">,
) {
  return `${formatMoney(program.tuition_amount, program.tuition_currency)} ${PERIOD[program.tuition_period]}`;
}
