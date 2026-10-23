import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { contentQuery, waLink } from "@/lib/content";

export function WhatsAppButton() {
  const { data } = useSuspenseQuery(contentQuery);
  const n = data.settings.whatsapp_number;
  if (!n) return null;
  return (
    <a
      href={waLink(n, data.settings.whatsapp_message || "Hi Haider!")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-whatsapp-foreground shadow-card transition-transform hover:scale-105"
      aria-label="Chat with me on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Chat with me on WhatsApp</span>
    </a>
  );
}
