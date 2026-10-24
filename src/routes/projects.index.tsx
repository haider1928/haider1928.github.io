import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { contentQuery, githubReposQuery } from "@/lib/content";
import { useVisitor } from "@/lib/visitor";
import { EmptyState, PageHeader, ProjectCard, statusLabel } from "@/components/site/cards";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Haider Mohsin" },
      {
        name: "description",
        content:
          "SkillBridge, a live attack-and-defend hacking event, and open-source work on GitHub.",
      },
      { property: "og:title", content: "Projects by Haider Mohsin" },
      {
        property: "og:description",
        content: "What I'm building now, plus public GitHub projects.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { data } = useSuspenseQuery(contentQuery);
  const { purpose } = useVisitor();
  const [status, setStatus] = useState("all");
  const gh = useQuery(githubReposQuery(data.settings.github_user || "haider1928"));
  const statuses = ["all", ...new Set(data.projects.map((p) => p.status))];
  const list = data.projects.filter((p) => status === "all" || p.status === status);

  return (
    <>
      <PageHeader eyebrow="Work" title="Projects">
        What I'm building right now, and what I've shared publicly.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full border px-4 py-1.5 text-sm ${status === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60"}`}
            >
              {s === "all" ? "All" : statusLabel[s]}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {list.map((p) => (
            <ProjectCard
              key={p.slug}
              project={p}
              highlight={!!purpose && p.purpose_keys.includes(purpose)}
            />
          ))}
        </div>
        {list.length === 0 && <EmptyState title="No projects with this status" />}

        <h2 className="mt-16 text-2xl font-bold">On GitHub</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Public repositories from github.com/{data.settings.github_user}
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {gh.isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="surface h-32 animate-pulse" />
            ))}
          {gh.data?.map((r) => (
            <a
              key={r.name}
              href={r.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="surface lift flex flex-col p-5"
            >
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="truncate">{r.name}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </div>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {r.description || "No description yet."}
              </p>
              <div className="mt-3 flex gap-3 font-mono text-xs text-muted-foreground">
                {r.language && <span>{r.language}</span>}
                {r.archived && <span>archived</span>}
              </div>
            </a>
          ))}
        </div>
        {gh.isError && (
          <p className="mt-3 text-sm text-muted-foreground">
            Couldn't load GitHub right now.{" "}
            <a className="text-primary" href={`https://github.com/${data.settings.github_user}`}>
              View on GitHub →
            </a>
          </p>
        )}
        {gh.data?.length === 0 && <EmptyState title="No public repositories yet" />}
      </div>
    </>
  );
}
