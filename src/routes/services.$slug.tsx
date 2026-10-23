import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { contentQuery } from "@/lib/content";
import { useVisitor } from "@/lib/visitor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AddToBasketButton, OfferCard, ServiceCard } from "@/components/site/cards";
import { Icon } from "@/components/site/icons";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(contentQuery);
    const s = data.services.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return { name: s.name, tagline: s.tagline, summary: s.summary };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Haider Mohsin` },
          { name: "description", content: loaderData.summary },
          { property: "og:title", content: `${loaderData.name} — Haider Mohsin` },
          { property: "og:description", content: loaderData.tagline },
          { property: "og:type", content: "product" },
        ]
      : [{ title: "Service unavailable" }, { name: "robots", content: "noindex" }],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(contentQuery);
  const { addToBasket } = useVisitor();
  const navigate = useNavigate();
  const s = data.services.find((x) => x.slug === slug)!;
  const category = data.categories.find((c) => c.slug === s.category_slug);
  const related = data.services.filter((x) => x.category_slug === s.category_slug && x.slug !== s.slug).slice(0, 3);
  const offers = data.offers.filter((o) => o.service_slug === s.slug);
  const fiverr = s.fiverr_url || data.settings.fiverr_url;

  const request = () => {
    addToBasket(s.slug);
    navigate({ to: "/contact" });
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-hero absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr] md:py-16">
          <div>
            <nav className="font-mono text-xs text-muted-foreground" aria-label="Breadcrumb">
              <Link to="/services" className="hover:text-foreground">services</Link> / <span>{category?.name.toLowerCase()}</span> / <span className="text-primary">{s.slug}</span>
            </nav>
            <div className="mt-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-secondary text-primary"><Icon name={s.icon} className="h-6 w-6" /></span>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{category?.name}</span>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">{s.name}</h1>
            <p className="mt-3 text-xl text-muted-foreground">{s.tagline}</p>
            <p className="mt-6 max-w-2xl leading-relaxed">{s.description}</p>
          </div>
          <aside className="surface h-fit p-6 md:sticky md:top-24">
            <p className="eyebrow">Get started</p>
            <p className="mt-2 text-2xl font-bold">{s.packages[0]?.price_label ?? "Custom quote"}</p>
            <p className="text-sm text-muted-foreground">Every project is scoped honestly before any commitment.</p>
            <div className="mt-5 grid gap-2">
              <button onClick={request} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary font-semibold text-primary-foreground">Request this service <ArrowRight className="h-4 w-4" /></button>
              <AddToBasketButton slug={s.slug} size="lg" />
              {fiverr && (
                <a href={fiverr} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  Prefer Fiverr? Order there <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">What's included</h2>
            <ul className="mt-4 grid gap-2.5">
              {s.includes.map((i) => <li key={i} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{i}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold">Who it's for</h2>
            <ul className="mt-4 grid gap-2.5">
              {s.audience.map((i) => <li key={i} className="surface px-4 py-3 text-sm">{i}</li>)}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold">How it works</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-4">
            {s.process.map((p, i) => (
              <li key={p.title} className="surface p-5">
                <span className="font-mono text-sm text-primary">0{i + 1}</span>
                <p className="mt-2 font-semibold">{p.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {s.packages.length > 0 && (
          <div>
            <h2 className="text-xl font-bold">Packages</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {s.packages.map((p) => (
                <div key={p.name} className="surface flex flex-col p-6">
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  <p className="mt-4 text-2xl font-bold">{p.price_amount != null ? `${p.currency} ${p.price_amount}` : p.price_label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{p.delivery}</p>
                  <ul className="mt-4 grid flex-1 gap-2 text-sm">
                    {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-primary" />{f}</li>)}
                  </ul>
                  <button onClick={request} className="mt-5 h-10 rounded-md border border-border text-sm font-medium hover:border-primary">Ask about this</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {offers.length > 0 && <div className="grid gap-4 md:grid-cols-2">{offers.map((o) => <OfferCard key={o.slug} offer={o} highlight />)}</div>}

        {s.faqs.length > 0 && (
          <div>
            <h2 className="text-xl font-bold">FAQs</h2>
            <Accordion type="single" collapsible className="mt-3">
              {s.faqs.map((f) => (
                <AccordionItem key={f.question} value={f.question}>
                  <AccordionTrigger>{f.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold">Related services</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <ServiceCard key={r.slug} service={r} />)}</div>
          </div>
        )}
      </div>
    </>
  );
}
