"use client";

import { Loader2, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { resendVerificationEmail } from "@/lib/actions/auth";

const COOLDOWN_SECONDS = 60;

/** Resend button with a cooldown so the inbox isn't flooded. */
export function ResendVerification() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  function resend() {
    const toastId = toast.loading("Sending a new email…");
    startTransition(async () => {
      const result = await resendVerificationEmail();
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success("New verification email sent", { id: toastId });
      setSeconds(COOLDOWN_SECONDS);
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      onClick={resend}
      disabled={pending || seconds > 0}
    >
      {pending ? <Loader2 className="animate-spin" aria-hidden /> : <RotateCw aria-hidden />}
      {seconds > 0 ? `Resend in ${seconds}s` : "Resend email"}
    </Button>
  );
}
