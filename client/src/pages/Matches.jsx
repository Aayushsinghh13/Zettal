import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Check, X, Trash2, Clock, Inbox } from 'lucide-react';
import Navbar from '../components/Navbar';
import UserAvatar from '../components/UserAvatar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getMyMatches, updateMatchStatus, deleteMatch } from '../api/matches';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/formatDate';

const TABS = ['pending', 'accepted', 'rejected'];

export default function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await getMyMatches();
        setMatches(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const res = await updateMatchStatus(id, status);
      setMatches((prev) => prev.map((m) => m._id === id ? res.data : m));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMatch(id);
      setMatches((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = matches.filter((m) => m.status === tab);

  const statusBadge = {
    pending:  'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-50 text-red-600 border-red-200',
  };

  const emptyMessages = {
    pending:  { title: 'No pending requests', message: 'Browse skills and send a swap request to get started.' },
    accepted: { title: 'No accepted matches', message: 'Accept a pending request or wait for your requests to be accepted.' },
    rejected: { title: 'No rejected requests', message: "That's a good thing!" },
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My Matches</h1>
          <p className="text-lg text-slate-600 font-medium">Manage your skill swap requests</p>
        </div>

        {/* ── Tabs ────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-10 pb-5 border-b border-slate-200/60">
          {TABS.map((t) => {
            const count = matches.filter((m) => m.status === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {count > 0 && (
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-xs font-bold ${
                    tab === t ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Content ─────────────────────────────────────── */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Inbox size={32} />}
            title={emptyMessages[tab].title}
            message={emptyMessages[tab].message}
            action={tab === 'pending' ? { label: 'Browse Skills', onClick: () => window.location.href = '/browse' } : undefined}
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((match) => {
                const isSender   = match.sender?._id === user?.id;
                const otherUser  = isSender ? match.receiver : match.sender;
                const isReceiver = !isSender;

                return (
                  <motion.div
                    key={match._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <UserAvatar name={otherUser?.name} avatar={otherUser?.avatar} size="lg" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <p className="font-extrabold text-lg text-slate-900 leading-tight mb-1">{otherUser?.name}</p>
                            <p className="text-sm text-slate-500 font-medium mb-3">
                              {isSender ? 'You requested to swap with them' : 'They requested to swap with you'}
                            </p>
                          </div>
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border uppercase tracking-wide ${statusBadge[match.status]}`}>
                            {match.status}
                          </span>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-medium text-slate-700">
                            <div className="flex-1">
                              <span className="text-slate-500 text-xs block uppercase tracking-wider mb-1">They Teach</span>
                              <span className="text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 inline-block">{match.skillOffered}</span>
                            </div>
                            <div className="hidden sm:block text-slate-300">↔</div>
                            <div className="flex-1">
                              <span className="text-slate-500 text-xs block uppercase tracking-wider mb-1">They Want</span>
                              <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 inline-block">{match.skillWanted}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                          <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                            <Clock size={12} /> {timeAgo(match.createdAt)}
                          </p>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            {match.status === 'pending' && isReceiver && (
                              <>
                                <button onClick={() => handleStatus(match._id, 'rejected')}
                                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                                  Decline
                                </button>
                                <button onClick={() => handleStatus(match._id, 'accepted')}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-sm transition-colors">
                                  <Check size={16} /> Accept Swap
                                </button>
                              </>
                            )}
                            {match.status === 'pending' && isSender && (
                              <button onClick={() => handleDelete(match._id)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                                <Trash2 size={14} /> Cancel Request
                              </button>
                            )}
                            {match.status === 'accepted' && (
                              <Link to={`/messages/${match._id}`} className="btn-primary text-sm px-5 py-2.5 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)]">
                                <MessageSquare size={16} /> Open Chat
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
