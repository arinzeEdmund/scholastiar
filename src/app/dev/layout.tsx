import { notFound } from "next/navigation";

import { isMock } from "@/lib/env";

// Dev-only routes: gallery, shell previews, build status. Hidden outside Phase A mock mode.
export default function DevLayout({ children }: LayoutProps<"/dev">) {
  if (!isMock) notFound();
  return children;
}
