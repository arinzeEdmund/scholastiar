"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm, useWatch, type FieldPath } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BoxField, boxControl, boxControlProps, FieldErrorText, InlineError } from "@/components/forms/box-field";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { signUp } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import {
  candidateSignUpSchema,
  employerSignUpSchema,
  HIRING_FOCUS,
  PROVIDER_TYPES,
  providerSignUpSchema,
  type SignUpInput,
} from "@/lib/validation/auth";

import { authCta } from "./auth-heading";
import { PasswordInput, PasswordStrength } from "./password-input";
import { StepIndicator } from "./step-indicator";

type AccountType = SignUpInput["accountType"];
// The form spans three account shapes; fields are addressed by name.
type FormValues = Record<string, string | boolean | undefined>;
type Name = FieldPath<FormValues>;

export interface WizardPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  highlights: string[];
  featured: boolean;
  includesName?: string;
}

const COMPARE_HREF: Record<AccountType, string> = {
  candidate: "/pricing#compare",
  employer: "/pricing#employers",
  provider: "/pricing#providers",
};

const SCHEMAS = { candidate: candidateSignUpSchema, employer: employerSignUpSchema, provider: providerSignUpSchema };

const STEPS: Record<AccountType, { title: string; fields: Name[] }[]> = {
  candidate: [
    { title: "Your account", fields: ["fullName", "email", "password", "countryCode", "whatsapp"] },
    { title: "Your plan", fields: ["planId", "acceptTerms"] },
  ],
  employer: [
    { title: "Your account", fields: ["fullName", "jobTitle", "whatsapp", "email", "password"] },
    { title: "Your company", fields: ["companyName", "companyWebsite", "countryCode", "hiringFocus"] },
    { title: "Your plan", fields: ["planId", "acceptTerms"] },
  ],
  provider: [
    { title: "Your account", fields: ["fullName", "jobTitle", "whatsapp", "email", "password"] },
    {
      title: "Your organisation",
      fields: ["organizationName", "organizationType", "organizationWebsite", "countryCode"],
    },
    { title: "Your plan", fields: ["planId", "acceptTerms"] },
  ],
};

const DEFAULTS: Record<AccountType, FormValues> = {
  candidate: {
    accountType: "candidate",
    fullName: "",
    email: "",
    password: "",
    countryCode: "",
    whatsapp: "",
    acceptTerms: false,
  },
  employer: {
    accountType: "employer",
    fullName: "",
    jobTitle: "",
    email: "",
    password: "",
    whatsapp: "",
    companyName: "",
    companyWebsite: "",
    countryCode: "",
    acceptTerms: false,
  },
  provider: {
    accountType: "provider",
    fullName: "",
    jobTitle: "",
    email: "",
    password: "",
    whatsapp: "",
    organizationName: "",
    organizationWebsite: "",
    countryCode: "",
    acceptTerms: false,
  },
};

export function SignUpWizard({
  accountType,
  plans,
  countries,
  defaultPlanId,
  salesHref,
  header,
  compactHeader,
  footer,
}: {
  accountType: AccountType;
  plans: WizardPlan[];
  countries: { iso2: string; name: string }[];
  defaultPlanId?: string;
  salesHref?: string;
  /** Full page heading on the first step. */
  header: React.ReactNode;
  /** Smaller heading on later steps, so the plan step fits on one screen. */
  compactHeader: React.ReactNode;
  /** Shown on the first step only ("Already have an account?"). */
  footer: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const steps = STEPS[accountType];
  const form = useForm<FormValues>({
    resolver: zodResolver(SCHEMAS[accountType] as never),
    defaultValues: { ...DEFAULTS[accountType], planId: defaultPlanId },
    mode: "onTouched",
  });
  const { errors } = form.formState;
  const err = (name: string) => (errors[name] as { message?: string } | undefined)?.message;
  const password = String(useWatch({ control: form.control, name: "password" }) ?? "");
  const hiringFocus = useWatch({ control: form.control, name: "hiringFocus" });
  const sponsorsGraduates = accountType === "employer" && hiringFocus !== undefined && hiringFocus !== "students";

  // Sponsoring graduates needs Employer Pro: move the choice there automatically.
  useEffect(() => {
    if (sponsorsGraduates && form.getValues("planId") === "employer_starter") {
      form.setValue("planId", "employer_pro", { shouldValidate: true });
    }
  }, [sponsorsGraduates, form]);

  async function next() {
    if (await form.trigger(steps[step].fields)) setStep((s) => s + 1);
  }

  function onSubmit(values: FormValues) {
    const toastId = toast.loading("Creating your account…");
    startTransition(async () => {
      const result = await signUp(values as SignUpInput);
      if (!result.ok) {
        const fieldErrors = result.fieldErrors ?? {};
        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (messages?.[0]) form.setError(field, { message: messages[0] });
        }
        const firstStep = steps.findIndex((s) => s.fields.some((f) => fieldErrors[f]?.length));
        if (firstStep >= 0) setStep(firstStep);
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success("Account created — now choose how to pay", { id: toastId });
      router.push(result.data.redirectTo);
      router.refresh();
    });
  }

  const text = (name: Name, label: string, props: Partial<React.ComponentProps<typeof Input>> = {}, hint?: string) => (
    <BoxField id={name} label={label} error={err(name)} hint={hint}>
      <Input {...boxControlProps(name, err(name))} className={boxControl} {...props} {...form.register(name)} />
    </BoxField>
  );

  const select = (name: Name, label: string, options: [string, string][], placeholder: string) => (
    <BoxField id={name} label={label} error={err(name)}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Select value={(field.value as string) || ""} onValueChange={field.onChange}>
            <SelectTrigger {...boxControlProps(name, err(name))} className={boxControl} onBlur={field.onBlur}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(([value, optionLabel]) => (
                <SelectItem key={value} value={value}>
                  {optionLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </BoxField>
  );

  // Entering a number is the opt-in to official Scholastiar WhatsApp messages (the label says so).
  const whatsappField = text("whatsapp", "WhatsApp for updates (optional)", {
    type: "tel",
    autoComplete: "tel",
    placeholder: "+234 801 555 0100",
  });

  const countryOptions = countries.map((c) => [c.iso2, c.name] as [string, string]);
  const current = steps[step].title;

  return (
    <div>
      {step === 0 ? header : compactHeader}
      <div className="mt-5" />
      <StepIndicator steps={[...steps.map((s) => s.title), "Payment", "Verify email"]} current={step} />

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-5">
        <FieldGroup className="gap-3">
          {current === "Your account" && (
            <>
              {text("fullName", "Full name", {
                autoComplete: "name",
                placeholder: accountType === "candidate" ? "As it appears on your passport" : undefined,
              })}
              {accountType !== "candidate" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {text("jobTitle", "Your job title", { autoComplete: "organization-title" })}
                  {whatsappField}
                </div>
              )}
              {text("email", accountType === "candidate" ? "Email" : "Work email", {
                type: "email",
                autoComplete: "email",
              })}
              <BoxField
                id="password"
                label="Password"
                error={err("password")}
                aside={<PasswordStrength password={password} />}
              >
                <PasswordInput
                  {...boxControlProps("password", err("password"))}
                  className={boxControl}
                  autoComplete="new-password"
                  placeholder="8+ characters, with a letter and a number"
                  {...form.register("password")}
                />
              </BoxField>
              {accountType === "candidate" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {select("countryCode", "Where do you live now?", countryOptions, "Choose your country")}
                  {whatsappField}
                </div>
              )}
            </>
          )}

          {current === "Your company" && (
            <>
              {text("companyName", "Company name", { autoComplete: "organization" })}
              {text("companyWebsite", "Company website (optional)", {
                type: "url",
                placeholder: "https://",
                autoComplete: "url",
              })}
              {select("countryCode", "Country where you hire", countryOptions, "Choose a country")}
              <div>
                <span id="hiringFocus-label" className="text-xs font-medium text-secondary-text">
                  Who are you hiring?
                </span>
                <Controller
                  control={form.control}
                  name="hiringFocus"
                  render={({ field }) => (
                    <div
                      role="radiogroup"
                      aria-labelledby="hiringFocus-label"
                      aria-describedby={err("hiringFocus") ? "hiringFocus-error" : undefined}
                      className="mt-2 grid gap-2"
                    >
                      {Object.entries(HIRING_FOCUS).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={field.value === value}
                          onClick={() => field.onChange(value)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border border-input bg-card px-3.5 py-3 text-left text-sm text-primary-text shadow-xs transition-all hover:border-green/50 dark:bg-white/[0.03]",
                            field.value === value &&
                              "border-green-action bg-soft-green/50 ring-4 ring-green/10 dark:bg-green/10",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                              field.value === value ? "border-green bg-green" : "border-subtle-text",
                            )}
                          >
                            {field.value === value && <span className="size-1.5 rounded-full bg-white" />}
                          </span>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                />
                <InlineError id="hiringFocus-error" message={err("hiringFocus")} />
              </div>
            </>
          )}

          {current === "Your organisation" && (
            <>
              {text("organizationName", "Organisation name", { autoComplete: "organization" })}
              {select("organizationType", "Type of organisation", Object.entries(PROVIDER_TYPES), "Choose a type")}
              {text("organizationWebsite", "Website (optional)", {
                type: "url",
                placeholder: "https://",
                autoComplete: "url",
              })}
              {select("countryCode", "Country", countryOptions, "Choose a country")}
            </>
          )}

          {current === "Your plan" && (
            <>
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span id="planId-label" className="text-xs font-medium text-secondary-text">
                    Choose your plan
                  </span>
                  <span className="text-[0.6875rem] text-secondary-text">Billed monthly · USD · Change any time</span>
                </div>
                <Controller
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <div
                      role="radiogroup"
                      aria-labelledby="planId-label"
                      aria-describedby={err("planId") ? "planId-error" : undefined}
                      className="mt-2.5 grid gap-3 sm:grid-cols-2"
                    >
                      {plans.map((plan) => (
                        <PlanOption
                          key={plan.id}
                          plan={plan}
                          checked={field.value === plan.id}
                          blocked={sponsorsGraduates && plan.id === "employer_starter"}
                          onSelect={() => field.onChange(plan.id)}
                        />
                      ))}
                    </div>
                  )}
                />
                <InlineError id="planId-error" message={err("planId")} />
                <p className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 px-0.5 text-xs text-secondary-text">
                  <Link
                    href={COMPARE_HREF[accountType]}
                    target="_blank"
                    className="font-medium text-green-dark hover:underline"
                  >
                    Compare every feature
                  </Link>
                  {salesHref && (
                    <Link href={salesHref} className="font-medium text-green-dark hover:underline">
                      Need more? Talk to sales about Enterprise
                    </Link>
                  )}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 rounded-xl border border-input bg-card px-3.5 py-2.5 shadow-xs dark:bg-white/[0.03]">
                  <Controller
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <Checkbox
                        id="acceptTerms"
                        className="aria-invalid:border-input aria-invalid:ring-0 dark:aria-invalid:border-input dark:aria-invalid:ring-0"
                        checked={field.value === true}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                        aria-invalid={Boolean(err("acceptTerms"))}
                        aria-describedby={err("acceptTerms") ? "acceptTerms-error" : undefined}
                      />
                    )}
                  />
                  <label htmlFor="acceptTerms" className="min-w-0 flex-1 text-sm leading-snug text-secondary-text">
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" className="font-medium text-green-dark hover:underline">
                      terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" target="_blank" className="font-medium text-green-dark hover:underline">
                      privacy policy
                    </Link>
                  </label>
                  {err("acceptTerms") && (
                    <FieldErrorText id="acceptTerms-error" message={err("acceptTerms")!} className="shrink-0" />
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-1">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 rounded-xl"
                onClick={() => setStep((s) => s - 1)}
                disabled={pending}
              >
                <ArrowLeft aria-hidden />
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button key="next" type="button" size="lg" className={cn(authCta, "flex-1")} onClick={next}>
                Continue
                <ArrowRight aria-hidden />
              </Button>
            ) : (
              // Separate keys: reusing the Continue button as the submit button would submit on the same click.
              <Button key="submit" type="submit" size="lg" className={cn(authCta, "flex-1")} disabled={pending}>
                {pending && <Loader2 className="animate-spin" aria-hidden />}
                Create account and continue to payment
              </Button>
            )}
          </div>
        </FieldGroup>
      </form>
      {step === 0 && footer}
    </div>
  );
}

/** Side-by-side plan card: radio mark, price, short promise and three highlights. */
function PlanOption({
  plan,
  checked,
  blocked,
  onSelect,
}: {
  plan: WizardPlan;
  checked: boolean;
  blocked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-disabled={blocked}
      disabled={blocked}
      onClick={onSelect}
      className={cn(
        "group/plan relative flex h-full flex-col overflow-hidden rounded-2xl border border-input bg-card p-4 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:border-green/50 hover:shadow-lg hover:shadow-black/5 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-none dark:bg-white/[0.03] dark:hover:shadow-black/40",
        plan.featured && "bg-linear-to-b from-soft-green/70 to-card dark:from-green/[0.09] dark:to-white/[0.02]",
        checked &&
          "border-green-action shadow-[0_0_0_4px_rgb(16_182_91/0.18),0_12px_30px_-14px_rgb(16_182_91/0.55)] hover:border-green-action",
      )}
    >
      {plan.featured && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-10 size-32 rounded-full bg-green/15 blur-2xl"
        />
      )}
      <span className="relative flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-sm font-semibold text-primary-text">{plan.name}</span>
          {plan.featured && (
            <span className="shrink-0 rounded-full bg-green-action px-1.5 py-px text-[0.625rem] font-semibold tracking-wide text-white uppercase">
              Popular
            </span>
          )}
        </span>
        <span
          aria-hidden
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            checked ? "border-green-action bg-green-action text-white" : "border-subtle-text/60",
          )}
        >
          {checked && <Check className="size-3" strokeWidth={3.5} />}
        </span>
      </span>
      <span className="relative mt-2 flex items-baseline gap-1">
        <span className="text-[1.75rem] leading-none font-bold tracking-tight text-primary-text">{plan.price}</span>
        <span className="text-xs text-secondary-text">/month</span>
      </span>
      <span className="relative mt-2 text-xs leading-snug text-secondary-text">{plan.description}</span>
      <span className="relative my-3 h-px bg-border" aria-hidden />
      <span className="relative grid gap-1.5 text-xs leading-snug text-primary-text/90">
        {plan.includesName && (
          <span className="font-medium text-green-dark">Everything in {plan.includesName}, plus</span>
        )}
        {plan.highlights.slice(0, 3).map((h) => (
          <span key={h} className="flex gap-1.5">
            <Check className="mt-px size-3.5 shrink-0 text-green-dark" strokeWidth={2.5} aria-hidden />
            {h}
          </span>
        ))}
      </span>
      {blocked && (
        <span className="relative mt-3 flex items-start gap-1.5 text-[0.6875rem] leading-snug font-medium text-warning">
          <Info className="mt-px size-3.5 shrink-0" aria-hidden />
          Sponsoring graduates needs Employer Pro.
        </span>
      )}
    </button>
  );
}
