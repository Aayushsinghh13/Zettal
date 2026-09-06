import { scrollToId } from "../../lib/scroll";

export const Footer = () => (
  <footer className="border-t border-white/10 bg-[#0A0A0D] pt-16 pb-8 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between gap-10 mb-16">
        <div className="max-w-sm">
          <p className="font-display font-black text-2xl text-[#F4F4F0]">Zettal</p>
          <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">The zero-dollar skill marketplace. Teach what you love, learn what you hunger for.</p>
          <div data-testid="footer-status-pill" className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4FF00] animate-pulse" />
            <span className="font-code text-[11px] text-[#A1A1AA]">All systems live</span>
          </div>
        </div>
        <nav className="flex gap-16">
          <div className="flex flex-col gap-3">
            <p className="font-code text-[11px] uppercase tracking-[0.3em] text-[#71717A] mb-1">Site</p>
            <button data-testid="footer-link-manifesto" onClick={() => scrollToId("manifesto")} className="text-left text-sm text-[#A1A1AA] hover:text-[#FF5E2B] transition-colors duration-300">Manifesto</button>
            <button data-testid="footer-link-protocol" onClick={() => scrollToId("protocol")} className="text-left text-sm text-[#A1A1AA] hover:text-[#FF5E2B] transition-colors duration-300">Protocol</button>
            <button data-testid="footer-link-exchange" onClick={() => scrollToId("exchange")} className="text-left text-sm text-[#A1A1AA] hover:text-[#FF5E2B] transition-colors duration-300">Exchange</button>
            <button data-testid="footer-link-waitlist" onClick={() => scrollToId("waitlist")} className="text-left text-sm text-[#A1A1AA] hover:text-[#FF5E2B] transition-colors duration-300">Waitlist</button>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-code text-[11px] uppercase tracking-[0.3em] text-[#71717A] mb-1">Legal</p>
            <span className="text-sm text-[#71717A]">Privacy</span>
            <span className="text-sm text-[#71717A]">Terms</span>
          </div>
        </nav>
      </div>

      <p aria-hidden className="font-display font-black text-center leading-none select-none text-stroke text-[clamp(5rem,18vw,16rem)]">ZETTAL</p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6">
        <p className="font-code text-[11px] text-[#71717A]">© 2026 Zettal — SkillSwap. All skills reserved.</p>
        <p className="font-code text-[11px] text-[#71717A]">Made by swappers, for swappers.</p>
      </div>
    </div>
  </footer>
);
