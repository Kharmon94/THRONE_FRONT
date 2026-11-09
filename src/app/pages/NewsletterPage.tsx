import { useEffect, useState, type FormEvent } from "react";
import { ApiError, newsletterApi, type NewsletterConfig } from "../../services/api";
import { ThroneIcon } from "../components/ThroneIcon";
import { BLOG_URL } from "../../config/site";

// /newsletter: double opt-in signup, confirmation (#confirm=<token>) and
// unsubscribe (#unsubscribe=<token>). Tokens live in the fragment so they are
// never sent to the static host or in Referer headers; they are removed from the
// address bar as soon as they are read. Actions need a button press, so mail
// scanners that pre-open links cannot confirm or unsubscribe anyone.

type Mode = { kind: "signup" } | { kind: "confirm"; token: string } | { kind: "unsubscribe"; token: string };

function readMode(): Mode {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const confirm = params.get("confirm");
  const unsubscribe = params.get("unsubscribe");
  if (confirm || unsubscribe) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  if (confirm) return { kind: "confirm", token: confirm };
  if (unsubscribe) return { kind: "unsubscribe", token: unsubscribe };
  return { kind: "signup" };
}

// Acquisition params come from the query string (before any #). The API keeps
// only allowlisted sources and valid slugs; anything else is dropped there.
function readAttribution(): { utm_source?: string; utm_campaign?: string } {
  const q = new URLSearchParams(window.location.search);
  const out: { utm_source?: string; utm_campaign?: string } = {};
  const source = q.get("utm_source");
  const campaign = q.get("utm_campaign");
  if (source) out.utm_source = source.slice(0, 40);
  if (campaign) out.utm_campaign = campaign.slice(0, 40);
  return out;
}

const TOO_MANY = "Too many requests. Please try again later.";

export function NewsletterPage() {
  const [mode] = useState<Mode>(readMode);

  useEffect(() => {
    document.title = "Throne Tech articles by email";
    if (mode.kind === "signup") return;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [mode.kind]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--brand-navy)", color: "var(--brand-offwhite)", fontFamily: "var(--font-ui)" }}
    >
      <header className="px-4 sm:px-6 h-[72px] flex items-center" style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
        <a href="/" aria-label="Throne Tech — home" className="flex items-center">
          <ThroneIcon size={44} />
        </a>
      </header>
      <main className="flex-1 px-4 py-14 md:py-20">
        <div className="max-w-xl mx-auto">
          {mode.kind === "signup" && <SignupView />}
          {mode.kind === "confirm" && <ConfirmView token={mode.token} />}
          {mode.kind === "unsubscribe" && <UnsubscribeView token={mode.token} />}
        </div>
      </main>
      <footer className="px-4 py-8 text-center" style={{ color: "var(--brand-muted)", fontSize: "0.85rem" }}>
        <a href="/" className="brand-nav-link">Throne Tech</a>
        <span aria-hidden="true"> · </span>
        <a href={BLOG_URL} className="brand-nav-link">Blog</a>
      </footer>
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-display" style={{ fontSize: "clamp(1.9rem, 5vw, 2.6rem)", lineHeight: 1.12 }}>
      {children}
    </h1>
  );
}

function Status({ tone, children }: { tone: "ok" | "error"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className="mt-6"
      style={{ color: tone === "ok" ? "var(--brand-offwhite)" : "#f0a8a8", lineHeight: 1.7 }}
    >
      {children}
    </p>
  );
}

function SignupView() {
  const [config, setConfig] = useState<NewsletterConfig | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    newsletterApi.config().then(setConfig).catch(() => setLoadError(true));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await newsletterApi.subscribe({ email: email.trim(), consent, website, ...readAttribution() });
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) setError(TOO_MANY);
      else if (err instanceof ApiError && err.status === 404) setConfig({ signup_open: false });
      else setError(err instanceof Error ? err.message : "Request failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Heading>Get Throne Tech articles by email.</Heading>
      <p className="mt-4" style={{ color: "var(--brand-muted)", lineHeight: 1.7 }}>
        Guides on websites, Shopify, custom software and integrations. Subscribe for email updates; unsubscribe anytime.
      </p>

      {config === null && !loadError && <p className="mt-8" style={{ color: "var(--brand-muted)" }}>Loading…</p>}
      {(loadError || (config && !config.signup_open)) && (
        <Status tone="ok">Email updates aren&apos;t open yet. Please check back soon.</Status>
      )}

      {config?.signup_open && done && (
        <Status tone="ok">
          Check your inbox. If this address can receive email from us, we&apos;ve sent a link to confirm your
          subscription. It expires in 48 hours.
        </Status>
      )}

      {config?.signup_open && !done && (
        <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="nl-email" className="block mb-2" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              Email address
            </label>
            <input
              id="nl-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-3"
              style={{ background: "var(--brand-navy-2)", border: "1px solid rgba(212,175,55,0.35)", color: "var(--brand-offwhite)" }}
            />
          </div>
          {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored. */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="nl-website">Website</label>
            <input id="nl-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <label className="flex items-start gap-3" style={{ lineHeight: 1.6, fontSize: "0.95rem" }}>
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
              style={{ accentColor: "var(--brand-gold)", width: 18, height: 18 }}
            />
            <span>
              Yes, email me Throne Tech articles. I can unsubscribe anytime.{" "}
              <a href={config.privacy_url} target="_blank" rel="noopener" style={{ color: "var(--brand-gold)", textDecoration: "underline" }}>
                Privacy policy
              </a>
            </span>
          </label>
          {error && <Status tone="error">{error}</Status>}
          <button type="submit" className="brand-btn" disabled={busy || !consent || !email.trim()}>
            {busy ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
    </>
  );
}

function TokenAction({
  title,
  button,
  run,
  success,
  invalid,
}: {
  title: string;
  button: string;
  run: () => Promise<unknown>;
  success: string;
  invalid: string;
}) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "invalid" | "error">("idle");
  const [message, setMessage] = useState("");

  const onClick = async () => {
    setState("busy");
    try {
      await run();
      setState("ok");
    } catch (err) {
      if (err instanceof ApiError && (err.status === 410 || err.status === 404)) setState("invalid");
      else {
        setMessage(err instanceof ApiError && err.status === 429 ? TOO_MANY : err instanceof Error ? err.message : "Request failed.");
        setState("error");
      }
    }
  };

  return (
    <>
      <Heading>{title}</Heading>
      {state === "ok" && <Status tone="ok">{success}</Status>}
      {state === "invalid" && <Status tone="error">{invalid}</Status>}
      {state === "error" && <Status tone="error">{message}</Status>}
      {(state === "idle" || state === "busy" || state === "error") && (
        <button type="button" className="brand-btn mt-8" onClick={onClick} disabled={state === "busy"}>
          {state === "busy" ? "Working…" : button}
        </button>
      )}
    </>
  );
}

function ConfirmView({ token }: { token: string }) {
  return (
    <TokenAction
      title="Confirm your subscription"
      button="Confirm subscription"
      run={() => newsletterApi.confirm(token)}
      success="You're subscribed to Throne Tech articles by email. You can unsubscribe anytime from any email."
      invalid="This confirmation link is invalid or has expired. Subscribe again to get a new link."
    />
  );
}

function UnsubscribeView({ token }: { token: string }) {
  return (
    <TokenAction
      title="Unsubscribe"
      button="Unsubscribe"
      run={() => newsletterApi.unsubscribe(token)}
      success="You've been unsubscribed and won't receive Throne Tech newsletter emails."
      invalid="This unsubscribe link isn't valid."
    />
  );
}
