import { ThroneIcon } from "./ThroneIcon";
import { BLOG_URL } from "../../config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-16 px-4"
      style={{ background: "var(--brand-navy)", borderTop: "1px solid rgba(212,175,55,0.18)" }}
    >
      <div className="max-w-6xl mx-auto py-12 grid gap-10 md:grid-cols-3">
        <div>
          <ThroneIcon size={48} />
          <p className="mt-4" style={{ color: "var(--brand-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Websites and custom software by Throne Technology.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2
            style={{ color: "var(--brand-gold)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}
          >
            Throne Technology
          </h2>
          <ul className="mt-4 space-y-2">
            <li><a className="brand-nav-link" href="#services">Services</a></li>
            <li><a className="brand-nav-link" href="#projects">Work</a></li>
            <li><a className="brand-nav-link" href="#contact">Schedule a Conversation</a></li>
          </ul>
        </nav>
        <div>
          <h2
            style={{ color: "var(--brand-gold)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}
          >
            Blog
          </h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a className="brand-nav-link" href={BLOG_URL} target="_blank" rel="noopener">
                Latest articles
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="max-w-6xl mx-auto py-6 text-sm"
        style={{ color: "rgba(243,243,245,0.6)", borderTop: "1px solid rgba(243,243,245,0.08)" }}
      >
        © {year} Throne Technology. All rights reserved.
      </div>
    </footer>
  );
}
