import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// -----------------------------------------------------------------
// useSocket hook: creates and manages one Socket.io connection.
// We use useRef to hold the socket so it persists across renders
// without triggering re-renders itself (unlike useState).
// -----------------------------------------------------------------
export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:8000');

    return () => {
      // Cleanup: disconnect when the component using this hook unmounts
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef;
};
