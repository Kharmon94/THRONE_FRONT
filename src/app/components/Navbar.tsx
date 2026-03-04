import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useReduceAnimations } from "../../hooks/useReduceAnimations";
import type { Page } from "../App";

const navLinks = ["About", "Services", "Projects", "Contact"];

export function Navbar({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const reduce = useReduceAnimations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: reduce ? 0 : -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduce ? 0.25 : 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div
        className="max-w-6xl mx-auto rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-500"
        style={{
          background: scrolled ? "rgba(6, 5, 4, 0.92)" : "rgba(255,255,255,0.02)",
          backdropFilter: reduce ? "blur(12px)" : "blur(24px)",
          WebkitBackdropFilter: reduce ? "blur(12px)" : "blur(24px)",
          border: scrolled
            ? "1px solid rgba(212, 175, 55, 0.25)"
            : "1px solid rgba(255,255,255,0.05)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08)"
            : "none",
        }}
      >
        {/* Logo - Throne Tech */}
        <motion.button
          className="flex items-center cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={reduce ? undefined : { scale: 1.02 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <motion.div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "1.15rem",
              letterSpacing: "0.06em",
              background: "linear-gradient(135deg, #F0D060, #D4AF37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textTransform: "uppercase",
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, letterSpacing: "-0.04em" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, letterSpacing: "0.06em" }}
            transition={{ duration: reduce ? 0.25 : 0.5, ease: "easeOut" }}
          >
            Throne Tech
          </motion.div>
        </motion.button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="relative px-4 py-2 rounded-xl text-sm transition-all duration-200 group"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-200">
                {link}
              </span>
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "rgba(212, 175, 55, 0.08)" }}
              />
            </button>
          ))}
          <button
            onClick={() => scrollTo("Contact")}
            className="ml-2 px-5 py-2.5 rounded-xl text-sm text-black transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #F0D060, #D4AF37)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              boxShadow: "0 0 24px rgba(212, 175, 55, 0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 40px rgba(212, 175, 55, 0.55)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 24px rgba(212, 175, 55, 0.35)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Start a Project
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-2 rounded-lg"
          style={{ background: "rgba(212, 175, 55, 0.08)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="max-w-6xl mx-auto mt-2 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(6, 5, 4, 0.97)",
              backdropFilter: reduce ? "blur(8px)" : "blur(20px)",
              WebkitBackdropFilter: reduce ? "blur(8px)" : "blur(20px)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="w-full text-left px-6 py-4 text-sm transition-colors duration-200 border-b last:border-b-0"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  borderColor: "rgba(212,175,55,0.07)",
                }}
              >
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
