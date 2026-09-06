import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Post your offering & wishlist",
    body: "List one to three skills you can comfortably teach, and one to three you ache to learn. Your profile becomes a trade proposal.",
  },
  {
    n: "02",
    title: "Match & handshake",
    body: "Zettal pairs complementary traders — Maya wants React, Leo wants Spanish. Review profiles, then propose the swap with one tap.",
  },
  {
    n: "03",
    title: "Go live & earn credits",
    body: "Meet in the built-in video room with a collaborative canvas. Every hour you teach earns exchange credit to keep learning forever.",
  },
];

export const HowItWorks = () => (
  <section id="protocol" className="py-24 sm:py-32 bg-[#0A0A0D]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
        <div>
          <p className="font-code text-xs uppercase tracking-[0.3em] text-[#FF5E2B] mb-4">The Protocol</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-[#F4F4F0]">
            Three moves to<br /><span className="font-editorial italic font-medium text-[#A1A1AA]">your first swap.</span>
          </h2>
        </div>
        <p className="font-code text-[11px] uppercase tracking-widest text-[#71717A] lg:text-right">Avg. time to first match<br />4 minutes 12 seconds</p>
      </Reveal>

      <div>
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.12}>
            <div data-testid={`protocol-step-${s.n}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-baseline border-t border-white/10 py-10 lg:py-12 hover:bg-white/[0.02] transition-colors duration-500 px-2 sm:px-4 -mx-2 sm:-mx-4">
              <span className="lg:col-span-2 font-display text-5xl lg:text-7xl font-black text-stroke group-hover:text-[#FF5E2B] group-hover:[-webkit-text-stroke:0px] transition-all duration-500">{s.n}</span>
              <h3 className="lg:col-span-4 font-display text-xl sm:text-2xl font-bold text-[#F4F4F0]">{s.title}</h3>
              <p className="lg:col-span-6 text-base leading-relaxed text-[#A1A1AA]">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
