"use client";

import { FlaskConical, Inbox, LayoutTemplate, Palette, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { ROLE_LABELS } from "@/config/personas";
import { resetDemoData, setAiFailure, setViewState, switchPersona, switchPlan } from "@/lib/actions/dev";
import type { ActionResult } from "@/lib/actions/result";
import { cn } from "@/lib/utils";

const GUEST = "__guest__";

const STATE_OPTIONS = [
  { value: "live", label: "Live" },
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Empty" },
  { value: "error", label: "Error" },
] as const;

interface DevPanelProps {
  personas: { userId: string; name: string; surface: string; organization: string | null }[];
  currentUserId: string | null;
  currentRoles: string[];
  plans: { id: string; name: string }[];
  currentPlanId: string | null;
  viewState: string;
  aiFailure: boolean;
}

export function DevPanel({
  personas,
  currentUserId,
  currentRoles,
  plans,
  currentPlanId,
  viewState,
  aiFailure,
}: DevPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run<T>(loading: string, action: () => Promise<ActionResult<T>>, success: (data: T) => string) {
    const toastId = toast.loading(loading);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success(success(result.data), { id: toastId });
      router.refresh();
    });
  }

  const current = personas.find((p) => p.userId === currentUserId);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open dev panel"
          className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] left-3 z-50 inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-near-black px-3 text-xs font-semibold text-white shadow-lg hover:bg-brand-black lg:right-4 lg:bottom-4 lg:left-auto"
        >
          <FlaskConical className="size-3.5 text-green" aria-hidden />
          Dev
          <span className="max-w-28 truncate font-normal text-white/70">
            · {current?.name.split(" ")[0] ?? "Guest"}
          </span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Dev panel</SheetTitle>
          <SheetDescription>
            Phase A controls. Switch who you are, what plan they have and which state screens show. Only visible with
            mock data.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <section className="space-y-2">
            <Label htmlFor="dev-persona">Signed in as</Label>
            <Select
              value={currentUserId ?? GUEST}
              disabled={pending}
              onValueChange={(value) => {
                const userId = value === GUEST ? null : value;
                run(
                  "Switching persona…",
                  () => switchPersona(userId),
                  (data) => (data.name ? `Now signed in as ${data.name}` : "Signed out — browsing as a guest"),
                );
              }}
            >
              <SelectTrigger id="dev-persona" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={GUEST}>Guest (signed out)</SelectItem>
                  {personas.map((p) => (
                    <SelectItem key={p.userId} value={p.userId}>
                      {p.name} · {p.surface}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {current && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-secondary-text">
                {current.organization && <span>{current.organization} ·</span>}
                {currentRoles.map((role) => (
                  <Badge key={role} variant="neutral">
                    {ROLE_LABELS[role] ?? role}
                  </Badge>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <Label htmlFor="dev-plan">Plan</Label>
            {plans.length > 0 && currentUserId ? (
              <Select
                value={currentPlanId ?? "none"}
                disabled={pending}
                onValueChange={(planId) =>
                  run(
                    "Switching plan…",
                    () => switchPlan({ userId: currentUserId, planId }),
                    (data) =>
                      data.planName === "No subscription"
                        ? "Subscription removed"
                        : `Plan switched to ${data.planName}`,
                  )
                }
              >
                <SelectTrigger id="dev-plan" className="w-full">
                  <SelectValue placeholder="No plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No subscription</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-secondary-text">
                {currentUserId ? "This surface has no subscription plans." : "Sign in as a persona to switch plans."}
              </p>
            )}
          </section>

          <section className="space-y-2">
            <span id="dev-state-label" className="text-sm font-medium">
              Screen state
            </span>
            <div
              role="radiogroup"
              aria-labelledby="dev-state-label"
              className="grid grid-cols-4 gap-1 rounded-lg bg-soft p-1"
            >
              {STATE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={viewState === option.value}
                  disabled={pending}
                  onClick={() =>
                    run(
                      "Updating screen state…",
                      () => setViewState(option.value),
                      () => `Screens now show the ${option.label.toLowerCase()} state`,
                    )
                  }
                  className={cn(
                    "h-8 rounded-md text-xs font-medium text-secondary-text transition-colors hover:text-primary-text",
                    viewState === option.value && "bg-card text-primary-text shadow-sm",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-secondary-text">Applies to every list and detail screen that reads data.</p>
          </section>

          <section className="flex items-start justify-between gap-4">
            <div>
              <Label htmlFor="dev-ai-failure">Simulate AI failure</Label>
              <p className="mt-1 text-xs text-secondary-text">
                AI drafts return an error so failure states can be checked.
              </p>
            </div>
            <Switch
              id="dev-ai-failure"
              checked={aiFailure}
              disabled={pending}
              onCheckedChange={(enabled) =>
                run(
                  "Updating…",
                  () => setAiFailure(enabled),
                  (data) => (data.enabled ? "AI requests will now fail" : "AI requests back to normal"),
                )
              }
            />
          </section>

          <Separator />

          <section className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dev/gallery">
                <Palette aria-hidden />
                Component gallery
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dev/outbox">
                <Inbox aria-hidden />
                Message outbox (email + WhatsApp)
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dev">
                <LayoutTemplate aria-hidden />
                Layout shells & build status
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="justify-start" disabled={pending}>
                  <RotateCcw aria-hidden />
                  Reset demo data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all demo data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Every change made while testing is replaced with the original sample data. Your current persona
                    stays signed in.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep my changes</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => run("Resetting demo data…", resetDemoData, () => "Demo data reset")}
                  >
                    Reset demo data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
