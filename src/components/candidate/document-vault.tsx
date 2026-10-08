"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Download,
  Eye,
  FileImage,
  FileText,
  FileType2,
  Loader2,
  Lock,
  Pencil,
  Send,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type DragEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { ConfirmDelete } from "@/components/candidate/confirm-delete";
import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { ChoiceTiles, TagInput } from "@/components/forms/choice";
import { useFormAction } from "@/components/forms/use-form-action";
import { EmptyState } from "@/components/states/empty-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { CandidateDocument, DocumentType } from "@/data/types";
import { deleteDocument, updateDocument, uploadDocument } from "@/lib/actions/candidate";
import { DOCUMENT_TYPES, formatBytes } from "@/lib/candidate/labels";
import { cn } from "@/lib/utils";
import { documentUpdateSchema, type DocumentUpdateInput } from "@/lib/validation/candidate";

const ACCEPT = ".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.txt";

/** Best guess from the file name; the candidate can change it. */
function guessType(name: string): DocumentType {
  const n = name.toLowerCase();
  if (/\b(cv|resume|résumé)\b/.test(n) || n.includes("cv")) return "cv";
  if (n.includes("transcript")) return "transcript";
  if (n.includes("cover")) return "cover_letter";
  if (n.includes("passport")) return "passport";
  if (n.includes("visa") || n.includes("brp") || n.includes("permit")) return "visa";
  if (n.includes("certificate") || n.includes("cert")) return "certificate";
  if (n.includes("reference")) return "reference_letter";
  return "other";
}

function FileIcon({ mime }: { mime: string }) {
  const Icon = mime.startsWith("image/") ? FileImage : mime === "application/pdf" ? FileText : FileType2;
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl",
        mime === "application/pdf"
          ? "bg-danger-soft text-danger dark:bg-danger/15"
          : "bg-info-soft text-info dark:bg-info/15",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </span>
  );
}

async function openPreview(doc: CandidateDocument) {
  if (!doc.mock_data_url) return;
  const blob = await (await fetch(doc.mock_data_url)).blob();
  window.open(URL.createObjectURL(blob), "_blank", "noopener");
}

function EditDocumentDialog({ doc, onClose }: { doc: CandidateDocument; onClose: () => void }) {
  const router = useRouter();
  const form = useForm<DocumentUpdateInput>({
    resolver: zodResolver(documentUpdateSchema),
    defaultValues: {
      fileName: doc.file_name,
      documentType: doc.document_type,
      visibility: doc.visibility,
      tags: doc.tags,
    },
  });
  const { errors } = form.formState;
  const { pending, run } = useFormAction(form.setError);

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        run(
          () => updateDocument(doc.id, values),
          { loading: "Saving…", success: "Document updated" },
          () => {
            onClose();
            router.refresh();
          },
        ),
      )}
      className="space-y-3"
    >
      <BoxField id="doc-name" label="File name" error={errors.fileName?.message}>
        <Input
          {...boxControlProps("doc-name", errors.fileName?.message)}
          className={boxControl}
          {...form.register("fileName")}
        />
      </BoxField>
      <BoxField id="doc-type" label="Type">
        <Controller
          control={form.control}
          name="documentType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="doc-type" className={boxControl}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </BoxField>
      <Controller
        control={form.control}
        name="tags"
        render={({ field }) => (
          <TagInput
            id="doc-tags"
            label="Tags (optional)"
            value={field.value}
            onChange={field.onChange}
            placeholder="e.g. research, 2026"
            max={8}
          />
        )}
      />
      <Controller
        control={form.control}
        name="visibility"
        render={({ field }) => (
          <ChoiceTiles
            label="Who can use it"
            columns={2}
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: "private", label: "Only me", description: "Stored privately." },
              { value: "applications", label: "My applications", description: "Can be attached when you apply." },
            ]}
          />
        )}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={onClose} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" className="h-10 rounded-xl" disabled={pending}>
          {pending && <Loader2 className="animate-spin" aria-hidden />}
          Save
        </Button>
      </div>
    </form>
  );
}

export function DocumentVault({ documents }: { documents: CandidateDocument[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, startUpload] = useTransition();
  const [, startToggle] = useTransition();
  const [filter, setFilter] = useState<DocumentType | "all">("all");
  const [editing, setEditing] = useState<CandidateDocument | null>(null);

  const types = [...new Set(documents.map((d) => d.document_type))];
  const shown = filter === "all" ? documents : documents.filter((d) => d.document_type === filter);
  const totalBytes = documents.reduce((sum, d) => sum + d.size_bytes, 0);

  function upload(files: FileList | File[]) {
    const list = [...files];
    if (list.length === 0) return;
    startUpload(async () => {
      for (const file of list) {
        const toastId = toast.loading(`Uploading ${file.name}…`);
        const data = new FormData();
        data.set("file", file);
        data.set("documentType", guessType(file.name));
        const result = await uploadDocument(data);
        if (result.ok) toast.success(`${file.name} uploaded`, { id: toastId });
        else toast.error(result.error, { id: toastId });
      }
      router.refresh();
    });
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    upload(event.dataTransfer.files);
  }

  function toggleVisibility(doc: CandidateDocument, usable: boolean) {
    startToggle(async () => {
      const result = await updateDocument(doc.id, {
        fileName: doc.file_name,
        documentType: doc.document_type,
        visibility: usable ? "applications" : "private",
        tags: doc.tags,
      });
      if (!result.ok) toast.error(result.error);
      else toast.success(usable ? "Can now be attached to applications" : "Now private to you");
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragging ? "border-green bg-soft-green/50 dark:bg-green/10" : "border-input bg-card dark:bg-white/[0.02]",
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-soft-green text-green-dark ring-1 ring-green/20 dark:bg-green/10">
          {uploading ? (
            <Loader2 className="size-6 animate-spin" aria-hidden />
          ) : (
            <UploadCloud className="size-6" aria-hidden />
          )}
        </span>
        <p className="mt-3 font-semibold text-primary-text">{uploading ? "Uploading…" : "Drop files here to upload"}</p>
        <p className="mt-0.5 text-sm text-secondary-text">PDF, Word, images or text · up to 5 MB each</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Choose files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          aria-label="Upload documents"
          onChange={(e) => {
            if (e.target.files) upload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <p className="flex gap-2 text-xs text-secondary-text">
        <ShieldCheck className="size-4 shrink-0 text-green-dark" aria-hidden />
        Documents are private by default. Only ones you allow for applications can be attached when you apply.
      </p>

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload your CV, transcripts and certificates once — then attach them to any application."
        />
      ) : (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter documents">
              {(["all", ...types] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  aria-pressed={filter === type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filter === type
                      ? "border-green-action bg-soft-green/60 text-green-dark dark:bg-green/15"
                      : "border-input text-secondary-text hover:text-primary-text",
                  )}
                >
                  {type === "all" ? `All (${documents.length})` : DOCUMENT_TYPES[type]}
                </button>
              ))}
            </div>
            <span className="text-xs text-secondary-text">
              {documents.length} {documents.length === 1 ? "file" : "files"} · {formatBytes(totalBytes)}
            </span>
          </div>
          <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
            {shown.map((doc) => {
              const usable = doc.visibility === "applications";
              return (
                <li key={doc.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3.5">
                  <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto sm:flex-1">
                    <FileIcon mime={doc.mime_type} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-primary-text">{doc.file_name}</p>
                      <p className="text-xs text-secondary-text">
                        {DOCUMENT_TYPES[doc.document_type]} · {formatBytes(doc.size_bytes)} ·{" "}
                        {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
                          new Date(doc.created_at),
                        )}
                        {doc.tags.length > 0 && ` · ${doc.tags.map((t) => `#${t}`).join(" ")}`}
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-secondary-text">
                    <Switch
                      checked={usable}
                      onCheckedChange={(checked) => toggleVisibility(doc, checked)}
                      aria-label={`Allow ${doc.file_name} in applications`}
                    />
                    <span className="inline-flex w-28 items-center gap-1">
                      {usable ? (
                        <Send className="size-3 text-green-dark" aria-hidden />
                      ) : (
                        <Lock className="size-3" aria-hidden />
                      )}
                      {usable ? "In applications" : "Private"}
                    </span>
                  </label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-secondary-text"
                      disabled={!doc.mock_data_url}
                      title={doc.mock_data_url ? undefined : "Preview isn't available for demo files"}
                      onClick={() => openPreview(doc)}
                      aria-label={`Preview ${doc.file_name}`}
                    >
                      <Eye className="size-4" aria-hidden />
                    </Button>
                    {doc.mock_data_url ? (
                      <Button asChild variant="ghost" size="icon" className="size-8 text-secondary-text">
                        <a href={doc.mock_data_url} download={doc.file_name} aria-label={`Download ${doc.file_name}`}>
                          <Download className="size-4" aria-hidden />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-secondary-text"
                        disabled
                        title="Download isn't available for demo files"
                        aria-label={`Download ${doc.file_name}`}
                      >
                        <Download className="size-4" aria-hidden />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-secondary-text"
                      onClick={() => setEditing(doc)}
                      aria-label={`Edit ${doc.file_name}`}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <ConfirmDelete
                      label={`Delete ${doc.file_name}`}
                      title="Delete this document?"
                      description={`${doc.file_name} will be permanently deleted. Applications you've already sent keep their copy.`}
                      action={() => deleteDocument(doc.id)}
                      onDone={() => router.refresh()}
                      successMessage="Document deleted"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit document</DialogTitle>
            <DialogDescription>Rename it, change its type and decide who can use it.</DialogDescription>
          </DialogHeader>
          {editing && <EditDocumentDialog doc={editing} onClose={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
