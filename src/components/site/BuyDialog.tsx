import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Linkedin, Mail, MessageCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { contentQuery, waLink } from "@/lib/content";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BuyProps = {
  name: string;
  price: string;
  fiverrUrl?: string | null | undefined;
  size?: "sm" | "lg";
  variant?: "primary" | "outline";
  label?: string;
  className?: string;
};

// "Buy" opens an on-page dialog with ordering options. It never navigates or stores anything.
export function BuyButton({
  name,
  price,
  fiverrUrl,
  size = "sm",
  variant = "outline",
  label = "Buy",
  className = "",
}: BuyProps) {
  const [open, setOpen] = useState(false);
  const base = size === "lg" ? "h-12 px-5 text-sm" : "h-9 px-3 text-xs";
  const look =
    variant === "primary"
      ? "bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
      : "border border-border font-medium hover:border-primary/60";
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline-flex items-center justify-center gap-1.5 rounded-md transition-colors ${base} ${look} ${className}`}
      >
        <ShoppingBag className="h-4 w-4" /> {label}
      </button>
      <BuyDialog
        open={open}
        onOpenChange={setOpen}
        name={name}
        price={price}
        fiverrUrl={fiverrUrl}
      />
    </>
  );
}

function BuyDialog({
  open,
  onOpenChange,
  name,
  price,
  fiverrUrl,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  name: string;
  price: string;
  fiverrUrl?: string | null | undefined;
}) {
  const { data } = useSuspenseQuery(contentQuery);
  const s = data.settings;
  const fiverr = fiverrUrl || s.fiverr_url;
  const msg = `Hi Haider, I'd like to order: ${name} (${price}).`;
  const row =
    "flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:border-primary/60";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="surface max-w-md">
        <DialogHeader>
          <p className="eyebrow">How to order</p>
          <DialogTitle className="text-xl">{name}</DialogTitle>
          <DialogDescription className="font-mono text-sm text-primary">{price}</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Pick whichever is easiest. I'll reply personally with the scope and next steps.
        </p>
        <div className="grid gap-2">
          {s.whatsapp_number && (
            <a
              href={waLink(s.whatsapp_number, msg)}
              target="_blank"
              rel="noopener noreferrer"
              className={row}
            >
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="flex-1">
                <span className="block text-sm font-medium">WhatsApp</span>
                <span className="font-mono text-xs text-muted-foreground">
                  +{s.whatsapp_number.replace(/\D/g, "")}
                </span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          )}
          {s.email && (
            <a
              href={`mailto:${s.email}?subject=${encodeURIComponent(`Order: ${name}`)}&body=${encodeURIComponent(msg)}`}
              className={row}
            >
              <Mail className="h-5 w-5 text-primary" />
              <span className="flex-1">
                <span className="block text-sm font-medium">Email</span>
                <span className="font-mono text-xs text-muted-foreground">{s.email}</span>
              </span>
            </a>
          )}
          {s.linkedin_url ? (
            <a href={s.linkedin_url} target="_blank" rel="noopener noreferrer" className={row}>
              <Linkedin className="h-5 w-5 text-primary" />
              <span className="flex-1 text-sm font-medium">LinkedIn</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          ) : (
            <div
              className="flex items-center gap-3 rounded-md border border-dashed border-border p-3 text-muted-foreground"
              aria-disabled
            >
              <Linkedin className="h-5 w-5" />
              <span className="flex-1">
                <span className="block text-sm font-medium">LinkedIn</span>
                <span className="text-xs">Profile link coming soon</span>
              </span>
            </div>
          )}
          {fiverr && (
            <a href={fiverr} target="_blank" rel="noopener noreferrer" className={row}>
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="flex-1 text-sm font-medium">Order on Fiverr</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <Link
            to="/contact"
            onClick={() => onOpenChange(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Or send a detailed request →
          </Link>
          <DialogClose className="h-10 rounded-md border border-border px-4 text-sm font-medium hover:border-primary/60">
            Close
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
