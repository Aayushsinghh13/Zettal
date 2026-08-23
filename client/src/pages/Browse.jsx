import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import SkillCard from '../components/SkillCard';
import EmptyState from '../components/EmptyState';
import { getAllListings } from '../api/skills';

const CATEGORIES = ['All', 'Programming', 'Design', 'Music', 'Language', 'Cooking', 'Sports', 'Other'];
const LEVELS = ['Any Level', 'Beginner', 'Intermediate', 'Advanced'];

// Skeleton loader card
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-5">
      <div className="h-5 w-24 bg-slate-100 rounded-lg" />
      <div className="h-5 w-20 bg-slate-100 rounded-lg" />
    </div>
    <div className="h-6 w-3/4 bg-slate-200 rounded-lg mb-3" />
    <div className="h-4 w-full bg-slate-100 rounded-lg mb-2" />
    <div className="h-4 w-2/3 bg-slate-100 rounded-lg mb-8" />
    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
      <div className="w-9 h-9 rounded-full bg-slate-200" />
      <div>
        <div className="h-4 w-24 bg-slate-200 rounded mb-1.5" />
        <div className="h-3 w-16 bg-slate-100 rounded" />
      </div>
    </div>
  </div>
);

export default function Browse() {
  const [listings, setListings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [level, setLevel]           = useState('Any Level');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch listings whenever filters change
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = {};
        if (debouncedSearch) params.skill = debouncedSearch;
        if (category !== 'All') params.category = category;
        if (level !== 'Any Level') params.proficiencyWanted = level;
        const res = await getAllListings(params);
        setListings(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [debouncedSearch, category, level]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('Any Level');
  };

  const hasFilters = search || category !== 'All' || level !== 'Any Level';

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Discover Skills</h1>
          <p className="text-lg text-slate-600 font-medium">Find what you want to learn from our community of experts.</p>
        </div>

        {/* ── Search + Filter Row ──────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-2xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill name… (e.g. Guitar, Python)"
              className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white border border-slate-200/80 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-md transition-colors"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Filters toggle (mobile) */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`sm:hidden flex items-center gap-2 px-4 py-3.5 rounded-xl border font-semibold text-sm transition-all ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}
          >
            <SlidersHorizontal size={16} /> Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-primary-500" />}
          </button>
        </div>

        {/* ── Category + Level filters ─────────────────────────── */}
        <div className={`mb-10 ${showFilters ? 'block' : 'hidden sm:block'}`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                    category === cat
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            <div className="hidden sm:block w-px h-6 bg-slate-200 flex-shrink-0" />

            {/* Level pills */}
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <motion.button
                  key={l}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                    level === l
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {l}
                </motion.button>
              ))}
            </div>

            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-all shadow-sm">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Results count ─────────────────────────────────────── */}
        {!loading && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              {listings.length === 0
                ? 'No listings found'
                : `${listings.length} listing${listings.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
        )}

        {/* ── Content ──────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="py-10">
            <EmptyState
              icon={<Sparkles size={32} />}
              title="No skills found"
              message="We couldn't find any listings matching your filters. Try adjusting your search."
              action={hasFilters ? { label: 'Clear all filters', onClick: clearFilters } : undefined}
            />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {listings.map((listing, i) => (
                <SkillCard key={listing._id} listing={listing} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
