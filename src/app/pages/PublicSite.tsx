import type { Page } from "../App";
import { Background } from "../components/Background";
import { Services } from "../components/Services";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

export function PublicSite({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <Background />
      <div className="relative z-10">
        <main>
          <Projects />
          <Services />
          <Contact />
        </main>
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
}
