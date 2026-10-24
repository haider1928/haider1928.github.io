import { describe, expect, it } from "vitest";
import { groupAchievements } from "@/lib/achievements";
import { seedAchievements } from "@/lib/seed";

const g = groupAchievements(seedAchievements);
const all = (k: keyof typeof g) => g[k].map((a) => a.title);

describe("achievements", () => {
  it("never lists eJPT as earned, only as planned", () => {
    const earned = seedAchievements.filter((a) => !g.planned.includes(a));
    expect(earned.some((a) => /ejpt/i.test(a.title))).toBe(false);
    expect(all("planned").some((t) => /ejpt/i.test(t))).toBe(true);
    expect(g.planned.find((a) => /ejpt/i.test(a.title))?.kind).toBe("Planned");
  });

  it("lists exactly the seven Hack The Box badges given", () => {
    expect(all("badges").sort()).toEqual(
      [
        "Constant Champion",
        "Cyber Rookie 365",
        "Binary Duo Explorer",
        "Unwavering User",
        "Cyber Starter",
        "Developer",
        "Your request is my demand",
      ].sort(),
    );
  });

  it("links OzMed AI to github.com/haider1928/ozmed and leaves unknown repo URLs empty", () => {
    expect(g.repos.find((r) => r.title === "OzMed AI")?.link).toBe(
      "https://github.com/haider1928/ozmed",
    );
    expect(g.repos.filter((r) => r.title !== "OzMed AI").every((r) => r.link === null)).toBe(true);
  });

  it("labels the Punjab College seminar as Upcoming", () => {
    expect(g.community.find((a) => /seminar/i.test(a.title))?.kind).toBe("Upcoming");
  });

  it("has five LinkedIn write-ups with no invented URLs", () => {
    expect(g.posts).toHaveLength(5);
    expect(g.posts.every((p) => p.link === null)).toBe(true);
  });

  it("uses unique titles so the database script can re-run safely", () => {
    expect(new Set(seedAchievements.map((a) => a.title)).size).toBe(seedAchievements.length);
  });
});
