import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Menu, X } from "lucide-react";
import { ThroneIcon } from "./ThroneIcon";
import { BLOG_URL } from "../../config/site";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Work" },
  { href: "#contact", label: "Book a call" },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  // In-page target chosen from the drawer; scrolled to after the lock is released.
  const pendingHash = useRef<string | null>(null);

  // Closed drawer stays mounted (so it can slide) but is inert: not focusable or clickable.
  useEffect(() => {
    if (drawerRef.current) drawerRef.current.inert = !open;
    if (backdropRef.current) backdropRef.current.inert = !open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = { html: html.style.overflow, body: document.body.style.overflow };
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const items = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !drawerRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !drawerRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    // Drawer is mobile-only; close it if the viewport grows to the desktop layout.
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onMq);

    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      html.style.overflow = prev.html;
      document.body.style.overflow = prev.body;
      const hash = pendingHash.current;
      pendingHash.current = null;
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          if (window.location.hash !== hash) history.pushState(null, "", hash);
          target.scrollIntoView({ block: "start" });
          return;
        }
      }
      menuBtnRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const onDrawerLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      pendingHash.current = href;
    }
    setOpen(false);
  };

  // Rendered in a portal: the sticky header uses backdrop-filter, which makes it the
  // containing block for position:fixed children and clipped the old drawer to 72px.
  const drawer = (
    <div className="md:hidden">
      <div
        ref={backdropRef}
        className="mobile-drawer-backdrop"
        data-open={open}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <div
        ref={drawerRef}
        id="mobile-drawer"
        className="mobile-drawer"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between mb-8">
          <a href="#top" onClick={(e) => onDrawerLink(e, "#top")} aria-label="Throne Tech — home">
            <ThroneIcon size={40} />
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="brand-btn-ghost"
            style={{ padding: "6px 14px", color: "var(--brand-gold)", borderColor: "rgba(212,175,55,0.6)" }}
          >
            Close <X size={14} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => onDrawerLink(e, item.href)}
              className="block py-4 brand-nav-link"
              style={{ borderBottom: "1px solid rgba(212,175,55,0.14)", fontSize: "1rem" }}
            >
              {item.label}
            </a>
          ))}
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener"
            onClick={() => setOpen(false)}
            className="block py-4 brand-nav-link"
            style={{ borderBottom: "1px solid rgba(212,175,55,0.14)", fontSize: "1rem" }}
          >
            Blog
          </a>
        </nav>
        <a href="#contact" onClick={(e) => onDrawerLink(e, "#contact")} className="brand-btn mt-8 w-full">
          <CalendarDays size={16} aria-hidden="true" /> Schedule a Conversation
        </a>
      </div>
    </div>
  );

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: "rgba(3,2,19,0.86)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(212,175,55,0.12)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        <a href="#top" aria-label="Throne Tech — home" className="flex items-center">
          <ThroneIcon size={44} />
        </a>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          {NAV.slice(0, 2).map((item) => (
            <a key={item.href} href={item.href} className="brand-nav-link">
              {item.label}
            </a>
          ))}
          <a href={BLOG_URL} className="brand-nav-link" target="_blank" rel="noopener">
            Blog
          </a>
          <a href="#contact" className="brand-btn">
            <CalendarDays size={16} aria-hidden="true" /> Schedule a Conversation
          </a>
        </nav>

        <button
          ref={menuBtnRef}
          type="button"
          className="md:hidden brand-btn-ghost"
          style={{ padding: "8px 14px" }}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <Menu size={18} aria-hidden="true" /> Menu
        </button>
      </div>

      {typeof document !== "undefined" && createPortal(drawer, document.body)}
    </header>
  );
}
