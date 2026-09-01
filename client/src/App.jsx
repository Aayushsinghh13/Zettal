import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages (lazy imports keep the initial bundle small)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import ListingDetail from './pages/ListingDetail';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import VideoCall from './pages/VideoCall';
import GlobalCallListener from './components/GlobalCallListener';

// -----------------------------------------------------------------
// App.jsx owns the routing table. Every URL maps to a component.
// AuthProvider wraps everything so any page can access user state.
// BrowserRouter enables history-based navigation (real URLs like
// /browse instead of /#/browse).
// -----------------------------------------------------------------
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SocketProvider>
          <GlobalCallListener />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/listings/:id" element={<ListingDetail />} />

            {/* Protected routes — require login */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/messages/:matchId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/call/:matchId" element={<ProtectedRoute><VideoCall /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
