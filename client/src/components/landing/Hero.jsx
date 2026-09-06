import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { scrollToId } from "../../lib/scroll";

const FLOOR_SKILLS = ["REACT & NEXT.JS", "SPANISH FLUENCY", "UI/UX DESIGN", "JAZZ GUITAR", "AI PROMPTING", "JAPANESE", "FILM EDITING", "PIANO"];

const PAIRS = [
  { a: "REACT", b: "Spanish", pa: "Maya", pb: "Leo", no: "0041" },
  { a: "GUITAR", b: "AI Prompts", pa: "Leo", pb: "Mara", no: "0042" },
  { a: "JAPANESE", b: "Figma", pa: "Aiko", pb: "Dev", no: "0043" },
  { a: "PIANO", b: "Python", pa: "Nina", pb: "Ravi", no: "0044" },
];

const DIAL_SKILLS = ["React", "Spanish", "Figma", "Guitar", "Japanese", "AI Prompting", "Piano", "Python"];

const MaskedLine = ({ children, delay }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export const Hero = () => {
  const [count] = useState(1248);
  const [tick, setTick] = useState(0);
  const [pair, setPair] = useState(0);
  const [dial, setDial] = useState({ teach: "React", learn: "Spanish" });
  const [burst, setBurst] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const headY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % FLOOR_SKILLS.length), 2200);
    const pairId = setInterval(() => setPair((p) => (p + 1) % PAIRS.length), 3200);
    return () => { clearInterval(id); clearInterval(pairId); };
  }, []);

  const fireDial = (k, v) => {
    const next = { ...dial, [k]: v };
    setDial(next);
    setBurst((b) => b + 1);
    toast.success(`${next.teach} ⇄ ${next.learn} — strong combo. Matches waiting below.`);
  };

  const p = PAIRS[pair];

  return (
    <section ref={ref} className="hero-glow relative overflow-hidden pt-36 sm:pt-40 pb-24 min-h-[92vh] flex flex-col justify-center">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex items-center justify-between font-code text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#71717A] border-b border-white/10 pb-5 mb-12 sm:mb-16"
        >
          <span>[ Manifesto Protocol 01 ] <span className="text-[#FF5E2B]">— Zettal // SkillSwap</span></span>
          <span className="hidden sm:inline">Est. 2026 — No cash, ever</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          <motion.div style={{ y: headY }} className="lg:col-span-7">
            <h1 data-testid="hero-title" className="font-display font-black tracking-tight leading-[0.95] text-[12.5vw] sm:text-7xl lg:text-7xl xl:text-8xl text-[#F4F4F0]">
              <MaskedLine delay={0.25}><span className="text-stroke">We are the</span></MaskedLine>
              <MaskedLine delay={0.37}>zero-dollar</MaskedLine>
              <MaskedLine delay={0.49}>
                <span className="font-editorial italic font-medium text-[#D4FF00]">skill exchange.</span>
              </MaskedLine>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="mt-9 max-w-xl text-base sm:text-lg leading-relaxed text-[#A1A1AA]"
            >
              A non-monetary peer network where creators, engineers, artists, and polymaths
              trade live 1-on-1 mastery. Zero subscriptions. Zero cash. Pure human reciprocity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.05 }}
              className="mt-8 flex items-center gap-3 font-code text-[10px] sm:text-xs uppercase tracking-[0.25em]"
            >
              <span className="text-[#71717A]">On the floor right now</span>
              <span className="relative inline-flex h-7 min-w-44 items-center overflow-hidden rounded-full border border-[#FF5E2B]/30 bg-[#FF5E2B]/5 px-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={tick}
                    data-testid="hero-skill-ticker"
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -18, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[#FF5E2B]"
                  >
                    {FLOOR_SKILLS[tick]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <button
                data-testid="hero-join-waitlist-button"
                onClick={() => scrollToId("waitlist")}
                className="group flex items-center gap-2 rounded-full bg-[#FF5E2B] px-7 py-4 text-sm font-semibold text-[#08080A] transition-all duration-300 hover:bg-[#FF784A] hover:shadow-[0_0_36px_rgba(255,94,43,0.45)] hover:scale-[1.02]"
              >
                Join Waitlist
                <span className="font-code text-[11px] opacity-70">· {count.toLocaleString()} queued</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <button
                data-testid="hero-explore-manifesto-button"
                onClick={() => scrollToId("manifesto")}
                className="group flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.3em] text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors duration-300"
              >
                Explore Manifesto
                <ArrowDown className="h-4 w-4 animate-bounce" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: panelY }}
            initial={{ opacity: 0, x: 40, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div data-testid="hero-swap-ticket" className="relative flex rounded-2xl border border-white/10 bg-[#0F0F12]/90 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden hover:rotate-0 transition-transform duration-500">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#FF5E2B]/10 blur-3xl pointer-events-none" />

              <div className="relative w-14 shrink-0 border-r border-dashed border-white/15 flex flex-col items-center justify-between py-5">
                <span className="font-code text-[9px] uppercase tracking-[0.3em] text-[#71717A] [writing-mode:vertical-rl] rotate-180">Zettal SkillSwap</span>
                <span className="font-code text-[9px] uppercase tracking-[0.3em] text-[#FF5E2B] [writing-mode:vertical-rl] rotate-180">Admit Two</span>
              </div>
              <span className="absolute left-14 -translate-x-1/2 -top-3 h-6 w-6 rounded-full bg-[#08080A] border border-white/10" />
              <span className="absolute left-14 -translate-x-1/2 -bottom-3 h-6 w-6 rounded-full bg-[#08080A] border border-white/10" />

              <div className="relative flex-1 px-6 sm:px-8 py-7">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-code text-[10px] uppercase tracking-[0.3em] text-[#71717A]">Swap Ticket — No. {p.no}</span>
                  <span className="font-code text-[10px] uppercase tracking-[0.3em] text-[#71717A]">1 hr ⇄ 1 hr</span>
                </div>

                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div key={pair} initial="out" animate="in" exit="out2">
                      <div className="overflow-hidden">
                        <motion.p
                          variants={{ out: { y: 40, opacity: 0 }, in: { y: 0, opacity: 1 }, out2: { y: -40, opacity: 0 } }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#F4F4F0]"
                        >
                          {p.a}
                        </motion.p>
                      </div>
                      <div className="my-2 flex items-center gap-3">
                        <span className="h-px flex-1 bg-white/10" />
                        <motion.span
                          animate={{ rotate: [0, 180] }}
                          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                          key={`arrow-${pair}`}
                          className="text-[#FF5E2B]"
                        >
                          <ArrowLeftRight className="h-5 w-5" />
                        </motion.span>
                        <span className="h-px flex-1 bg-white/10" />
                      </div>
                      <div className="overflow-hidden">
                        <motion.p
                          variants={{ out: { y: 40, opacity: 0 }, in: { y: 0, opacity: 1 }, out2: { y: -40, opacity: 0 } }}
                          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                          className="font-editorial italic font-medium text-4xl sm:text-5xl text-[#D4FF00]"
                        >
                          {p.b}.
                        </motion.p>
                      </div>
                      <motion.p
                        variants={{ out: { opacity: 0 }, in: { opacity: 1 }, out2: { opacity: 0 } }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="mt-4 font-code text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA]"
                      >
                        {p.pa} teaches ⇄ {p.pb} teaches
                      </motion.p>
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`stamp-${pair}`}
                      initial={{ scale: 1.8, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: -12 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.35 }}
                      className="absolute top-1/2 -translate-y-1/2 right-0 border-2 border-[#D4FF00] text-[#D4FF00] font-code text-xs uppercase tracking-[0.3em] px-3 py-1.5 rounded-sm"
                    >
                      Matched
                    </motion.span>
                  </AnimatePresence>
                </div>

                <div className="mt-7 border-t border-dashed border-white/15 pt-4 flex items-end justify-between gap-4">
                  <div className="h-8 w-36 opacity-70" style={{ background: "repeating-linear-gradient(90deg, #F4F4F0 0 2px, transparent 2px 5px, #F4F4F0 5px 6px, transparent 6px 11px)" }} />
                  <span className="font-code text-[9px] uppercase tracking-[0.25em] text-[#71717A] text-right">Value: $0.00<br />Worth: everything</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="mt-5 flex items-center gap-2"
            >
              <span className="font-code text-[10px] uppercase tracking-[0.25em] text-[#71717A] shrink-0">Try yours</span>
              <select
                data-testid="hero-dial-teach-select"
                value={dial.teach}
                onChange={(e) => fireDial("teach", e.target.value)}
                className="flex-1 min-w-0 rounded-full border border-white/10 bg-[#16161B] px-3 py-2 font-code text-[11px] uppercase tracking-wider text-[#FF5E2B] outline-none focus:border-[#FF5E2B]/50 transition-colors duration-300"
              >
                {DIAL_SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <motion.span
                key={burst}
                initial={{ scale: 0.4, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 14 }}
                className="text-[#D4FF00] shrink-0"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </motion.span>
              <select
                data-testid="hero-dial-learn-select"
                value={dial.learn}
                onChange={(e) => fireDial("learn", e.target.value)}
                className="flex-1 min-w-0 rounded-full border border-white/10 bg-[#16161B] px-3 py-2 font-code text-[11px] uppercase tracking-wider text-[#F4F4F0] outline-none focus:border-[#FF5E2B]/50 transition-colors duration-300"
              >
                {DIAL_SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
