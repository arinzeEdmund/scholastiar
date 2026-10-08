"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Loader2, MoreHorizontal, Pencil, Share2, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { updateProfileBasics } from "@/lib/actions/profile";
import { profileBasicsSchema, type ProfileBasicsInput } from "@/lib/validation/profile";
import { ENGAGEMENT_THRESHOLD, usePwaStore } from "@/store/pwa-store";

/** Production form pattern: React Hook Form + Zod on the client, the same schema re-checked by the server action. */
export function ProfileBasicsForm({ defaults }: { defaults: { full_name: string; headline: string | null } }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<ProfileBasicsInput>({
    resolver: zodResolver(profileBasicsSchema),
    defaultValues: { full_name: defaults.full_name, headline: defaults.headline ?? "" },
  });
  const { errors, isDirty } = form.formState;

  function onSubmit(values: ProfileBasicsInput) {
    const toastId = toast.loading("Saving your profile…");
    startTransition(async () => {
      const result = await updateProfileBasics(values);
      if (!result.ok) {
        for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
          if (messages?.[0]) form.setError(field as keyof ProfileBasicsInput, { message: messages[0] });
        }
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success("Profile saved", { id: toastId });
      form.reset({ full_name: result.data.full_name, headline: result.data.headline ?? "" });
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-md">
      <FieldGroup>
        <BoxField
          id="full_name"
          label="Full name"
          error={errors.full_name?.message}
          hint="Use the name on your passport so applications match your documents."
        >
          <Input
            {...boxControlProps("full_name", errors.full_name?.message)}
            className={boxControl}
            autoComplete="name"
            {...form.register("full_name")}
          />
        </BoxField>
        <BoxField id="headline" label="Headline" error={errors.headline?.message}>
          <Input
            {...boxControlProps("headline", errors.headline?.message)}
            className={boxControl}
            placeholder="e.g. Master's applicant · Lagos → London"
            {...form.register("headline")}
          />
        </BoxField>
        <div className="flex gap-2">
          <Button type="submit" disabled={pending || !isDirty}>
            {pending && <Loader2 className="animate-spin" aria-hidden />}
            Save profile
          </Button>
          <Button type="button" variant="ghost" disabled={pending || !isDirty} onClick={() => form.reset()}>
            Discard changes
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

export function FormControlsDemo() {
  const [country, setCountry] = useState("gb");
  return (
    <FieldGroup className="max-w-md">
      <BoxField id="demo-email" label="Email">
        <Input {...boxControlProps("demo-email")} className={boxControl} type="email" placeholder="you@example.com" />
      </BoxField>
      <BoxField id="demo-invalid" label="Passport number" error="Usually 8–9 characters.">
        <Input {...boxControlProps("demo-invalid", "x")} className={boxControl} defaultValue="A12" />
      </BoxField>
      <Field>
        <FieldLabel htmlFor="demo-country">Where do you want to work?</FieldLabel>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger id="demo-country" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gb">United Kingdom</SelectItem>
            <SelectItem value="de">Germany</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="ae">United Arab Emirates</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>This helps us find programmes and scholarships that fit.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="demo-motivation">Why this country?</FieldLabel>
        <Textarea id="demo-motivation" placeholder="A sentence or two is enough." />
      </Field>
      <Field>
        <span className="text-sm font-medium">Will you need a student visa?</span>
        <RadioGroup defaultValue="yes" aria-label="Will you need a student visa?">
          {[
            ["yes", "Yes, I'll need a student visa"],
            ["no", "No, I already have the right to study there"],
            ["unsure", "I'm not sure yet"],
          ].map(([value, label]) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={`demo-visa-${value}`} />
              <Label htmlFor={`demo-visa-${value}`} className="font-normal">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Field>
      <div className="flex items-center gap-2">
        <Checkbox id="demo-consent" />
        <Label htmlFor="demo-consent" className="font-normal">
          Remind me before saved deadlines close
        </Label>
      </div>
      <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-3">
        <div>
          <Label htmlFor="demo-switch">Open to relocation</Label>
          <p className="text-xs text-secondary-text">Employers see this on your profile.</p>
        </div>
        <Switch id="demo-switch" defaultChecked />
      </div>
    </FieldGroup>
  );
}

export function OverlaysDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share your Signia profile</DialogTitle>
            <DialogDescription>Anyone with the link can view the sections you&apos;ve made public.</DialogDescription>
          </DialogHeader>
          <Input readOnly value="https://scholastiar.ai/s/amara" aria-label="Profile link" />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={() => toast.success("Link copied")}>Copy link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open filter sheet</Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85dvh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Filter opportunities</SheetTitle>
            <SheetDescription>On mobile, filters open as a sheet from the bottom.</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4">
            {["Fits study visa hours", "Near campus", "Flexible shifts"].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <Checkbox id={`sheet-${label}`} />
                <Label htmlFor={`sheet-${label}`} className="font-normal">
                  {label}
                </Label>
              </div>
            ))}
          </div>
          <SheetFooter>
            <Button size="lg">Show results</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 aria-hidden />
            Delete document
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from your vault and from any draft applications. Submitted applications keep their
              copy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep document</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => toast.success("Document deleted")}>
              Delete document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Actions
            <ChevronDown aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Pencil aria-hidden />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share2 aria-hidden />
            Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2 aria-hidden />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">What is a success score?</Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 text-sm text-secondary-text">
          An estimate of how ready your profile is for this opportunity, based on eligibility, documents, deadline and
          fit. It is not a guarantee of selection.
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More actions">
            <MoreHorizontal />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Icon-only actions always get a tooltip</TooltipContent>
      </Tooltip>
    </div>
  );
}

export function ToastsDemo() {
  function simulate(outcome: "success" | "error") {
    const id = toast.loading("Saving opportunity…");
    setTimeout(() => {
      if (outcome === "success") toast.success("Saved to your list", { id });
      else toast.error("We couldn't save this. Check your connection and try again.", { id });
    }, 1200);
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => simulate("success")}>
        Loading → success
      </Button>
      <Button variant="outline" onClick={() => simulate("error")}>
        Loading → error
      </Button>
    </div>
  );
}

export function PwaDemo() {
  const engagement = usePwaStore((s) => s.engagement);
  const recordEngagement = usePwaStore((s) => s.recordEngagement);
  const installable = usePwaStore((s) => Boolean(s.installEvent));

  return (
    <div className="space-y-3 text-sm text-secondary-text">
      <p>
        The install card appears after {ENGAGEMENT_THRESHOLD} meaningful actions (e.g. saving opportunities), only when
        the browser supports installing, and not again for 14 days after “Not now”. Install support needs a production
        build (<code className="font-mono text-xs">pnpm build && pnpm start</code>).
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={recordEngagement}>
          <Smartphone aria-hidden />
          Record engagement
        </Button>
        <span>
          Engagement: <strong className="text-primary-text tabular-nums">{engagement}</strong> · Browser install
          support: <strong className="text-primary-text">{installable ? "available" : "not available here"}</strong>
        </span>
      </div>
      <p>To see the offline banner, turn on “Offline” in your browser’s developer tools (Network tab).</p>
    </div>
  );
}
