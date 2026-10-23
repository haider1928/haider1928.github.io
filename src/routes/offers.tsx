import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { contentQuery } from "@/lib/content";
import { useVisitor } from "@/lib/visitor";
import { EmptyState, OfferCard, PageHeader } from "@/components/site/cards";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Deals — Haider Mohsin" },
      { name: "description", content: "Free consultations, discounted security scans and student rates on Python lessons." },
      { property: "og:title", content: "Current offers — Haider Mohsin" },
      { property: "og:description", content: "Deals on security scans, consultations and Python teaching." },
    ],
  }),
  component: Offers,
});

function Offers() {
  const { data } = useSuspenseQuery(contentQuery);
  const { purpose } = useVisitor();
  return (
    <>
      <PageHeader eyebrow="Deals" title="Offers">Limited deals to make starting easier.</PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-10">
        {data.offers.length ? (
          <div className="grid gap-4 md:grid-cols-3">{data.offers.map((o) => <OfferCard key={o.slug} offer={o} highlight={!!purpose && o.purpose_keys.includes(purpose)} />)}</div>
        ) : (
          <EmptyState title="No offers right now">Check back soon, or just get in touch.</EmptyState>
        )}
      </div>
    </>
  );
}
