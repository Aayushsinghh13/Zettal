import { Link } from 'react-router-dom';
import { ArrowRight, Users, Zap, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import UserAvatar from '../components/UserAvatar';
import { useRef } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const Marquee = () => (
  <div className="relative flex overflow-hidden w-full bg-white border-y border-slate-200/60 py-6">
    <div className="flex animate-marquee whitespace-nowrap">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex gap-12 px-6 items-center">
          {['React.js', 'Spanish Language', 'Guitar', 'Figma Design', 'Python', 'Digital Marketing', 'Piano', 'Data Science', 'Public Speaking', 'Photography'].map((skill, j) => (
            <span key={j} className="text-xl font-extrabold text-slate-300 tracking-tight flex items-center gap-4">
              {skill}
              <span className="w-2 h-2 rounded-full bg-primary-400"></span>
            </span>
          ))}
        </div>
      ))}
    </div>
    {/* Gradient Fades for Marquee */}
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
  </div>
);

export default function Landing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary-100 selection:text-primary-900 font-sans" ref={containerRef}>
      <Navbar />

      {/* ── STUNNING HERO SECTION ── */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-white border-b border-slate-200/60">
        
        {/* Animated Background Gradients */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-primary-400/10 blur-[120px] mix-blend-multiply animate-blob" />
          <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'%23f1f5f9\'%3e%3cpath d=\'M0 .5H31.5V32\'/%3e%3c/svg%3e')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-60" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy */}
          <motion.div 
            initial="hidden" animate="visible" variants={stagger}
            className="text-center lg:text-left pt-10"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>The #1 Free Knowledge Exchange</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] font-extrabold tracking-[-0.04em] leading-[1.05] text-slate-900 mb-6">
              Exchange skills.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Without money.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
              Stop paying for expensive courses. Connect with peers to master what you want to learn, and teach what you already know in return.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
              <Link to="/register" className="btn-primary text-base px-8 py-4 h-14 rounded-2xl shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200">
                Start Swapping <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/browse" className="btn-ghost text-base px-8 py-4 h-14 rounded-2xl border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5 transition-all duration-200 bg-white">
                Browse Skills
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                {["1","2","3","4","5"].map((num, i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${num}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                ))}
              </div>
              <div className="text-sm font-semibold text-slate-600">
                Join <span className="text-slate-900 font-bold">1,200+</span> active learners
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Stunning Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 40, rotate: 2 }} 
            animate={{ opacity: 1, x: 0, rotate: 0 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[500px] w-full hidden lg:block perspective-1000"
          >
            {/* Base Dashboard Window */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-3xl border border-white/60 shadow-[0_20px_50px_rgb(0,0,0,0.1)] overflow-hidden flex flex-col transform rotate-[-2deg] translate-x-12 translate-y-6">
              {/* Fake Mac Header */}
              <div className="h-10 border-b border-slate-200/50 flex items-center px-4 gap-2 bg-slate-50/50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="p-6 bg-slate-50/30 flex-1">
                <div className="flex gap-4">
                  <div className="w-1/3 space-y-4">
                    <div className="h-24 rounded-2xl bg-white shadow-sm border border-slate-100 p-4">
                       <div className="h-4 w-1/2 bg-slate-200 rounded mb-3" />
                       <div className="h-2 w-full bg-slate-100 rounded mb-2" />
                       <div className="h-2 w-2/3 bg-slate-100 rounded" />
                    </div>
                    <div className="h-24 rounded-2xl bg-white shadow-sm border border-slate-100 p-4">
                       <div className="h-4 w-1/3 bg-slate-200 rounded mb-3" />
                       <div className="h-2 w-full bg-slate-100 rounded mb-2" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-2xl bg-white shadow-sm border border-slate-100 p-6 flex flex-col justify-end gap-3">
                    <div className="self-start px-4 py-2 rounded-2xl rounded-bl-sm bg-slate-100 text-slate-400 text-xs w-2/3 h-10" />
                    <div className="self-end px-4 py-2 rounded-2xl rounded-br-sm bg-primary-600 text-white text-xs w-1/2 h-10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Skill Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 -left-10 bg-white p-5 rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.12)] border border-slate-200/60 w-64 z-20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Match Accepted!</p>
                  <p className="text-xs text-slate-500">Alex wants to learn UI</p>
                </div>
              </div>
              <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-sm">
                Open Chat
              </button>
            </motion.div>

            {/* Floating Notification */}
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-16 right-[-20px] bg-white p-4 rounded-2xl shadow-[0_20px_40px_rgb(0,0,0,0.12)] border border-slate-200/60 flex items-center gap-3 z-30"
            >
              <img src="https://i.pravatar.cc/100?img=9" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-bold text-slate-900">Sarah sent a request</p>
                <p className="text-xs text-slate-500">She offers "React.js"</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SCROLLING MARQUEE ── */}
      <Marquee />

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'%23e2e8f0\'%3e%3cpath d=\'M0 .5H31.5V32\'/%3e%3c/svg%3e')] opacity-40 mix-blend-multiply" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">How it works</h2>
            <p className="text-lg text-slate-600 font-medium">Start learning something new today in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto relative">
            {[
              { num: '1', title: 'Create your profile', desc: 'List what you want to learn and what skills you can offer in return.', icon: Sparkles },
              { num: '2', title: 'Find a match', desc: 'Browse listings or let our algorithm match you with the perfect partner.', icon: Users },
              { num: '3', title: 'Start swapping', desc: 'Connect via chat and arrange your first knowledge exchange session.', icon: Zap }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <step.icon size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 tracking-tight">{step.num}. {step.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE SKILLS ── */}
      <section className="py-24 lg:py-32 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Trending skills</h2>
              <p className="text-lg text-slate-600 font-medium">Discover what the community is offering right now.</p>
            </div>
            <Link to="/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition-colors group">
              View all listings <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { tag: 'Programming', color: 'blue', level: 'Advanced', title: 'React & Next.js Architecture', desc: 'I can teach you how to structure large scale enterprise React applications and performance optimization.', name: 'Alex Chen', wants: 'UI Design' },
              { tag: 'Languages', color: 'purple', level: 'Native', title: 'Conversational Spanish', desc: 'Native speaker from Madrid. I can help you practice speaking and perfect your pronunciation.', name: 'Maria Garcia', wants: 'Python' },
              { tag: 'Music', color: 'emerald', level: 'Intermediate', title: 'Acoustic Guitar Basics', desc: 'Learn chords, strumming patterns, and your first 5 songs within a month.', name: 'James Wilson', wants: 'Marketing' }
            ].map((card, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:border-slate-300 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${card.color}-400/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform`} />
                <div className="flex justify-between items-start mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-${card.color}-50 text-${card.color}-700 border border-${card.color}-100 tracking-wide uppercase`}>
                    {card.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wide bg-slate-50 px-2 py-1 rounded-md">{card.level}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight group-hover:text-primary-600 transition-colors">{card.title}</h3>
                <p className="text-slate-600 text-sm mb-8 flex-1 leading-relaxed font-medium">{card.desc}</p>
                
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <UserAvatar name={card.name} size="sm" />
                  <div className="text-sm">
                    <p className="font-extrabold text-slate-900">{card.name}</p>
                    <p className="text-slate-500 font-medium text-xs mt-0.5">Wants: <span className="text-slate-700 font-bold">{card.wants}</span></p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="relative py-24 lg:py-32 bg-slate-900 overflow-hidden text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary-600/30 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Ready to start learning?</h2>
          <p className="text-xl text-slate-300 mb-10 font-medium">Join thousands of people who are already exchanging knowledge for free.</p>
          <Link to="/register" className="btn-primary bg-white text-slate-900 hover:bg-slate-50 text-lg px-10 py-5 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300">
            Create Free Account
          </Link>
          <p className="text-sm text-slate-400 mt-8 font-medium">Takes less than 2 minutes to set up your profile.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800 text-slate-400 text-sm font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-extrabold text-white text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-white" />
            </div>
            SkillSwap
          </div>
          <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/browse" className="hover:text-white transition-colors">Browse</Link>
            <Link to="/login" className="hover:text-white transition-colors">Log in</Link>
            <Link to="/register" className="hover:text-white transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
