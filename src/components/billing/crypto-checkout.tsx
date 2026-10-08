"use client";

import { AlertTriangle, Check, Clock, Copy, FlaskConical, Loader2, Lock, RotateCw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

import { authCta } from "@/components/auth/auth-heading";
import { FormAlert } from "@/components/forms/box-field";
import { Button } from "@/components/ui/button";
import type { CryptoPayment } from "@/data/types";
import { createCryptoInvoice, getCryptoInvoice, simulateCryptoPayment } from "@/lib/actions/billing";
import { CRYPTO_ASSETS, CRYPTO_PROVIDER, QUOTE_MINUTES } from "@/lib/payments/crypto";
import { cn } from "@/lib/utils";

const POLL_MS = 2500;

function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [active]);
  return now;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8 shrink-0 text-secondary-text"
      aria-label={`Copy ${label}`}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        toast.success(`${label} copied`);
      }}
    >
      <Copy className="size-4" aria-hidden />
    </Button>
  );
}

const STEPS = [
  { key: "awaiting_payment", label: "Waiting for payment" },
  { key: "confirming", label: "Confirming on the network" },
  { key: "paid", label: "Paid" },
] as const;

/** Crypto tab of the checkout (Cryptomus first). */
export function CryptoCheckout({ planId, priceLabel, mock }: { planId: string; priceLabel: string; mock: boolean }) {
  const router = useRouter();
  const [asset, setAsset] = useState("USDT");
  const [network, setNetwork] = useState("TRC20");
  const [invoice, setInvoice] = useState<CryptoPayment | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const waiting = invoice?.status === "awaiting_payment" || invoice?.status === "confirming";
  const now = useNow(invoice?.status === "awaiting_payment");
  const option = CRYPTO_ASSETS.find((a) => a.asset === asset)!;

  // QR code for the wallet address.
  useEffect(() => {
    if (!invoice) return;
    let cancelled = false;
    QRCode.toDataURL(invoice.pay_address, { margin: 1, width: 240, errorCorrectionLevel: "M" }).then((url) => {
      if (!cancelled) setQr(url);
    });
    return () => {
      cancelled = true;
    };
  }, [invoice?.pay_address, invoice]);

  // Live status while waiting (Phase B: the provider's webhook updates the invoice).
  useEffect(() => {
    if (!invoice || !waiting) return;
    const timer = window.setInterval(async () => {
      const result = await getCryptoInvoice(invoice.id);
      if (!result.ok) return;
      setInvoice(result.data);
      if (result.data.redirectTo) {
        window.clearInterval(timer);
        toast.success("Crypto payment received — your plan is active");
        router.push(result.data.redirectTo);
        router.refresh();
      }
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [invoice, waiting, router]);

  function createInvoice() {
    setError(null);
    startTransition(async () => {
      const result = await createCryptoInvoice({ planId, asset, network });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setQr(null);
      setInvoice(result.data);
    });
  }

  function simulate(outcome: "full" | "underpaid" | "expire") {
    if (!invoice) return;
    startTransition(async () => {
      const result = await simulateCryptoPayment(invoice.id, outcome);
      if (result.ok) setInvoice(result.data);
      else toast.error(result.error);
    });
  }

  if (!invoice) {
    return (
      <div className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}
        <div>
          <span className="mb-2 block text-xs font-medium text-secondary-text">Choose a coin</span>
          <div role="radiogroup" aria-label="Coin" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CRYPTO_ASSETS.map((a) => {
              const checked = a.asset === asset;
              return (
                <button
                  key={a.asset}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => {
                    setAsset(a.asset);
                    setNetwork(a.networks[0].key);
                  }}
                  className={cn(
                    "rounded-xl border border-input bg-card px-3 py-2.5 text-left shadow-xs transition-all hover:border-green/50 dark:bg-white/[0.03]",
                    checked &&
                      "border-green-action bg-soft-green/40 shadow-[0_0_0_3px_rgb(16_182_91/0.15)] dark:bg-green/10",
                  )}
                >
                  <span className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold text-primary-text">{a.asset}</span>
                    {a.stable && (
                      <span className="rounded-full bg-soft-green px-1.5 py-px text-[0.625rem] font-semibold text-green-dark dark:bg-green/15">
                        Stable
                      </span>
                    )}
                  </span>
                  <span className="block text-[0.6875rem] text-secondary-text">{a.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <span className="mb-2 block text-xs font-medium text-secondary-text">Network</span>
          <div role="radiogroup" aria-label="Network" className="flex flex-wrap gap-2">
            {option.networks.map((n) => (
              <button
                key={n.key}
                type="button"
                role="radio"
                aria-checked={network === n.key}
                onClick={() => setNetwork(n.key)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  network === n.key
                    ? "border-green-action bg-soft-green/60 text-green-dark dark:bg-green/15"
                    : "border-input text-secondary-text hover:text-primary-text",
                )}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
        <p className="flex gap-2 px-0.5 text-xs text-secondary-text">
          <Clock className="mt-px size-3.5 shrink-0" aria-hidden />
          Your price is locked for {QUOTE_MINUTES} minutes once you continue.
          {!option.stable && " Stablecoins (USDT, USDC) avoid price swings."}
        </p>
        <Button type="button" size="lg" className={authCta} onClick={createInvoice} disabled={pending}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Lock aria-hidden />}
          Pay {priceLabel} with {asset}
        </Button>
        <p className="text-center text-[0.6875rem] text-secondary-text">Processed by {CRYPTO_PROVIDER.name}</p>
      </div>
    );
  }

  const secondsLeft = Math.max(0, Math.floor((new Date(invoice.quote_expires_at).getTime() - now) / 1000));
  const clock = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  const stepIndex = invoice.status === "paid" ? 2 : invoice.status === "confirming" ? 1 : 0;
  const networkLabel = CRYPTO_ASSETS.find((a) => a.asset === invoice.asset)?.networks.find(
    (n) => n.key === invoice.network,
  )?.label;
  const remaining = (Number(invoice.amount_crypto) - Number(invoice.received_crypto)).toFixed(
    invoice.amount_crypto.split(".")[1]?.length ?? 2,
  );

  return (
    <div className="space-y-4" aria-live="polite">
      {invoice.status === "expired" ? (
        <div className="rounded-2xl border bg-card p-5 text-center shadow-xs dark:bg-white/[0.03]">
          <Clock className="mx-auto size-8 text-warning" aria-hidden />
          <p className="mt-2 font-semibold text-primary-text">This quote has expired</p>
          <p className="mt-1 text-sm text-secondary-text">
            Nothing was charged. Get a new quote to pay at the current rate.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setInvoice(null)}>
              Change coin
            </Button>
            <Button type="button" className="rounded-xl" onClick={createInvoice} disabled={pending}>
              <RotateCw aria-hidden />
              New quote
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <ol className="flex items-center gap-1.5 text-[0.6875rem]" aria-label="Payment status">
              {STEPS.map((step, i) => (
                <li
                  key={step.key}
                  className={cn(
                    "flex items-center gap-1.5",
                    i <= stepIndex ? "text-green-dark" : "text-secondary-text",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full text-[0.5625rem] font-bold",
                      i < stepIndex
                        ? "bg-green text-white"
                        : i === stepIndex
                          ? "bg-green-action text-white"
                          : "bg-neutral-soft dark:bg-white/10",
                    )}
                  >
                    {i < stepIndex ? <Check className="size-2.5" strokeWidth={4} aria-hidden /> : i + 1}
                  </span>
                  <span className={cn(i === stepIndex ? "font-semibold" : "hidden sm:inline")}>
                    {step.key === "confirming" && invoice.status === "confirming"
                      ? `Confirming (${invoice.confirmations}/3)`
                      : step.label}
                  </span>
                  {i < STEPS.length - 1 && <span className="h-px w-3 bg-border" aria-hidden />}
                </li>
              ))}
            </ol>
            {invoice.status === "awaiting_payment" && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-semibold tabular-nums",
                  secondsLeft < 120 ? "text-warning" : "text-secondary-text",
                )}
              >
                <Clock className="size-3.5" aria-hidden />
                {clock}
              </span>
            )}
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-[10.5rem_1fr]">
            <div className="mx-auto flex size-40 items-center justify-center rounded-xl bg-white p-2 ring-1 ring-border">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element -- generated data URL
                <img src={qr} alt={`QR code for the ${invoice.asset} payment address`} className="size-full" />
              ) : (
                <Loader2 className="size-6 animate-spin text-subtle-text" aria-hidden />
              )}
            </div>
            <div className="min-w-0 space-y-3">
              <div>
                <p className="text-xs text-secondary-text">
                  {invoice.status === "underpaid" ? "Send the remaining" : "Send exactly"}
                </p>
                <p className="flex items-center gap-1 text-2xl font-bold tracking-tight text-primary-text tabular-nums">
                  {invoice.status === "underpaid" ? remaining : invoice.amount_crypto}
                  <span className="text-base font-semibold text-secondary-text">{invoice.asset}</span>
                  <CopyButton
                    value={invoice.status === "underpaid" ? remaining : invoice.amount_crypto}
                    label="Amount"
                  />
                </p>
                <p className="text-xs text-secondary-text">
                  = {priceLabel.replace("/month", "")} · network {networkLabel}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-text">To this address</p>
                <p className="flex items-center gap-1 rounded-lg bg-soft px-2.5 py-1.5 font-mono text-xs break-all text-primary-text dark:bg-white/5">
                  <span className="min-w-0 flex-1">{invoice.pay_address}</span>
                  <CopyButton value={invoice.pay_address} label="Address" />
                </p>
              </div>
            </div>
          </div>

          {invoice.status === "underpaid" && (
            <p className="mx-4 mb-4 flex gap-2 rounded-xl bg-warning-soft px-3 py-2.5 text-xs text-warning">
              <AlertTriangle className="size-4 shrink-0" aria-hidden />
              We received {invoice.received_crypto} {invoice.asset}. Send the remaining {remaining} {invoice.asset} to
              the same address to finish.
            </p>
          )}
          <p className="flex gap-2 border-t bg-soft/50 px-4 py-2.5 text-[0.6875rem] text-secondary-text dark:bg-white/[0.02]">
            <ShieldCheck className="size-3.5 shrink-0 text-green-dark" aria-hidden />
            Send only {invoice.asset} on {networkLabel} to this address — other coins or networks can be lost. This page
            updates by itself.
          </p>
        </div>
      )}

      {mock && invoice.status !== "paid" && invoice.status !== "expired" && (
        <div className="rounded-xl border border-dashed border-info/40 bg-info-soft/60 px-3.5 py-2.5 text-xs">
          <p className="flex items-center gap-1.5 text-secondary-text">
            <FlaskConical className="size-3.5 text-info" aria-hidden />
            <span className="font-semibold text-info">Test wallet</span>
            <span>· mock mode only</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              {
                outcome: "full" as const,
                label: invoice.status === "underpaid" ? "Send the rest" : "Send full amount",
              },
              { outcome: "underpaid" as const, label: "Send too little" },
              { outcome: "expire" as const, label: "Let the quote expire" },
            ]
              .filter((o) => !(o.outcome === "underpaid" && invoice.status !== "awaiting_payment"))
              .map((o) => (
                <button
                  key={o.outcome}
                  type="button"
                  disabled={pending || invoice.status === "confirming"}
                  onClick={() => simulate(o.outcome)}
                  className="rounded-lg bg-background px-2 py-1 font-medium text-primary-text ring-1 ring-border transition hover:ring-info disabled:opacity-50"
                >
                  {o.label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
