import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BadgeCheck, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";

const inputCls = "w-full rounded-xl border border-white/10 bg-[#16161B] px-4 py-3.5 text-sm text-[#F4F4F0] placeholder:text-[#71717A] outline-none focus:border-[#FF5E2B]/50 transition-colors duration-300";

export const Waitlist = () => {
  const [form, setForm] = useState({ name: "", email: "", teach: "", learn: "" });
  const [busy, setBusy] = useState(false);
  const [pass, setPass] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    setTimeout(() => {
      const savedRank = Math.floor(100 + Math.random() * 900);
      setPass({ ...form, rank: savedRank });
      toast.success("Early access pass claimed! Your spot is locked.");
      setBusy(false);
    }, 600);
  };

  return (
    <section id="waitlist" className="relative py-24 sm:py-32 lg:py-36 overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-72 w-[42rem] max-w-full rounded-full bg-[#FF5E2B]/10 blur-[120px]" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <p className="font-code text-xs uppercase tracking-[0.3em] text-[#FF5E2B] mb-4">First Cohort</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-[#F4F4F0]">
            Reserve your spot in<br /><span className="font-editorial italic font-medium text-[#FF5E2B]">the first cohort.</span>
          </h2>
          <p className="mt-5 text-base text-[#A1A1AA] max-w-md mx-auto">Doors open in small batches. Your rank is locked the moment you join.</p>
        </Reveal>

        <AnimatePresence mode="wait">
          {pass ? (
            <motion.div
              key="pass"
              data-testid="waitlist-success-card"
              initial={{ opacity: 0, y: 24, rotateX: -12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-[#FF5E2B]/40 bg-gradient-to-br from-[#16161B] to-[#0F0F12] p-8 sm:p-10 shadow-[0_0_60px_rgba(255,94,43,0.15)]"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-code text-[11px] uppercase tracking-[0.3em] text-[#FF5E2B]">Early Access Pass</span>
                <BadgeCheck className="h-5 w-5 text-[#D4FF00]" />
              </div>
              <p className="font-display text-6xl sm:text-7xl font-black text-[#F4F4F0]">#{pass.rank}</p>
              <p className="mt-2 font-code text-[11px] uppercase tracking-widest text-[#71717A]">Your locked waitlist rank</p>
              <div className="mt-8 border-t border-white/10 pt-6 flex flex-wrap items-center gap-3">
                <span className="font-display font-bold text-lg text-[#F4F4F0]">{pass.name || "Swapper"}</span>
                {pass.teach && pass.learn && (
                  <span className="flex items-center gap-2 font-code text-[11px] uppercase tracking-wider text-[#A1A1AA]">
                    <span className="rounded-full bg-[#FF5E2B]/10 text-[#FF5E2B] px-2.5 py-1">{pass.teach}</span>
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    <span className="rounded-full bg-white/5 px-2.5 py-1">{pass.learn}</span>
                  </span>
                )}
              </div>
              <p className="mt-6 text-sm text-[#A1A1AA]">We'll email you the moment your batch opens.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-2xl border border-white/10 bg-[#0F0F12]/80 backdrop-blur-md p-6 sm:p-8 lg:p-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input data-testid="waitlist-form-name-input" required value={form.name} onChange={set("name")} placeholder="Full name" className={inputCls} />
                <input data-testid="waitlist-form-email-input" required type="email" value={form.email} onChange={set("email")} placeholder="Email address" className={inputCls} />
                <input data-testid="waitlist-form-teach-input" required value={form.teach} onChange={set("teach")} placeholder="Skill you'll teach (e.g. React)" className={inputCls} />
                <input data-testid="waitlist-form-learn-input" required value={form.learn} onChange={set("learn")} placeholder="Skill you want (e.g. Spanish)" className={inputCls} />
              </div>
              <button
                data-testid="waitlist-form-submit-button"
                type="submit"
                disabled={busy}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5E2B] py-4 text-sm font-semibold text-[#08080A] transition-all duration-300 hover:bg-[#FF784A] hover:shadow-[0_0_36px_rgba(255,94,43,0.45)] disabled:opacity-60"
              >
                {busy ? "Claiming…" : "Claim Early Access Pass"}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <p className="mt-4 text-center font-code text-[11px] uppercase tracking-widest text-[#71717A]">Free forever · No card · Pure barter</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
