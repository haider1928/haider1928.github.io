import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { contentQuery } from "@/lib/content";
import { useVisitor } from "@/lib/visitor";
import { groupAchievements } from "@/lib/achievements";
import { PHOTO_ALT, PHOTO_PATH, PHOTO_URL } from "@/lib/site";
import { OfferCard, ProjectCard, ServiceCard } from "@/components/site/cards";
import { Icon } from "@/components/site/icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Haider Mohsin — Web Development, Pentesting & AI Agents" },
      {
        name: "description",
        content:
          "Hire Haider Mohsin for web development, security testing, automation, agentic AI and Python lessons. Based in Lahore, working worldwide.",
      },
      { property: "og:title", content: "Haider Mohsin — Developer & Security Practitioner" },
      {
        property: "og:description",
        content:
          "A catalog of development, security, AI and teaching services. Pick what you need and tap Buy.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: PHOTO_URL },
      { property: "og:image:alt", content: PHOTO_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: PHOTO_URL },
    ],
  }),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(contentQuery);
  const { purpose, openPurposeDialog } = useVisitor();
  const s = data.settings;
  const p = data.purposes.find((x) => x.key === purpose);
  const match = (keys: string[]) => !!purpose && keys.includes(purpose);

  const services = [...data.services].sort(
    (a, b) =>
      Number(match(b.purpose_keys)) - Number(match(a.purpose_keys)) || a.sort_order - b.sort_order,
  );
  const featuredServices = (
    purpose
      ? services.filter((x) => match(x.purpose_keys) || x.featured)
      : services.filter((x) => x.featured)
  ).slice(0, 6);
  const offers = [...data.offers]
    .sort((a, b) => Number(match(b.purpose_keys)) - Number(match(a.purpose_keys)))
    .slice(0, 3);
  const projects = data.projects.filter((x) => x.featured).slice(0, 2);
  const cat = (slug: string) => data.categories.find((c) => c.slug === slug)?.name;
  const ga = groupAchievements(data.achievements);
  const topAchievements = [...ga.hardware, ...ga.live, ...ga.community, ...ga.other].slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-hero absolute inset-0" />
        <div className="grid-bg absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr] md:py-24">
          <div>
            <p className="eyebrow">{s.hero_eyebrow}</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {s.hero_title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{s.hero_subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Browse services <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-12 items-center rounded-md border border-border px-6 font-medium hover:border-primary/60"
              >
                Start a request
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> {s.availability}
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rounded-3xl bg-primary/20 blur-2xl" />
            <div className="surface relative overflow-hidden p-2">
              <img
                src={PHOTO_PATH}
                alt={PHOTO_ALT}
                className="aspect-square w-full rounded-lg object-cover"
                width={600}
                height={600}
                fetchPriority="high"
              />
              <div className="flex items-center justify-between px-2 py-3 font-mono text-xs">
                <span>
                  haider@lahore:~$ <span className="caret text-primary">whoami</span>
                </span>
                <span className="text-muted-foreground">{s.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose prompt */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="surface flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          {p ? (
            <>
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/15 text-primary">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">
                    You're here to: <span className="text-foreground">{p.label}</span> ·{" "}
                    <button onClick={openPurposeDialog} className="text-primary hover:underline">
                      change
                    </button>
                  </p>
                  <p className="font-medium">{p.next_step}</p>
                </div>
              </div>
              <a
                href={p.next_step_href}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                Next step <ArrowRight className="h-4 w-4" />
              </a>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <p>What brings you here? I'll highlight what's most relevant. Totally optional.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.purposes.slice(0, 5).map((x) => (
                  <PurposeChip key={x.key} k={x.key} label={x.label} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Section
        eyebrow="The catalog"
        title={p ? "Picked for you" : "Featured services"}
        link={{ to: "/services", label: "All services" }}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((x) => (
            <ServiceCard
              key={x.slug}
              service={x}
              category={cat(x.category_slug)}
              highlight={match(x.purpose_keys)}
            />
          ))}
        </div>
      </Section>

      {offers.length > 0 && (
        <Section
          eyebrow="Deals"
          title="Current offers"
          link={{ to: "/offers", label: "All offers" }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {offers.map((o) => (
              <OfferCard key={o.slug} offer={o} highlight={match(o.purpose_keys)} />
            ))}
          </div>
        </Section>
      )}

      <Section
        eyebrow="Building now"
        title="Featured projects"
        link={{ to: "/projects", label: "All projects" }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((x) => (
            <ProjectCard key={x.slug} project={x} highlight={match(x.purpose_keys)} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Track record"
        title="Achievements"
        link={{ to: "/achievements", label: "See all" }}
      >
        {topAchievements.length ? (
          <ul className="grid gap-3 md:grid-cols-3">
            {topAchievements.map((a) => (
              <li key={a.title} className="surface p-5">
                <p className="font-mono text-xs text-primary">{a.kind}</p>
                <p className="mt-1 font-semibold">{a.title}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Achievements will be listed here as they happen. No made-up numbers, ever.
          </p>
        )}
      </Section>

      <Section eyebrow="How it works" title="Simple, honest process">
        <ol className="grid gap-4 md:grid-cols-4">
          {[
            ["Pick", "Browse the catalog and tap Buy on what you need."],
            ["Send", "Message me on WhatsApp or email, or send one short request."],
            ["Talk", "I reply personally, usually within a day."],
            ["Ship", "Clear scope, regular updates, careful delivery."],
          ].map(([t, b], i) => (
            <li key={t} className="surface p-5">
              <span className="font-mono text-sm text-primary">0{i + 1}</span>
              <p className="mt-2 font-semibold">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{b}</p>
            </li>
          ))}
        </ol>
      </Section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="surface relative overflow-hidden p-8 text-center md:p-14">
          <div className="bg-hero absolute inset-0" />
          <div className="relative">
            <h2 className="text-3xl font-bold md:text-4xl">Have something in mind?</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Tell me what you need. Even a rough idea is enough to start.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 font-semibold text-primary-foreground"
            >
              Start a request <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PurposeChip({ k, label }: { k: string; label: string }) {
  const { setPurpose } = useVisitor();
  return (
    <button
      onClick={() => setPurpose(k)}
      className="rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
    >
      {label}
    </button>
  );
}

function Section({
  eyebrow,
  title,
  link,
  children,
}: {
  eyebrow: string;
  title: string;
  link?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-20 max-w-6xl px-4">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">{title}</h2>
        </div>
        {link && (
          <a href={link.to} className="shrink-0 text-sm text-primary hover:underline">
            {link.label} →
          </a>
        )}
      </div>
      {children}
    </section>
  );
}
