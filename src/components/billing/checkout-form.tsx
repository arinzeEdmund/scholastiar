"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type LucideIcon, Bitcoin, CreditCard, FlaskConical, Landmark, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, type FieldValues, type Path, type UseFormSetError } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { BoxField, boxControl, boxControlProps, BoxGroup, FormAlert, InlineError } from "@/components/forms/box-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authCta } from "@/components/auth/auth-heading";
import { CryptoCheckout } from "@/components/billing/crypto-checkout";
import { payForPlan } from "@/lib/actions/billing";
import { cn } from "@/lib/utils";
import { cardCheckoutSchema, type CheckoutInput, localCheckoutSchema } from "@/lib/validation/auth";

const LOCAL_PROVIDERS = [
  { value: "paystack", name: "Paystack", text: "Card, bank transfer or USSD" },
  { value: "flutterwave", name: "Flutterwave", text: "Card, bank transfer or mobile money" },
] as const;

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

interface CheckoutFormProps {
  planId: string;
  priceLabel: string;
  countries: { value: string; label: string }[];
  defaultCountry: string;
  testCards: { success: string; declined: string; insufficientFunds: string } | null;
}

/** Pay for the chosen plan by card (Stripe) or a local method (Paystack / Flutterwave). */
export function CheckoutForm({ planId, priceLabel, countries, defaultCountry, testCards }: CheckoutFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const cardForm = useForm({
    resolver: zodResolver(cardCheckoutSchema),
    defaultValues: {
      method: "card" as const,
      planId,
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      countryCode: defaultCountry,
    },
  });
  const localForm = useForm({
    resolver: zodResolver(localCheckoutSchema),
    defaultValues: { method: "local" as const, planId, provider: undefined },
  });

  function submit<T extends FieldValues>(setError: UseFormSetError<T>) {
    return (values: CheckoutInput) => {
      setPaymentError(null);
      const toastId = toast.loading("Processing your payment…");
      startTransition(async () => {
        const result = await payForPlan({ ...values, planId });
        if (!result.ok) {
          for (const [name, messages] of Object.entries(result.fieldErrors ?? {})) {
            if (messages?.length) setError(name as Path<T>, { message: messages[0] });
          }
          if (!result.fieldErrors) setPaymentError(result.error);
          toast.error(result.error, { id: toastId });
          return;
        }
        toast.success("Payment received — your plan is active", { id: toastId });
        router.push(result.data.redirectTo);
        router.refresh();
      });
    };
  }

  const cardErrors = cardForm.formState.errors;
  const payLabel = `Pay ${priceLabel}`;

  return (
    <div className="space-y-5">
      {paymentError && <FormAlert>{paymentError}</FormAlert>}

      <Tabs defaultValue="card" onValueChange={() => setPaymentError(null)} className="gap-0">
        <TabsList className="grid h-auto w-full grid-cols-3 gap-2 bg-transparent p-0 group-data-horizontal/tabs:h-auto">
          <MethodTab value="card" icon={CreditCard} title="Card" text="Visa, Mastercard, Amex" />
          <MethodTab value="local" icon={Landmark} title="Local" text="Paystack · Flutterwave" />
          <MethodTab value="crypto" icon={Bitcoin} title="Crypto" text="USDT, USDC, BTC, ETH" />
        </TabsList>

        <TabsContent value="card" className="mt-4">
          <form onSubmit={cardForm.handleSubmit(submit(cardForm.setError))} noValidate>
            <FieldGroup className="gap-3">
              <BoxGroup>
                <BoxField bare id="cardNumber" label="Card number" error={cardErrors.cardNumber?.message}>
                  <Controller
                    control={cardForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <div className="relative">
                        <Input
                          {...boxControlProps("cardNumber", cardErrors.cardNumber?.message)}
                          className={cn(boxControl, "pr-16 tabular-nums")}
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder="1234 1234 1234 1234"
                          {...field}
                          onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                        />
                        <CardBrand number={field.value} />
                      </div>
                    )}
                  />
                </BoxField>
                <div className="grid grid-cols-2 divide-x divide-input">
                  <BoxField bare id="expiry" label="Expiry" error={cardErrors.expiry?.message}>
                    <Controller
                      control={cardForm.control}
                      name="expiry"
                      render={({ field }) => (
                        <Input
                          {...boxControlProps("expiry", cardErrors.expiry?.message)}
                          className={cn(boxControl, "tabular-nums")}
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder="MM/YY"
                          {...field}
                          onChange={(e) => field.onChange(formatExpiry(e.target.value))}
                        />
                      )}
                    />
                  </BoxField>
                  <BoxField bare id="cvc" label="CVC" error={cardErrors.cvc?.message}>
                    <Input
                      {...boxControlProps("cvc", cardErrors.cvc?.message)}
                      className={cn(boxControl, "tabular-nums")}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      maxLength={4}
                      {...cardForm.register("cvc")}
                    />
                  </BoxField>
                </div>
              </BoxGroup>
              <div className="grid gap-3 sm:grid-cols-2">
                <BoxField id="cardName" label="Name on card" error={cardErrors.cardName?.message}>
                  <Input
                    {...boxControlProps("cardName", cardErrors.cardName?.message)}
                    className={boxControl}
                    autoComplete="cc-name"
                    {...cardForm.register("cardName")}
                  />
                </BoxField>
                <BoxField id="countryCode" label="Billing country" error={cardErrors.countryCode?.message}>
                  <Controller
                    control={cardForm.control}
                    name="countryCode"
                    render={({ field }) => (
                      <Select value={field.value || ""} onValueChange={field.onChange}>
                        <SelectTrigger
                          {...boxControlProps("countryCode", cardErrors.countryCode?.message)}
                          className={boxControl}
                        >
                          <SelectValue placeholder="Choose a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </BoxField>
              </div>
              <PayButton pending={pending} label={payLabel} />
            </FieldGroup>
          </form>

          {testCards && (
            <div className="mt-3 rounded-xl border border-dashed border-info/40 bg-info-soft/60 px-3.5 py-2.5 text-xs">
              <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-secondary-text">
                <FlaskConical className="size-3.5 text-info" aria-hidden />
                <span className="font-semibold text-info">Test cards</span>
                <span>· any future expiry and 3-digit code</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  { label: "Payment succeeds", short: "Succeeds", number: testCards.success },
                  { label: "Card declined", short: "Declined", number: testCards.declined },
                  { label: "Insufficient funds", short: "No funds", number: testCards.insufficientFunds },
                ].map((card) => (
                  <button
                    key={card.number}
                    type="button"
                    onClick={() => {
                      cardForm.setValue("cardNumber", card.number, { shouldValidate: true });
                      if (!cardForm.getValues("expiry")) cardForm.setValue("expiry", "12/34");
                      if (!cardForm.getValues("cvc")) cardForm.setValue("cvc", "123");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-background px-2 py-1 ring-1 ring-border transition hover:ring-info"
                    aria-label={`Use test card ${card.number} (${card.label})`}
                  >
                    <span className="font-medium text-primary-text">{card.short}</span>
                    <span className="font-mono text-secondary-text">···{card.number.slice(-4)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="crypto" className="mt-4">
          <CryptoCheckout planId={planId} priceLabel={priceLabel} mock={testCards !== null} />
        </TabsContent>

        <TabsContent value="local" className="mt-4">
          <form onSubmit={localForm.handleSubmit(submit(localForm.setError))} noValidate>
            <FieldGroup className="gap-4">
              <Controller
                control={localForm.control}
                name="provider"
                render={({ field, fieldState }) => (
                  <div>
                    <span id="provider-label" className="text-xs font-medium text-secondary-text">
                      Choose how to pay
                    </span>
                    <div
                      role="radiogroup"
                      aria-labelledby="provider-label"
                      aria-describedby={fieldState.error ? "provider-error" : undefined}
                      className="mt-2 grid gap-2 sm:grid-cols-2"
                    >
                      {LOCAL_PROVIDERS.map((provider) => {
                        const checked = field.value === provider.value;
                        return (
                          <button
                            key={provider.value}
                            type="button"
                            role="radio"
                            aria-checked={checked}
                            onClick={() => field.onChange(provider.value)}
                            className={cn(
                              "flex items-start gap-2.5 rounded-xl border border-input bg-card p-3 text-left shadow-xs transition-all hover:border-green/50 dark:bg-white/[0.03]",
                              checked && "border-green-action bg-soft-green/50 ring-4 ring-green/10 dark:bg-green/10",
                            )}
                          >
                            <span
                              className={cn(
                                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                                checked ? "border-green-action" : "border-subtle-text/60",
                              )}
                            >
                              {checked && <span className="size-2 rounded-full bg-green-action" />}
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-primary-text">{provider.name}</span>
                              <span className="mt-0.5 block text-xs text-secondary-text">{provider.text}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <InlineError id="provider-error" message={fieldState.error?.message} />
                  </div>
                )}
              />
              <p className="px-0.5 text-xs text-secondary-text">
                You&apos;ll confirm the payment on the provider&apos;s secure page, in your local currency.
                {testCards && " In mock mode the payment completes straight away."}
              </p>
              <PayButton pending={pending} label={payLabel} />
            </FieldGroup>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PayButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <Button type="submit" size="lg" className={authCta} disabled={pending}>
      {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Lock aria-hidden />}
      {label}
    </Button>
  );
}

function MethodTab({
  value,
  icon: Icon,
  title,
  text,
}: {
  value: string;
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <TabsTrigger
      value={value}
      className="group/method h-auto flex-col items-stretch gap-1.5 rounded-xl border border-input bg-card px-3 py-2.5 text-left shadow-xs transition-all hover:border-green/50 focus-visible:border-green-action focus-visible:ring-4 focus-visible:ring-green/15 focus-visible:outline-none dark:bg-white/[0.03] data-active:border-green-action data-active:bg-soft-green/40 data-active:shadow-[0_0_0_3px_rgb(16_182_91/0.15)] dark:data-active:border-green-action dark:data-active:bg-green/10"
    >
      <span className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-soft text-secondary-text transition-colors group-data-active/method:bg-green-action group-data-active/method:text-white dark:bg-white/5">
          <Icon className="size-3.5" aria-hidden />
        </span>
        <span className="text-sm font-semibold text-primary-text">{title}</span>
      </span>
      <span className="hidden text-[0.6875rem] leading-tight font-normal whitespace-normal text-secondary-text sm:block">
        {text}
      </span>
    </TabsTrigger>
  );
}

/** Network label from the first digits (text only, no brand artwork). */
function CardBrand({ number }: { number: string }) {
  const digits = number.replace(/\D/g, "");
  const brand = /^4/.test(digits)
    ? "VISA"
    : /^(5[1-5]|2[2-7])/.test(digits)
      ? "MC"
      : /^3[47]/.test(digits)
        ? "AMEX"
        : null;
  return (
    <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-[65%]">
      {brand ? (
        <span className="rounded-md border border-input bg-background px-1.5 py-0.5 text-[0.625rem] font-bold tracking-wider text-primary-text">
          {brand}
        </span>
      ) : (
        <CreditCard className="size-4 text-subtle-text" aria-hidden />
      )}
    </span>
  );
}
