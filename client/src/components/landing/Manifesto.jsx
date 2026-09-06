import { Reveal } from "./Reveal";

const CHAPTERS = [
  {
    n: "01",
    title: "The Zero-Dollar Economy",
    body: "Education was monetized, paywalled, and stripped of intimacy. Zettal resets the counter — here, skills are the only currency that matters.",
  },
  {
    n: "02",
    title: "Peer-to-Peer Mastery",
    body: "No pre-recorded ten-hour courses you'll never finish. You learn directly from active practitioners, live, 1-on-1, human to human.",
  },
  {
    n: "03",
    title: "The Infinite Exchange Loop",
    body: "Teach one hour of what you excel at. Receive one hour of what you hunger for. An infinite reciprocity engine with no checkout page.",
  },
];

export const Manifesto = () => (
  <section id="manifesto" className="py-24 sm:py-32 lg:py-36">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal>
        <p className="font-code text-xs uppercase tracking-[0.3em] text-[#FF5E2B] mb-4">The Manifesto</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-[#F4F4F0] max-w-2xl">
          Three chapters. <span className="font-editorial italic font-medium text-[#A1A1AA]">One conviction.</span>
        </h2>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
        {CHAPTERS.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.15}>
            <article data-testid={`manifesto-chapter-${c.n}`} className="group border-t border-white/10 pt-8 hover:border-[#FF5E2B]/50 transition-colors duration-500">
              <span className="font-display text-6xl font-black text-stroke group-hover:text-[#FF5E2B] group-hover:[-webkit-text-stroke:0px] transition-all duration-500">{c.n}</span>
              <h3 className="mt-6 font-display text-xl sm:text-2xl font-bold text-[#F4F4F0]">{c.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-[#A1A1AA]">{c.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
