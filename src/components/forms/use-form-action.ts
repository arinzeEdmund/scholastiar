"use client";

import { useTransition } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import toast from "react-hot-toast";

import type { ActionResult } from "@/lib/actions/result";

/**
 * Runs a server action with the standard feedback: loading toast, then success or error
 * on the same toast. Field errors from the server are shown on the matching fields.
 */
export function useFormAction<TValues extends FieldValues = FieldValues>(setError?: UseFormSetError<TValues>) {
  const [pending, startTransition] = useTransition();

  function run<R>(
    action: () => Promise<ActionResult<R>>,
    messages: { loading: string; success: string },
    onSuccess?: (data: R) => void,
  ) {
    const toastId = toast.loading(messages.loading);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        for (const [name, errors] of Object.entries(result.fieldErrors ?? {})) {
          if (errors?.[0] && setError) setError(name as Path<TValues>, { message: errors[0] });
        }
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success(messages.success, { id: toastId });
      onSuccess?.(result.data);
    });
  }

  return { pending, run };
}
