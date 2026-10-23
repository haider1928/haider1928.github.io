export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
};

export type ServicePackage = {
  name: string;
  description: string;
  price_label: string;
  price_amount: number | null;
  currency: string;
  delivery: string;
  features: string[];
  sort_order: number;
};

export type Faq = { question: string; answer: string; sort_order: number };

export type ProcessStep = { title: string; body: string };

export type Service = {
  slug: string;
  category_slug: string;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  icon: string;
  includes: string[];
  audience: string[];
  process: ProcessStep[];
  purpose_keys: string[];
  fiverr_url: string | null;
  featured: boolean;
  sort_order: number;
  packages: ServicePackage[];
  faqs: Faq[];
};

export type Offer = {
  slug: string;
  title: string;
  description: string;
  badge: string;
  service_slug: string | null;
  purpose_keys: string[];
  cta_label: string;
  ends_at: string | null;
  featured: boolean;
  sort_order: number;
};

export type ProjectStatus = "live" | "in_development" | "archived" | "concept";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  highlights: string[];
  purpose_keys: string[];
  repo_url: string | null;
  live_url: string | null;
  featured: boolean;
  sort_order: number;
};

export type Achievement = {
  title: string;
  description: string;
  achieved_on: string | null;
  kind: string;
  link: string | null;
  sort_order: number;
};

export type SocialLink = { label: string; url: string; icon: string; sort_order: number };

export type QuestionType = "text" | "textarea" | "select" | "multiselect" | "services";

export type FormQuestion = {
  key: string;
  label: string;
  help: string;
  type: QuestionType;
  options: string[];
  required: boolean;
  sort_order: number;
};

export type Purpose = {
  key: string;
  label: string;
  description: string;
  icon: string;
  next_step: string;
  next_step_href: string;
  email_required: boolean;
  sort_order: number;
  questions: FormQuestion[];
};

export type Settings = { [k: string]: string } & {
  site_name: string;
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  email: string;
  whatsapp_number: string;
  whatsapp_message: string;
  location: string;
  availability: string;
  about_title: string;
  about_story: string;
  about_now: string;
  skills: string;
  github_user: string;
  fiverr_url: string;
};

export type SiteContent = {
  settings: Settings;
  categories: Category[];
  services: Service[];
  offers: Offer[];
  projects: Project[];
  achievements: Achievement[];
  socials: SocialLink[];
  purposes: Purpose[];
  source: "database" | "built-in";
};

export const SUBMISSION_STATUSES = ["new", "contacted", "in_progress", "won", "lost", "spam"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];
