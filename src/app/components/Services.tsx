import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Code2, Smartphone, Palette, Cloud, Brain, Megaphone, ArrowRight } from "lucide-react";
import { GlassCard } from "./GlassCard";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    tagline: "Full-Stack Excellence",
    desc: "From blazing-fast marketing sites to complex SaaS platforms, we build web experiences that convert and scale.",
    techs: ["React", "Next.js", "Node.js", "PostgreSQL"],
    color: "#D4AF37",
    featured: true,
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    tagline: "iOS & Android",
    desc: "Native-quality cross-platform apps with fluid animations, offline support, and seamless UX.",
    techs: ["React Native", "Flutter", "Swift", "Firebase"],
    color: "#C0C0C0",
    featured: false,
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    tagline: "Pixel-Perfect Craft",
    desc: "Design systems, user research, prototyping, and brand identity work that puts your product ahead.",
    techs: ["Figma", "Framer", "Motion", "Design Systems"],
    color: "#D4AF37",
    featured: false,
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    tagline: "Infinite Scale",
    desc: "AWS & GCP architecture, Kubernetes, CI/CD pipelines, and infrastructure-as-code for zero-downtime deployments.",
    techs: ["AWS", "GCP", "Docker", "Terraform"],
    color: "#C0C0C0",
    featured: false,
  },
  {
    icon: Brain,
    title: "AI Integration",
    tagline: "Intelligent Products",
    desc: "Embed LLMs, computer vision, and predictive models into your product stack with clean, maintainable APIs.",
    techs: ["OpenAI", "LangChain", "Python", "Vector DBs"],
    color: "#D4AF37",
    featured: false,
  },
  {
    icon: Megaphone,
    title: "Digital Strategy",
    tagline: "Growth Architecture",
    desc: "Technical SEO, performance audits, conversion optimisation, and growth frameworks to scale your digital presence.",
    techs: ["Analytics", "SEO", "A/B Testing", "CRO"],
    color: "#C0C0C0",
    featured: false,
  },
];

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-28 px-4 relative" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span style={{ color: "#D4AF37", fontFamily: "'Fira Code', monospace", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            // what we do
          </span>
          <h2
            className="mt-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              background: "linear-gradient(135deg, #fff 0%, #C0C0C0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            Our Services
          </h2>
          <p
            className="mt-4 max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem" }}
          >
            End-to-end digital solutions — from concept to launch and beyond.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, tagline, desc, techs, color, featured }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.1 }}
            >
              <GlassCard
                tilt
                glow={`${color}15`}
                className="p-6 h-full group cursor-default"
                style={{
                  border: featured ? `1px solid rgba(212,175,55,0.3)` : `1px solid ${color}18`,
                  background: featured ? "rgba(212,175,55,0.05)" : "rgba(255,255,255,0.02)",
                }}
              >
                {featured && (
                  <div
                    className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs"
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      border: "1px solid rgba(212,175,55,0.3)",
                      color: "#D4AF37",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}25`,
                    boxShadow: `0 0 20px ${color}15`,
                  }}
                >
                  <Icon size={20} style={{ color }} />
                </div>

                <div
                  style={{ color: `${color}99`, fontSize: "0.7rem", fontFamily: "'Fira Code', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}
                  className="mb-1"
                >
                  {tagline}
                </div>
                <h3
                  className="text-white mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.05rem", letterSpacing: "-0.01em" }}
                >
                  {title}
                </h3>
                <p
                  className="leading-relaxed mb-5"
                  style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.87rem", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {desc}
                </p>

                {/* Techs */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {techs.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "rgba(255,255,255,0.45)",
                        fontFamily: "'Fira Code', monospace",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* CTA row */}
                <div
                  className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color, fontSize: "0.8rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
                >
                  Learn more <ArrowRight size={13} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
