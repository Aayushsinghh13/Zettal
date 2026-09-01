import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import UserAvatar from '../components/UserAvatar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMyMatches } from '../api/matches';
import { getMessages } from '../api/messages';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { timeAgo } from '../utils/formatDate';

// Format HH:MM for messages
const msgTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socketRef = useSocket();

  const [acceptedMatches, setAcceptedMatches] = useState([]);
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUser, setTypingUser]           = useState(null);
  const [isTyping, setIsTyping]               = useState(false);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

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

  // Socket: join room, receive messages & typing events
  useEffect(() => {
    if (!activeMatchId || !socketRef.current) return;
    const socket = socketRef.current;
    socket.emit('join-room', activeMatchId);

    const handleReceive = (message) => setMessages((prev) => [...prev, message]);

    const handleTyping = ({ name, userId }) => {
      if (userId !== user?.id) {
        setTypingUser(name);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2500);
      }
    };

    socket.on('receive-message', handleReceive);
    socket.on('user-typing', handleTyping);
    return () => {
      socket.off('receive-message', handleReceive);
      socket.off('user-typing', handleTyping);
    };
  }, [activeMatchId, socketRef.current]);


  // (Incoming call is handled globally by GlobalCallListener)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const handleInput = (e) => {
    setText(e.target.value);
    // Emit typing event
    if (socketRef.current && activeMatchId) {
      socketRef.current.emit('typing', {
        matchId: activeMatchId,
        userId: user.id,
        name: user.name,
      });
    }
  };

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current || !activeMatchId) return;
    socketRef.current.emit('send-message', {
      matchId: activeMatchId,
      senderId: user.id,
      text: trimmed,
    });
    setText('');
    setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Global socket listener for incoming calls is now handled by GlobalCallListener.jsx

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
          <button onClick={() => navigate('/matches')} className="btn-primary py-3.5 px-8 shadow-sm hover:-translate-y-0.5">
            Go to Matches
          </button>
        </div>
      </div>
    );
  }

  // Group messages by date for timestamp dividers
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 flex gap-6 min-h-0">

        {/* ── Left: conversation list ─────────────────────────── */}
        <div className="w-80 flex-shrink-0 bg-white rounded-3xl overflow-hidden flex flex-col border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Messages</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">{acceptedMatches.length} active swap{acceptedMatches.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {acceptedMatches.map((match) => {
              const other = match.sender?._id === user?.id ? match.receiver : match.sender;
              const isActive = match._id === activeMatchId;
              return (
                <button
                  key={match._id}
                  onClick={() => setActiveMatchId(match._id)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-all rounded-2xl ${isActive ? 'bg-primary-50 ring-1 ring-primary-100' : 'hover:bg-slate-50'
                    }`}
                >
                  <UserAvatar name={other?.name} avatar={other?.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isActive ? 'text-primary-700' : 'text-slate-900'}`}>
                      {other?.name}
                    </p>
                    <p className={`text-xs font-medium truncate ${isActive ? 'text-primary-500/80' : 'text-slate-500'}`}>
                      {match.skillOffered} ↔ {match.skillWanted}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: chat window ───────────────────────────────── */}
        <div className="flex-1 bg-white rounded-3xl overflow-hidden flex flex-col min-h-[500px] border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          {/* Chat header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/matches')} className="text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 p-2 rounded-xl">
                <ArrowLeft size={18} />
              </button>
              {otherUser && <UserAvatar name={otherUser.name} avatar={otherUser.avatar} size="md" />}
              <div>
                <p className="font-extrabold text-slate-900 text-base leading-tight">{otherUser?.name}</p>
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-wide mt-0.5">
                  {typingUser ? `${typingUser} is typing…` : 'Active now'}
                </p>
              </div>
            </div>
            
            {/* Video Call Button */}
            <button
              onClick={() => navigate(`/call/${activeMatchId}`, { state: { isInitiator: true, calleeId: otherUser?._id } })}
              className="w-10 h-10 flex items-center justify-center bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 transition-colors shadow-sm"
              title="Start Video Call"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
            {loadingMessages ? (
              <div className="py-20 flex justify-center"><LoadingSpinner message="Loading messages…" /></div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-5xl mb-4">👋</p>
                <p className="text-slate-700 font-bold text-lg">Say hi!</p>
                <p className="text-slate-400 font-medium text-sm">Start your skill swap conversation.</p>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  {/* Date divider */}
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{date}</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div className="space-y-3">
                    {msgs.map((msg, i) => {
                      const isMine = msg.sender?._id === user?.id || msg.sender === user?.id;
                      const nextMsg = msgs[i + 1];
                      const isLastInGroup = !nextMsg || (nextMsg.sender?._id !== msg.sender?._id && nextMsg.sender !== msg.sender);

                      return (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, scale: 0.95, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.15 }}
                          className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMine && (
                            <div className="w-8 flex-shrink-0">
                              {isLastInGroup && <UserAvatar name={msg.sender?.name} avatar={msg.sender?.avatar} size="sm" />}
                            </div>
                          )}
                          <div className={`group max-w-xs lg:max-w-md`}>
                            <div className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${isMine
                                ? 'bg-primary-600 text-white rounded-2xl rounded-br-sm'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm'
                              }`}>
                              {msg.text}
                            </div>
                            {isLastInGroup && (
                              <p className={`text-[10px] mt-1 font-semibold uppercase tracking-wide ${isMine ? 'text-right text-slate-400' : 'text-slate-400'}`}>
                                {msgTime(msg.createdAt)}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            <AnimatePresence>
              {typingUser && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-8 flex-shrink-0" />
                  <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="p-5 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-500 transition-all">
              <input
                type="text"
                value={text}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Type a message… (Enter to send)"
                className="flex-1 bg-transparent outline-none text-slate-900 font-medium placeholder-slate-400"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                disabled={!text.trim()}
                className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center disabled:opacity-40 transition-all hover:bg-primary-700 flex-shrink-0 shadow-sm"
              >
                <Send size={16} />
              </motion.button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-2 font-medium">Messages are end-to-end encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
