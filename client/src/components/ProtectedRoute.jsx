import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// -----------------------------------------------------------------
// ProtectedRoute: wraps any route that requires authentication.
// If the user is not logged in (no user in AuthContext), it
// redirects them to /login. Otherwise, renders the children.
//
// Usage in App.jsx:
//   <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
// -----------------------------------------------------------------
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
