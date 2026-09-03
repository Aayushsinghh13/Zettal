import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import UserAvatar from '../components/UserAvatar';
import SkillBadge from '../components/SkillBadge';
import { getListingById } from '../api/skills';
import { sendMatchRequest, getMyMatches } from '../api/matches';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/formatDate';

export default function ListingDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [listing, setListing]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [skillOffered, setSkillOffered] = useState('');
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await getListingById(id);
        setListing(res.data);
      } catch {
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  useEffect(() => {
    if (user && listing) {
      getMyMatches().then((res) => {
        const already = res.data.some((m) => {
          const senderId = m.sender?._id?.toString() || m.sender?.toString();
          return m.listing?._id === id && senderId === user.id;
        });
        if (already) setSent(true);
      }).catch(() => {});
    }
  }, [user, listing]);

  const handleSendRequest = async () => {
    if (!user) return navigate('/login');
    if (!skillOffered.trim()) return setError('Please enter the skill you are offering.');
    setSending(true);
    setError('');
    try {
      await sendMatchRequest({
        receiverId:   listing.postedBy._id,
        skillOffered: skillOffered.trim(),
        skillWanted:  listing.skillName,
        listingId:    listing._id,
      });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <><Navbar /><div className="py-32 flex justify-center"><LoadingSpinner /></div></>;
  if (!listing) return null;

  const isOwnListing = user && listing.postedBy._id === user.id;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/browse" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Browse
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left — main content ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/60 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 uppercase tracking-wide mb-4">
                    {listing.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">{listing.title}</h1>
                </div>
              </div>

              {/* Poster Profile Snippet */}
              <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
                <UserAvatar name={listing.postedBy.name} avatar={listing.postedBy.avatar} size="lg" />
                <div>
                  <p className="font-extrabold text-slate-900 text-lg leading-tight mb-1">{listing.postedBy.name}</p>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    {listing.postedBy.location && (
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <MapPin size={14} className="text-slate-400" /> {listing.postedBy.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-amber-500">
                      <Star size={14} fill="currentColor" /> {listing.postedBy.rating?.toFixed(1) || 'NEW'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">About this skill</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>
              
              <div className="mt-8 mb-4">
                <span className="text-sm font-bold text-slate-700 uppercase tracking-wider block mb-3">Target Skill</span>
                <span className="inline-flex items-center px-4 py-2 rounded-xl text-base font-bold bg-primary-50 text-primary-700 border border-primary-100 shadow-sm">
                  {listing.skillName}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-400 mt-10 uppercase tracking-wider">Posted {timeAgo(listing.createdAt)}</p>
            </motion.div>
          </div>

          {/* ── Right — action card (sticky) ────────────────── */}
          <div className="lg:sticky lg:top-28 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              {isOwnListing ? (
                <div className="text-center py-6">
                  <p className="text-slate-600 font-medium mb-5">This is your own listing.</p>
                  <Link to="/profile" className="btn-ghost w-full py-3 justify-center">
                    Manage in Profile
                  </Link>
                </div>
              ) : sent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <p className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Request Sent!</p>
                  <p className="text-sm text-slate-500 font-medium mb-6">Waiting for {listing.postedBy.name} to respond.</p>
                  <Link to="/matches" className="btn-primary w-full justify-center py-3.5 shadow-md">
                    View My Matches
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Interested in swapping?</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6">Tell {listing.postedBy.name} what skill you can offer in exchange.</p>

                  {error && (
                    <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your skill to offer
                  </label>
                  <input
                    type="text"
                    value={skillOffered}
                    onChange={(e) => setSkillOffered(e.target.value)}
                    placeholder={`e.g. "I'll teach Python"`}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 mb-6"
                  />

                  <button
                    onClick={handleSendRequest}
                    disabled={sending || !user}
                    className="btn-primary w-full justify-center py-3.5 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending request…
                      </span>
                    ) : (
                      <><Send size={16} /> Send Swap Request</>
                    )}
                  </button>

                  {!user && (
                    <p className="text-sm font-medium text-slate-500 text-center mt-4">
                      <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold transition-colors">Log in</Link> to send a request.
                    </p>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
