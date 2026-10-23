import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { contentQuery } from "@/lib/content";
import { Icon } from "./icons";

export function SiteFooter() {
  const { data } = useSuspenseQuery(contentQuery);
  const s = data.settings;
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-mono text-sm font-semibold">haidermohsin<span className="text-primary">.com</span></p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{s.hero_eyebrow}</p>
          <div className="mt-5 flex gap-2">
            {data.socials.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.label} className="grid h-10 w-10 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                <Icon name={l.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Explore</p>
          <ul className="grid gap-2 text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/offers" className="hover:text-foreground">Offers</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Contact</p>
          <ul className="grid gap-2 text-muted-foreground">
            <li><a href={`mailto:${s.email}`} className="hover:text-foreground">{s.email}</a></li>
            <li>{s.location}</li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link> · <Link to="/terms" className="hover:text-foreground">Terms</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-6 text-center font-mono text-xs text-muted-foreground">
        © {new Date().getFullYear()} Haider Mohsin. Built with care in Lahore.
      </p>
    </footer>
  );
}
