import {
  Bot,
  Briefcase,
  Code2,
  Compass,
  GraduationCap,
  Github,
  Handshake,
  Instagram,
  Mail,
  Radar,
  ScanSearch,
  Shield,
  ShoppingBag,
  Terminal,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  code: Code2,
  shield: Shield,
  scan: ScanSearch,
  radar: Radar,
  terminal: Terminal,
  workflow: Workflow,
  bot: Bot,
  graduation: GraduationCap,
  compass: Compass,
  briefcase: Briefcase,
  handshake: Handshake,
  github: Github,
  instagram: Instagram,
  mail: Mail,
  fiverr: ShoppingBag,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = map[name] ?? Code2;
  return <C className={className} aria-hidden />;
}
