import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// -----------------------------------------------------------------
// What is Context?
// Context is React's way to share state globally without passing
// props through every component. Any component that needs the
// current user just calls useAuth() — it doesn't matter how deep
// in the component tree it lives.
// -----------------------------------------------------------------
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true = "checking if logged in"

  // On app load: if a token exists in localStorage, fetch the user
  // profile to restore the session. This prevents the user from
  // being logged out every time they refresh the page.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token is invalid or expired — clear it
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Called after successful login or register
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Don't render children until we know if user is logged in
  // This prevents a flash of the login page on refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#040D14' }}>
        <div className="w-10 h-10 rounded-full animate-spin"
          style={{ border: '3px solid rgba(245,158,11,0.2)', borderTopColor: '#F59E0B' }} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — shortcut to consume context
export const useAuth = () => useContext(AuthContext);
