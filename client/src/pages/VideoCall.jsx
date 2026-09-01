import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Peer from 'simple-peer';
import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function VideoCall() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const socketRef = useSocket();

  const isInitiator   = location.state?.isInitiator || false;
  const calleeId      = location.state?.calleeId;          // who we are calling
  const incomingSignal = location.state?.incomingSignal;   // offer from caller (answerer path)
  const callerFrom    = location.state?.from;              // caller's userId (answerer path)
  const callerName    = location.state?.callerName;

  const [stream, setStream]         = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded]   = useState(false);
  const [micOn, setMicOn]           = useState(true);
  const [videoOn, setVideoOn]       = useState(true);
  const [status, setStatus]         = useState(isInitiator ? 'Calling…' : 'Connecting…');

  const myVideo      = useRef();
  const userVideo    = useRef();
  const connectionRef = useRef();
  const streamRef    = useRef(); // keep a ref so cleanup can access without stale closure

  // ─── Cleanup helper ──────────────────────────────────────────────
  const stopEverything = (shouldNavigate = true) => {
    const s = streamRef.current;
    if (s) s.getTracks().forEach((t) => t.stop());

    if (connectionRef.current) {
      try { connectionRef.current.destroy(); } catch (_) {}
    }

    if (shouldNavigate) navigate('/messages');
  };

  // ─── Main effect ─────────────────────────────────────────────────
  useEffect(() => {
    let peer;

    const start = async () => {
      let currentStream;
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err) {
        console.error('Camera/mic error:', err);
        setStatus('Could not access camera / microphone');
        return;
      }

      setStream(currentStream);
      streamRef.current = currentStream;
      if (myVideo.current) myVideo.current.srcObject = currentStream;

      // Wait for socket to be available (SocketContext initialises async)
      let socket = socketRef?.current;
      if (!socket) {
        await new Promise((resolve) => {
          const t = setInterval(() => {
            if (socketRef?.current) { clearInterval(t); resolve(); }
          }, 100);
        });
        socket = socketRef.current;
      }

      // ── Socket event listeners ─────────────────────────────────
      const onCallAccepted = (signal) => {
        setCallAccepted(true);
        setStatus('Connected');
        connectionRef.current?.signal(signal);
      };
      const onCallEnded = () => {
        setCallEnded(true);
        setStatus('Call ended');
        stopEverything();
      };
      const onCallDeclined = () => {
        setCallEnded(true);
        setStatus('Call declined');
        setTimeout(() => stopEverything(), 1500);
      };

      socket.on('call-accepted',  onCallAccepted);
      socket.on('call-ended',     onCallEnded);
      socket.on('call-declined',  onCallDeclined);

      // ── Initiator path ────────────────────────────────────────
      if (isInitiator) {
        peer = new Peer({
          initiator: true,
          trickle: false,
          stream: currentStream,
          config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
        });

        peer.on('signal', (signalData) => {
          socket.emit('call-user', {
            userToCall: calleeId,
            signalData,
            from: user.id,
            name: user.name,
            matchId,
          });
        });

        peer.on('stream', (remote) => {
          if (userVideo.current) userVideo.current.srcObject = remote;
        });

        peer.on('error', (e) => console.error('Peer error:', e));
        peer.on('close', () => { setCallEnded(true); setStatus('Call ended'); });
        connectionRef.current = peer;

      // ── Answerer path ─────────────────────────────────────────
      } else if (incomingSignal) {
        peer = new Peer({
          initiator: false,
          trickle: false,
          stream: currentStream,
          config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
        });

        peer.on('signal', (signalData) => {
          socket.emit('answer-call', { signal: signalData, to: callerFrom });
        });

        peer.on('stream', (remote) => {
          setCallAccepted(true);
          setStatus('Connected');
          if (userVideo.current) userVideo.current.srcObject = remote;
        });

        peer.on('error', (e) => console.error('Peer error:', e));
        peer.on('close', () => { setCallEnded(true); setStatus('Call ended'); });

        peer.signal(incomingSignal);
        connectionRef.current = peer;
        setCallAccepted(true);
        setStatus('Connected');
      }

      // Return cleanup for socket listeners
      return () => {
        socket.off('call-accepted',  onCallAccepted);
        socket.off('call-ended',     onCallEnded);
        socket.off('call-declined',  onCallDeclined);
      };
    };

    let cleanupSocket;
    start().then((fn) => { cleanupSocket = fn; });

    return () => {
      if (cleanupSocket) cleanupSocket();
      if (peer) { try { peer.destroy(); } catch (_) {} }
      stopEverything(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Controls ────────────────────────────────────────────────────
  const hangUp = () => {
    const otherId = isInitiator ? calleeId : callerFrom;
    if (otherId && socketRef?.current) {
      socketRef.current.emit('end-call', { to: otherId });
    }
    stopEverything(true);
  };

  const toggleMic = () => {
    const track = stream?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setMicOn(track.enabled); }
  };

  const toggleVideo = () => {
    const track = stream?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setVideoOn(track.enabled); }
  };

  // ─── UI ──────────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden select-none">

      {/* Remote video (main) */}
      <div className="relative flex-1 bg-black flex items-center justify-center">
        <video
          ref={userVideo}
          autoPlay
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-500 ${callAccepted && !callEnded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Status overlay */}
        {(!callAccepted || callEnded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4">
            {!callEnded && (
              <span className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            )}
            {callEnded && <PhoneOff size={48} className="text-red-400" />}
            <p className="text-xl font-semibold text-white/80">{status}</p>
          </div>
        )}

        {/* Caller label */}
        <div className="absolute top-5 left-5 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-white text-sm font-medium">
          {callerName || (isInitiator ? 'Calling…' : 'Remote')}
        </div>

        {/* Local PiP */}
        {stream && (
          <div className="absolute bottom-24 right-5 w-44 aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-800">
            <video ref={myVideo} autoPlay playsInline muted className="w-full h-full object-cover" />
            <span className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white/80 uppercase tracking-wide">You</span>
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-center gap-4 p-5 bg-slate-900 border-t border-white/5">
        <button
          onClick={toggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            micOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/40'
          }`}
          title={micOn ? 'Mute mic' : 'Unmute mic'}
        >
          {micOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>

        <button
          onClick={toggleVideo}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            videoOn ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/40'
          }`}
          title={videoOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {videoOn ? <Video size={22} /> : <VideoOff size={22} />}
        </button>

        <div className="w-px h-10 bg-white/10 mx-2" />

        <button
          onClick={hangUp}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg shadow-red-500/30 transition-all hover:scale-105"
          title="End call"
        >
          <PhoneOff size={26} className="text-white" />
        </button>
      </div>
    </div>
  );
}
