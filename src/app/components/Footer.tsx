import type { Page } from "../App";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { ThroneIcon } from "./ThroneIcon";

const links = {
  Services: ["Web Development", "Mobile Apps", "UI/UX Design", "Cloud & DevOps", "AI Integration"],
  Company:  ["About Us", "Our Work", "Careers", "Blog", "Contact"],
  Legal:    ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const socials = [
  { icon: Github,    href: "#" },
  { icon: Linkedin,  href: "#" },
  { icon: Twitter,   href: "#" },
  { icon: Instagram, href: "#" },
];

export function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <footer className="pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div
          className="rounded-2xl p-8 mb-10"
          style={{
            background: "rgba(212,175,55,0.04)",
            border: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <ThroneIcon size={30} />
                <div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      background: "linear-gradient(135deg, #F0D060, #D4AF37)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    THRONE
                  </div>
                  <div style={{ color: "rgba(212,175,55,0.5)", fontSize: "0.58rem", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    Technology
                  </div>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.7 }}>
                Building digital empires for ambitious brands since 2018.
              </p>
              <div className="flex gap-2.5 mt-5">
                {socials.map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.35)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,175,55,0.12)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.3)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)";
                    }}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(links).map(([heading, items]) => (
              <div key={heading}>
                <div style={{ color: "rgba(212,175,55,0.7)", fontSize: "0.72rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "14px" }}>
                  {heading}
                </div>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.83rem", fontFamily: "'Space Grotesk', sans-serif", textDecoration: "none", transition: "color 0.15s" }}
                        onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)")}
                        onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)")}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.78rem", fontFamily: "'Space Grotesk', sans-serif" }}>
            © {new Date().getFullYear()} Throne Technology LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
