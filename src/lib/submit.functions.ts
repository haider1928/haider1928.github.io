import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import {
  isBot,
  isRateLimited,
  RATE_LIMIT_WINDOW_MINUTES,
  submissionSchema,
} from "./submission-schema";

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; reason: "not_configured" | "rate_limited" | "error"; message: string };

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const submitRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submissionSchema.parse(input))
  .handler(async ({ data }): Promise<SubmitResult> => {
    // Bots get a fake success so they don't retry.
    if (isBot(data)) return { ok: true, id: "ok" };

    const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
    const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    if (!url || !serviceKey) {
      return {
        ok: false,
        reason: "not_configured",
        message: "The request inbox isn't connected yet.",
      };
    }

    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const req = getRequest();
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const ipHash = await sha256(`${ip}:${process.env["RATE_LIMIT_SALT"] || "hm"}`);

    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();
    const { count } = await admin
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (isRateLimited(count ?? 0)) {
      return {
        ok: false,
        reason: "rate_limited",
        message: "You've sent a few requests already. Please wait a few minutes.",
      };
    }

    const { data: row, error } = await admin
      .from("submissions")
      .insert({
        purpose: data.purpose,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        services: data.services,
        answers: data.answers,
        source_path: data.sourcePath || null,
        ip_hash: ipHash,
        user_agent: (req.headers.get("user-agent") || "").slice(0, 300),
      })
      .select("id, created_at")
      .single();
    if (error || !row) {
      console.error("Submission insert failed", error);
      return { ok: false, reason: "error", message: "Something went wrong saving your request." };
    }

    // Saved first; notifications can never lose the submission.
    try {
      const { notifyAll } = await import("./notify.server");
      const results = await notifyAll({
        id: row.id,
        purpose: data.purpose,
        name: data.name,
        email: data.email,
        phone: data.phone,
        services: data.services,
        answers: data.answers,
        createdAt: row.created_at,
      });
      await admin.from("submissions").update({ notifications: results }).eq("id", row.id);
    } catch (e) {
      console.error("Notification step failed", e);
    }

    return { ok: true, id: row.id };
  });
