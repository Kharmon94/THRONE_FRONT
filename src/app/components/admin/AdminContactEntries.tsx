import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Trash2, Mail } from "lucide-react";
import { api } from "../../../services/api";
import { useReduceAnimations } from "../../../hooks/useReduceAnimations";
import type { ContactEntry } from "../../types";

export function AdminContactEntries() {
  const reduce = useReduceAnimations();
  const [entries, setEntries] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getContactEntries();
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = entries.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.company ?? "").toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    await api.deleteContactEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setConfirmDelete(null);
  };

  const formatDate = (s: string) => {
    try {
      const d = new Date(s);
      return d.toLocaleDateString(undefined, { dateStyle: "medium" }) + " " + d.toLocaleTimeString(undefined, { timeStyle: "short" });
    } catch {
      return s;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.25 : 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
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
            Contact Entries
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif", marginTop: "2px" }}>
            {entries.length} total
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.25 : 0.4, delay: reduce ? 0.02 : 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(212,175,55,0.4)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company, message..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(212,175,55,0.12)",
              borderRadius: "12px",
              color: "white",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.85rem",
              padding: "10px 14px 10px 40px",
              outline: "none",
              transition: "all 0.15s",
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(212,175,55,0.4)";
              (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(212,175,55,0.07)";
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(212,175,55,0.12)";
              (e.target as HTMLInputElement).style.boxShadow = "none";
            }}
          />
        </div>
      </motion.div>

      {/* Entries list */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin h-8 w-8 border-2 border-amber-600 border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24"
          style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {search ? "No entries match your search." : "No contact entries yet."}
        </motion.div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.1)" }}
        >
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <AnimatePresence>
              {filtered.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: reduce ? 0.2 : 0.25, delay: reduce ? Math.min(i * 0.015, 0.2) : i * 0.03 }}
                  layout
                  className="px-6 py-5 flex flex-col sm:flex-row sm:items-start gap-4 group transition-colors duration-150"
                  style={{ borderColor: "rgba(255,255,255,0.04)" }}
                  onMouseEnter={(el) => (el.currentTarget.style.background = "rgba(212,175,55,0.03)")}
                  onMouseLeave={(el) => (el.currentTarget.style.background = "transparent")}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                    <Mail size={18} style={{ color: "#D4AF37" }} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.9rem" }}>{e.name}</span>
                      {e.company && (
                        <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37", fontFamily: "'Fira Code', monospace" }}>
                          {e.company}
                        </span>
                      )}
                    </div>
                    <a href={`mailto:${e.email}`} className="text-sm block" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Space Grotesk', sans-serif", textDecoration: "none" }}>
                      {e.email}
                    </a>
                    {e.budget && (
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                        Budget: {e.budget}
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.5 }}>
                      {e.message}
                    </p>
                    <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", fontFamily: "'Fira Code', monospace" }}>
                      {formatDate(e.created_at)}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setConfirmDelete(e.id)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150"
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171", cursor: "pointer" }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: reduce ? 0.12 : 0.18 }}
              className="relative rounded-2xl p-7 w-full max-w-sm text-center"
              style={{
                background: "#0d0b08",
                border: "1px solid rgba(239,68,68,0.3)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <Trash2 size={22} style={{ color: "#f87171" }} />
              </div>
              <h3 className="text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem" }}>
                Delete Contact Entry?
              </h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "20px" }}>
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm transition-all duration-150"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontFamily: "'Space Grotesk', sans-serif", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontFamily: "'Space Grotesk', sans-serif", cursor: "pointer", fontWeight: 600 }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
