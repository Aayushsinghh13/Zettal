import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import UserAvatar from '../components/UserAvatar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMyMatches } from '../api/matches';
import { getMessages } from '../api/messages';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { timeAgo } from '../utils/formatDate';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socketRef = useSocket();

  const [acceptedMatches, setAcceptedMatches] = useState([]);
  const [activeMatchId, setActiveMatchId]     = useState(null);
  const [messages, setMessages]               = useState([]);
  const [text, setText]                       = useState('');
  const [loadingMatches, setLoadingMatches]   = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getMyMatches()
      .then((res) => {
        const accepted = res.data.filter((m) => m.status === 'accepted');
        setAcceptedMatches(accepted);
        if (!activeMatchId && accepted.length > 0) {
          setActiveMatchId(accepted[0]._id);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingMatches(false));
  }, []);

  useEffect(() => {
    if (!activeMatchId) return;
    setLoadingMessages(true);
    getMessages(activeMatchId)
      .then((res) => setMessages(res.data))
      .catch(console.error)
      .finally(() => setLoadingMessages(false));
  }, [activeMatchId]);

  useEffect(() => {
    if (!activeMatchId || !socketRef.current) return;
    const socket = socketRef.current;
    socket.emit('join-room', activeMatchId);
    const handleReceive = (message) => setMessages((prev) => [...prev, message]);
    socket.on('receive-message', handleReceive);
    return () => socket.off('receive-message', handleReceive);
  }, [activeMatchId, socketRef]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current || !activeMatchId) return;
    socketRef.current.emit('send-message', {
      matchId:  activeMatchId,
      senderId: user.id,
      text:     trimmed,
    });
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const activeMatch = acceptedMatches.find((m) => m._id === activeMatchId);
  const otherUser = activeMatch
    ? activeMatch.sender?._id === user?.id ? activeMatch.receiver : activeMatch.sender
    : null;

  if (loadingMatches) return <><Navbar /><div className="py-32 flex justify-center"><LoadingSpinner /></div></>;

  if (acceptedMatches.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
          <p className="text-5xl mb-6">💬</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">No conversations yet</h2>
          <p className="text-lg text-slate-500 font-medium mb-8">Accept a match request to start chatting.</p>
          <button onClick={() => navigate('/matches')} className="btn-primary py-3.5 px-8 shadow-sm hover:-translate-y-0.5">Go to Matches</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex gap-6 min-h-0">

        {/* ── Left — conversation list ─────────────────────── */}
        <div className="w-80 flex-shrink-0 bg-white rounded-3xl overflow-hidden flex flex-col border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {acceptedMatches.map((match) => {
              const other = match.sender?._id === user?.id ? match.receiver : match.sender;
              const isActive = match._id === activeMatchId;
              return (
                <button
                  key={match._id}
                  onClick={() => setActiveMatchId(match._id)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-all rounded-2xl ${
                    isActive ? 'bg-primary-50 ring-1 ring-primary-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <UserAvatar name={other?.name} avatar={other?.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isActive ? 'text-primary-700' : 'text-slate-900'}`}>
                      {other?.name}
                    </p>
                    <p className={`text-xs font-medium truncate ${isActive ? 'text-primary-600/80' : 'text-slate-500'}`}>
                      {match.skillOffered} ↔ {match.skillWanted}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right — chat window ──────────────────────────── */}
        <div className="flex-1 bg-white rounded-3xl overflow-hidden flex flex-col min-h-[500px] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          {/* Chat header */}
          <div className="flex items-center gap-4 p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm z-10">
            <button onClick={() => navigate('/matches')} className="text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 p-2 rounded-xl">
              <ArrowLeft size={18} />
            </button>
            {otherUser && <UserAvatar name={otherUser.name} avatar={otherUser.avatar} size="md" online />}
            <div>
              <p className="font-extrabold text-slate-900 text-base leading-tight mb-0.5">{otherUser?.name}</p>
              <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {loadingMessages ? (
              <div className="py-20 flex justify-center"><LoadingSpinner message="Loading messages…" /></div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-5xl mb-4">👋</p>
                <p className="text-slate-500 font-medium">Say hi and start your skill swap!</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMine = msg.sender?._id === user?.id || msg.sender === user?.id;
                const isNextMine = messages[i+1]?.sender === msg.sender;
                
                return (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end gap-3 ${isMine ? 'justify-end' : 'justify-start'} ${isNextMine ? 'mb-1' : 'mb-4'}`}
                  >
                    {!isMine && <div className="flex-shrink-0 w-8">{!isNextMine && <UserAvatar name={msg.sender?.name} avatar={msg.sender?.avatar} size="sm" />}</div>}
                    <div className={`max-w-xs lg:max-w-md px-5 py-3 text-sm leading-relaxed shadow-sm ${
                      isMine
                        ? 'bg-primary-600 text-white rounded-2xl rounded-br-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm'
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1.5 font-semibold text-right uppercase tracking-wider ${isMine ? 'text-primary-200' : 'text-slate-400'}`}>
                        {timeAgo(msg.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="p-5 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-500 transition-all">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send)"
                className="flex-1 bg-transparent outline-none text-slate-900 font-medium placeholder-slate-400"
              />
              <button
                onClick={sendMessage}
                disabled={!text.trim()}
                className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center disabled:opacity-50 transition-opacity flex-shrink-0 shadow-sm hover:bg-primary-700"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
