import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ThroneIcon } from "../ThroneIcon";
import type { Page } from "../../App";

export function AdminLogin({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        onNavigate("admin");
      } else {
        setError("Incorrect email or password. Please try again.");
        setPassword("");
      }
    } catch {
      setError("Login failed. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #060504 0%, #0d0b07 50%, #060504 100%)",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(184,150,46,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm relative"
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(212,175,55,0.2)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 80px rgba(212,175,55,0.06)",
          }}
        >
          {/* Top shimmer */}
          <div
            className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }}
          />

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <ThroneIcon size={48} />
            </div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1.3rem",
                background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.01em",
              }}
            >
              THRONE TECHNOLOGY
            </div>
            <div
              style={{
                color: "rgba(212,175,55,0.4)",
                fontSize: "0.65rem",
                fontFamily: "'Fira Code', monospace",
                letterSpacing: "0.2em",
                marginTop: "3px",
              }}
            >
              ADMIN PANEL
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full mb-7"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" }}
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <div className="relative">
                <div
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(212,175,55,0.4)" }}
                >
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: error
                      ? "1px solid rgba(239,68,68,0.5)"
                      : "1px solid rgba(212,175,55,0.15)",
                    borderRadius: "12px",
                    color: "white",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.9rem",
                    padding: "12px 44px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    if (!error) {
                      (e.target as HTMLInputElement).style.borderColor = "rgba(212,175,55,0.45)";
                      (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!error) {
                      (e.target as HTMLInputElement).style.borderColor = "rgba(212,175,55,0.15)";
                      (e.target as HTMLInputElement).style.boxShadow = "none";
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div className="relative">
                <div
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(212,175,55,0.4)" }}
                >
                  <Lock size={15} />
                </div>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: error
                      ? "1px solid rgba(239,68,68,0.5)"
                      : "1px solid rgba(212,175,55,0.15)",
                    borderRadius: "12px",
                    color: "white",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.9rem",
                    padding: "12px 44px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    if (!error) {
                      (e.target as HTMLInputElement).style.borderColor = "rgba(212,175,55,0.45)";
                      (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!error) {
                      (e.target as HTMLInputElement).style.borderColor = "rgba(212,175,55,0.15)";
                      (e.target as HTMLInputElement).style.boxShadow = "none";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3.5 py-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <AlertCircle size={14} style={{ color: "#f87171", flexShrink: 0 }} />
                <span style={{ color: "#f87171", fontSize: "0.8rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {error}
                </span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-black flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                boxShadow: "0 0 25px rgba(212,175,55,0.35)",
                cursor: loading ? "wait" : "pointer",
                letterSpacing: "0.03em",
              }}
              whileHover={!loading ? { scale: 1.01, boxShadow: "0 0 40px rgba(212,175,55,0.5)" } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                "Access Panel"
              )}
            </motion.button>
          </form>

          <p
            className="text-center mt-6"
            style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.72rem", fontFamily: "'Fira Code', monospace" }}
          >
            Use your admin email and password
          </p>
        </div>
      </motion.div>
    </div>
  );
}
