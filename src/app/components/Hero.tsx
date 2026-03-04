import { motion } from "motion/react";
import { ArrowDown, ArrowRight, Zap, Globe, Shield } from "lucide-react";
import { ThroneIcon } from "./ThroneIcon";
import { useReduceAnimations } from "../../hooks/useReduceAnimations";

const pillars = [
  { icon: Zap,    label: "High Performance" },
  { icon: Globe,  label: "Global Scale" },
  { icon: Shield, label: "Enterprise-Grade" },
];

const coreStack = ["React", "Vite", "TypeScript", "Rails", "PostgreSQL", "Tailwind", "AWS"];

export function Hero() {
  const reduce = useReduceAnimations();
  const d = (x: number, y: number) => (reduce ? y : x);
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16 relative">
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center">

        <div className="space-y-8 max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.6, 0.3), delay: d(0.2, 0.05) }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.25)",
              }}
            >
              <ThroneIcon size={14} />
              <span style={{ color: "#D4AF37", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.8rem", fontWeight: 500 }}>
                Digital Agency — Est. 2018
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.7, 0.35), delay: d(0.3, 0.08) }}
            className="space-y-3"
          >
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
                color: "#FFFFFF",
              }}
            >
              We Build
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #9A7B0A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Digital Empires.
              </span>
            </h1>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                color: "rgba(255,255,255,0.45)",
                maxWidth: "480px",
                lineHeight: 1.7,
                margin: "0 auto",
              }}
            >
              Throne Technology crafts world-class web applications, mobile experiences,
              and digital platforms for ambitious brands that demand excellence.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.6, 0.3), delay: d(0.5, 0.12) }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              className="px-7 py-3.5 rounded-xl text-black text-sm flex items-center gap-2 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 50px rgba(212,175,55,0.65)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(212,175,55,0.4)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start a Project
              <ArrowRight size={15} />
            </button>
            <button
              className="px-7 py-3.5 rounded-xl text-sm flex items-center gap-2 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,55,0.35)";
                (e.currentTarget as HTMLButtonElement).style.color = "#D4AF37";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)";
              }}
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Our Work
            </button>
          </motion.div>

          {/* Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.6, 0.3), delay: d(0.65, 0.15) }}
            className="flex flex-wrap justify-center gap-3"
          >
            {pillars.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: "rgba(212, 175, 55, 0.06)",
                  border: "1px solid rgba(212, 175, 55, 0.12)",
                }}
              >
                <Icon size={12} style={{ color: "#D4AF37" }} />
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Core Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.6, 0.3), delay: d(0.75, 0.18) }}
            className="flex flex-wrap justify-center gap-2"
          >
            {coreStack.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg text-xs"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={reduce ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span style={{ color: "rgba(212,175,55,0.3)", fontSize: "0.7rem", fontFamily: "'Fira Code', monospace" }}>scroll</span>
        <ArrowDown size={14} style={{ color: "rgba(212,175,55,0.3)" }} />
      </motion.div>
    </section>
  );
}
