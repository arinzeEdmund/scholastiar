"use client";

import { useRouter } from "next/navigation";

import type { CountryOption } from "@/components/forms/choice";
import type { ExperienceFormInput } from "@/lib/validation/candidate";

import { ExperienceForm } from "./experience-form";

/** Full-page experience editor: returns to the profile after saving. */
export function ExperiencePageForm(props: {
  id: string | null;
  defaults: ExperienceFormInput;
  countries: CountryOption[];
}) {
  const router = useRouter();
  return (
    <ExperienceForm
      {...props}
      variant="page"
      onSaved={() => {
        router.push("/profile#experience");
        router.refresh();
      }}
    />
  );
}
