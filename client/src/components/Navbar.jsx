import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, MessageSquare, Menu, Zap } from 'lucide-react';
import { useState } from 'react';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-subtle">
                <Zap size={18} className="text-white" />
              </div>
              SkillSwap
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <Link to="/browse" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Browse Skills
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/matches" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Matches
                </Link>
                <Link to="/chat" className="text-slate-600 hover:text-primary-600 transition-colors relative">
                  <MessageSquare size={20} />
                  {/* Optional: Add notification dot here if needed */}
                </Link>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <div className="relative group">
                  <button className="flex items-center gap-2 focus:outline-none">
                    <UserAvatar name={user.name} size="sm" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-floating border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right translate-y-2 group-hover:translate-y-0">
                    <div className="p-4 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
                        <User size={16} /> Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="sm:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-floating">
          <Link to="/browse" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-900 hover:bg-slate-50">Browse Skills</Link>
          {user ? (
            <>
              <Link to="/matches" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-900 hover:bg-slate-50">Matches</Link>
              <Link to="/chat" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-900 hover:bg-slate-50">Messages</Link>
              <Link to="/profile" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-900 hover:bg-slate-50">Profile</Link>
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-900 hover:bg-slate-50">Log in</Link>
              <Link to="/register" className="block px-3 py-2 rounded-lg text-base font-medium text-primary-600 hover:bg-primary-50">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
