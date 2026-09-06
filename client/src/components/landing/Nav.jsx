import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { scrollToId } from "../../lib/scroll";

export const Nav = () => {
  const [count] = useState(1248);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl rounded-full bg-[#0F0F12]/80 border border-white/10 backdrop-blur-xl px-5 sm:px-6 py-3 shadow-2xl flex items-center justify-between"
    >
      <button data-testid="nav-brand-logo" onClick={() => window.__lenis?.scrollTo(0, { duration: 1.5 })} className="flex items-baseline gap-2 group">
        <span className="font-display font-black text-xl tracking-tight text-[#F4F4F0] group-hover:text-[#FF5E2B] transition-colors duration-300">Zettal</span>
        <span className="font-code text-[10px] uppercase tracking-widest text-[#71717A] hidden sm:inline">SkillSwap</span>
      </button>

      <nav className="hidden md:flex items-center gap-7">
        <button data-testid="nav-link-manifesto" onClick={() => scrollToId("manifesto")} className="text-sm text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors duration-300">Manifesto</button>
        <button data-testid="nav-link-how-it-works" onClick={() => scrollToId("protocol")} className="text-sm text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors duration-300">Protocol</button>
        <button data-testid="nav-link-skills" onClick={() => scrollToId("exchange")} className="text-sm text-[#A1A1AA] hover:text-[#F4F4F0] transition-colors duration-300">Exchange</button>
      </nav>

      <div className="flex items-center gap-3">
        <div data-testid="nav-counter-pill" className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4FF00] animate-pulse" />
          <span className="font-code text-[11px] text-[#A1A1AA]">{count.toLocaleString()} on the list</span>
        </div>
        <button
          data-testid="nav-waitlist-button"
          onClick={() => scrollToId("waitlist")}
          className="group flex items-center gap-1.5 rounded-full bg-[#FF5E2B] px-4 py-2 text-sm font-semibold text-[#08080A] transition-all duration-300 hover:bg-[#FF784A] hover:shadow-[0_0_24px_rgba(255,94,43,0.4)] hover:scale-[1.03]"
        >
          Join Waitlist
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </motion.header>
  );
};
