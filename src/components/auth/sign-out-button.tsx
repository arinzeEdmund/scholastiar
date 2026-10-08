"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

/** Text-style sign-out control. */
export function SignOutButton({
  label = "Sign out",
  redirectTo,
  className,
}: {
  label?: string;
  redirectTo?: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await signOut();
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("Signed out");
          router.push(redirectTo ?? result.data.redirectTo);
          router.refresh();
        })
      }
      className={cn("font-medium text-green-dark hover:underline disabled:opacity-60", className)}
    >
      {label}
    </button>
  );
}
