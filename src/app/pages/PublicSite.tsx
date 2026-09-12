import { Background } from "../components/Background";
import { Services } from "../components/Services";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";

export function PublicSite() {
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
      </div>
    </div>
  );
}
