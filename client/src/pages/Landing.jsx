import { useEffect } from "react";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { Nav } from "../components/landing/Nav";
import { Hero } from "../components/landing/Hero";
import { Marquee } from "../components/landing/Marquee";
import { Manifesto } from "../components/landing/Manifesto";
import { HowItWorks } from "../components/landing/HowItWorks";
import { SkillShowcase } from "../components/landing/SkillShowcase";
import { Waitlist } from "../components/landing/Waitlist";
import { Footer } from "../components/landing/Footer";

export default function Landing() {
  useEffect(() => {
    document.title = "Zettal — Trade Skills, Not Money";
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09 });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <div className="App grain" style={{ backgroundColor: "#08080a", minHeight: "100vh", color: "#f4f4f0" }}>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <HowItWorks />
        <SkillShowcase />
        <Waitlist />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
