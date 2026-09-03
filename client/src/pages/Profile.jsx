import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Save, Plus, Loader, MapPin, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import UserAvatar from '../components/UserAvatar';
import SkillBadge from '../components/SkillBadge';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../api/users';
import { createListing, deleteListing, getAllListings } from '../api/skills';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', bio: '', location: '' });
  const [skills, setSkills] = useState([]);           // [{name, level}]
  const [skillInput, setSkillInput] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [listings, setListings] = useState([]);
  const [newListing, setNewListing] = useState({ title: '', description: '', category: '', skillName: '', proficiencyWanted: 'Beginner' });
  const [showListingForm, setShowListingForm] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', bio: user.bio || '', location: user.location || '' });
      setSkills(user.skillsOffered || []);
      getAllListings({ postedBy: user.id }).then((res) => {
        const all = Array.isArray(res.data) ? res.data : res.data.data || [];
        setListings(all.filter((l) => l.postedBy?._id === user.id || l.postedBy === user.id));
      }).catch(() => {});
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateMe({
        id: user.id,                    // used to build the PUT URL
        name: form.name,
        bio: form.bio,
        location: form.location,
        skillsOffered: skills,
      });
      setUser({ ...user, ...res.data, id: user.id }); // keep id as string
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const t = skillInput.trim();
    if (t && !skills.find((s) => s.name === t)) {
      setSkills((p) => [...p, { name: t, level: skillLevel }]);
    }
    setSkillInput('');
  };

  const [listingError, setListingError] = useState(null);

  const handlePostListing = async () => {
    setListingError(null);
    if (!newListing.title || !newListing.description || !newListing.category || !newListing.skillName) {
      setListingError('Please fill out all fields.');
      return;
    }
    
    try {
      const res = await createListing(newListing);
      setListings((p) => [res.data, ...p]);
      setNewListing({ title: '', description: '', category: '', skillName: '', proficiencyWanted: 'Beginner' });
      setShowListingForm(false);
    } catch (err) {
      console.error(err);
      setListingError(err.response?.data?.error || err.response?.data?.message || 'Failed to post listing.');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteListing(id);
      setListings((p) => p.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) { navigate('/login'); return null; }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* ── Profile card ──────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-6 mb-10">
            <div className="relative">
              <UserAvatar name={user.name} avatar={user.avatar} size="lg" />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
              <p className="text-slate-500 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. London, UK" className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3} maxLength={300} placeholder="Tell others about yourself…" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all resize-none" />
            </div>

            {/* Skills */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Skills I Offer</label>
              <div className="flex gap-3 mb-4">
                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Type a skill…" className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
                <div className="relative">
                  <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}
                    className="appearance-none px-4 py-3 pr-8 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer">
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <button onClick={addSkill} className="px-5 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors shadow-sm font-semibold flex items-center gap-2">
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => <SkillBadge key={s.name} label={s.name} level={s.level} removable onRemove={() => setSkills(skills.filter((x) => x.name !== s.name))} />)}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button onClick={handleSave} disabled={saving}
                className="btn-primary py-3.5 px-8 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-base flex items-center gap-2">
                {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── My Listings ───────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">My Listings</h2>
              <p className="text-slate-500 font-medium text-sm">Manage the skills you want to learn.</p>
            </div>
            <button onClick={() => setShowListingForm(!showListingForm)} className="btn-primary text-sm py-2.5 px-5 shadow-sm hover:-translate-y-0.5">
              <Plus size={16} className="mr-1" /> Post New Skill
            </button>
          </div>

          {showListingForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8 p-6 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 space-y-4">
              <h3 className="font-bold text-slate-900 mb-2">Create a listing</h3>
              <input type="text" placeholder="Catchy Title (e.g. Want to learn Advanced React)" value={newListing.title}
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
              <textarea placeholder="Describe what you want to learn (max 500 chars)" rows={3} value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all resize-none" />
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Category (e.g. Programming)" value={newListing.category}
                onChange={(e) => setNewListing({ ...newListing, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
              <input type="text" placeholder="Specific Skill (e.g. React.js)" value={newListing.skillName}
                onChange={(e) => setNewListing({ ...newListing, skillName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" />
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Proficiency Needed</label>
                <select value={newListing.proficiencyWanted} onChange={(e) => setNewListing({ ...newListing, proficiencyWanted: e.target.value })}
                  className="w-full appearance-none px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all">
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 bottom-3.5 text-slate-400 pointer-events-none" />
              </div>
              </div>
              {listingError && <p className="text-sm text-red-600 font-medium">{listingError}</p>}
              <div className="flex gap-3 pt-2">
                <button onClick={handlePostListing} className="btn-primary text-sm py-2.5 px-6 shadow-sm hover:-translate-y-0.5">Post Listing</button>
                <button onClick={() => setShowListingForm(false)} className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">Cancel</button>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {listings.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">You don't have any listings yet.</p>
                <p className="text-slate-400 text-sm mt-1">Post a skill you want to learn to get started.</p>
              </div>
            ) : (
              listings.map((l) => (
                <div key={l._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-colors gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{l.category}</span>
                    <p className="font-extrabold text-slate-900 text-lg leading-tight mb-2">{l.title}</p>
                    <SkillBadge label={l.skillName} />
                  </div>
                  <button onClick={() => handleDeleteListing(l._id)}
                    className="self-start sm:self-center px-4 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
