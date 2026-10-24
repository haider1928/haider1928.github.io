import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Tag } from "lucide-react";
import type { Offer, Project, Service } from "@/lib/types";
import { BuyButton } from "./BuyDialog";
import { Icon } from "./icons";

export const statusLabel: Record<string, string> = {
  live: "Live",
  in_development: "In development",
  archived: "Archived",
  concept: "Concept",
};

export function ServiceCard({
  service,
  category,
  highlight,
}: {
  service: Service;
  category?: string | undefined;
  highlight?: boolean | undefined;
}) {
  const price = service.packages[0]?.price_label ?? "Custom quote";
  return (
    <div
      className={`surface lift group relative flex flex-col p-5 ${highlight ? "shadow-glow" : ""}`}
    >
      {/* Stretched link: the whole card opens the service, except the Buy row. */}
      <Link
        to="/services/$slug"
        params={{ slug: service.slug }}
        className="flex flex-1 flex-col after:absolute after:inset-0 after:content-['']"
      >
        <div className="flex items-start justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-primary">
            <Icon name={service.icon} className="h-5 w-5" />
          </span>
          {highlight ? (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
              For you
            </span>
          ) : (
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          )}
        </div>
        {category && (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {category}
          </p>
        )}
        <h3 className="mt-1 text-lg font-semibold">{service.name}</h3>
        <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{service.tagline}</p>
      </Link>
      <div className="relative z-10 mt-5 flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted-foreground">{price}</span>
        <BuyButton name={service.name} price={price} fiverrUrl={service.fiverr_url} />
      </div>
    </div>
  );
}

export function OfferCard({ offer, highlight }: { offer: Offer; highlight?: boolean | undefined }) {
  const href = offer.service_slug ? `/services/${offer.service_slug}` : "/contact";
  return (
    <div
      className={`surface relative flex flex-col overflow-hidden p-5 ${highlight ? "shadow-glow" : ""}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
        <Tag className="h-3 w-3" /> {offer.badge}
      </span>
      <h3 className="mt-3 text-lg font-semibold">{offer.title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{offer.description}</p>
      {offer.ends_at && (
        <p className="mt-3 font-mono text-xs text-warning">
          Ends {new Date(offer.ends_at).toLocaleDateString()}
        </p>
      )}
      <a
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        {offer.cta_label} <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

export function ProjectCard({
  project,
  highlight,
}: {
  project: Project;
  highlight?: boolean | undefined;
}) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className={`surface lift group flex flex-col p-6 ${highlight ? "shadow-glow" : ""}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${project.status === "live" ? "bg-success" : "bg-warning"}`}
        />
        <span className="font-mono text-xs text-muted-foreground">
          {statusLabel[project.status]}
        </span>
      </div>
      <h3 className="mt-3 text-xl font-semibold">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span
            key={t}
            className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-hero absolute inset-0" />
      <div className="grid-bg absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="surface grid place-items-center px-6 py-14 text-center">
      <p className="font-mono text-sm text-primary">// empty</p>
      <p className="mt-2 text-lg font-semibold">{title}</p>
      {children && <div className="mt-2 max-w-md text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}
