import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail, MapPin, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { contentQuery, waLink } from "@/lib/content";
import { useVisitor } from "@/lib/visitor";
import { submitRequest } from "@/lib/submit.functions";
import { PageHeader } from "@/components/site/cards";
import { Icon } from "@/components/site/icons";
import type { FormQuestion } from "@/lib/types";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Haider Mohsin" },
      { name: "description", content: "Send a request in a few quick steps, email hello@haidermohsin.com, or chat on WhatsApp." },
      { property: "og:title", content: "Contact Haider Mohsin" },
      { property: "og:description", content: "A quick, friendly request flow. Reply usually within a day." },
    ],
  }),
  component: Contact,
});

type Answers = Record<string, string | string[]>;
const input = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary";

function Contact() {
  const { data } = useSuspenseQuery(contentQuery);
  const { purpose: savedPurpose, setPurpose: savePurpose, basket, clearBasket } = useVisitor();
  const submit = useServerFn(submitRequest);
  const s = data.settings;

  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<null | { ok: boolean; message?: string }>(null);

  useEffect(() => {
    if (basket.length) {
      setPurpose((p) => p ?? "business");
      setAnswers((a) => ({ ...a, services: basket }));
      setStep((st) => (st === 0 ? 1 : st));
    } else if (savedPurpose) setPurpose((p) => p ?? savedPurpose);
  }, [basket, savedPurpose]);

  const p = data.purposes.find((x) => x.key === purpose);
  const questions = p?.questions ?? [];
  const emailRequired = p?.email_required ?? true;
  const serviceName = (slug: string) => data.services.find((x) => x.slug === slug)?.name ?? slug;

  const validate = () => {
    setError("");
    if (step === 0 && !p) return setError("Please pick an option."), false;
    if (step === 1) {
      const missing = questions.find((q) => q.required && !(Array.isArray(answers[q.key]) ? (answers[q.key] as string[]).length : String(answers[q.key] ?? "").trim()));
      if (missing) return setError(`Please answer: ${missing.label}`), false;
    }
    if (step === 2) {
      if (!name.trim()) return setError("Please tell me your name."), false;
      if (emailRequired && !/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email."), false;
      if (email && !/^\S+@\S+\.\S+$/.test(email)) return setError("That email doesn't look right."), false;
    }
    return true;
  };
  const next = () => validate() && setStep((x) => x + 1);

  const send = async () => {
    if (!p) return;
    setSending(true);
    setError("");
    const services = Array.isArray(answers["services"]) ? (answers["services"] as string[]) : [];
    const rest = Object.fromEntries(Object.entries(answers).filter(([k]) => k !== "services"));
    try {
      const r = await submit({ data: { purpose: p.key, name, email, phone, services, answers: rest, emailRequired, website, sourcePath: "/contact" } });
      if (r.ok) {
        savePurpose(p.key);
        clearBasket();
        setDone({ ok: true });
      } else if (r.reason === "rate_limited") setError(r.message);
      else setDone({ ok: false, message: r.message });
    } catch {
      setError("Couldn't send right now. Please check your details and try again.");
    } finally {
      setSending(false);
    }
  };

  const summaryText = () =>
    [`Purpose: ${p?.label}`, `Name: ${name}`, email && `Email: ${email}`, phone && `Phone: ${phone}`, ...Object.entries(answers).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.map(serviceName).join(", ") : v}`)].filter(Boolean).join("\n");

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk">A few quick questions so I can reply with something useful. Takes about two minutes.</PageHeader>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_300px]">
        <div className="surface p-5 md:p-8">
          {done ? (
            done.ok ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-4 text-2xl font-bold">Thanks, {name.split(" ")[0]}! Your request is in.</h2>
                <p className="mt-2 text-muted-foreground">I'll reply personally, usually within a day.</p>
                {p && <p className="mt-6 text-sm">{p.next_step}</p>}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {p && <a href={p.next_step_href} className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Next step</a>}
                  <Link to="/projects" className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm">See my projects</Link>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <h2 className="text-xl font-bold">The online inbox isn't switched on yet</h2>
                <p className="mt-2 text-muted-foreground">Your details weren't lost. Send them directly instead:</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <a href={`mailto:${s.email}?subject=${encodeURIComponent(`Request: ${p?.label ?? ""}`)}&body=${encodeURIComponent(summaryText())}`} className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"><Mail className="h-4 w-4" /> Send by email</a>
                  <a href={waLink(s.whatsapp_number, summaryText())} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-md bg-whatsapp px-4 text-sm font-semibold text-whatsapp-foreground"><MessageCircle className="h-4 w-4" /> Send on WhatsApp</a>
                </div>
              </div>
            )
          ) : (
            <>
              <ol className="mb-6 flex gap-2" aria-label="Progress">
                {["Purpose", "Details", "You", "Review"].map((l, i) => (
                  <li key={l} className="flex-1">
                    <div className={`h-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`} />
                    <span className={`mt-1.5 block font-mono text-[10px] uppercase tracking-wider ${i === step ? "text-primary" : "text-muted-foreground"}`}>{l}</span>
                  </li>
                ))}
              </ol>

              {step === 0 && (
                <fieldset>
                  <legend className="text-xl font-bold">What can I help with?</legend>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {data.purposes.map((x) => (
                      <button key={x.key} type="button" onClick={() => setPurpose(x.key)} className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${purpose === x.key ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                        <Icon name={x.icon} className="h-5 w-5 shrink-0 text-primary" />
                        <span><span className="block font-medium">{x.label}</span><span className="block text-xs text-muted-foreground">{x.description}</span></span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <div className="grid gap-5">
                  <h2 className="text-xl font-bold">{p?.label}</h2>
                  {questions.length === 0 && <p className="text-muted-foreground">Nothing else needed. Continue.</p>}
                  {questions.map((q) => (
                    <QuestionField key={q.key} q={q} value={answers[q.key]} onChange={(v) => setAnswers((a) => ({ ...a, [q.key]: v }))} services={data.services.map((x) => ({ slug: x.slug, name: x.name }))} />
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4">
                  <h2 className="text-xl font-bold">How can I reach you?</h2>
                  <label className="grid gap-1.5 text-sm">Name *<input className={input} value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoComplete="name" /></label>
                  <label className="grid gap-1.5 text-sm">Email {emailRequired ? "*" : "(optional)"}<input type="email" className={input} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} autoComplete="email" /></label>
                  <label className="grid gap-1.5 text-sm">Phone / WhatsApp (optional)<input type="tel" className={input} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} autoComplete="tel" /></label>
                  <label className="absolute -left-[9999px]" aria-hidden>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold">Review and send</h2>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <Row k="Purpose" v={p?.label ?? ""} />
                    {questions.map((q) => answers[q.key] && <Row key={q.key} k={q.label} v={Array.isArray(answers[q.key]) ? (answers[q.key] as string[]).map(serviceName).join(", ") : String(answers[q.key])} />)}
                    <Row k="Name" v={name} />
                    {email && <Row k="Email" v={email} />}
                    {phone && <Row k="Phone" v={phone} />}
                  </dl>
                  <p className="mt-4 text-xs text-muted-foreground">By sending, you agree to the <Link to="/privacy" className="underline">privacy policy</Link>.</p>
                </div>
              )}

              {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
              <div className="mt-8 flex justify-between gap-2">
                <button type="button" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0} className="inline-flex h-11 items-center gap-1.5 rounded-md border border-border px-4 text-sm disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> Back</button>
                {step < 3 ? (
                  <button type="button" onClick={next} className="inline-flex h-11 items-center gap-1.5 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground">Continue <ArrowRight className="h-4 w-4" /></button>
                ) : (
                  <button type="button" onClick={send} disabled={sending} className="inline-flex h-11 items-center gap-1.5 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Send request</button>
                )}
              </div>
            </>
          )}
        </div>
        <aside className="grid h-fit gap-3">
          <a href={`mailto:${s.email}`} className="surface flex items-center gap-3 p-4 text-sm hover:border-primary/50"><Mail className="h-4 w-4 text-primary" />{s.email}</a>
          <a href={waLink(s.whatsapp_number, s.whatsapp_message)} target="_blank" rel="noopener noreferrer" className="surface flex items-center gap-3 p-4 text-sm hover:border-primary/50"><MessageCircle className="h-4 w-4 text-whatsapp" />Chat on WhatsApp</a>
          <div className="surface flex items-center gap-3 p-4 text-sm"><MapPin className="h-4 w-4 text-primary" />{s.location}</div>
          <div className="surface flex flex-wrap gap-2 p-4">
            {data.socials.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:border-primary/50"><Icon name={l.icon} className="h-3.5 w-3.5" />{l.label}</a>)}
          </div>
        </aside>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="grid gap-0.5 border-b border-border pb-3"><dt className="text-muted-foreground">{k}</dt><dd className="whitespace-pre-wrap">{v}</dd></div>;
}

function QuestionField({ q, value, onChange, services }: { q: FormQuestion; value: string | string[] | undefined; onChange: (v: string | string[]) => void; services: { slug: string; name: string }[] }) {
  const label = <span className="text-sm font-medium">{q.label}{q.required ? " *" : ""}{q.help && <span className="block text-xs font-normal text-muted-foreground">{q.help}</span>}</span>;
  if (q.type === "services" || q.type === "multiselect") {
    const opts = q.type === "services" ? services.map((s) => ({ v: s.slug, l: s.name })) : q.options.map((o) => ({ v: o, l: o }));
    const arr = Array.isArray(value) ? value : [];
    return (
      <fieldset className="grid gap-2">
        <legend className="mb-2">{label}</legend>
        <div className="flex flex-wrap gap-2">
          {opts.map((o) => {
            const on = arr.includes(o.v);
            return <button key={o.v} type="button" aria-pressed={on} onClick={() => onChange(on ? arr.filter((x) => x !== o.v) : [...arr, o.v])} className={`rounded-full border px-3 py-1.5 text-sm ${on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}>{o.l}</button>;
          })}
        </div>
      </fieldset>
    );
  }
  const v = typeof value === "string" ? value : "";
  if (q.type === "select")
    return (
      <label className="grid gap-1.5">{label}
        <select className={input} value={v} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose…</option>
          {q.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
    );
  if (q.type === "textarea") return <label className="grid gap-1.5">{label}<textarea rows={5} maxLength={4000} className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-primary" value={v} onChange={(e) => onChange(e.target.value)} /></label>;
  return <label className="grid gap-1.5">{label}<input className={input} maxLength={300} value={v} onChange={(e) => onChange(e.target.value)} /></label>;
}
