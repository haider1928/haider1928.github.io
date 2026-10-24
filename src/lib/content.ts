import { queryOptions } from "@tanstack/react-query";
import { getSupabase } from "./supabase";
import {
  seedAchievements,
  seedCategories,
  seedOffers,
  seedProjects,
  seedPurposes,
  seedServices,
  seedSettings,
  seedSocials,
} from "./seed";
import type { Faq, FormQuestion, Purpose, Service, ServicePackage, SiteContent } from "./types";

type Published = { published?: boolean };
type DbService = Omit<Service, "packages" | "faqs"> & {
  service_packages?: (ServicePackage & Published)[];
  faqs?: (Faq & Published)[];
};
type DbPurpose = Omit<Purpose, "questions"> & { form_questions?: (FormQuestion & Published)[] };

const bySort = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

export const builtInContent: SiteContent = {
  settings: seedSettings,
  categories: seedCategories,
  services: seedServices,
  offers: seedOffers,
  projects: seedProjects,
  achievements: seedAchievements,
  socials: seedSocials,
  purposes: seedPurposes,
  source: "built-in",
};

async function loadContent(): Promise<SiteContent> {
  const sb = getSupabase();
  if (!sb) return builtInContent;
  try {
    const now = new Date().toISOString();
    const [settings, categories, services, offers, projects, achievements, socials, purposes] =
      await Promise.all([
        sb.from("site_settings").select("key,value"),
        sb.from("categories").select("*").eq("published", true),
        sb.from("services").select("*, service_packages(*), faqs(*)").eq("published", true),
        sb.from("offers").select("*").eq("published", true).or(`ends_at.is.null,ends_at.gt.${now}`),
        sb.from("projects").select("*").eq("published", true),
        sb.from("achievements").select("*").eq("published", true),
        sb.from("social_links").select("*").eq("published", true),
        sb.from("form_purposes").select("*, form_questions(*)").eq("published", true),
      ]);
    const err = [
      settings,
      categories,
      services,
      offers,
      projects,
      achievements,
      socials,
      purposes,
    ].find((r) => r.error);
    if (err?.error) throw err.error;

    const s = { ...seedSettings } as SiteContent["settings"];
    for (const row of settings.data ?? []) s[row.key] = row.value;

    return {
      settings: s,
      categories: (categories.data ?? []).sort(bySort),
      services: (services.data ?? [])
        .map((r: DbService): Service => ({
          ...r,
          packages: (r.service_packages ?? []).filter((p) => p.published !== false).sort(bySort),
          faqs: (r.faqs ?? []).filter((f) => f.published !== false).sort(bySort),
        }))
        .sort(bySort),
      offers: (offers.data ?? []).sort(bySort),
      projects: (projects.data ?? []).sort(bySort),
      achievements: (achievements.data ?? []).sort(bySort),
      socials: (socials.data ?? []).sort(bySort),
      purposes: (purposes.data ?? [])
        .map((p: DbPurpose) => ({
          ...p,
          questions: (p.form_questions ?? []).filter((q) => q.published !== false).sort(bySort),
        }))
        .sort(bySort),
      source: "database",
    };
  } catch (e) {
    console.error("Falling back to built-in content:", e);
    return builtInContent;
  }
}

export const contentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: loadContent,
  staleTime: 60_000,
});

export type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

export const githubReposQuery = (user: string) =>
  queryOptions({
    queryKey: ["github", user],
    queryFn: async (): Promise<GithubRepo[]> => {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`,
        {
          headers: { Accept: "application/vnd.github+json" },
        },
      );
      if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
      const data = (await res.json()) as GithubRepo[];
      return data.filter((r) => !r.fork);
    },
    staleTime: 10 * 60_000,
    retry: 1,
  });

export function waLink(number: string, text: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
