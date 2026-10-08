"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, FileText, Film, ImageIcon, Loader2, Pencil, Presentation } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { deleteSigniaMedia, updateSigniaMedia } from "@/lib/actions/signia";
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
            <DialogDescription>{item.host_label}</DialogDescription>
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

/** Media and documents on Signia, all added by link: filter, edit, link to a project, delete. */
export function MediaLibrary({
  items,
  projects,
  addByLink,
}: {
  items: SigniaMediaItem[];
  projects: { id: string; title: string }[];
  /** The "add by link" form, shown above the list. */
  addByLink: ReactNode;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<SigniaMediaType | "all">("all");
  const [editing, setEditing] = useState<SigniaMediaItem | null>(null);

  const types = [...new Set(items.map((i) => i.media_type))];
  const shown = filter === "all" ? items : items.filter((i) => i.media_type === filter);

  return (
    <div className="space-y-5">
      {addByLink}

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
                {item.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- platform thumbnail
                  <img src={item.thumbnail_url} alt="" className="aspect-video w-full object-cover" />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-soft-green/60 dark:bg-green/10">
                    <Icon className="size-8 text-green-dark" aria-hidden />
                  </div>
                )}
                <div className="flex items-start gap-1 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-primary-text">{item.title}</p>
                    <p className="truncate text-xs text-secondary-text">
                      {MEDIA_TYPES[item.media_type]} · {item.host_label} · {VISIBILITY_LABELS[item.visibility].label}
                    </p>
                    {project && <p className="truncate text-xs text-green-dark">On “{project.title}”</p>}
                  </div>
                  <Button asChild variant="ghost" size="icon" className="size-8">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${item.title} (opens in a new tab)`}
                    >
                      <ExternalLink className="size-4" aria-hidden />
                    </a>
                  </Button>
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
                    title="Remove this item?"
                    description="It's removed from your portfolio. The original stays wherever it's hosted."
                    action={() => deleteSigniaMedia(item.id)}
                    onDone={() => router.refresh()}
                    successMessage="Removed"
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
