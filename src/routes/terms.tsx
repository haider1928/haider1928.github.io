import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/cards";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Haider Mohsin" },
      { name: "description", content: "Terms for using haidermohsin.com and requesting services." },
      { property: "og:title", content: "Terms of service" },
      { property: "og:description", content: "Terms for requesting services from Haider Mohsin." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Legal" title="Terms" />
      <div className="mx-auto grid max-w-3xl gap-4 px-4 py-12 leading-relaxed text-muted-foreground">
        <p>Sending a request doesn't create a contract or payment obligation. Scope, price and timeline are agreed in writing before any work starts.</p>
        <p>Security testing (pentests, scans, recon) only happens on systems you own or are authorised to test, with written permission.</p>
        <p>Offers may change or end at any time and apply only as described.</p>
      </div>
    </>
  ),
});
