import { useEffect } from "react";
import { Background } from "../components/Background";
import { Services } from "../components/Services";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import { SectionFlowArrow } from "../components/SectionFlowArrow";
import { SiteHeader } from "../components/SiteHeader";
import { Hero } from "../components/Hero";
import { SiteFooter } from "../components/SiteFooter";

export function PublicSite() {
  // The blog links to /appointments; land those visitors on the booking section.
  useEffect(() => {
    if (window.location.pathname.replace(/\/$/, "") === "/appointments" && !window.location.hash) {
      requestAnimationFrame(() => document.getElementById("contact")?.scrollIntoView());
    }
  }, []);

  return (
    <div
      id="top"
      className="min-h-screen relative overflow-x-hidden"
      style={{ fontFamily: "var(--font-ui)", color: "var(--brand-offwhite)" }}
    >
      <a href="#main" className="skip-link">Skip to content</a>
      <Background />
      <div className="relative z-10">
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          <Hero />
          <Contact />
          <SectionFlowArrow />
          <Services />
          <SectionFlowArrow />
          <Projects />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
