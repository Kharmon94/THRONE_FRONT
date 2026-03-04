import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Mail, Send, MapPin, CheckCircle, Clock } from "lucide-react";
import { api } from "../../services/api";
import { GlassCard } from "./GlassCard";
import { ThroneIcon } from "./ThroneIcon";
import { useReduceAnimations } from "../../hooks/useReduceAnimations";

const contactInfo = [
  { icon: Mail,   label: "Email Us",  value: "thronetechnology@gmail.com", color: "#D4AF37", href: "mailto:thronetechnology@gmail.com" },
  { icon: MapPin, label: "HQ",        value: "Aurora, CO",                 color: "#D4AF37", href: "#" },
  { icon: Clock,  label: "Response",  value: "Within 24 hours",            color: "#C0C0C0", href: "#" },
];

const budgets = ["< $10k", "$10k–$25k", "$25k–$75k", "$75k–$150k", "$150k+"];

export function Contact() {
  const reduce = useReduceAnimations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.createContactEntry({
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        budget: form.budget || undefined,
        message: form.message,
      });
      setSent(true);
      setForm({ name: "", email: "", company: "", budget: "", message: "" });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const base = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(212,175,55,0.1)",
    borderRadius: "12px",
    color: "white",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.875rem",
    padding: "11px 14px",
    outline: "none",
    width: "100%",
    transition: "all 0.2s",
  } as React.CSSProperties;

  const focusStyle = (el: HTMLElement) => {
    el.style.borderColor = "rgba(212,175,55,0.45)";
    el.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)";
  };
  const blurStyle = (el: HTMLElement) => {
    el.style.borderColor = "rgba(212,175,55,0.1)";
    el.style.boxShadow = "none";
  };

  return (
    <section id="contact" className="py-28 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reduce ? 0.3 : 0.6 }}
          className="text-center mb-16"
        >
          <span style={{ color: "#D4AF37", fontFamily: "'Fira Code', monospace", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            // let's build together
          </span>
          <h2
            className="mt-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              background: "linear-gradient(135deg, #fff 0%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            Start Your Project
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left info — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: reduce ? 0.35 : 0.7, delay: reduce ? 0.05 : 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            <GlassCard className="p-7">
              <div className="flex items-center gap-3 mb-6">
                <ThroneIcon size={32} />
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", background: "linear-gradient(135deg, #F0D060, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    THRONE TECHNOLOGY
                  </div>
                  <div style={{ color: "rgba(212,175,55,0.5)", fontSize: "0.65rem", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.12em" }}>
                    GET IN TOUCH
                  </div>
                </div>
              </div>

              <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "24px" }}>
                Have a project in mind? We'd love to hear about it. Fill out the form or reach us directly — we respond within one business day.
              </p>

              <div className="space-y-3">
                {contactInfo.map(({ icon: Icon, label, value, color, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", textDecoration: "none" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = `${color}0d`;
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}30`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.02)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.05)";
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", fontFamily: "'Space Grotesk', sans-serif" }}>{label}</div>
                      <div className="text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: "0.85rem" }}>{value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </GlassCard>

            {/* Availability */}
            <GlassCard className="p-5" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#10b981", boxShadow: "0 0 10px rgba(16,185,129,0.7)", flexShrink: 0 }} />
                <div>
                  <div className="text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem" }}>Currently Accepting Projects</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", fontFamily: "'Space Grotesk', sans-serif" }}>Q1 2026 slots available — book yours now</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right form — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: reduce ? 0.35 : 0.7, delay: reduce ? 0.1 : 0.35 }}
            className="lg:col-span-3"
          >
            <GlassCard className="p-8 h-full">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                      placeholder="Alex Johnson"
                      style={base}
                      onFocus={(e) => focusStyle(e.target as HTMLElement)}
                      onBlur={(e) => blurStyle(e.target as HTMLElement)}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                      placeholder="alex@company.com"
                      style={base}
                      onFocus={(e) => focusStyle(e.target as HTMLElement)}
                      onBlur={(e) => blurStyle(e.target as HTMLElement)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                    Company / Project Name
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
                    placeholder="Acme Corp"
                    style={base}
                    onFocus={(e) => focusStyle(e.target as HTMLElement)}
                    onBlur={(e) => blurStyle(e.target as HTMLElement)}
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                    Estimated Budget
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {budgets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setForm((s) => ({ ...s, budget: b }))}
                        className="px-3.5 py-2 rounded-lg text-sm transition-all duration-150"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          background: form.budget === b ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.03)",
                          border: form.budget === b ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.07)",
                          color: form.budget === b ? "#D4AF37" : "rgba(255,255,255,0.4)",
                          fontWeight: form.budget === b ? 600 : 400,
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                    Tell Us About Your Project *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                    placeholder="Describe what you want to build, your timeline, and any specific requirements..."
                    style={{ ...base, resize: "none" }}
                    onFocus={(e) => focusStyle(e.target as HTMLElement)}
                    onBlur={(e) => blurStyle(e.target as HTMLElement)}
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{error}</div>
                )}

                <motion.button
                  type="submit"
                  disabled={sending || sent}
                  className="w-full py-4 rounded-xl text-black flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: sent ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #F0D060, #D4AF37)",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: sent ? "white" : "black",
                    boxShadow: sent ? "0 0 30px rgba(16,185,129,0.4)" : "0 0 30px rgba(212,175,55,0.35)",
                    cursor: sending ? "wait" : "pointer",
                    letterSpacing: "0.02em",
                  }}
                  whileHover={!reduce && !sending && !sent ? { scale: 1.01 } : undefined}
                  whileTap={!reduce && !sending && !sent ? { scale: 0.99 } : undefined}
                >
                  {sent ? (
                    <><CheckCircle size={16} /> Message Received — We'll be in touch!</>
                  ) : sending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <><Send size={15} /> Send Enquiry</>
                  )}
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
