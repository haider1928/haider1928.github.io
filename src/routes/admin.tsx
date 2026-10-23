import { createFileRoute } from "@tanstack/react-router";
import { Download, Loader2, LogOut, Mail, MessageCircle, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { waLink } from "@/lib/content";
import { SUBMISSION_STATUSES, type SubmissionStatus } from "@/lib/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Haider Mohsin" },
      { name: "description", content: "Private admin area." },
      { property: "og:title", content: "Admin" },
      { property: "og:description", content: "Private admin area." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  ssr: false,
  component: Admin,
});

type Sub = {
  id: string;
  created_at: string;
  purpose: string;
  name: string;
  email: string | null;
  phone: string | null;
  services: string[];
  answers: Record<string, string | string[]>;
  status: SubmissionStatus;
  notes: string | null;
  notifications: unknown;
};

const input = "h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary";

function Admin() {
  const sb = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!sb) return setReady(true);
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  if (!isSupabaseConfigured || !sb)
    return <Shell><p className="text-muted-foreground">The database isn't connected yet. Follow SETUP.md to connect Supabase, then come back.</p></Shell>;
  if (!ready) return <Shell><Loader2 className="h-5 w-5 animate-spin" /></Shell>;
  if (!session) return <Login />;
  return <Dashboard email={session.user.email ?? ""} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 py-16"><div className="surface w-full p-6">{children}</div></div>;
}

function Login() {
  const sb = getSupabase()!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <Shell>
      <h1 className="text-xl font-bold">Admin sign in</h1>
      <form
        className="mt-4 grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr("");
          const { error } = await sb.auth.signInWithPassword({ email, password });
          if (error) setErr("Sign-in failed. Check your email and password.");
          setBusy(false);
        }}
      >
        <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <input className={input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button disabled={busy} className="h-10 rounded-md bg-primary text-sm font-semibold text-primary-foreground">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </Shell>
  );
}

function Dashboard({ email }: { email: string }) {
  const sb = getSupabase()!;
  const [rows, setRows] = useState<Sub[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [purpose, setPurpose] = useState("all");
  const [service, setService] = useState("all");
  const [from, setFrom] = useState("");
  const [open, setOpen] = useState<Sub | null>(null);
  const [tab, setTab] = useState<"inbox" | "content">("inbox");

  const load = useCallback(async () => {
    setLoading(true);
    const { data: admin } = await sb.rpc("is_admin");
    setIsAdmin(Boolean(admin));
    if (admin) {
      const { data, error } = await sb.from("submissions").select("*").order("created_at", { ascending: false }).limit(1000);
      if (error) toast.error(error.message);
      setRows((data as Sub[]) ?? []);
    }
    setLoading(false);
  }, [sb]);
  useEffect(() => void load(), [load]);

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return rows.filter(
      (r) =>
        (status === "all" || r.status === status) &&
        (purpose === "all" || r.purpose === purpose) &&
        (service === "all" || r.services.includes(service)) &&
        (!from || r.created_at >= from) &&
        (!t || [r.name, r.email, r.phone, JSON.stringify(r.answers)].join(" ").toLowerCase().includes(t)),
    );
  }, [rows, q, status, purpose, service, from]);

  const update = async (id: string, patch: Partial<Sub>) => {
    const { error } = await sb.from("submissions").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setOpen((o) => (o && o.id === id ? { ...o, ...patch } : o));
    toast.success("Saved");
  };

  const exportCsv = () => {
    const cols = ["created_at", "status", "purpose", "name", "email", "phone", "services", "answers", "notes"] as const;
    const esc = (v: unknown) => `"${String(typeof v === "object" && v !== null ? JSON.stringify(v) : (v ?? "")).replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...filtered.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (isAdmin === false)
    return (
      <Shell>
        <p>Signed in as {email}, but this account isn't on the admin list.</p>
        <button onClick={() => sb.auth.signOut()} className="mt-4 text-sm text-primary">Sign out</button>
      </Shell>
    );

  const newCount = rows.filter((r) => r.status === "new").length;
  const purposes = [...new Set(rows.map((r) => r.purpose))];
  const services = [...new Set(rows.flatMap((r) => r.services))];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Admin</h1>
          {newCount > 0 && <span className="rounded-full bg-primary px-2.5 py-0.5 font-mono text-xs font-bold text-primary-foreground">{newCount} new</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab("inbox")} className={`h-9 rounded-md px-3 text-sm ${tab === "inbox" ? "bg-secondary" : ""}`}>Submissions</button>
          <button onClick={() => setTab("content")} className={`h-9 rounded-md px-3 text-sm ${tab === "content" ? "bg-secondary" : ""}`}>Quick content</button>
          <button onClick={() => sb.auth.signOut()} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
      </div>

      {tab === "content" ? (
        <ContentManager />
      ) : (
        <>
          <div className="mt-6 grid gap-2 md:grid-cols-[1fr_auto_auto_auto_auto_auto]">
            <label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input className={`${input} w-full pl-9`} placeholder="Search name, email, answers…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
            <select className={input} value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{SUBMISSION_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            <select className={input} value={purpose} onChange={(e) => setPurpose(e.target.value)}><option value="all">All purposes</option>{purposes.map((s) => <option key={s}>{s}</option>)}</select>
            <select className={input} value={service} onChange={(e) => setService(e.target.value)}><option value="all">All services</option>{services.map((s) => <option key={s}>{s}</option>)}</select>
            <input type="date" className={input} value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
            <button onClick={exportCsv} className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-3 text-sm"><Download className="h-4 w-4" /> CSV</button>
          </div>

          <div className="surface mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs text-muted-foreground"><tr className="border-b border-border">{["Date", "Name", "Purpose", "Services", "Status"].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {loading && <tr><td colSpan={5} className="p-6 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>}
                {!loading && filtered.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No submissions yet.</td></tr>}
                {filtered.map((r) => (
                  <tr key={r.id} onClick={() => setOpen(r)} className="cursor-pointer border-b border-border hover:bg-secondary/50">
                    <td className="p-3 font-mono text-xs">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-3">{r.name}<span className="block text-xs text-muted-foreground">{r.email}</span></td>
                    <td className="p-3">{r.purpose}</td>
                    <td className="p-3 text-xs">{r.services.join(", ")}</td>
                    <td className="p-3"><span className={`rounded-full px-2 py-0.5 font-mono text-xs ${r.status === "new" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {open && <Detail sub={open} onClose={() => setOpen(null)} onUpdate={(p) => update(open.id, p)} />}
    </div>
  );
}

function Detail({ sub, onClose, onUpdate }: { sub: Sub; onClose: () => void; onUpdate: (p: Partial<Sub>) => void }) {
  const [notes, setNotes] = useState(sub.notes ?? "");
  const first = sub.name.split(" ")[0];
  const msg = `Hi ${first}, this is Haider from haidermohsin.com. Thanks for your request about ${sub.services.join(", ") || sub.purpose}.`;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/70 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-lg overflow-y-auto border-l border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between"><div><h2 className="text-xl font-bold">{sub.name}</h2><p className="font-mono text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleString()}</p></div><button onClick={onClose} className="text-sm text-muted-foreground">Close</button></div>
        <dl className="mt-5 grid gap-3 text-sm">
          {[["Purpose", sub.purpose], ["Email", sub.email ?? "—"], ["Phone", sub.phone ?? "—"], ["Services", sub.services.join(", ") || "—"], ...Object.entries(sub.answers).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : v])].map(([k, v]) => (
            <div key={k} className="border-b border-border pb-2"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="whitespace-pre-wrap">{v}</dd></div>
          ))}
        </dl>
        <label className="mt-5 grid gap-1.5 text-sm">Status
          <select className={input} value={sub.status} onChange={(e) => onUpdate({ status: e.target.value as SubmissionStatus })}>{SUBMISSION_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </label>
        <label className="mt-4 grid gap-1.5 text-sm">Private notes
          <textarea rows={4} className="rounded-md border border-input bg-background p-3 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <button onClick={() => onUpdate({ notes })} className="mt-2 h-9 rounded-md border border-border px-3 text-sm">Save notes</button>
        <div className="mt-6 flex flex-wrap gap-2">
          {sub.email && <a href={`mailto:${sub.email}?subject=${encodeURIComponent("Re: your request on haidermohsin.com")}&body=${encodeURIComponent(msg)}`} className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"><Mail className="h-4 w-4" /> Reply by email</a>}
          {sub.phone && <a href={waLink(sub.phone, msg)} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-md bg-whatsapp px-4 text-sm font-semibold text-whatsapp-foreground"><MessageCircle className="h-4 w-4" /> Open WhatsApp</a>}
        </div>
      </div>
    </div>
  );
}

type Item = { id: string; name?: string; title?: string; published: boolean; sort_order: number };

function ContentManager() {
  const sb = getSupabase()!;
  const [table, setTable] = useState<"services" | "offers" | "projects">("services");
  const [items, setItems] = useState<Item[]>([]);
  const load = useCallback(async () => {
    const { data } = await sb.from(table).select(table === "services" ? "id,name,published,sort_order" : "id,title,published,sort_order").order("sort_order");
    setItems((data as unknown as Item[]) ?? []);
  }, [sb, table]);
  useEffect(() => void load(), [load]);
  const patch = async (id: string, p: Partial<Item>) => {
    const { error } = await sb.from(table).update(p).eq("id", id);
    if (error) toast.error(error.message);
    load();
  };
  return (
    <div className="mt-6">
      <div className="flex gap-2">{(["services", "offers", "projects"] as const).map((t) => <button key={t} onClick={() => setTable(t)} className={`h-9 rounded-md border px-3 text-sm capitalize ${table === t ? "border-primary text-primary" : "border-border"}`}>{t}</button>)}</div>
      <p className="mt-3 text-xs text-muted-foreground">Toggle visibility and order here. Full editing stays in the Supabase table editor.</p>
      <ul className="surface mt-3 divide-y divide-border">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-3 p-3 text-sm">
            <input type="number" className={`${input} w-20`} defaultValue={it.sort_order} onBlur={(e) => Number(e.target.value) !== it.sort_order && patch(it.id, { sort_order: Number(e.target.value) })} aria-label="Order" />
            <span className="flex-1">{it.name ?? it.title}</span>
            <label className="flex items-center gap-2"><input type="checkbox" checked={it.published} onChange={(e) => patch(it.id, { published: e.target.checked })} /> Published</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
