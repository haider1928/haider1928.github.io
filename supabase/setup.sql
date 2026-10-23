-- haidermohsin.com — full Supabase setup. Safe to re-run.
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
insert into public.site_settings (key,value) values
  ('site_name','Haider Mohsin'),
  ('hero_eyebrow','Developer · Security practitioner · Lahore'),
  ('hero_title','Software that ships. Systems that hold.'),
  ('hero_subtitle','I build web apps, Python tools and AI agents, then try to break them before anyone else does. Pick a service, add it to your request, and I''ll reply personally.'),
  ('email','hello@haidermohsin.com'),
  ('whatsapp_number','923318888878'),
  ('whatsapp_message','Hi Haider, I found you on haidermohsin.com and wanted to ask about'),
  ('location','Lahore, Pakistan'),
  ('availability','Open for new projects and students'),
  ('about_title','Hi, I''m Haider.'),
  ('about_story','I''m a developer and cybersecurity practitioner from Lahore. I started by writing Python scripts to automate boring things, moved into building full web apps, and got pulled into security once I realised how many of those apps could be broken in an afternoon.

Today I work on both sides: I build products for clients and students, and I test systems the way an attacker would so the people who own them can sleep better. I like small, honest scopes, clear communication and shipping things that actually get used.'),
  ('about_now','Building SkillBridge, a talent marketplace for students of Punjab Group of Colleges, and organising a live attack-and-defend hacking event for student teams.'),
  ('skills','Python, TypeScript, React, Node.js, SQL, Supabase, REST APIs, Linux, Burp Suite, Nmap, OWASP Top 10, Recon & OSINT, LLM agents, Automation'),
  ('github_user','haider1928'),
  ('fiverr_url','https://www.fiverr.com/haidermohsinn')
on conflict (key) do nothing;
insert into public.social_links (label,url,icon,sort_order) values
  ('GitHub','https://github.com/haider1928','github',1),
  ('Fiverr','https://www.fiverr.com/haidermohsinn','fiverr',2),
  ('Instagram','https://instagram.com/haidermohsin_official','instagram',3),
  ('Email','mailto:hello@haidermohsin.com','mail',4)
on conflict (url) do nothing;
insert into public.categories (slug,name,description,icon,sort_order) values
  ('development','Development','Web apps and Python software built to last.','code',1),
  ('security','Security','Find the weak spots before attackers do.','shield',2),
  ('ai-automation','AI & Automation','Agents and scripts that do the busywork.','bot',3),
  ('learning','Learning','Learn Python with a patient, practical tutor.','graduation',4)
on conflict (slug) do nothing;
insert into public.services (slug,category_slug,name,tagline,summary,description,icon,includes,audience,process,purpose_keys,fiverr_url,featured,sort_order) values
  ('web-development','development','Web Development','Fast, secure websites and web apps, built properly.','From a polished landing page to a full web app with logins, dashboards and a database.','I design and build modern websites and web applications with clean code, sensible hosting and security baked in from day one, not bolted on later. You get something fast on phones, easy to update and safe to grow.','code',array['Responsive, mobile-first design','Frontend and backend development','Database, logins and admin panels','Basic SEO and analytics setup','Security hardening before launch','Handover notes and a walkthrough']::text[],array['Small businesses that need a real website','Founders validating an idea','Teams replacing a slow or outdated site']::text[],'[{"title":"Discovery call","body":"We agree on goals, pages, features and a realistic timeline."},{"title":"Plan & design","body":"A clear scope and a visual direction you approve before code."},{"title":"Build in the open","body":"Regular previews so you see progress and can steer."},{"title":"Launch & handover","body":"Deploy, test, secure, and show you how to run it."}]'::jsonb,array['business']::text[],'https://www.fiverr.com/haidermohsinn',true,1),
  ('pentesting','security','Pentesting','A real attacker''s view of your app, with a fix list.','Manual penetration testing of web apps and APIs, with clear findings and remediation steps.','I test your application the way a motivated attacker would: authentication, access control, injection, business logic and more. Every finding comes with evidence, impact and a practical fix. Testing only happens with your written permission and an agreed scope.','shield',array['Scoping and rules of engagement','Manual testing based on OWASP guidance','Authentication and access-control checks','API and business-logic testing','Written report with severity and fixes','One free retest of fixed issues']::text[],array['Startups before a launch or investor review','Companies handling customer data','Developers who want a second pair of eyes']::text[],'[{"title":"Scope & permission","body":"We define targets, test window and sign a simple authorisation."},{"title":"Recon & mapping","body":"I map the attack surface and how the app really works."},{"title":"Testing","body":"Hands-on testing for vulnerabilities and logic flaws."},{"title":"Report & retest","body":"Clear findings, a debrief call, and a retest once fixed."}]'::jsonb,array['security','business']::text[],'https://www.fiverr.com/haidermohsinn',true,2),
  ('security-scan','security','Security Scan','A quick health check for your website''s security.','Automated and manual checks for common misconfigurations, outdated software and exposed data.','A lighter, faster alternative to a full pentest. I scan your site for common issues such as missing security headers, weak TLS, exposed files, outdated plugins and known vulnerabilities, then explain what matters in plain language.','scan',array['Security headers and TLS review','Known-vulnerability and version checks','Exposed files and directories','Basic misconfiguration checks','Plain-language summary with priorities']::text[],array['Small business and WordPress sites','Anyone who''s never had a security check','Teams wanting a quick baseline']::text[],'[{"title":"Share your site","body":"Tell me the domain and confirm you own it."},{"title":"Scan","body":"Automated tools plus manual verification to remove false alarms."},{"title":"Summary","body":"A short report: what''s wrong, how bad it is, how to fix it."}]'::jsonb,array['security','business','exploring']::text[],'https://www.fiverr.com/haidermohsinn',true,3),
  ('recon','security','Recon','See what the internet already knows about you.','Attack-surface and OSINT reconnaissance: subdomains, exposed services, leaked data and more.','Before attackers strike, they research. I map your organisation''s public footprint: domains, subdomains, open services, technologies, leaked credentials and exposed documents, so you can close doors you didn''t know were open.','radar',array['Domain and subdomain discovery','Exposed services and technologies','Public code and credential leak checks','OSINT on public company footprint','Prioritised findings report']::text[],array['Companies preparing for a pentest','Bug bounty programme owners','Teams with lots of legacy domains']::text[],'[{"title":"Scope","body":"Agree which domains and organisation names are in scope."},{"title":"Discovery","body":"Passive and light active recon across public sources."},{"title":"Report","body":"A map of your attack surface and what to fix first."}]'::jsonb,array['security','business']::text[],'https://www.fiverr.com/haidermohsinn',false,4),
  ('python-development','development','Python Development','Scripts, tools and backends written in clean Python.','Custom Python software: CLIs, APIs, data processing, scrapers and integrations.','Need a tool that does exactly what you want? I write readable, tested Python: from small utilities to APIs and data pipelines, documented so you or your team can maintain them.','terminal',array['Requirements and design','Clean, documented Python code','APIs, CLIs or data pipelines','Basic tests','Setup and usage guide']::text[],array['Businesses with repetitive data work','Developers who need extra hands','Researchers and students with a project']::text[],'[{"title":"Brief","body":"Tell me the problem, inputs and the result you want."},{"title":"Build","body":"I write and test the code, sharing progress along the way."},{"title":"Deliver","body":"Code, instructions and a short walkthrough."}]'::jsonb,array['business']::text[],'https://www.fiverr.com/haidermohsinn',false,5),
  ('automation','ai-automation','Automation','Stop doing the same task twice.','Automate spreadsheets, reports, data entry, web tasks and app-to-app workflows.','If you copy, paste, download or click the same things every week, it can probably be automated. I build reliable automations with Python and modern tools that save hours and reduce mistakes.','workflow',array['Workflow review','Automation scripts or integrations','Scheduling and error alerts','Documentation and handover']::text[],array['Small teams drowning in admin','Shops and agencies with manual reporting','Anyone using lots of spreadsheets']::text[],'[{"title":"Map the task","body":"We walk through the workflow step by step."},{"title":"Automate","body":"I build and test the automation with your real data."},{"title":"Run it","body":"Schedule it, monitor it, and hand it over."}]'::jsonb,array['business']::text[],'https://www.fiverr.com/haidermohsinn',true,6),
  ('agentic-ai-development','ai-automation','Agentic AI Development','AI agents that take real actions, safely.','LLM-powered assistants and agents that use tools, search your data and complete multi-step tasks.','I build AI agents that do more than chat: they look things up, call APIs, fill forms and hand off to humans when needed. With a security background, I pay attention to prompt injection, data leaks and safe permissions.','bot',array['Use-case and feasibility review','Agent design with tools and guardrails','Integration with your data or APIs','Testing for safety and reliability','Deployment and monitoring basics']::text[],array['Businesses exploring practical AI','Support and operations teams','Founders building AI products']::text[],'[{"title":"Use case","body":"Pick a narrow, valuable task for the agent."},{"title":"Prototype","body":"A working demo you can try quickly."},{"title":"Harden","body":"Guardrails, evaluations and safe permissions."},{"title":"Ship","body":"Deploy and measure real results."}]'::jsonb,array['business','collaboration']::text[],'https://www.fiverr.com/haidermohsinn',true,7),
  ('python-teaching','learning','Python Teaching','Learn Python by building real things.','One-to-one or small-group Python lessons for beginners and intermediates.','Patient, practical lessons tailored to your level and goals, whether that''s passing a course, starting a career, or automating your own work. We learn by building small projects, not memorising syntax.','graduation',array['Level check and learning plan','Live sessions (online)','Hands-on mini projects','Homework and code review','Help with your own projects']::text[],array['Students and complete beginners','Professionals switching careers','Learners stuck on tutorials']::text[],'[{"title":"Intro chat","body":"We talk about your level, goals and schedule."},{"title":"Plan","body":"A personal roadmap of topics and projects."},{"title":"Learn by doing","body":"Regular sessions with practice and feedback."}]'::jsonb,array['learn']::text[],'https://www.fiverr.com/haidermohsinn',true,8)
on conflict (slug) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'web-development'),'Landing page','A single, high-converting page.','Custom quote',null,'USD','About 1 week',array['Up to 1 page','Contact form','Mobile-first']::text[],1) on conflict (service_id,name) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'web-development'),'Business site','A multi-page site you can grow.','Custom quote',null,'USD','2–3 weeks',array['Up to 6 pages','CMS or editable content','SEO basics']::text[],2) on conflict (service_id,name) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'web-development'),'Web app','Custom features, logins and data.','Custom quote',null,'USD','Scoped together',array['Auth & database','Admin dashboard','Security review']::text[],3) on conflict (service_id,name) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'web-development'),'Which technologies do you use?','Usually React/TypeScript with a managed backend, but I pick what fits your project and budget.',1) on conflict (service_id,question) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'web-development'),'Can I edit the content myself?','Yes. I can set things up so text, images and listings are editable without touching code.',2) on conflict (service_id,question) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'pentesting'),'Focused test','One app area or a small site.','Custom quote',null,'USD','3–5 days',array['Limited scope','Report with fixes']::text[],1) on conflict (service_id,name) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'pentesting'),'Full web app','Complete application test.','Custom quote',null,'USD','1–2 weeks',array['Full scope','API coverage','Retest included']::text[],2) on conflict (service_id,name) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'pentesting'),'Will testing break my site?','I test carefully and agree on what''s off-limits. Production-sensitive tests can run on staging.',1) on conflict (service_id,question) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'pentesting'),'Do you need my written permission?','Always. I never test anything without explicit authorisation from the owner.',2) on conflict (service_id,question) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'security-scan'),'Quick check','Headline issues on one domain.','Custom quote',null,'USD','1–2 days',array['Headers & TLS','Top issues list']::text[],1) on conflict (service_id,name) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'security-scan'),'Detailed scan','Deeper checks with a written report.','Custom quote',null,'USD','3–4 days',array['Manual verification','Full report']::text[],2) on conflict (service_id,name) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'security-scan'),'Is this the same as a pentest?','No. A scan finds common, known issues quickly. A pentest goes deep into logic and custom flaws.',1) on conflict (service_id,question) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'recon'),'Recon report','Full attack-surface map.','Custom quote',null,'USD','3–5 days',array['Subdomains & services','Leak checks','Report']::text[],1) on conflict (service_id,name) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'recon'),'Is recon legal?','Yes, when done on your own assets with permission and using public sources. I stay within the agreed scope.',1) on conflict (service_id,question) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'python-development'),'Script / tool','A focused utility.','Custom quote',null,'USD','Few days',array['Source code','Usage guide']::text[],1) on conflict (service_id,name) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'python-development'),'API / backend','A service your apps can call.','Custom quote',null,'USD','1–3 weeks',array['API endpoints','Docs & tests']::text[],2) on conflict (service_id,name) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'python-development'),'Will I own the code?','Yes, you get full source code and rights once the project is paid.',1) on conflict (service_id,question) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'automation'),'Single workflow','Automate one recurring task.','Custom quote',null,'USD','Few days',array['Script or integration','Guide']::text[],1) on conflict (service_id,name) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'automation'),'What can''t be automated?','Tasks that need real judgement every time. I''ll tell you honestly if automation isn''t worth it.',1) on conflict (service_id,question) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'agentic-ai-development'),'Prototype','A working agent demo.','Custom quote',null,'USD','1–2 weeks',array['Core flow','Demo']::text[],1) on conflict (service_id,name) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'agentic-ai-development'),'Production agent','Hardened and integrated.','Custom quote',null,'USD','Scoped together',array['Guardrails','Integrations','Monitoring']::text[],2) on conflict (service_id,name) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'agentic-ai-development'),'Is my data safe with AI?','I design agents to access only what they need and discuss which AI providers fit your privacy needs.',1) on conflict (service_id,question) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'python-teaching'),'Single session','Try a lesson or get unstuck.','Custom quote',null,'USD','1 hour',array['Live session','Notes']::text[],1) on conflict (service_id,name) do nothing;
insert into public.service_packages (service_id,name,description,price_label,price_amount,currency,delivery,features,sort_order) values ((select id from public.services where slug = 'python-teaching'),'Monthly plan','Regular weekly lessons.','Custom quote',null,'USD','4+ sessions',array['Learning plan','Projects','Code review']::text[],2) on conflict (service_id,name) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'python-teaching'),'Do I need any experience?','No. Complete beginners are very welcome.',1) on conflict (service_id,question) do nothing;
insert into public.faqs (service_id,question,answer,sort_order) values ((select id from public.services where slug = 'python-teaching'),'Are lessons online?','Yes, online by video call, so you can join from anywhere.',2) on conflict (service_id,question) do nothing;
insert into public.offers (slug,title,description,badge,service_slug,purpose_keys,cta_label,ends_at,featured,sort_order) values
  ('free-consultation','Free 20-minute consultation','Not sure what you need? Book a short call and get honest advice, no obligation.','Free',null,array['business','collaboration','exploring']::text[],'Book a call',null,true,1),
  ('security-scan-discount','Discounted security scan','First-time clients get a reduced price on a Quick Security Scan for one domain.','Limited','security-scan',array['security','business']::text[],'Claim offer',null,true,2),
  ('student-python-discount','Student discount on Python lessons','Students get a special rate on Python Teaching. Mention your college when you ask.','Students','python-teaching',array['learn']::text[],'Ask about it',null,true,3)
on conflict (slug) do nothing;
insert into public.projects (slug,title,summary,description,status,tags,highlights,purpose_keys,repo_url,live_url,featured,sort_order) values
  ('skillbridge','SkillBridge','A talent marketplace connecting students of Punjab Group of Colleges with real work.','SkillBridge helps students showcase their skills and find freelance and internship opportunities, while giving local businesses an easy way to hire young talent. It''s currently in development.','in_development',array['Marketplace','Web app','Students']::text[],array['Student profiles and skill showcases','Gigs and opportunities board','Built for Punjab Group of Colleges']::text[],array['business','collaboration','exploring']::text[],null,null,true,1),
  ('live-hacking-event','Live Hacking Event','An attack-and-defend competition where student teams build, break and protect websites.','Each student team builds two sites: one deliberately vulnerable and one hardened. Then teams attack each other''s targets and defend their own in real time. The goal is to teach security by doing it. Currently in development.','in_development',array['Cybersecurity','Event','Education']::text[],array['Attack & defend format','Vulnerable vs secure builds','Hands-on learning for students']::text[],array['security','learn','collaboration']::text[],null,null,true,2)
on conflict (slug) do nothing;
insert into public.form_purposes (key,label,description,icon,next_step,next_step_href,email_required,sort_order) values
  ('exploring','Just exploring','Having a look around. No pressure at all.','compass','Curious how secure your own site is? Try a free quick security check.','/services/security-scan',false,1),
  ('business','Hire me for business','You have a project, product or problem to solve.','briefcase','Start with a free 20-minute consultation to scope your project.','/contact',true,2),
  ('learn','Learn Python','Lessons for beginners and improvers.','graduation','Students get a special rate. Ask about the student discount.','/services/python-teaching',true,3),
  ('security','Security check','For your website, app or company.','shield','Want a free quick security check? Start with a Security Scan.','/services/security-scan',true,4),
  ('collaboration','Collaboration or other','Events, partnerships, ideas or anything else.','handshake','See what I''m building right now. Maybe we can build together.','/projects',true,5)
on conflict (key) do nothing;
insert into public.form_questions (purpose_key,key,label,help,type,options,required,sort_order) values
  ('exploring','message','Anything you''d like to say? (optional)','','textarea','{}'::text[],false,1),
  ('business','services','Which services are you interested in?','Pick any that apply.','services','{}'::text[],true,1),
  ('business','budget','Rough budget','','select',array['Under $250','$250 – $1,000','$1,000 – $5,000','$5,000+','Not sure yet']::text[],false,2),
  ('business','timeline','Timeline','','select',array['ASAP','Within a month','1–3 months','Flexible']::text[],false,3),
  ('business','message','Tell me about the project','Goals, current situation, links.','textarea','{}'::text[],true,4),
  ('learn','level','Your current level','','select',array['Complete beginner','Know the basics','Intermediate','Advanced']::text[],true,1),
  ('learn','goals','What do you want to achieve?','','textarea','{}'::text[],true,2),
  ('learn','format','Preferred format','','select',array['One-to-one','Small group','Either']::text[],false,3),
  ('security','services','What kind of check?','','services','{}'::text[],false,1),
  ('security','target','Website or company name','Only assets you own or are authorised to test.','text','{}'::text[],true,2),
  ('security','message','What worries you most?','','textarea','{}'::text[],false,3),
  ('collaboration','message','What did you have in mind?','','textarea','{}'::text[],true,1)
on conflict (purpose_key, key) do nothing;
