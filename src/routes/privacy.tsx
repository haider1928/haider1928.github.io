import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/cards";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Haider Mohsin" },
      { name: "description", content: "What data haidermohsin.com collects and how it's used." },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: "How your data is handled on haidermohsin.com." },
    ],
  }),
  component: () => (
    <>
      <PageHeader eyebrow="Legal" title="Privacy policy" />
      <div className="mx-auto grid max-w-3xl gap-4 px-4 py-12 leading-relaxed text-muted-foreground">
        <p>
          <b className="text-foreground">What I collect.</b> Only what you type into the request
          form (name, contact details and answers), plus a one-way hashed version of your IP address
          used to stop spam.
        </p>
        <p>
          <b className="text-foreground">Why.</b> To reply to your request. I don't sell or share
          your data, and there are no advertising trackers.
        </p>
        <p>
          <b className="text-foreground">Your browser.</b> Your "what brings you here" choice is
          saved only in your own browser.
        </p>
        <p>
          <b className="text-foreground">Deleting.</b> Email hello@haidermohsin.com and I'll delete
          your details.
        </p>
      </div>
    </>
  ),
});
