import { CalendarDays, ArrowRight } from "lucide-react";

// Copy is limited to facts already stated on the site and the approved blog:
// Throne Technology builds websites and custom software and books conversations.
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="px-4 pt-14 pb-6 md:pt-20 md:pb-10">
      <div className="max-w-6xl mx-auto">
        <p
          style={{
            color: "var(--brand-gold)",
            fontFamily: "var(--font-ui)",
            fontWeight: 600,
            fontSize: "0.75rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Throne Technology
        </p>
        <h1
          id="hero-title"
          className="font-display mt-3 max-w-3xl"
          style={{ color: "var(--brand-offwhite)", fontSize: "clamp(2.25rem, 5.5vw, 4rem)", lineHeight: 1.08 }}
        >
          Websites and custom software,{" "}
          <em style={{ color: "var(--brand-gold)", fontStyle: "italic" }}>built around your business.</em>
        </h1>
        <p
          className="mt-5 max-w-2xl"
          style={{ color: "var(--brand-muted)", fontSize: "1.05rem", lineHeight: 1.7 }}
        >
          Tell us what you're trying to accomplish and we'll talk through the options. Pick a time
          below to schedule a conversation.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#contact" className="brand-btn">
            <CalendarDays size={16} aria-hidden="true" /> Schedule a Conversation
          </a>
          <a href="#projects" className="brand-btn-ghost">
            See our work <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
