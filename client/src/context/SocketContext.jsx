import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create socket connection once on mount
    const s = io('http://localhost:8000', { autoConnect: true });
    socketRef.current = s;
    setSocket(s);

    s.on('connect', () => {
      console.log('[Socket] Connected:', s.id);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, []); // Only run once

  // Whenever user logs in/out, join/leave the personal room
  useEffect(() => {
    if (!socketRef.current || !user?.id) return;
    console.log('[Socket] Joining user room:', user.id);
    socketRef.current.emit('join-user-room', user.id);
  }, [user?.id, socket]); // Runs when user or socket changes

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
