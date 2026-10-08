"use client";

import { Toaster as HotToaster } from "react-hot-toast";

/** The single app-wide toaster. Mounted once in the root layout — never mount another. */
export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        className: "!rounded-lg !border !border-border !bg-card !text-sm !text-primary-text !shadow-md",
        success: { iconTheme: { primary: "#10B65B", secondary: "#ffffff" } },
        error: { iconTheme: { primary: "#B91C1C", secondary: "#ffffff" }, duration: 6000 },
      }}
    />
  );
}
