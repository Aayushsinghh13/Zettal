import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export default function GlobalCallListener() {
  const socketRef = useSocket();
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState(false);
  const [callData, setCallData] = useState(null);

  // Attach incoming-call listener once socket is ready.
  // Because socketRef is a ref (not state), we poll for it
  // via a small interval so we never miss the event even if
  // the socket connects after the first render.
  useEffect(() => {
    let cleanup = null;

    const attach = () => {
      const socket = socketRef?.current;
      if (!socket) return false;

      const handleIncomingCall = (data) => {
        console.log('[GlobalCallListener] incoming-call', data);
        setCallData(data);
        setIncomingCall(true);
      };

      socket.on('incoming-call', handleIncomingCall);
      cleanup = () => socket.off('incoming-call', handleIncomingCall);
      return true;
    };

    if (!attach()) {
      // Socket not ready yet — retry every 300 ms
      const timer = setInterval(() => {
        if (attach()) clearInterval(timer);
      }, 300);
      return () => { clearInterval(timer); if (cleanup) cleanup(); };
    }

    return () => { if (cleanup) cleanup(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answerCall = () => {
    setIncomingCall(false);
    navigate(`/call/${callData.matchId}`, {
      state: {
        isInitiator: false,
        incomingSignal: callData.signal,
        from: callData.from,
        callerName: callData.name,
      },
    });
  };

  const declineCall = () => {
    setIncomingCall(false);
    socketRef?.current?.emit('decline-call', { to: callData.from });
  };

  return (
    <AnimatePresence>
      {incomingCall && callData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm text-center border border-slate-100"
          >
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-100 animate-pulse">
              <Video size={36} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Incoming Video Call</h3>
            <p className="text-slate-500 font-medium mb-8">
              <span className="text-slate-900 font-bold">{callData.name}</span> is calling you…
            </p>
            <div className="flex gap-3">
              <button
                onClick={declineCall}
                className="flex-1 py-3 px-4 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <PhoneOff size={18} /> Decline
              </button>
              <button
                onClick={answerCall}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Phone size={18} /> Answer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
