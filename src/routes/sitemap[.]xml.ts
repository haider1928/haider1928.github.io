import { createFileRoute } from "@tanstack/react-router";
import { seedProjects, seedServices } from "@/lib/seed";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const paths = ["/", "/services", "/projects", "/offers", "/achievements", "/about", "/contact", "/privacy", "/terms", ...seedServices.map((s) => `/services/${s.slug}`), ...seedProjects.map((p) => `/projects/${p.slug}`)];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${origin}${p}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
