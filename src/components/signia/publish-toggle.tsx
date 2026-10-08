"use client";

import { Loader2 } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import toast from "react-hot-toast";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { setSigniaPublished } from "@/lib/actions/signia";

export function PublishToggle({ published }: { published: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(published);
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-2.5">
      <Switch
        id="signia-published"
        checked={optimistic}
        disabled={pending}
        onCheckedChange={(on) =>
          startTransition(async () => {
            setOptimistic(on);
            const result = await setSigniaPublished(on);
            if (!result.ok) toast.error(result.error);
            else toast.success(on ? "Your portfolio is live" : "Your portfolio is unpublished");
          })
        }
      />
      <Label htmlFor="signia-published" className="text-sm font-medium text-primary-text">
        {optimistic ? "Published" : "Not published"}
      </Label>
      {pending && <Loader2 className="size-3.5 animate-spin text-subtle-text" aria-hidden />}
    </div>
  );
}
