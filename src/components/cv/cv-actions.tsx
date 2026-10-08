"use client";

import { Copy, Download, Loader2, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";

import { ConfirmDelete } from "@/components/candidate/confirm-delete";
import { Button } from "@/components/ui/button";
import { deleteCv, duplicateCv } from "@/lib/actions/cv";

/** Preview toolbar: download (print to PDF), edit, duplicate, delete. */
export function CvActions({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function duplicate() {
    const toastId = toast.loading("Duplicating…");
    startTransition(async () => {
      const result = await duplicateCv({ id });
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success("Copy created — edit it freely", { id: toastId });
      router.push(`/ai-cv/${result.data.id}/edit`);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" className="rounded-xl" onClick={() => window.print()}>
        <Download aria-hidden />
        Download PDF
      </Button>
      <Button asChild variant="outline" className="rounded-xl">
        <Link href={`/ai-cv/${id}/edit`}>
          <Pencil aria-hidden />
          Edit
        </Link>
      </Button>
      <Button type="button" variant="outline" className="rounded-xl" onClick={duplicate} disabled={pending}>
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Copy aria-hidden />}
        Duplicate
      </Button>
      <ConfirmDelete
        label={`Delete ${title}`}
        title="Delete this CV?"
        description="It's removed from your CVs. Applications you've already sent keep their copy."
        action={() => deleteCv({ id })}
        onDone={() => router.push("/ai-cv/history")}
        successMessage="CV deleted"
      />
    </div>
  );
}
