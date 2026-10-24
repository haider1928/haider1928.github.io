import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useVisitor } from "@/lib/visitor";
import { BrandMark } from "./BrandMark";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/offers", label: "Offers" },
  { to: "/achievements", label: "Achievements" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { openPurposeDialog } = useVisitor();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
          aria-label="Haider Mohsin, home"
        >
          <BrandMark className="h-7 w-7 text-primary" />
          <span className="hidden sm:inline">
            haidermohsin<span className="text-primary">.com</span>
          </span>
        </Link>
        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{
                className: "rounded-md px-3 py-2 text-sm text-foreground bg-secondary",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={openPurposeDialog}
            className="hidden items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            <Sparkles className="h-4 w-4 text-primary" /> What brings you here?
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border px-4 py-3 lg:hidden" aria-label="Mobile">
          <div className="grid gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                openPurposeDialog();
              }}
              className="flex items-center gap-2 rounded-md px-3 py-3 text-left text-base text-primary hover:bg-secondary"
            >
              <Sparkles className="h-4 w-4" /> What brings you here?
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
