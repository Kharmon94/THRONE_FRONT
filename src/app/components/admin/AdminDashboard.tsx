import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FolderKanban, Eye, Star, FileX, ArrowRight, TrendingUp, Clock, Mail } from "lucide-react";
import { useProjects } from "../../context/ProjectsContext";
import { api } from "../../../services/api";

export function AdminDashboard({
  onNavigateToProjects,
  onNavigateToContactEntries,
}: {
  onNavigateToProjects: () => void;
  onNavigateToContactEntries: () => void;
}) {
  const { projects } = useProjects();
  const [contactCount, setContactCount] = useState<number>(0);

  useEffect(() => {
    api.getContactEntries().then((e) => setContactCount(e.length)).catch(() => setContactCount(0));
  }, []);

  const total     = projects.length;
  const published = projects.filter((p) => p.status === "published").length;
  const drafts    = projects.filter((p) => p.status === "draft").length;
  const featured  = projects.filter((p) => p.featured).length;

  const stats: Array<{ label: string; value: number; icon: typeof FolderKanban; color: string; sub: string; onClick?: () => void }> = [
    { label: "Total Projects", value: total,         icon: FolderKanban, color: "#D4AF37",  sub: "in portfolio" },
    { label: "Published",      value: published,     icon: Eye,          color: "#10b981",  sub: "live on site" },
    { label: "Drafts",         value: drafts,        icon: FileX,        color: "#C0C0C0",  sub: "in progress" },
    { label: "Featured",       value: featured,      icon: Star,         color: "#F0D060",  sub: "highlighted" },
    { label: "Contact Entries", value: contactCount, icon: Mail,         color: "#60a5fa",  sub: "from form", onClick: onNavigateToContactEntries },
  ];

  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const recentProjects = [...projects].slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "1.6rem",
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #fff, #D4AF37)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif", marginTop: "4px" }}>
          Welcome back — here's an overview of your portfolio.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, color, sub, onClick }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
          >
            <div
              role={onClick ? "button" : undefined}
              onClick={onClick}
              tabIndex={onClick ? 0 : undefined}
              onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
              className="p-5 rounded-2xl relative overflow-hidden transition-colors duration-150"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${color}20`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
                cursor: onClick ? "pointer" : undefined,
              }}
              onMouseEnter={onClick ? (e) => { (e.currentTarget.style.background = "rgba(255,255,255,0.05)"); (e.currentTarget.style.borderColor = `${color}40`); } : undefined}
              onMouseLeave={onClick ? (e) => { (e.currentTarget.style.background = "rgba(255,255,255,0.03)"); (e.currentTarget.style.borderColor = `${color}20`); } : undefined}
            >
              {/* Glow */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, filter: "blur(20px)", transform: "translate(30%, -30%)" }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "2rem",
                  lineHeight: 1,
                  background: `linear-gradient(135deg, #fff, ${color})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
              >
                {value}
              </div>
              <div className="mt-1.5" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}>
                {label}
              </div>
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif", marginTop: "2px" }}>
                {sub}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(212,175,55,0.1)",
            }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <Clock size={15} style={{ color: "#D4AF37" }} />
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                  Recent Projects
                </span>
              </div>
              <button
                onClick={onNavigateToProjects}
                className="flex items-center gap-1.5 text-xs transition-colors duration-150"
                style={{ color: "rgba(212,175,55,0.6)", fontFamily: "'Space Grotesk', sans-serif", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#D4AF37")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(212,175,55,0.6)")}
              >
                View all <ArrowRight size={11} />
              </button>
            </div>

            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {recentProjects.map((p) => (
                <div
                  key={p.id}
                  className="px-6 py-3.5 flex items-center gap-4 group transition-colors duration-150"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,175,55,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Thumb */}
                  <div
                    className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ border: `1px solid ${p.color}25` }}
                  >
                    <img src={p.image ?? "https://placehold.co/100/1a1a1a/666?text=+"} alt={p.title} className="w-full h-full object-cover opacity-70" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className="text-white truncate"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      {p.title}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                      {p.client} · {p.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {p.featured && (
                      <span style={{ color: "#D4AF37", fontSize: "0.68rem" }}>★</span>
                    )}
                    <span
                      className="px-2.5 py-1 rounded-full text-xs"
                      style={{
                        background: p.status === "published" ? "rgba(16,185,129,0.12)" : "rgba(156,163,175,0.12)",
                        border: p.status === "published" ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(156,163,175,0.2)",
                        color: p.status === "published" ? "#10b981" : "#9ca3af",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
              {recentProjects.length === 0 && (
                <div className="px-6 py-10 text-center" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                  No projects yet. Add your first one!
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="space-y-5"
        >
          {/* Categories */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} style={{ color: "#D4AF37" }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
                By Category
              </span>
            </div>
            <div className="space-y-3">
              {categories.map((cat) => {
                const count = projects.filter((p) => p.category === cat).length;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={cat}>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", fontFamily: "'Space Grotesk', sans-serif" }}>{cat}</span>
                      <span style={{ color: "#D4AF37", fontSize: "0.72rem", fontFamily: "'Fira Code', monospace" }}>{count}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg, #D4AF37, #F0D060)" }}
                      />
                    </div>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                  No data yet.
                </p>
              )}
            </div>
          </div>

          {/* Quick action */}
          <button
            onClick={onNavigateToProjects}
            className="block w-full text-left rounded-2xl p-5 transition-all duration-200"
            style={{
              background: "rgba(212,175,55,0.07)",
              border: "1px solid rgba(212,175,55,0.2)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,175,55,0.12)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,55,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,175,55,0.07)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,55,0.2)";
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "6px",
              }}
            >
              Manage Projects →
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", fontFamily: "'Space Grotesk', sans-serif" }}>
              Add, edit, or remove portfolio items
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
