import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, ExternalLink, Github } from "lucide-react";
import { contentQuery } from "@/lib/content";
import { PageHeader, statusLabel } from "@/components/site/cards";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(contentQuery);
    const p = data.projects.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { title: p.title, summary: p.summary };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Haider Mohsin` },
          { name: "description", content: loaderData.summary },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.summary },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Project unavailable" }, { name: "robots", content: "noindex" }],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(contentQuery);
  const p = data.projects.find((x) => x.slug === slug)!;
  return (
    <>
      <PageHeader eyebrow={statusLabel[p.status] ?? "Project"} title={p.title}>{p.summary}</PageHeader>
      <div className="mx-auto grid max-w-4xl gap-8 px-4 py-12">
        <p className="text-lg leading-relaxed">{p.description}</p>
        {p.highlights.length > 0 && (
          <ul className="grid gap-2">
            {p.highlights.map((h) => <li key={h} className="flex gap-2"><Check className="mt-1 h-4 w-4 text-primary" />{h}</li>)}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => <span key={t} className="rounded-md bg-secondary px-2 py-1 font-mono text-xs">{t}</span>)}
        </div>
        <div className="flex flex-wrap gap-2">
          {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Visit <ExternalLink className="h-4 w-4" /></a>}
          {p.repo_url && <a href={p.repo_url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm"><Github className="h-4 w-4" /> Code</a>}
          <Link to="/contact" className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm">Interested? Get in touch</Link>
        </div>
      </div>
    </>
  );
}
