import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { contentQuery } from "@/lib/content";
import { PageHeader } from "@/components/site/cards";
import photo from "@/assets/haider.png.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Haider Mohsin" },
      { name: "description", content: "Haider Mohsin is a developer and cybersecurity practitioner from Lahore, Pakistan." },
      { property: "og:title", content: "About Haider Mohsin" },
      { property: "og:description", content: "My story, skills, what I'm building now and availability." },
    ],
  }),
  component: About,
});

function About() {
  const { data } = useSuspenseQuery(contentQuery);
  const s = data.settings;
  return (
    <>
      <PageHeader eyebrow="About" title={s.about_title} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[320px_1fr]">
        <div>
          <img src={photo.url} alt="Haider Mohsin" className="surface aspect-square w-full object-cover p-1.5" width={400} height={400} />
          <p className="mt-4 flex items-center gap-2 font-mono text-xs"><span className="h-2 w-2 rounded-full bg-success" />{s.availability}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{s.location}</p>
        </div>
        <div className="grid gap-10">
          <div className="grid gap-4 text-lg leading-relaxed">{s.about_story.split(/\n\n+/).map((para, i) => <p key={i}>{para}</p>)}</div>
          <div>
            <p className="eyebrow">Building now</p>
            <p className="mt-2">{s.about_now}</p>
          </div>
          <div>
            <p className="eyebrow">Skills</p>
            <div className="mt-3 flex flex-wrap gap-2">{s.skills.split(",").map((k) => <span key={k} className="rounded-md border border-border px-2.5 py-1 font-mono text-xs">{k.trim()}</span>)}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/services" className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground">See services</Link>
            <Link to="/contact" className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm">Get in touch</Link>
          </div>
        </div>
      </div>
    </>
  );
}
