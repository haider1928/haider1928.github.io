// Built-in starter content. It mirrors the seed rows in supabase/setup.sql
// (that file is generated from this one) and is shown until the database is connected.
import type {
  Achievement,
  Category,
  Offer,
  Project,
  Purpose,
  Service,
  Settings,
  SocialLink,
} from "./types";

const FIVERR = "https://www.fiverr.com/haidermohsinn";

export const seedSettings: Settings = {
  site_name: "Haider Mohsin",
  hero_eyebrow: "Developer · Security practitioner · Lahore",
  hero_title: "Software that ships. Systems that hold.",
  hero_subtitle:
    "I build web apps, Python tools and AI agents, then try to break them before anyone else does. Pick a service, tap Buy, and I'll reply personally.",
  email: "hello@haidermohsin.com",
  whatsapp_number: "923318888878",
  whatsapp_message: "Hi Haider, I found you on haidermohsin.com and wanted to ask about",
  location: "Lahore, Pakistan",
  availability: "Open for new projects and students",
  about_title: "Hi, I'm Haider.",
  about_story:
    "I'm a developer and cybersecurity practitioner from Lahore. I started by writing Python scripts to automate boring things, moved into building full web apps, and got pulled into security once I realised how many of those apps could be broken in an afternoon.\n\nToday I work on both sides: I build products for clients and students, and I test systems the way an attacker would so the people who own them can sleep better. I like small, honest scopes, clear communication and shipping things that actually get used.",
  about_now:
    "Building SkillBridge, a talent marketplace for students of Punjab Group of Colleges, and organising a live attack-and-defend hacking event for student teams.",
  skills:
    "Python, TypeScript, React, Node.js, SQL, Supabase, REST APIs, Linux, Burp Suite, Nmap, OWASP Top 10, Recon & OSINT, LLM agents, Automation",
  github_user: "haider1928",
  fiverr_url: FIVERR,
  // Left empty on purpose: fill these in (Supabase → site_settings) and they appear on the site.
  linkedin_url: "",
  htb_profile_url: "",
};

export const seedSocials: SocialLink[] = [
  { label: "GitHub", url: "https://github.com/haider1928", icon: "github", sort_order: 1 },
  { label: "Fiverr", url: FIVERR, icon: "fiverr", sort_order: 2 },
  {
    label: "Instagram",
    url: "https://instagram.com/haidermohsin_official",
    icon: "instagram",
    sort_order: 3,
  },
  { label: "Email", url: "mailto:hello@haidermohsin.com", icon: "mail", sort_order: 4 },
];

export const seedCategories: Category[] = [
  {
    slug: "development",
    name: "Development",
    description: "Web apps and Python software built to last.",
    icon: "code",
    sort_order: 1,
  },
  {
    slug: "security",
    name: "Security",
    description: "Find the weak spots before attackers do.",
    icon: "shield",
    sort_order: 2,
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    description: "Agents and scripts that do the busywork.",
    icon: "bot",
    sort_order: 3,
  },
  {
    slug: "learning",
    name: "Learning",
    description: "Learn Python with a patient, practical tutor.",
    icon: "graduation",
    sort_order: 4,
  },
];

const quote = (
  name: string,
  description: string,
  delivery: string,
  features: string[],
  i: number,
) => ({
  name,
  description,
  price_label: "Custom quote",
  price_amount: null,
  currency: "USD",
  delivery,
  features,
  sort_order: i,
});

export const seedServices: Service[] = [
  {
    slug: "web-development",
    category_slug: "development",
    name: "Web Development",
    tagline: "Fast, secure websites and web apps, built properly.",
    summary:
      "From a polished landing page to a full web app with logins, dashboards and a database.",
    description:
      "I design and build modern websites and web applications with clean code, sensible hosting and security baked in from day one, not bolted on later. You get something fast on phones, easy to update and safe to grow.",
    icon: "code",
    includes: [
      "Responsive, mobile-first design",
      "Frontend and backend development",
      "Database, logins and admin panels",
      "Basic SEO and analytics setup",
      "Security hardening before launch",
      "Handover notes and a walkthrough",
    ],
    audience: [
      "Small businesses that need a real website",
      "Founders validating an idea",
      "Teams replacing a slow or outdated site",
    ],
    process: [
      {
        title: "Discovery call",
        body: "We agree on goals, pages, features and a realistic timeline.",
      },
      {
        title: "Plan & design",
        body: "A clear scope and a visual direction you approve before code.",
      },
      { title: "Build in the open", body: "Regular previews so you see progress and can steer." },
      { title: "Launch & handover", body: "Deploy, test, secure, and show you how to run it." },
    ],
    purpose_keys: ["business"],
    fiverr_url: FIVERR,
    featured: true,
    sort_order: 1,
    packages: [
      quote(
        "Landing page",
        "A single, high-converting page.",
        "About 1 week",
        ["Up to 1 page", "Contact form", "Mobile-first"],
        1,
      ),
      quote(
        "Business site",
        "A multi-page site you can grow.",
        "2–3 weeks",
        ["Up to 6 pages", "CMS or editable content", "SEO basics"],
        2,
      ),
      quote(
        "Web app",
        "Custom features, logins and data.",
        "Scoped together",
        ["Auth & database", "Admin dashboard", "Security review"],
        3,
      ),
    ],
    faqs: [
      {
        question: "Which technologies do you use?",
        answer:
          "Usually React/TypeScript with a managed backend, but I pick what fits your project and budget.",
        sort_order: 1,
      },
      {
        question: "Can I edit the content myself?",
        answer:
          "Yes. I can set things up so text, images and listings are editable without touching code.",
        sort_order: 2,
      },
    ],
  },
  {
    slug: "pentesting",
    category_slug: "security",
    name: "Pentesting",
    tagline: "A real attacker's view of your app, with a fix list.",
    summary:
      "Manual penetration testing of web apps and APIs, with clear findings and remediation steps.",
    description:
      "I test your application the way a motivated attacker would: authentication, access control, injection, business logic and more. Every finding comes with evidence, impact and a practical fix. Testing only happens with your written permission and an agreed scope.",
    icon: "shield",
    includes: [
      "Scoping and rules of engagement",
      "Manual testing based on OWASP guidance",
      "Authentication and access-control checks",
      "API and business-logic testing",
      "Written report with severity and fixes",
      "One free retest of fixed issues",
    ],
    audience: [
      "Startups before a launch or investor review",
      "Companies handling customer data",
      "Developers who want a second pair of eyes",
    ],
    process: [
      {
        title: "Scope & permission",
        body: "We define targets, test window and sign a simple authorisation.",
      },
      { title: "Recon & mapping", body: "I map the attack surface and how the app really works." },
      { title: "Testing", body: "Hands-on testing for vulnerabilities and logic flaws." },
      {
        title: "Report & retest",
        body: "Clear findings, a debrief call, and a retest once fixed.",
      },
    ],
    purpose_keys: ["security", "business"],
    fiverr_url: FIVERR,
    featured: true,
    sort_order: 2,
    packages: [
      quote(
        "Focused test",
        "One app area or a small site.",
        "3–5 days",
        ["Limited scope", "Report with fixes"],
        1,
      ),
      quote(
        "Full web app",
        "Complete application test.",
        "1–2 weeks",
        ["Full scope", "API coverage", "Retest included"],
        2,
      ),
    ],
    faqs: [
      {
        question: "Will testing break my site?",
        answer:
          "I test carefully and agree on what's off-limits. Production-sensitive tests can run on staging.",
        sort_order: 1,
      },
      {
        question: "Do you need my written permission?",
        answer: "Always. I never test anything without explicit authorisation from the owner.",
        sort_order: 2,
      },
    ],
  },
  {
    slug: "security-scan",
    category_slug: "security",
    name: "Security Scan",
    tagline: "A quick health check for your website's security.",
    summary:
      "Automated and manual checks for common misconfigurations, outdated software and exposed data.",
    description:
      "A lighter, faster alternative to a full pentest. I scan your site for common issues such as missing security headers, weak TLS, exposed files, outdated plugins and known vulnerabilities, then explain what matters in plain language.",
    icon: "scan",
    includes: [
      "Security headers and TLS review",
      "Known-vulnerability and version checks",
      "Exposed files and directories",
      "Basic misconfiguration checks",
      "Plain-language summary with priorities",
    ],
    audience: [
      "Small business and WordPress sites",
      "Anyone who's never had a security check",
      "Teams wanting a quick baseline",
    ],
    process: [
      { title: "Share your site", body: "Tell me the domain and confirm you own it." },
      { title: "Scan", body: "Automated tools plus manual verification to remove false alarms." },
      { title: "Summary", body: "A short report: what's wrong, how bad it is, how to fix it." },
    ],
    purpose_keys: ["security", "business", "exploring"],
    fiverr_url: FIVERR,
    featured: true,
    sort_order: 3,
    packages: [
      quote(
        "Quick check",
        "Headline issues on one domain.",
        "1–2 days",
        ["Headers & TLS", "Top issues list"],
        1,
      ),
      quote(
        "Detailed scan",
        "Deeper checks with a written report.",
        "3–4 days",
        ["Manual verification", "Full report"],
        2,
      ),
    ],
    faqs: [
      {
        question: "Is this the same as a pentest?",
        answer:
          "No. A scan finds common, known issues quickly. A pentest goes deep into logic and custom flaws.",
        sort_order: 1,
      },
    ],
  },
  {
    slug: "recon",
    category_slug: "security",
    name: "Recon",
    tagline: "See what the internet already knows about you.",
    summary:
      "Attack-surface and OSINT reconnaissance: subdomains, exposed services, leaked data and more.",
    description:
      "Before attackers strike, they research. I map your organisation's public footprint: domains, subdomains, open services, technologies, leaked credentials and exposed documents, so you can close doors you didn't know were open.",
    icon: "radar",
    includes: [
      "Domain and subdomain discovery",
      "Exposed services and technologies",
      "Public code and credential leak checks",
      "OSINT on public company footprint",
      "Prioritised findings report",
    ],
    audience: [
      "Companies preparing for a pentest",
      "Bug bounty programme owners",
      "Teams with lots of legacy domains",
    ],
    process: [
      { title: "Scope", body: "Agree which domains and organisation names are in scope." },
      { title: "Discovery", body: "Passive and light active recon across public sources." },
      { title: "Report", body: "A map of your attack surface and what to fix first." },
    ],
    purpose_keys: ["security", "business"],
    fiverr_url: FIVERR,
    featured: false,
    sort_order: 4,
    packages: [
      quote(
        "Recon report",
        "Full attack-surface map.",
        "3–5 days",
        ["Subdomains & services", "Leak checks", "Report"],
        1,
      ),
    ],
    faqs: [
      {
        question: "Is recon legal?",
        answer:
          "Yes, when done on your own assets with permission and using public sources. I stay within the agreed scope.",
        sort_order: 1,
      },
    ],
  },
  {
    slug: "python-development",
    category_slug: "development",
    name: "Python Development",
    tagline: "Scripts, tools and backends written in clean Python.",
    summary: "Custom Python software: CLIs, APIs, data processing, scrapers and integrations.",
    description:
      "Need a tool that does exactly what you want? I write readable, tested Python: from small utilities to APIs and data pipelines, documented so you or your team can maintain them.",
    icon: "terminal",
    includes: [
      "Requirements and design",
      "Clean, documented Python code",
      "APIs, CLIs or data pipelines",
      "Basic tests",
      "Setup and usage guide",
    ],
    audience: [
      "Businesses with repetitive data work",
      "Developers who need extra hands",
      "Researchers and students with a project",
    ],
    process: [
      { title: "Brief", body: "Tell me the problem, inputs and the result you want." },
      { title: "Build", body: "I write and test the code, sharing progress along the way." },
      { title: "Deliver", body: "Code, instructions and a short walkthrough." },
    ],
    purpose_keys: ["business"],
    fiverr_url: FIVERR,
    featured: false,
    sort_order: 5,
    packages: [
      quote("Script / tool", "A focused utility.", "Few days", ["Source code", "Usage guide"], 1),
      quote(
        "API / backend",
        "A service your apps can call.",
        "1–3 weeks",
        ["API endpoints", "Docs & tests"],
        2,
      ),
    ],
    faqs: [
      {
        question: "Will I own the code?",
        answer: "Yes, you get full source code and rights once the project is paid.",
        sort_order: 1,
      },
    ],
  },
  {
    slug: "automation",
    category_slug: "ai-automation",
    name: "Automation",
    tagline: "Stop doing the same task twice.",
    summary: "Automate spreadsheets, reports, data entry, web tasks and app-to-app workflows.",
    description:
      "If you copy, paste, download or click the same things every week, it can probably be automated. I build reliable automations with Python and modern tools that save hours and reduce mistakes.",
    icon: "workflow",
    includes: [
      "Workflow review",
      "Automation scripts or integrations",
      "Scheduling and error alerts",
      "Documentation and handover",
    ],
    audience: [
      "Small teams drowning in admin",
      "Shops and agencies with manual reporting",
      "Anyone using lots of spreadsheets",
    ],
    process: [
      { title: "Map the task", body: "We walk through the workflow step by step." },
      { title: "Automate", body: "I build and test the automation with your real data." },
      { title: "Run it", body: "Schedule it, monitor it, and hand it over." },
    ],
    purpose_keys: ["business"],
    fiverr_url: FIVERR,
    featured: true,
    sort_order: 6,
    packages: [
      quote(
        "Single workflow",
        "Automate one recurring task.",
        "Few days",
        ["Script or integration", "Guide"],
        1,
      ),
    ],
    faqs: [
      {
        question: "What can't be automated?",
        answer:
          "Tasks that need real judgement every time. I'll tell you honestly if automation isn't worth it.",
        sort_order: 1,
      },
    ],
  },
  {
    slug: "agentic-ai-development",
    category_slug: "ai-automation",
    name: "Agentic AI Development",
    tagline: "AI agents that take real actions, safely.",
    summary:
      "LLM-powered assistants and agents that use tools, search your data and complete multi-step tasks.",
    description:
      "I build AI agents that do more than chat: they look things up, call APIs, fill forms and hand off to humans when needed. With a security background, I pay attention to prompt injection, data leaks and safe permissions.",
    icon: "bot",
    includes: [
      "Use-case and feasibility review",
      "Agent design with tools and guardrails",
      "Integration with your data or APIs",
      "Testing for safety and reliability",
      "Deployment and monitoring basics",
    ],
    audience: [
      "Businesses exploring practical AI",
      "Support and operations teams",
      "Founders building AI products",
    ],
    process: [
      { title: "Use case", body: "Pick a narrow, valuable task for the agent." },
      { title: "Prototype", body: "A working demo you can try quickly." },
      { title: "Harden", body: "Guardrails, evaluations and safe permissions." },
      { title: "Ship", body: "Deploy and measure real results." },
    ],
    purpose_keys: ["business", "collaboration"],
    fiverr_url: FIVERR,
    featured: true,
    sort_order: 7,
    packages: [
      quote("Prototype", "A working agent demo.", "1–2 weeks", ["Core flow", "Demo"], 1),
      quote(
        "Production agent",
        "Hardened and integrated.",
        "Scoped together",
        ["Guardrails", "Integrations", "Monitoring"],
        2,
      ),
    ],
    faqs: [
      {
        question: "Is my data safe with AI?",
        answer:
          "I design agents to access only what they need and discuss which AI providers fit your privacy needs.",
        sort_order: 1,
      },
    ],
  },
  {
    slug: "python-teaching",
    category_slug: "learning",
    name: "Python Teaching",
    tagline: "Learn Python by building real things.",
    summary: "One-to-one or small-group Python lessons for beginners and intermediates.",
    description:
      "Patient, practical lessons tailored to your level and goals, whether that's passing a course, starting a career, or automating your own work. We learn by building small projects, not memorising syntax.",
    icon: "graduation",
    includes: [
      "Level check and learning plan",
      "Live sessions (online)",
      "Hands-on mini projects",
      "Homework and code review",
      "Help with your own projects",
    ],
    audience: [
      "Students and complete beginners",
      "Professionals switching careers",
      "Learners stuck on tutorials",
    ],
    process: [
      { title: "Intro chat", body: "We talk about your level, goals and schedule." },
      { title: "Plan", body: "A personal roadmap of topics and projects." },
      { title: "Learn by doing", body: "Regular sessions with practice and feedback." },
    ],
    purpose_keys: ["learn"],
    fiverr_url: FIVERR,
    featured: true,
    sort_order: 8,
    packages: [
      quote(
        "Single session",
        "Try a lesson or get unstuck.",
        "1 hour",
        ["Live session", "Notes"],
        1,
      ),
      quote(
        "Monthly plan",
        "Regular weekly lessons.",
        "4+ sessions",
        ["Learning plan", "Projects", "Code review"],
        2,
      ),
    ],
    faqs: [
      {
        question: "Do I need any experience?",
        answer: "No. Complete beginners are very welcome.",
        sort_order: 1,
      },
      {
        question: "Are lessons online?",
        answer: "Yes, online by video call, so you can join from anywhere.",
        sort_order: 2,
      },
    ],
  },
];

export const seedOffers: Offer[] = [
  {
    slug: "free-consultation",
    title: "Free 20-minute consultation",
    description: "Not sure what you need? Book a short call and get honest advice, no obligation.",
    badge: "Free",
    service_slug: null,
    purpose_keys: ["business", "collaboration", "exploring"],
    cta_label: "Book a call",
    ends_at: null,
    featured: true,
    sort_order: 1,
  },
  {
    slug: "security-scan-discount",
    title: "Discounted security scan",
    description: "First-time clients get a reduced price on a Quick Security Scan for one domain.",
    badge: "Limited",
    service_slug: "security-scan",
    purpose_keys: ["security", "business"],
    cta_label: "Claim offer",
    ends_at: null,
    featured: true,
    sort_order: 2,
  },
  {
    slug: "student-python-discount",
    title: "Student discount on Python lessons",
    description:
      "Students get a special rate on Python Teaching. Mention your college when you ask.",
    badge: "Students",
    service_slug: "python-teaching",
    purpose_keys: ["learn"],
    cta_label: "Ask about it",
    ends_at: null,
    featured: true,
    sort_order: 3,
  },
];

export const seedProjects: Project[] = [
  {
    slug: "skillbridge",
    title: "SkillBridge",
    summary: "A talent marketplace connecting students of Punjab Group of Colleges with real work.",
    description:
      "SkillBridge helps students showcase their skills and find freelance and internship opportunities, while giving local businesses an easy way to hire young talent. It's currently in development.",
    status: "in_development",
    tags: ["Marketplace", "Web app", "Students"],
    highlights: [
      "Student profiles and skill showcases",
      "Gigs and opportunities board",
      "Built for Punjab Group of Colleges",
    ],
    purpose_keys: ["business", "collaboration", "exploring"],
    repo_url: null,
    live_url: null,
    featured: true,
    sort_order: 1,
  },
  {
    slug: "live-hacking-event",
    title: "Live Hacking Event",
    summary:
      "An attack-and-defend competition where student teams build, break and protect websites.",
    description:
      "Each student team builds two sites: one deliberately vulnerable and one hardened. Then teams attack each other's targets and defend their own in real time. The goal is to teach security by doing it. Currently in development.",
    status: "in_development",
    tags: ["Cybersecurity", "Event", "Education"],
    highlights: [
      "Attack & defend format",
      "Vulnerable vs secure builds",
      "Hands-on learning for students",
    ],
    purpose_keys: ["security", "learn", "collaboration"],
    repo_url: null,
    live_url: null,
    featured: true,
    sort_order: 2,
  },
];

// Only real achievements supplied by Haider. `link` is null where the URL is still to be filled in;
// for "HTB badge" rows `link` is an optional badge image URL. Titles must stay unique.
const ach = (
  sort_order: number,
  kind: string,
  title: string,
  description = "",
  link: string | null = null,
): Achievement => ({
  title,
  description,
  kind,
  link,
  achieved_on: null,
  sort_order,
});

export const seedAchievements: Achievement[] = [
  ach(
    1,
    "Hardware",
    "VoIP calling system on bare ESP32 hardware",
    "Built a fully functional VoIP calling system on bare hardware using ESP32 microcontrollers and SIP.",
  ),

  ach(
    10,
    "Repository",
    "OzMed AI",
    "A sysadmin assistant that runs Python, PowerShell and system commands, can be sandboxed, and runs in the background.",
    "https://github.com/haider1928/ozmed",
  ),
  ach(11, "Repository", "AI Bug Hunter", "An AI agent for security testing."),
  ach(
    12,
    "Repository",
    "Instagram automation pipeline",
    "A Python pipeline that fetches content, edits and posts it automatically, and manages the account.",
  ),

  ach(
    20,
    "Live project",
    "PCTLS SkillBridge",
    "A student marketplace where students buy and sell skills. Built with React, Vite, TypeScript, Tailwind and Supabase. The first version is live and still in development.",
    "https://skillbridge.haidermohsin.com/",
  ),
  ach(
    21,
    "Live project",
    "Board Ready",
    "An AI study planner app for matric students, with an AI assistant and a fox mascot.",
  ),

  ach(30, "HTB badge", "Constant Champion", "4 weekly streaks in a row"),
  ach(31, "HTB badge", "Cyber Rookie 365", "1 year"),
  ach(32, "HTB badge", "Binary Duo Explorer", "2 years"),
  ach(33, "HTB badge", "Unwavering User"),
  ach(34, "HTB badge", "Cyber Starter"),
  ach(35, "HTB badge", "Developer"),
  ach(36, "HTB badge", "Your request is my demand"),

  ach(
    40,
    "LinkedIn",
    "LinkedIn profile with consistent content",
    "Established a LinkedIn profile with consistent content uploads.",
  ),
  ach(41, "LinkedIn post", "I Built an AI Agent That Runs Its Own Pentests"),
  ach(
    42,
    "LinkedIn post",
    "The Load Balancer That Trusted a Header",
    "Auth bypass to password reset poisoning",
  ),
  ach(43, "LinkedIn post", "The Password Reset Token That Wasn't Actually Checked"),
  ach(44, "LinkedIn post", "From a Stored XSS to a Cracked MD5"),
  ach(45, "LinkedIn post", "Breaking a Remember Me Cookie"),

  ach(
    50,
    "Upcoming",
    "Web security seminar at Punjab College",
    "Organizing a seminar for 200+ expected students where teams build a vulnerable website and a secure one, then attack and defend them.",
  ),

  ach(
    60,
    "Experience",
    "4 years of hands-on coding",
    "Python automation and scraping, web development and cybersecurity.",
  ),
  ach(61, "Practice", "Hands-on lab practice", "TryHackMe, Hack The Box and PortSwigger labs."),
  ach(
    62,
    "Tools",
    "Tools I use",
    "Burp Suite, Nmap, Wireshark, Metasploit, sqlmap, Gobuster, ffuf, Hashcat, John",
  ),

  ach(70, "Planned", "eJPT certification"),
];

export const seedPurposes: Purpose[] = [
  {
    key: "exploring",
    label: "Just exploring",
    description: "Having a look around. No pressure at all.",
    icon: "compass",
    next_step: "Curious how secure your own site is? Try a free quick security check.",
    next_step_href: "/services/security-scan",
    email_required: false,
    sort_order: 1,
    questions: [
      {
        key: "message",
        label: "Anything you'd like to say? (optional)",
        help: "",
        type: "textarea",
        options: [],
        required: false,
        sort_order: 1,
      },
    ],
  },
  {
    key: "business",
    label: "Hire me for business",
    description: "You have a project, product or problem to solve.",
    icon: "briefcase",
    next_step: "Start with a free 20-minute consultation to scope your project.",
    next_step_href: "/contact",
    email_required: true,
    sort_order: 2,
    questions: [
      {
        key: "services",
        label: "Which services are you interested in?",
        help: "Pick any that apply.",
        type: "services",
        options: [],
        required: true,
        sort_order: 1,
      },
      {
        key: "budget",
        label: "Rough budget",
        help: "",
        type: "select",
        options: ["Under $250", "$250 – $1,000", "$1,000 – $5,000", "$5,000+", "Not sure yet"],
        required: false,
        sort_order: 2,
      },
      {
        key: "timeline",
        label: "Timeline",
        help: "",
        type: "select",
        options: ["ASAP", "Within a month", "1–3 months", "Flexible"],
        required: false,
        sort_order: 3,
      },
      {
        key: "message",
        label: "Tell me about the project",
        help: "Goals, current situation, links.",
        type: "textarea",
        options: [],
        required: true,
        sort_order: 4,
      },
    ],
  },
  {
    key: "learn",
    label: "Learn Python",
    description: "Lessons for beginners and improvers.",
    icon: "graduation",
    next_step: "Students get a special rate. Ask about the student discount.",
    next_step_href: "/services/python-teaching",
    email_required: true,
    sort_order: 3,
    questions: [
      {
        key: "level",
        label: "Your current level",
        help: "",
        type: "select",
        options: ["Complete beginner", "Know the basics", "Intermediate", "Advanced"],
        required: true,
        sort_order: 1,
      },
      {
        key: "goals",
        label: "What do you want to achieve?",
        help: "",
        type: "textarea",
        options: [],
        required: true,
        sort_order: 2,
      },
      {
        key: "format",
        label: "Preferred format",
        help: "",
        type: "select",
        options: ["One-to-one", "Small group", "Either"],
        required: false,
        sort_order: 3,
      },
    ],
  },
  {
    key: "security",
    label: "Security check",
    description: "For your website, app or company.",
    icon: "shield",
    next_step: "Want a free quick security check? Start with a Security Scan.",
    next_step_href: "/services/security-scan",
    email_required: true,
    sort_order: 4,
    questions: [
      {
        key: "services",
        label: "What kind of check?",
        help: "",
        type: "services",
        options: [],
        required: false,
        sort_order: 1,
      },
      {
        key: "target",
        label: "Website or company name",
        help: "Only assets you own or are authorised to test.",
        type: "text",
        options: [],
        required: true,
        sort_order: 2,
      },
      {
        key: "message",
        label: "What worries you most?",
        help: "",
        type: "textarea",
        options: [],
        required: false,
        sort_order: 3,
      },
    ],
  },
  {
    key: "collaboration",
    label: "Collaboration or other",
    description: "Events, partnerships, ideas or anything else.",
    icon: "handshake",
    next_step: "See what I'm building right now. Maybe we can build together.",
    next_step_href: "/projects",
    email_required: true,
    sort_order: 5,
    questions: [
      {
        key: "message",
        label: "What did you have in mind?",
        help: "",
        type: "textarea",
        options: [],
        required: true,
        sort_order: 1,
      },
    ],
  },
];
