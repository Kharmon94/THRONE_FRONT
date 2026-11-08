import { useEffect, useRef, useState } from "react";
import { CalendarDays, Menu, X } from "lucide-react";
import { BrandWordmark } from "./BrandWordmark";
import { BLOG_URL } from "../../config/site";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Work" },
  { href: "#contact", label: "Book a call" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      menuBtnRef.current?.focus();
    };
  }, [open]);

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
          <BrandWordmark width={112} />
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
          onClick={() => setOpen(true)}
        >
          <Menu size={18} aria-hidden="true" /> Menu
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Site menu">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 w-full h-full"
            style={{ background: "rgba(3,2,19,0.6)", cursor: "default" }}
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-drawer"
            className="absolute left-0 top-0 h-full w-[86%] max-w-[340px] px-6 py-6 flex flex-col"
            style={{ background: "var(--brand-navy)", borderRight: "1px solid var(--brand-gold)" }}
          >
            <div className="flex items-center justify-between mb-8">
              <BrandWordmark width={96} />
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
                  onClick={() => setOpen(false)}
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
                className="block py-4 brand-nav-link"
                style={{ borderBottom: "1px solid rgba(212,175,55,0.14)", fontSize: "1rem" }}
              >
                Blog
              </a>
            </nav>
            <a href="#contact" onClick={() => setOpen(false)} className="brand-btn mt-8 w-full">
              <CalendarDays size={16} aria-hidden="true" /> Schedule a Conversation
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
