"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

/** Copies the current page URL (optionally with a #hash) to the clipboard. */
export function CopyLinkButton({
  hash,
  path,
  label = "Copy link",
}: {
  hash?: string;
  /** Copy this path instead of the current page. */
  path?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}${path ?? window.location.pathname}${hash ? `#${hash}` : ""}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link. Copy it from the address bar instead.");
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy}>
      {copied ? <Check aria-hidden /> : <Link2 aria-hidden />}
      {copied ? "Copied" : label}
    </Button>
  );
}
