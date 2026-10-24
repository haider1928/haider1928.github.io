import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  CalendarClock,
  Cpu,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import type { ReactNode } from "react";
import { contentQuery } from "@/lib/content";
import { groupAchievements, isToolsRow } from "@/lib/achievements";
import type { Achievement } from "@/lib/types";
import { PageHeader } from "@/components/site/cards";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Haider Mohsin" },
      {
        name: "description",
        content:
          "Hardware builds, open-source repos, live projects, Hack The Box badges and security write-ups by Haider Mohsin.",
      },
      { property: "og:title", content: "Achievements — Haider Mohsin" },
      {
        property: "og:description",
        content: "Real milestones only: hardware, repos, live projects, HTB badges and write-ups.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Achievements,
});

function Soon({ children = "Link coming soon" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-dashed border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
      {children}
    </span>
  );
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
    >
      {children} <ExternalLink className="h-3 w-3" />
    </a>
  );
}

function Block({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-14 first:mt-0">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-bold">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Card({ a, icon, label }: { a: Achievement; icon: ReactNode; label?: string | undefined }) {
  return (
    <div className="surface flex flex-col p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
          {icon}
        </span>
        {label && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
            {label}
          </span>
        )}
      </div>
      <p className="mt-4 text-lg font-semibold">{a.title}</p>
      {a.description && (
        <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{a.description}</p>
      )}
    </div>
  );
}

function Achievements() {
  const { data } = useSuspenseQuery(contentQuery);
  const s = data.settings;
  const g = groupAchievements(data.achievements);
  const ghUser = s.github_user || "haider1928";

  return (
    <>
      <PageHeader eyebrow="Track record" title="Achievements">
        Only real milestones live here. Nothing invented, nothing inflated.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-12">
        {g.hardware.length > 0 && (
          <Block eyebrow="Hardware" title="Built from the metal up">
            <div className="grid gap-4 md:grid-cols-2">
              {g.hardware.map((a) => (
                <Card key={a.title} a={a} icon={<Cpu className="h-5 w-5" />} />
              ))}
            </div>
          </Block>
        )}

        <Block
          eyebrow="Open source"
          title="Published GitHub repositories"
          action={
            <a
              href={`https://github.com/${ghUser}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:border-primary/60"
            >
              <Github className="h-4 w-4" /> View all repositories
            </a>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.repos.map((a) => (
              <div key={a.title} className="surface flex flex-col p-5">
                <p className="flex items-center gap-2 font-mono text-sm">
                  <Github className="h-4 w-4 text-primary" />
                  {a.title}
                </p>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.description}</p>
                <div className="mt-4">
                  {a.link ? (
                    <Ext href={a.link}>View repository</Ext>
                  ) : (
                    <Soon>Repo link coming soon</Soon>
                  )}
                </div>
              </div>
            ))}
            <div className="grid place-items-center rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
              More repositories on{" "}
              <a
                className="text-primary hover:underline"
                href={`https://github.com/${ghUser}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/{ghUser}
              </a>
            </div>
          </div>
        </Block>

        {g.live.length > 0 && (
          <Block eyebrow="Shipping" title="Live projects">
            <div className="grid gap-4 md:grid-cols-2">
              {g.live.map((a) => (
                <div key={a.title} className="surface flex flex-col p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
                    <Globe className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-xl font-semibold">{a.title}</p>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.description}</p>
                  <div className="mt-4">
                    {a.link ? (
                      <Ext href={a.link}>
                        {a.link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </Ext>
                    ) : (
                      <Soon />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Block>
        )}

        <Block
          eyebrow="Hack The Box Academy"
          title="Badges"
          action={
            s.htb_profile_url ? (
              <a
                href={s.htb_profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:border-primary/60"
              >
                <ShieldCheck className="h-4 w-4" /> View HTB profile
              </a>
            ) : (
              <Soon>HTB profile link coming soon</Soon>
            )
          }
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {g.badges.map((a) => (
              <li key={a.title} className="surface flex items-center gap-3 p-4">
                {a.link ? (
                  <img
                    src={a.link}
                    alt={`${a.title} badge`}
                    className="h-12 w-12 shrink-0 object-contain"
                    loading="lazy"
                    width={48}
                    height={48}
                  />
                ) : (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block font-semibold leading-tight">{a.title}</span>
                  {a.description && (
                    <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                      {a.description}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Block>

        {(g.linkedin.length > 0 || g.posts.length > 0) && (
          <Block
            eyebrow="Writing"
            title="LinkedIn"
            action={
              s.linkedin_url ? (
                <a
                  href={s.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:border-primary/60"
                >
                  <Linkedin className="h-4 w-4" /> View profile
                </a>
              ) : (
                <Soon>Profile link coming soon</Soon>
              )
            }
          >
            {g.linkedin.map((a) => (
              <p key={a.title} className="mb-4 text-muted-foreground">
                {a.description || a.title}
              </p>
            ))}
            {g.posts.length > 0 && (
              <>
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Featured write-ups
                </p>
                <ul className="grid gap-2">
                  {g.posts.map((a) => (
                    <li
                      key={a.title}
                      className="surface flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                    >
                      <span>
                        <span className="block font-medium">{a.title}</span>
                        {a.description && (
                          <span className="block text-sm text-muted-foreground">
                            {a.description}
                          </span>
                        )}
                      </span>
                      {a.link ? <Ext href={a.link}>Read</Ext> : <Soon />}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Block>
        )}

        {g.community.length > 0 && (
          <Block eyebrow="Community" title="Teaching security by doing it">
            <div className="grid gap-4 md:grid-cols-2">
              {g.community.map((a) => (
                <Card
                  key={a.title}
                  a={a}
                  icon={<CalendarClock className="h-5 w-5" />}
                  label={a.kind.toLowerCase() === "upcoming" ? "Upcoming" : undefined}
                />
              ))}
            </div>
          </Block>
        )}

        {g.practice.length > 0 && (
          <Block eyebrow="Practice & experience" title="How I keep sharp">
            <div className="grid gap-4 md:grid-cols-3">
              {g.practice.map((a) =>
                isToolsRow(a) ? (
                  <div key={a.title} className="surface p-5 md:col-span-3">
                    <p className="flex items-center gap-2 font-semibold">
                      <Terminal className="h-4 w-4 text-primary" />
                      {a.title}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {a.description
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-border px-2.5 py-1 font-mono text-xs"
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                  </div>
                ) : (
                  <Card key={a.title} a={a} icon={<Terminal className="h-5 w-5" />} />
                ),
              )}
            </div>
          </Block>
        )}

        {g.other.length > 0 && (
          <Block eyebrow="More" title="Other milestones">
            <div className="grid gap-4 md:grid-cols-2">
              {g.other.map((a) => (
                <Card
                  key={a.title}
                  a={a}
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label={a.kind}
                />
              ))}
            </div>
          </Block>
        )}

        {g.planned.length > 0 && (
          <Block eyebrow="Next up" title="Planned">
            <ul className="flex flex-wrap gap-2">
              {g.planned.map((a) => (
                <li
                  key={a.title}
                  className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-4 py-2 text-sm"
                >
                  {a.title}{" "}
                  <span className="font-mono text-[10px] uppercase tracking-wider text-warning">
                    Planned
                  </span>
                </li>
              ))}
            </ul>
          </Block>
        )}
      </div>
    </>
  );
}
