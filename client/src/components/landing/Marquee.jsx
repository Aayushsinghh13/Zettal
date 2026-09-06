const ITEMS = [
  "Teach React ↔ Learn Spanish",
  "Swap Figma ↔ Learn Japanese",
  "Trade Guitar ↔ Master AI Prompting",
  "Teach Python ↔ Learn Film Editing",
  "Swap Piano ↔ Learn UX Writing",
  "Trade Photography ↔ Learn Sourdough",
];

export const Marquee = () => (
  <div data-testid="editorial-marquee" className="overflow-hidden border-y border-white/10 bg-[#0F0F12] py-5">
    <div className="animate-marquee flex w-max whitespace-nowrap">
      {[0, 1].map((dup) => (
        <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
          {ITEMS.map((item) => (
            <span key={`${dup}-${item}`} className="flex items-center font-code text-sm uppercase tracking-[0.2em] text-[#A1A1AA]">
              <span className="px-6">{item}</span>
              <span className="text-[#FF5E2B]">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
