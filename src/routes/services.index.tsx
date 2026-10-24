import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { contentQuery } from "@/lib/content";
import { useVisitor } from "@/lib/visitor";
import { EmptyState, OfferCard, PageHeader, ServiceCard } from "@/components/site/cards";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Haider Mohsin" },
      {
        name: "description",
        content:
          "Browse web development, pentesting, security scans, recon, Python, automation, agentic AI and Python teaching services.",
      },
      { property: "og:title", content: "Service catalog — Haider Mohsin" },
      {
        property: "og:description",
        content: "Development, security, AI and learning services. Add them to one request.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  const { data } = useSuspenseQuery(contentQuery);
  const { purpose } = useVisitor();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState<"recommended" | "az" | "za">("recommended");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const r = data.services.filter(
      (s) =>
        (cat === "all" || s.category_slug === cat) &&
        (!term ||
          [s.name, s.tagline, s.summary, ...s.includes].join(" ").toLowerCase().includes(term)),
    );
    const m = (k: string[]) => Number(!!purpose && k.includes(purpose));
    if (sort === "az") r.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "za") r.sort((a, b) => b.name.localeCompare(a.name));
    else
      r.sort(
        (a, b) =>
          m(b.purpose_keys) - m(a.purpose_keys) ||
          Number(b.featured) - Number(a.featured) ||
          a.sort_order - b.sort_order,
      );
    return r;
  }, [data.services, q, cat, sort, purpose]);

  const catName = (s: string) => data.categories.find((c) => c.slug === s)?.name;

  return (
    <>
      <PageHeader eyebrow="Catalog" title="Services">
        Pick what you need and tap Buy to see how to order it.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search services</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search services…"
              className="h-11 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <label>
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-11 rounded-md border border-input bg-card px-3 text-sm"
            >
              <option value="recommended">Recommended</option>
              <option value="az">Name A–Z</option>
              <option value="za">Name Z–A</option>
            </select>
          </label>
        </div>
        <div
          className="mt-4 flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Categories"
        >
          {[{ slug: "all", name: "All" }, ...data.categories].map((c) => (
            <button
              key={c.slug}
              role="tab"
              aria-selected={cat === c.slug}
              onClick={() => setCat(c.slug)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${cat === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/60"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
        {cat !== "all" && (
          <p className="mt-4 text-sm text-muted-foreground">
            {data.categories.find((c) => c.slug === cat)?.description}
          </p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <ServiceCard
              key={s.slug}
              service={s}
              category={catName(s.category_slug)}
              highlight={!!purpose && s.purpose_keys.includes(purpose)}
            />
          ))}
        </div>
        {list.length === 0 && (
          <EmptyState title="No services match">Try a different search or category.</EmptyState>
        )}

        {data.offers.length > 0 && (
          <div className="mt-16">
            <p className="eyebrow">Deals</p>
            <h2 className="mb-5 mt-2 text-2xl font-bold">Current offers</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {data.offers.map((o) => (
                <OfferCard key={o.slug} offer={o} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
