import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data.token, res.data.user);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
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
            Welcome back to the knowledge exchange.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Log in to manage your matches, reply to swap requests, and continue learning new skills.
          </p>
        </div>
      </div>

      {/* ── RIGHT — form ───────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 bg-white" />
        
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center justify-center gap-2 mb-10 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">SkillSwap</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Log in</h1>
            <p className="text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Sign up</Link>
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required 
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Forgot?</a>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" required 
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500" 
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base rounded-xl mt-4 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in…
                </span>
              ) : 'Log in'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
