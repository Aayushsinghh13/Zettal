import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getAllListings } from '../api/skills';

const CATEGORIES = ['All', 'Programming', 'Design', 'Music', 'Language', 'Cooking', 'Sports', 'Other'];

export default function Browse() {
  const [listings, setListings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce: wait 400ms after the user stops typing before querying.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch listings whenever the filter changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = {};
        if (debouncedSearch) params.skill = debouncedSearch;
        if (category !== 'All') params.category = category;
        const res = await getAllListings(params);
        setListings(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [debouncedSearch, category]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
  };

  const hasFilters = search || category !== 'All';

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Page Header ──────────────────────────────────────── */}
        <div className="mb-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Discover Skills</h1>
          <p className="text-lg text-slate-600 font-medium">Find what you want to learn from our community of experts.</p>
        </div>

        {/* ── Search & Filters ─────────────────────────────────── */}
        <div className="mb-10 space-y-6">
          {/* Search bar */}
          <div className="relative max-w-2xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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

          {/* Category pills */}
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
                  category === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md hover:bg-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
            {hasFilters && (
              <button onClick={clearFilters}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-all flex items-center gap-1.5 shadow-sm">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Results count ────────────────────────────────────── */}
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
          <div className="py-20 flex justify-center">
            <LoadingSpinner message="Finding skills for you…" />
          </div>
        ) : listings.length === 0 ? (
          <div className="py-10">
            <EmptyState
              icon={<SlidersHorizontal size={32} />}
              title="No skills found"
              message="We couldn't find any listings matching your current filters. Try adjusting your search."
              action={hasFilters ? { label: 'Clear all filters', onClick: clearFilters } : undefined}
            />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
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
