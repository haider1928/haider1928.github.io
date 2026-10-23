import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { contentQuery } from "@/lib/content";
import { EmptyState, PageHeader } from "@/components/site/cards";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Haider Mohsin" },
      { name: "description", content: "Real milestones, certifications and wins. No invented stats." },
      { property: "og:title", content: "Achievements — Haider Mohsin" },
      { property: "og:description", content: "A timeline of real milestones." },
    ],
  }),
  component: Achievements,
});

function Achievements() {
  const { data } = useSuspenseQuery(contentQuery);
  return (
    <>
      <PageHeader eyebrow="Track record" title="Achievements">Only real milestones live here.</PageHeader>
      <div className="mx-auto max-w-3xl px-4 py-12">
        {data.achievements.length === 0 ? (
          <EmptyState title="Coming soon">New milestones will be added here as they happen.</EmptyState>
        ) : (
          <ol className="relative grid gap-6 border-l border-border pl-6">
            {data.achievements.map((a) => (
              <li key={a.title} className="relative">
                <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-primary" />
                <p className="font-mono text-xs text-muted-foreground">{a.achieved_on ? new Date(a.achieved_on).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : ""} · {a.kind}</p>
                <p className="mt-1 text-lg font-semibold">{a.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                {a.link && <a href={a.link} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-primary">Proof <ExternalLink className="h-3 w-3" /></a>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
