import { useEffect, type ReactNode } from "react";
import { ThroneIcon } from "../components/ThroneIcon";
import { BLOG_URL } from "../../config/site";

// /privacy: factual notice for www.thronetechnology.com. Every statement here
// must match current code and verified provider settings; update it (and its
// effective date) whenever they change.
const CONTACT = "sales@thronetechnology.com";
const EFFECTIVE = "November 8, 2026";

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display mt-10" style={{ fontSize: "1.5rem", color: "var(--brand-offwhite)" }}>
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3" style={{ color: "var(--brand-muted)", lineHeight: 1.75 }}>
      {children}
    </p>
  );
}

function Ul({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc pl-6 space-y-2" style={{ color: "var(--brand-muted)", lineHeight: 1.7 }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const mail = (
  <a href={`mailto:${CONTACT}`} style={{ color: "var(--brand-gold)", textDecoration: "underline" }}>
    {CONTACT}
  </a>
);

export function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy notice | Throne Technology";
  }, []);

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
        <article className="max-w-2xl mx-auto">
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", lineHeight: 1.1 }}>
            Privacy notice
          </h1>
          <p className="mt-3" style={{ color: "var(--brand-muted)" }}>Effective {EFFECTIVE}</p>

          <H2>Who we are</H2>
          <P>
            This website, www.thronetechnology.com, is run by Throne Technology L.L.C (A Future Scope Labs Company) (&ldquo;Throne Tech&rdquo;, &ldquo;we&rdquo;). For
            anything about your data, email {mail}.
          </P>

          <H2>Email updates (newsletter)</H2>
          <P>If you sign up at www.thronetechnology.com/newsletter, we collect:</P>
          <Ul
            items={[
              "your email address;",
              "a record of your consent: which version of the signup wording you saw, when you asked to subscribe, and when you confirmed;",
              "if you came from one of our own links, which channel (our blog, website, Facebook or Instagram) and a short campaign name.",
            ]}
          />
          <P>
            We use this only to send you new Throne Tech articles by email, because you asked us to. We add you only after you
            click the link in our confirmation email. We don&apos;t sell your address or share it for anyone else&apos;s
            marketing, and we won&apos;t use it for other marketing without asking you first. We don&apos;t store your IP address
            or browser details in our subscriber records.
          </P>
          <P>
            <strong style={{ color: "var(--brand-offwhite)" }}>Unsubscribing:</strong> every newsletter email will include an
            unsubscribe link, and you can also email {mail}. Unsubscribing takes effect immediately.
          </P>

          <H2>Booking a call</H2>
          <P>
            When you book a call, we collect your name, email address, the time you pick, and anything you add (company, notes).
            We use it to arrange and, if needed, reschedule the call, including by email. We keep booking records until they are
            no longer needed; there is currently no automatic deletion schedule, so email {mail} if you&apos;d like yours deleted.
          </P>

          <H2>How long we keep newsletter data</H2>
          <Ul
            items={[
              "Unconfirmed signups: the confirmation link expires after 48 hours. Our server deletes unconfirmed signups older than 7 days; this cleanup runs automatically when our newsletter page or signup is used (at most once an hour), so during quiet periods they can be kept longer, until the next cleanup or a manual cleanup.",
              "Subscribers: while you stay subscribed.",
              "After you unsubscribe: we keep your email address marked as unsubscribed so we don't email you again. You can ask us to delete it entirely.",
            ]}
          />

          <H2>Service providers</H2>
          <Ul
            items={[
              "Railway hosts this website and our server. Railway's platform logs record visitors' IP addresses and request details (such as the pages requested) and are kept for up to 90 days. Separately, our application is configured not to write email addresses, names, notes or the codes in our email links into its own request logs; this does not change what Railway's platform logs record.",
              "Resend delivers our emails. It keeps records of sent emails, including the recipient address and message, for 30 days, plus backups for 7 days. As of November 8, 2026, email open and click tracking is turned off for our sending domain.",
              "Google Fonts: our pages load fonts from Google's servers, so your browser shares your IP address with Google when a page loads.",
            ]}
          />
          <P>
            These providers process data in the United States. This site doesn&apos;t use analytics or advertising cookies.
          </P>

          <H2>Your choices and rights</H2>
          <P>
            You can ask us to access, correct or delete your data, or withdraw your consent at any time, by emailing {mail}.
            Depending on where you live, you may also have the right to complain to your data protection authority.
          </P>

          <H2>Changes</H2>
          <P>If we change how we handle your data, we&apos;ll update this page and its effective date.</P>
        </article>
      </main>
      <footer className="px-4 py-8 text-center" style={{ color: "var(--brand-muted)", fontSize: "0.85rem" }}>
        <a href="/" className="brand-nav-link">Throne Tech</a>
        <span aria-hidden="true"> · </span>
        <a href="/newsletter" className="brand-nav-link">Email updates</a>
        <span aria-hidden="true"> · </span>
        <a href={BLOG_URL} className="brand-nav-link">Blog</a>
      </footer>
    </div>
  );
}
