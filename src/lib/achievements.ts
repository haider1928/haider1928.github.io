import type { Achievement } from "./types";

// Achievement rows are split into page sections by their `kind` value (case-insensitive).
export const SECTION_KINDS = {
  hardware: ["hardware"],
  repos: ["repository"],
  live: ["live project"],
  badges: ["htb badge"],
  linkedin: ["linkedin"],
  posts: ["linkedin post"],
  community: ["upcoming", "community"],
  practice: ["experience", "practice", "tools"],
  planned: ["planned", "in progress"],
} as const;

export type SectionKey = keyof typeof SECTION_KINDS | "other";
export type GroupedAchievements = Record<SectionKey, Achievement[]>;

const norm = (k: string) => k.trim().toLowerCase();

export function groupAchievements(list: Achievement[]): GroupedAchievements {
  const out = Object.fromEntries(
    [...Object.keys(SECTION_KINDS), "other"].map((k) => [k, [] as Achievement[]]),
  ) as GroupedAchievements;
  for (const a of list) {
    const k = norm(a.kind);
    const key = (Object.keys(SECTION_KINDS) as (keyof typeof SECTION_KINDS)[]).find((s) =>
      (SECTION_KINDS[s] as readonly string[]).includes(k),
    );
    out[key ?? "other"].push(a);
  }
  return out;
}

export const isToolsRow = (a: Achievement) => norm(a.kind) === "tools";
