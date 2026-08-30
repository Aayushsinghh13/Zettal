import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, MapPin, Plus, Zap } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import SkillBadge from '../components/SkillBadge';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/auth';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', bio: '', location: '' });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const t = skillInput.trim();
    if (t && !skills.includes(t)) setSkills((p) => [...p, t]);
    setSkillInput('');
  };

  const handleSkillKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) return setError('Passwords do not match');

    setLoading(true);
    try {
      const res = await registerUser({ ...form, skillsOffered: skills });
      login(res.data.token, res.data.user);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* ── LEFT — branding (Desktop only) ────────────────────── */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 relative overflow-hidden bg-slate-900 border-r border-slate-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'%231e293b\'%3e%3cpath d=\'M0 .5H31.5V32\'/%3e%3c/svg%3e')] -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" />
        
        <div className="max-w-md relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-12 group w-max">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white text-2xl font-extrabold tracking-tight">SkillSwap</span>
          </Link>
          <h2 className="text-white text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-6">
            Join thousands of skill swappers.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Post what you can teach. Find what you want to learn. Connect with real people, no money involved.
          </p>
        </div>
      </div>

      {/* ── RIGHT — form ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-y-auto">
        <div className="absolute inset-0 bg-white min-h-full" />
        
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px] relative z-10 py-8"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-10 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">SkillSwap</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Create your account</h1>
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Log in</Link>
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Alice Smith" required 
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required 
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500" />
              </div>
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} name="password"
                    value={form.password} onChange={handleChange}
                    placeholder="Min. 6 chars" required minLength={6} 
                    className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-sm" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Confirm</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" name="confirm" value={form.confirm}
                    onChange={handleChange} placeholder="Repeat" required 
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Skills offered */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Skills You Can Teach <span className="text-slate-400 normal-case font-normal">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKey}
                  placeholder="e.g. Guitar, Python…"
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
                />
                <button type="button" onClick={addSkill}
                  className="px-5 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors shadow-sm font-semibold flex items-center justify-center">
                  <Plus size={18} />
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((s) => (
                    <SkillBadge key={s} label={s} removable onRemove={() => setSkills(skills.filter((x) => x !== s))} />
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Location <span className="text-slate-400 normal-case font-normal">(optional)</span>
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. London, UK" 
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base rounded-xl mt-6 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Or sign up with</p>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign Up Failed')}
              shape="rectangular"
              size="large"
              width="300"
              theme="outline"
              text="continue_with"
            />
          </div>

          <p className="mt-8 text-center text-xs font-medium text-slate-400">
            By signing up, you agree to our Terms of Service.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
