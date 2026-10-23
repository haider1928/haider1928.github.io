import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ExternalLink, Trash2 } from "lucide-react";
import { contentQuery } from "@/lib/content";
import { useVisitor } from "@/lib/visitor";
import { EmptyState, PageHeader } from "@/components/site/cards";
import { Icon } from "@/components/site/icons";

export const Route = createFileRoute("/basket")({
  head: () => ({
    meta: [
      { title: "Your request — Haider Mohsin" },
      { name: "description", content: "Review the services you've picked and send one combined request." },
      { property: "og:title", content: "Your request basket" },
      { property: "og:description", content: "Review selected services and send one request." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Basket,
});

function Basket() {
  const { data } = useSuspenseQuery(contentQuery);
  const { basket, removeFromBasket, clearBasket } = useVisitor();
  const items = basket.map((slug) => data.services.find((s) => s.slug === slug)).filter((s) => !!s);

  return (
    <>
      <PageHeader eyebrow="Request basket" title="Your request">No payment needed. Send it and I'll reply with a scope and quote.</PageHeader>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_320px]">
        <div className="grid gap-3">
          {items.length === 0 ? (
            <EmptyState title="Your basket is empty">
              <Link to="/services" className="text-primary hover:underline">Browse the catalog</Link> and add services you're interested in.
            </EmptyState>
          ) : (
            items.map((s) => (
              <div key={s.slug} className="surface flex items-center gap-4 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-secondary text-primary"><Icon name={s.icon} className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="font-semibold hover:text-primary">{s.name}</Link>
                  <p className="truncate text-sm text-muted-foreground">{s.tagline}</p>
                  {(s.fiverr_url || data.settings.fiverr_url) && (
                    <a href={s.fiverr_url || data.settings.fiverr_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">Order on Fiverr <ExternalLink className="h-3 w-3" /></a>
                  )}
                </div>
                <span className="hidden font-mono text-xs text-muted-foreground sm:block">{s.packages[0]?.price_label ?? "Quote"}</span>
                <button onClick={() => removeFromBasket(s.slug)} aria-label={`Remove ${s.name}`} className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
        <aside className="surface h-fit p-6">
          <p className="eyebrow">Summary</p>
          <p className="mt-2 text-3xl font-bold">{items.length} <span className="text-base font-normal text-muted-foreground">service{items.length === 1 ? "" : "s"}</span></p>
          <p className="mt-1 text-sm text-muted-foreground">Total: custom quote after a quick chat.</p>
          <Link to="/contact" className={`mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-semibold text-primary-foreground ${items.length ? "" : "pointer-events-none opacity-50"}`}>
            Send request <ArrowRight className="h-4 w-4" />
          </Link>
          {items.length > 0 && <button onClick={clearBasket} className="mt-3 w-full text-sm text-muted-foreground hover:text-foreground">Clear basket</button>}
        </aside>
      </div>
    </>
  );
}
