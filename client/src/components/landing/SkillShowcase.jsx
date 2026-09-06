import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { scrollToId } from "../../lib/scroll";

const TABS = [
  { id: "all", label: "All Swaps" },
  { id: "tech-lang", label: "Tech ↔ Languages" },
  { id: "creative-biz", label: "Creative ↔ Business" },
  { id: "music-ai", label: "Music ↔ AI" },
];

const SWAPPERS = [
  { id: 1, name: "Maya K.", cat: "tech-lang", teaches: "React", learns: "Spanish", rating: 4.9, sessions: 23, img: "https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBjb2RpbmclMjBsZWFybmluZyUyMHRvZ2V0aGVyJTIwZGFyayUyMGFlc3RoZXRpYyUyMHBvcnRyYWl0fGVufDB8fHx8MTc4ODQ1NDgxNHww&ixlib=rb-4.1.0&q=85" },
  { id: 2, name: "Leo T.", cat: "music-ai", teaches: "Guitar", learns: "AI Prompting", rating: 5.0, sessions: 17, img: "https://images.unsplash.com/photo-1659443805491-bba9994e64c3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHw0fHxhcnRpc3QlMjBwb3J0cmFpdCUyMGRhcmslMjBzdHVkaW8lMjBndWl0YXIlMjBwYWludGluZ3xlbnwwfHx8fDE3ODg0NTQ4MjN8MA&ixlib=rb-4.1.0&q=85" },
  { id: 3, name: "Aiko S.", cat: "tech-lang", teaches: "Japanese", learns: "Figma", rating: 4.8, sessions: 31, img: "https://images.unsplash.com/photo-1599060052009-24d6d0b0161c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHwzfHxqYXBhbmVzZSUyMGxhbmd1YWdlJTIwbmVvbiUyMGNpdHklMjBkYXJrJTIwYWVzdGhldGljfGVufDB8fHx8MTc4ODQ1NDgyM3ww&ixlib=rb-4.1.0&q=85" },
  { id: 4, name: "Dev P.", cat: "creative-biz", teaches: "Brand Design", learns: "Copywriting", rating: 4.9, sessions: 12, img: "https://images.unsplash.com/photo-1767163934854-655747a35068?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHw0fHxwZW9wbGUlMjBjb2RpbmclMjBsZWFybmluZyUyMHRvZ2V0aGVyJTIwZGFyayUyMGFlc3RoZXRpYyUyMHBvcnRyYWl0fGVufDB8fHx8MTc4ODQ1NDgxNHww&ixlib=rb-4.1.0&q=85" },
];

const SKILLS = ["React", "Spanish", "Figma", "Guitar", "Japanese", "AI Prompting", "Piano", "Python", "Copywriting", "Film Editing"];

export const SkillShowcase = () => {
  const [tab, setTab] = useState("all");
  const [teach, setTeach] = useState("React");
  const [learn, setLearn] = useState("Spanish");
  const [result, setResult] = useState(null);

  const visible = SWAPPERS.filter((s) => tab === "all" || s.cat === tab);

  const runMatch = () => {
    const mutual = SWAPPERS.filter((s) => s.teaches === learn && s.learns === teach);
    const teachers = SWAPPERS.filter((s) => s.teaches === learn && s.learns !== teach);
    setResult({ mutual, teachers });
  };

  const propose = (name) => {
    toast.info(`Reserve your spot to propose a swap with ${name}`);
    scrollToId("waitlist");
  };

  return (
    <section id="exchange" className="py-24 sm:py-32 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <p className="font-code text-xs uppercase tracking-[0.3em] text-[#FF5E2B] mb-4">The Exchange Floor</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-[#F4F4F0]">
              Live pairs, <span className="font-editorial italic font-medium text-[#A1A1AA]">trading now.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                data-testid={`showcase-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`rounded-full border px-4 py-2 font-code text-[11px] uppercase tracking-widest transition-all duration-300 ${tab === t.id ? "border-[#FF5E2B]/60 bg-[#FF5E2B]/10 text-[#FF5E2B]" : "border-white/10 text-[#A1A1AA] hover:border-white/25 hover:text-[#F4F4F0]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {visible.map((s, i) => (
              <motion.article
                key={s.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                data-testid={`swap-card-${s.id}`}
                className="group rounded-2xl border border-white/10 bg-[#0F0F12]/80 overflow-hidden hover:border-[#FF5E2B]/40 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={s.img} alt={`${s.name} skill swap`} loading="lazy" className="h-full w-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur px-2.5 py-1">
                    <Star className="h-3 w-3 fill-[#D4FF00] text-[#D4FF00]" />
                    <span className="font-code text-[11px] text-[#F4F4F0]">{s.rating} · {s.sessions} swaps</span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-display font-bold text-[#F4F4F0]">{s.name}</p>
                  <div className="mt-3 flex items-center gap-2 font-code text-[11px] uppercase tracking-wider">
                    <span className="rounded-full bg-[#FF5E2B]/10 text-[#FF5E2B] px-2.5 py-1">{s.teaches}</span>
                    <ArrowLeftRight className="h-3.5 w-3.5 text-[#71717A]" />
                    <span className="rounded-full bg-white/5 text-[#A1A1AA] px-2.5 py-1">{s.learns}</span>
                  </div>
                  <button
                    data-testid={`swap-card-propose-btn-${s.id}`}
                    onClick={() => propose(s.name)}
                    className="mt-5 w-full rounded-full border border-white/15 py-2.5 text-sm font-semibold text-[#F4F4F0] transition-all duration-300 hover:bg-[#FF5E2B] hover:border-[#FF5E2B] hover:text-[#08080A]"
                  >
                    Propose Swap
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <Reveal delay={0.1} className="mt-16">
          <div className="rounded-2xl border border-white/10 bg-[#0F0F12]/80 backdrop-blur-md p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-4 w-4 text-[#FF5E2B]" />
              <p className="font-code text-xs uppercase tracking-[0.3em] text-[#FF5E2B]">Match Simulator</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <label className="block">
                <span className="font-code text-[11px] uppercase tracking-widest text-[#71717A]">I can teach…</span>
                <select
                  data-testid="simulator-teach-select"
                  value={teach}
                  onChange={(e) => setTeach(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#16161B] px-4 py-3.5 text-sm text-[#F4F4F0] outline-none focus:border-[#FF5E2B]/50 transition-colors duration-300"
                >
                  {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="font-code text-[11px] uppercase tracking-widest text-[#71717A]">I want to learn…</span>
                <select
                  data-testid="simulator-learn-select"
                  value={learn}
                  onChange={(e) => setLearn(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#16161B] px-4 py-3.5 text-sm text-[#F4F4F0] outline-none focus:border-[#FF5E2B]/50 transition-colors duration-300"
                >
                  {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <button
                data-testid="simulator-match-button"
                onClick={runMatch}
                className="rounded-xl bg-[#FF5E2B] px-6 py-3.5 text-sm font-semibold text-[#08080A] transition-all duration-300 hover:bg-[#FF784A] hover:shadow-[0_0_24px_rgba(255,94,43,0.4)] hover:scale-[1.02]"
              >
                Find My Matches
              </button>
            </div>
            <AnimatePresence>
              {result && (
                <motion.div
                  data-testid="simulator-result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 rounded-xl border border-[#FF5E2B]/25 bg-[#FF5E2B]/5 p-5"
                >
                  {result.mutual.length > 0 ? (
                    <p className="text-sm text-[#F4F4F0]">
                      <span className="font-code text-[#D4FF00]">{result.mutual.length} perfect mutual {result.mutual.length === 1 ? "match" : "matches"}</span>
                      {" "}— {result.mutual.map((m) => m.name).join(", ")} {result.mutual.length === 1 ? "teaches" : "teach"} {learn} and {result.mutual.length === 1 ? "wants" : "want"} your {teach}.
                      {result.teachers.length > 0 && ` Plus ${result.teachers.length} more can teach you ${learn}.`}
                    </p>
                  ) : result.teachers.length > 0 ? (
                    <p className="text-sm text-[#F4F4F0]">
                      <span className="font-code text-[#FF5E2B]">{result.teachers.length} direct {result.teachers.length === 1 ? "match" : "matches"}</span>
                      {" "}— {result.teachers.map((m) => m.name).join(", ")} can teach you {learn}. Join the waitlist to unlock full matching.
                    </p>
                  ) : (
                    <p className="text-sm text-[#A1A1AA]">No public pair for that combo yet — the waitlist pool is much bigger. Reserve your spot and be the first match.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
