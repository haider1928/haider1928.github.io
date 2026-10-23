// Generates supabase/setup.sql from src/lib/seed.ts. Run: bun scripts/gen-sql.ts
import { writeFileSync } from "node:fs";
import * as S from "../src/lib/seed";

const q = (v: unknown): string => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) return `array[${v.map(q).join(",")}]::text[]`;
  if (typeof v === "object") return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
  return `'${String(v).replace(/'/g, "''")}'`;
};
const ins = (table: string, cols: string[], rows: Record<string, unknown>[], conflict: string) =>
  rows.length
    ? `insert into public.${table} (${cols.join(",")}) values\n${rows.map((r) => `  (${cols.map((c) => q(r[c])).join(",")})`).join(",\n")}\non conflict (${conflict}) do nothing;\n`
    : "";

const schema = `-- haidermohsin.com — full Supabase setup. Safe to re-run.
-- Paste into Supabase → SQL Editor → Run.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- Admin allow-list -------------------------------------------------------
create table if not exists public.admin_emails (email text primary key);
insert into public.admin_emails (email) values ('hello@haidermohsin.com') on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_emails where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Content tables -----------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key, value text not null default '', updated_at timestamptz not null default now());

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(), label text not null, url text not null unique, icon text not null default 'link',
  sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, description text not null default '',
  icon text not null default 'code', sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  category_slug text not null references public.categories(slug) on update cascade,
  name text not null, tagline text not null default '', summary text not null default '', description text not null default '',
  icon text not null default 'code', includes text[] not null default '{}', audience text[] not null default '{}',
  process jsonb not null default '[]', purpose_keys text[] not null default '{}', fiverr_url text,
  featured boolean not null default false, sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table if not exists public.service_packages (
  id uuid primary key default gen_random_uuid(), service_id uuid not null references public.services(id) on delete cascade,
  name text not null, description text not null default '', price_label text not null default 'Custom quote',
  price_amount numeric(10,2), currency text not null default 'USD', delivery text not null default '',
  features text[] not null default '{}', sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (service_id, name));

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(), service_id uuid references public.services(id) on delete cascade,
  question text not null, answer text not null, sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (service_id, question));

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, description text not null default '',
  badge text not null default 'Offer', service_slug text references public.services(slug) on update cascade on delete set null,
  purpose_keys text[] not null default '{}', cta_label text not null default 'Learn more', starts_at timestamptz, ends_at timestamptz,
  featured boolean not null default false, sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, summary text not null default '',
  description text not null default '', status text not null default 'in_development' check (status in ('live','in_development','archived','concept')),
  tags text[] not null default '{}', highlights text[] not null default '{}', purpose_keys text[] not null default '{}',
  repo_url text, live_url text, featured boolean not null default false, sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(), title text not null, description text not null default '', achieved_on date,
  kind text not null default 'Milestone', link text, sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table if not exists public.form_purposes (
  id uuid primary key default gen_random_uuid(), key text not null unique check (key ~ '^[a-z0-9_-]{1,40}$'),
  label text not null, description text not null default '', icon text not null default 'compass',
  next_step text not null default '', next_step_href text not null default '/contact', email_required boolean not null default true,
  sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now());

create table if not exists public.form_questions (
  id uuid primary key default gen_random_uuid(), purpose_key text not null references public.form_purposes(key) on update cascade on delete cascade,
  key text not null, label text not null, help text not null default '',
  type text not null default 'text' check (type in ('text','textarea','select','multiselect','services')),
  options text[] not null default '{}', required boolean not null default false, sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (purpose_key, key));

-- Private: submissions -----------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  purpose text not null, name text not null check (char_length(name) between 1 and 100),
  email text check (email is null or char_length(email) <= 200), phone text check (phone is null or char_length(phone) <= 30),
  services text[] not null default '{}', answers jsonb not null default '{}', source_path text,
  status text not null default 'new' check (status in ('new','contacted','in_progress','won','lost','spam')),
  notes text, notifications jsonb, ip_hash text, user_agent text);

create index if not exists submissions_created_idx on public.submissions (created_at desc);
create index if not exists submissions_status_idx on public.submissions (status);
create index if not exists submissions_ip_idx on public.submissions (ip_hash, created_at);
create index if not exists services_cat_idx on public.services (category_slug, sort_order);
create index if not exists packages_service_idx on public.service_packages (service_id);
create index if not exists faqs_service_idx on public.faqs (service_id);
create index if not exists questions_purpose_idx on public.form_questions (purpose_key);

-- updated_at triggers, grants and RLS -------------------------------------
do $$
declare t text;
begin
  foreach t in array array['site_settings','social_links','categories','services','service_packages','faqs','offers','projects','achievements','form_purposes','form_questions','submissions'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists admin_all on public.%I', t);
    execute format('create policy admin_all on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    if t <> 'submissions' then
      execute format('grant select on public.%I to anon', t);
      execute format('drop policy if exists public_read on public.%I', t);
      if t = 'site_settings' then
        execute format('create policy public_read on public.%I for select to anon, authenticated using (true)', t);
      else
        execute format('create policy public_read on public.%I for select to anon, authenticated using (published)', t);
      end if;
    end if;
  end loop;
end $$;

alter table public.admin_emails enable row level security;
revoke all on public.admin_emails from anon, authenticated;
grant all on public.admin_emails to service_role;
revoke all on public.submissions from anon;

-- Seed data ----------------------------------------------------------------
`;

let seed = "";
seed += ins("site_settings", ["key", "value"], Object.entries(S.seedSettings).map(([key, value]) => ({ key, value })), "key");
seed += ins("social_links", ["label", "url", "icon", "sort_order"], S.seedSocials, "url");
seed += ins("categories", ["slug", "name", "description", "icon", "sort_order"], S.seedCategories, "slug");
seed += ins("services", ["slug", "category_slug", "name", "tagline", "summary", "description", "icon", "includes", "audience", "process", "purpose_keys", "fiverr_url", "featured", "sort_order"], S.seedServices as any, "slug");
for (const s of S.seedServices) {
  const sid = `(select id from public.services where slug = ${q(s.slug)})`;
  for (const p of s.packages)
    seed += `insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values (${sid},${q(p.name)},${q(p.description)},${q(p.price_label)},${q(p.price_amount)},${q(p.currency)},${q(p.delivery)},${q(p.features)},${p.sort_order}) on conflict (service_id,name) do nothing;\n`;
  for (const f of s.faqs)
    seed += `insert into public.faqs (service_id,question,answer,sort_order) values (${sid},${q(f.question)},${q(f.answer)},${f.sort_order}) on conflict (service_id,question) do nothing;\n`;
}
seed += ins("offers", ["slug", "title", "description", "badge", "service_slug", "purpose_keys", "cta_label", "ends_at", "featured", "sort_order"], S.seedOffers as any, "slug");
seed += ins("projects", ["slug", "title", "summary", "description", "status", "tags", "highlights", "purpose_keys", "repo_url", "live_url", "featured", "sort_order"], S.seedProjects as any, "slug");
seed += ins("form_purposes", ["key", "label", "description", "icon", "next_step", "next_step_href", "email_required", "sort_order"], S.seedPurposes as any, "key");
seed += ins(
  "form_questions",
  ["purpose_key", "key", "label", "help", "type", "options", "required", "sort_order"],
  S.seedPurposes.flatMap((p) => p.questions.map((qq) => ({ ...qq, purpose_key: p.key }))) as any,
  "purpose_key, key",
);
// empty text[] needs a cast
const out = (schema + seed).replace(/array\[\]::text\[\]/g, "'{}'::text[]");
writeFileSync("supabase/setup.sql", out);
console.log("wrote supabase/setup.sql", out.length);
