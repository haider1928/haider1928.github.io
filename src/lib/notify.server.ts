// Server-only notification channels. Each one is optional and controlled by secrets.
// A failing channel is logged and reported, never thrown.

export type NotifyPayload = {
  id: string;
  purpose: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  answers: Record<string, string | string[]>;
  createdAt: string;
};

type Result = { channel: string; ok: boolean; detail?: string | undefined };

const fmt = (p: NotifyPayload) => {
  const lines = [
    `New request on haidermohsin.com`,
    `Purpose: ${p.purpose}`,
    `Name: ${p.name}`,
    `Email: ${p.email || "—"}`,
    `Phone: ${p.phone || "—"}`,
    `Services: ${p.services.join(", ") || "—"}`,
    ...Object.entries(p.answers).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`),
    `ID: ${p.id}`,
  ];
  return lines.join("\n");
};

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

async function email(p: NotifyPayload): Promise<Result> {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return { channel: "email", ok: false, detail: "RESEND_API_KEY not set" };
  const to = process.env["NOTIFY_EMAIL_TO"] || "hello@haidermohsin.com";
  const from = process.env["NOTIFY_EMAIL_FROM"] || "Website <notifications@haidermohsin.com>";
  const rows = [
    ["Purpose", p.purpose],
    ["Name", p.name],
    ["Email", p.email || "—"],
    ["Phone / WhatsApp", p.phone || "—"],
    ["Services", p.services.join(", ") || "—"],
    ...Object.entries(p.answers).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : String(v)]),
  ];
  const html = `<h2>New request from ${esc(p.name)}</h2><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#666;vertical-align:top"><b>${esc(String(k))}</b></td><td style="white-space:pre-wrap">${esc(String(v))}</td></tr>`,
    )
    .join("")}</table><p style="color:#888">ID ${esc(p.id)} · ${esc(p.createdAt)}</p>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: p.email || null,
      subject: `New ${p.purpose} request — ${p.name}`,
      html,
      text: fmt(p),
    }),
  });
  return {
    channel: "email",
    ok: res.ok,
    detail: res.ok ? undefined : `${res.status} ${await res.text()}`,
  };
}

async function whatsappCloud(p: NotifyPayload): Promise<Result | null> {
  const token = process.env["WHATSAPP_CLOUD_TOKEN"];
  const phoneId = process.env["WHATSAPP_PHONE_NUMBER_ID"];
  const to = process.env["WHATSAPP_NOTIFY_TO"];
  if (!token || !phoneId || !to) return null;
  const template = process.env["WHATSAPP_TEMPLATE_NAME"];
  const body = template
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template,
          language: { code: process.env["WHATSAPP_TEMPLATE_LANG"] || "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: p.name },
                { type: "text", text: p.purpose },
              ],
            },
          ],
        },
      }
    : { messaging_product: "whatsapp", to, type: "text", text: { body: fmt(p).slice(0, 4000) } };
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return {
    channel: "whatsapp_cloud",
    ok: res.ok,
    detail: res.ok ? undefined : `${res.status} ${await res.text()}`,
  };
}

async function whatsappCallMeBot(p: NotifyPayload): Promise<Result | null> {
  const apikey = process.env["CALLMEBOT_API_KEY"];
  const phone = process.env["WHATSAPP_NOTIFY_TO"];
  if (!apikey || !phone) return null;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&apikey=${encodeURIComponent(apikey)}&text=${encodeURIComponent(fmt(p).slice(0, 1500))}`;
  const res = await fetch(url);
  return {
    channel: "whatsapp_callmebot",
    ok: res.ok,
    detail: res.ok ? undefined : String(res.status),
  };
}

async function telegram(p: NotifyPayload): Promise<Result | null> {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  const chat = process.env["TELEGRAM_CHAT_ID"];
  if (!token || !chat) return null;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chat,
      text: fmt(p).slice(0, 4000),
      disable_web_page_preview: true,
    }),
  });
  return {
    channel: "telegram",
    ok: res.ok,
    detail: res.ok ? undefined : `${res.status} ${await res.text()}`,
  };
}

export async function notifyAll(p: NotifyPayload): Promise<Result[]> {
  const jobs = [email(p), whatsappCloud(p), whatsappCallMeBot(p), telegram(p)];
  const settled = await Promise.allSettled(jobs);
  return settled
    .map((s, i) =>
      s.status === "fulfilled"
        ? s.value
        : {
            channel: ["email", "whatsapp_cloud", "whatsapp_callmebot", "telegram"][i],
            ok: false,
            detail: String(s.reason),
          },
    )
    .filter((r): r is Result => r !== null);
}
