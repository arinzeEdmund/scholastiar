import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubPageHeader } from "@/components/candidate/sub-page-header";
import { SigniaProjectForm } from "@/components/signia/project-form";
import { ErrorState } from "@/components/states/error-state";
import { ReloadButton } from "@/components/states/reload-button";
import { repos } from "@/data";
import { requireCandidate } from "@/lib/guards";
import { safeLoad } from "@/lib/safe-load";

export const metadata: Metadata = { title: "Project" };

export default async function SigniaProjectPage({ params }: PageProps<"/signia/projects/[projectId]">) {
  const { user } = await requireCandidate();
  const { projectId } = await params;
  const isNew = projectId === "new";
  const result = await safeLoad(() =>
    Promise.all([repos.signia.get(user.user_id), repos.candidate.listSkills(user.user_id)]),
  );
  if (!result.ok) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <SubPageHeader backHref="/signia" backLabel="Signia" title="Project" />
        <ErrorState action={<ReloadButton />} />
      </div>
    );
  }
  const [signia, skills] = result.data;
  const project = isNew ? null : signia.projects.find((p) => p.id === projectId);
  if (!isNew && !project) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <SubPageHeader
        backHref="/signia"
        backLabel="Signia"
        title={project ? project.title : "Add a project"}
        description="Show the problem, what you did and what changed. Real projects from coursework, research, work or volunteering all count."
      />
      <SigniaProjectForm
        id={project?.id ?? null}
        skillSuggestions={skills.map((s) => s.skill_name)}
        defaults={
          project
            ? {
                title: project.title,
                summary: project.summary,
                role_description: project.role_description,
                problem_statement: project.problem_statement,
                approach: project.approach,
                outcome: project.outcome,
                status: project.status,
                project_type: project.project_type,
                skills: project.skills,
                links: project.links,
                visibility: project.visibility,
                start_date: project.start_date,
                end_date: project.end_date,
              }
            : {
                title: "",
                summary: "",
                role_description: "",
                problem_statement: "",
                approach: "",
                outcome: "",
                status: "completed",
                project_type: "project",
                skills: [],
                links: [],
                visibility: "public",
                start_date: null,
                end_date: null,
              }
        }
      />
    </div>
  );
}
