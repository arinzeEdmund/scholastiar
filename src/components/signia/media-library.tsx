"use client";

import { FileText, Film, ImageIcon, Loader2, Pencil, Presentation, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";

import { ConfirmDelete } from "@/components/candidate/confirm-delete";
import { BoxField, boxControl, boxControlProps } from "@/components/forms/box-field";
import { useFormAction } from "@/components/forms/use-form-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SigniaMediaItem, SigniaMediaType, SigniaVisibility } from "@/data/types";
import { addSigniaMedia, deleteSigniaMedia, updateSigniaMedia } from "@/lib/actions/signia";
import { MEDIA_TYPES, VISIBILITY_LABELS } from "@/lib/signia/labels";
import { signiaMediaUpdateSchema } from "@/lib/validation/signia";
import { cn } from "@/lib/utils";

const ICONS = {
  video: Film,
  image: ImageIcon,
  document: FileText,
  deck: Presentation,
  certificate: FileText,
  other: FileText,
};
const size = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

type EditValues = z.infer<typeof signiaMediaUpdateSchema>;

function EditDialog({
  item,
  projects,
  onClose,
}: {
  item: SigniaMediaItem;
  projects: { id: string; title: string }[];
  onClose: () => void;
}) {
  const router = useRouter();
  const form = useForm<EditValues>({
    resolver: zodResolver(signiaMediaUpdateSchema),
    defaultValues: {
      id: item.id,
      title: item.title,
      description: item.description,
      visibility: item.visibility,
      project_id: item.project_id,
    },
  });
  const { pending, run } = useFormAction<EditValues>(form.setError);
  const { errors } = form.formState;

  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent>
        <form
          noValidate
          onSubmit={form.handleSubmit((values) =>
            run(
              () => updateSigniaMedia(values),
              { loading: "Saving…", success: "Saved" },
              () => {
                onClose();
                router.refresh();
              },
            ),
          )}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Edit {MEDIA_TYPES[item.media_type].toLowerCase()}</DialogTitle>
            <DialogDescription>{item.file_name}</DialogDescription>
          </DialogHeader>
          <BoxField id="md-title" label="Title" error={errors.title?.message}>
            <Input
              {...form.register("title")}
              {...boxControlProps("md-title", errors.title?.message)}
              className={boxControl}
            />
          </BoxField>
          <BoxField id="md-desc" label="Description" error={errors.description?.message}>
            <Textarea
              {...form.register("description")}
              {...boxControlProps("md-desc")}
              rows={3}
              className={boxControl}
            />
          </BoxField>
          <div className="grid gap-3 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <BoxField id="md-project" label="Project">
                  <Select value={field.value ?? "none"} onValueChange={(v) => field.onChange(v === "none" ? null : v)}>
                    <SelectTrigger className={boxControl} {...boxControlProps("md-project")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not linked</SelectItem>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </BoxField>
              )}
            />
            <Controller
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <BoxField id="md-vis" label="Who can see it">
                  <Select value={field.value} onValueChange={(v) => field.onChange(v as SigniaVisibility)}>
                    <SelectTrigger className={boxControl} {...boxControlProps("md-vis")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(VISIBILITY_LABELS).map(([value, v]) => (
                        <SelectItem key={value} value={value}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </BoxField>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Upload and manage the media and documents shown on Signia. */
export function MediaLibrary({
  items,
  projects,
}: {
  items: SigniaMediaItem[];
  projects: { id: string; title: string }[];
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<SigniaMediaType | "all">("all");
  const [editing, setEditing] = useState<SigniaMediaItem | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();

  function upload(file: File | undefined) {
    if (!file) return;
    const data = new FormData();
    // Videos send their details only in Phase A; documents and images send the file.
    if (file.type.startsWith("video/")) {
      data.set("name", file.name);
      data.set("type", file.type);
      data.set("size", String(file.size));
    } else {
      data.set("file", file);
    }
    const toastId = toast.loading(`Uploading ${file.name}…`);
    startTransition(async () => {
      const result = await addSigniaMedia(data);
      if (!result.ok) {
        toast.error(result.error, { id: toastId });
        return;
      }
      toast.success("Added to your media", { id: toastId });
      router.refresh();
    });
  }

  const types = [...new Set(items.map((i) => i.media_type))];
  const shown = filter === "all" ? items : items.filter((i) => i.media_type === filter);

  return (
    <div className="space-y-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed bg-card p-8 text-center transition-colors dark:bg-white/[0.03]",
          dragging && "border-green bg-soft-green/40",
        )}
      >
        <Upload className="size-6 text-green-dark" aria-hidden />
        <div>
          <p className="font-semibold text-primary-text">Drop a file here, or choose one</p>
          <p className="text-sm text-secondary-text">Videos up to 200 MB · images, PDFs, Word and slides up to 5 MB</p>
        </div>
        <input
          ref={input}
          type="file"
          className="sr-only"
          aria-label="Choose a file to add"
          accept="video/*,image/*,application/pdf,.doc,.docx,.ppt,.pptx,text/plain"
          onChange={(e) => {
            upload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <Button type="button" onClick={() => input.current?.click()} disabled={pending} className="rounded-xl">
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Upload aria-hidden />}
          Choose a file
        </Button>
      </div>

      {items.length > 0 && (
        <nav aria-label="Filter media" className="flex flex-wrap gap-1.5">
          {(["all", ...types] as const).map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={filter === type}
              onClick={() => setFilter(type)}
              className={cn(
                "h-8 rounded-full border px-3 text-sm",
                filter === type
                  ? "border-green-action bg-green-action text-white"
                  : "text-secondary-text hover:border-green/50",
              )}
            >
              {type === "all"
                ? `All · ${items.length}`
                : `${MEDIA_TYPES[type]} · ${items.filter((i) => i.media_type === type).length}`}
            </button>
          ))}
        </nav>
      )}

      {items.length === 0 ? (
        <p className="text-center text-sm text-secondary-text">
          Nothing here yet. Research posters, papers, slides, certificates and project videos all make strong proof.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => {
            const Icon = ICONS[item.media_type];
            const project = projects.find((p) => p.id === item.project_id);
            return (
              <li key={item.id} className="overflow-hidden rounded-2xl border bg-card shadow-xs dark:bg-white/[0.03]">
                {item.preview_data_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- inline demo preview (data URL)
                  <img src={item.preview_data_url} alt="" className="aspect-video w-full object-cover" />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-soft-green/60 dark:bg-green/10">
                    <Icon className="size-8 text-green-dark" aria-hidden />
                  </div>
                )}
                <div className="flex items-start gap-2 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-primary-text">{item.title}</p>
                    <p className="truncate text-xs text-secondary-text">
                      {MEDIA_TYPES[item.media_type]} · {size(item.size_bytes)} ·{" "}
                      {VISIBILITY_LABELS[item.visibility].label}
                    </p>
                    {project && <p className="truncate text-xs text-green-dark">On “{project.title}”</p>}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setEditing(item)}
                    aria-label={`Edit ${item.title}`}
                  >
                    <Pencil className="size-4" aria-hidden />
                  </Button>
                  <ConfirmDelete
                    label={`Delete ${item.title}`}
                    title="Delete this file?"
                    description="It's removed from your portfolio and media library."
                    action={() => deleteSigniaMedia(item.id)}
                    onDone={() => router.refresh()}
                    successMessage="File deleted"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {editing && <EditDialog item={editing} projects={projects} onClose={() => setEditing(null)} />}
    </div>
  );
}
