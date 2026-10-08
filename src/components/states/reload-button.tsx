"use client";

import { RotateCw } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

export function ReloadButton({ children = "Try again", ...props }: ComponentProps<typeof Button>) {
  return (
    <Button onClick={() => window.location.reload()} {...props}>
      <RotateCw aria-hidden />
      {children}
    </Button>
  );
}
