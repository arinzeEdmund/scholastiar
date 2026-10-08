import "server-only";

// Phase A payment stand-in (Phase B: Stripe primary, Paystack and Flutterwave fallback).
// Mirrors Stripe test cards so the flows behave like the real thing.

export const TEST_CARDS = {
  success: "4242 4242 4242 4242",
  declined: "4000 0000 0000 0002",
  insufficientFunds: "4000 0000 0000 9995",
} as const;

const digits = (value: string) => value.replace(/\D/g, "");

export function passesLuhn(cardNumber: string): boolean {
  const d = digits(cardNumber);
  if (d.length < 12 || d.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

export type ChargeResult = { succeeded: true } | { succeeded: false; reason: string };

export function chargeCard(cardNumber: string): ChargeResult {
  const d = digits(cardNumber);
  if (d === digits(TEST_CARDS.declined)) {
    return { succeeded: false, reason: "Your card was declined. Try another card or a local payment method." };
  }
  if (d === digits(TEST_CARDS.insufficientFunds)) {
    return {
      succeeded: false,
      reason: "Your card has insufficient funds. Try another card or a local payment method.",
    };
  }
  return { succeeded: true };
}

// Mock crypto provider (stands in for Cryptomus). Rates are demo values.
const MOCK_USD_RATES: Record<string, number> = { USDT: 1, USDC: 1, BTC: 64000, ETH: 3200 };
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const HEX = "0123456789abcdef";
const randomFrom = (alphabet: string, length: number) =>
  Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");

export function mockCryptoQuote(asset: string, network: string, usd: number) {
  const rate = MOCK_USD_RATES[asset] ?? 1;
  const decimals = rate === 1 ? 2 : 8;
  const address =
    network === "TRC20"
      ? `T${randomFrom(BASE58, 33)}`
      : network === "BTC"
        ? `bc1q${randomFrom("023456789acdefghjklmnpqrstuvwxyz", 38)}`
        : `0x${randomFrom(HEX, 40)}`;
  return {
    rate,
    amountCrypto: (usd / rate).toFixed(decimals),
    address,
    invoiceId: `mock_inv_${randomFrom(HEX, 12)}`,
    txHash: () => (network === "TRC20" || network === "BTC" ? randomFrom(HEX, 64) : `0x${randomFrom(HEX, 64)}`),
  };
}
