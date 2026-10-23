# haidermohsin.com — setup & handoff

Until Supabase is connected, the site shows built-in starter content and the contact form offers "send by email / WhatsApp" instead of saving.

## 1. Create the database
1. Create a project at supabase.com (region near Pakistan, e.g. Mumbai/Singapore).
2. Open **SQL Editor → New query**, paste all of `supabase/setup.sql`, click **Run**. It is safe to run again.
   (If you change starter content in `src/lib/seed.ts`, regenerate with `bun scripts/gen-sql.ts`.)

## 2. Connect the site (Lovable → Settings → secrets / environment)
| Name | Where to find it | Used by |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | public site + admin |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | same page → anon / publishable key | public site + admin |
| `SUPABASE_URL` | same as above | server |
| `SUPABASE_SERVICE_ROLE_KEY` | same page → service_role / secret key (**never** in a VITE_ variable) | saving submissions |
| `RATE_LIMIT_SALT` | any random string | spam limits |

## 3. Your admin account
1. Supabase → **Authentication → Users → Add user** → `hello@haidermohsin.com` with a strong password (tick "auto confirm").
2. Authentication → Providers → Email: turn **off** "Allow new users to sign up".
3. Visit `/admin` and sign in. Only emails in the `admin_emails` table can see data — this is enforced by database security rules, not just the page.

## 4. Email notifications (main channel)
1. Sign up at resend.com → **Domains → Add** `haidermohsin.com` → add the DNS records it shows at your domain registrar → wait for "Verified".
2. Create an API key. Add secrets: `RESEND_API_KEY`, optional `NOTIFY_EMAIL_FROM` (default `Website <notifications@haidermohsin.com>`), optional `NOTIFY_EMAIL_TO` (default hello@haidermohsin.com).

## 5. WhatsApp notifications — options, honestly
**A. CallMeBot (free, 5 minutes, unofficial).** Save +34 644 71 81 99 in your phone, send it "I allow callmebot to send me messages", you get an API key. Add `CALLMEBOT_API_KEY` and `WHATSAPP_NOTIFY_TO=923318888878`. Tradeoff: a free hobby service with no guarantees; fine for alerts to yourself.

**B. WhatsApp Business Cloud API (official, Meta).** Needs a Meta Business account, a phone number that is *not* already on regular WhatsApp, and business verification. Free-form messages only work within 24 h after *you* last messaged the business number; otherwise Meta requires an **approved template**. Steps: developers.facebook.com → create app → WhatsApp → get Phone number ID and a permanent token (System User) → create a template, e.g. `new_lead` with body "New website request from {{1}} about {{2}}. Check your admin dashboard." → wait for approval. Secrets: `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_NOTIFY_TO=923318888878`, `WHATSAPP_TEMPLATE_NAME=new_lead`, optional `WHATSAPP_TEMPLATE_LANG` (default en_US).

**C. Twilio WhatsApp** works similarly to B (also needs templates) and is paid per message; not wired in, B is cheaper.

Either way, the admin dashboard's **Open WhatsApp** button always works (it opens wa.me with a prefilled reply).

## 6. Telegram (optional)
Talk to @BotFather → `/newbot` → copy token. Message your bot once, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `chat.id`. Secrets: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

Each request is **saved first**; then every configured channel is tried. Results are stored in the submission's `notifications` column. A failed channel never loses the request or the visitor's success message.

## Editing content (Supabase → Table Editor)
- **Add a service:** `services` → Insert row (slug, category_slug from `categories`, name, tagline…). Lists like `includes` are text arrays: `{"Item one","Item two"}`. `process` is JSON: `[{"title":"Step","body":"Text"}]`. Add tiers in `service_packages` (pick the service_id) and FAQs in `faqs`.
- **Create an offer:** `offers` → Insert. Set `service_slug` to link it, `purpose_keys` like `{security}` to personalise, optional `ends_at` to auto-expire, `featured` to show on Home.
- **Hide anything:** untick `published`. **Reorder:** change `sort_order` (lower = first). Quick toggles also exist in `/admin → Quick content`.
- **Add a form question:** `form_questions` → purpose_key (e.g. `business`), key (unique word), label, type (`text`, `textarea`, `select`, `multiselect`, `services`), `options` for selects.
- **Site text, WhatsApp number, email, about story:** `site_settings` (key/value).
- **Achievements:** `achievements` table (starts empty on purpose).
- Prices: fill `price_amount` + `currency` on a package to show a price instead of "Custom quote".

## Admin dashboard (`/admin`)
Search and filter by status, purpose, service and date; click a row for full details; change status (new → contacted → in_progress → won/lost/spam); add private notes; reply by email or WhatsApp; export the filtered list as CSV. The "N new" badge counts unhandled requests.

## Security notes
Public visitors can only read published content. Submissions are written only by the server function (service key) after validation, honeypot and a limit of 3 requests per visitor per 10 minutes, and are readable only by allow-listed admins.
