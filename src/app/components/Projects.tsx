import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { useProjects } from "../context/ProjectsContext";

const ALL = "All";

export function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { projects } = useProjects();
  const [activeFilter, setActiveFilter] = useState(ALL);

  const published = projects.filter((p) => p.status === "published");
  const categories = [ALL, ...Array.from(new Set(published.map((p) => p.category)))];
  const filtered =
    activeFilter === ALL ? published : published.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-28 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span style={{ color: "#D4AF37", fontFamily: "'Fira Code', monospace", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            // our work
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
            Client Work
          </h2>
          <p
            className="mt-4 max-w-lg mx-auto"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem" }}
          >
            A selection of projects we're proud to have built for ambitious clients.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-2 mb-12 flex-wrap"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="px-5 py-2 rounded-xl text-sm transition-all duration-200"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
                background:
                  activeFilter === cat
                    ? "linear-gradient(135deg, rgba(212,175,55,0.5), rgba(184,150,46,0.5))"
                    : "rgba(255,255,255,0.03)",
                border:
                  activeFilter === cat
                    ? "1px solid rgba(212,175,55,0.5)"
                    : "1px solid rgba(255,255,255,0.07)",
                color: activeFilter === cat ? "#0a0800" : "rgba(255,255,255,0.45)",
                boxShadow:
                  activeFilter === cat ? "0 0 20px rgba(212,175,55,0.25)" : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Space Grotesk', sans-serif" }}>
            No published projects in this category yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.25 + i * 0.1 }}
                layout
              >
                <GlassCard
                  tilt
                  glow={`${project.color}18`}
                  className="overflow-hidden h-full group"
                  style={{ border: `1px solid ${project.color}20` }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={project.image ?? "https://placehold.co/400x300/1a1a1a/666?text=No+Image"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ opacity: 0.55 }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to bottom, transparent 20%, rgba(6,5,4,0.97))",
                      }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {project.featured && (
                        <span
                          className="px-2.5 py-1 rounded-full text-xs"
                          style={{
                            background: "rgba(212,175,55,0.2)",
                            border: "1px solid rgba(212,175,55,0.4)",
                            color: "#D4AF37",
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 500,
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          ★ Featured
                        </span>
                      )}
                    </div>

                    {/* Live link */}
                    {project.live && project.live !== "#" && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: "rgba(6,5,4,0.8)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          backdropFilter: "blur(10px)",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-1.5">
                      <h3
                        className="text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}
                      >
                        {project.title}
                      </h3>
                      <ArrowUpRight
                        size={15}
                        className="flex-shrink-0 mt-0.5 transition-colors duration-200 group-hover:opacity-100"
                        style={{ color: "rgba(212,175,55,0.3)" }}
                      />
                    </div>

                    <div
                      className="flex items-center gap-2 mb-3"
                      style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      <span>{project.client}</span>
                      {project.year && (
                        <>
                          <span>·</span>
                          <span>{project.year}</span>
                        </>
                      )}
                    </div>

                    <p
                      className="text-sm mb-4 leading-relaxed line-clamp-2"
                      style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            background: `${project.color}12`,
                            border: `1px solid ${project.color}25`,
                            color: project.color,
                            fontFamily: "'Fira Code', monospace",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
