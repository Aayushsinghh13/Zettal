import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, MessageSquare, Menu, Zap, Bell, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import UserAvatar from './UserAvatar';
import { getNotifications, markAllNotifRead } from '../api/users';
import { useSocket } from '../hooks/useSocket';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const socketRef = useSocket();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Fetch notifications on mount
  useEffect(() => {
    if (!user) return;
    getNotifications()
      .then((res) => setNotifs(res.data))
      .catch(() => {});
  }, [user]);

  // Join personal socket room + listen for real-time notifications
  useEffect(() => {
    if (!user || !socketRef.current) return;
    const socket = socketRef.current;
    socket.emit('join-user-room', user.id);

    const handleNotif = (notif) => {
      setNotifs((prev) => [notif, ...prev].slice(0, 20));
    };
    socket.on('notification', handleNotif);
    return () => socket.off('notification', handleNotif);
  }, [user, socketRef.current]);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifs.filter((n) => !n.read).length;

  const handleOpenNotifs = async () => {
    setNotifOpen((v) => !v);
    if (!notifOpen && unread > 0) {
      // Mark all as read optimistically
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
      await markAllNotifRead().catch(() => {});
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200">
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
                <Link to="/messages" className="text-slate-600 hover:text-primary-600 transition-colors relative">
                  <MessageSquare size={20} />
                </Link>

                {/* ── Notification Bell ──────────────────────── */}
                <div className="relative" ref={notifRef}>
                  <button onClick={handleOpenNotifs} className="relative text-slate-600 hover:text-primary-600 transition-colors p-1">
                    <Bell size={20} />
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgb(0,0,0,0.12)] border border-slate-200/60 overflow-hidden z-50">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <h3 className="font-extrabold text-slate-900 text-sm">Notifications</h3>
                        <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={16} />
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifs.length === 0 ? (
                          <p className="text-slate-400 text-sm font-medium text-center py-8">No notifications yet</p>
                        ) : (
                          notifs.map((n, i) => (
                            <Link
                              key={i}
                              to={n.link || '/matches'}
                              onClick={() => setNotifOpen(false)}
                              className={`block px-5 py-4 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-primary-50/60' : ''}`}
                            >
                              <p className="text-sm font-semibold text-slate-800 leading-snug">{n.message}</p>
                              <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                
                {/* ── Profile Dropdown ───────────────────────── */}
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
              <Link to="/matches" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-900 hover:bg-slate-50">
                Matches
              </Link>
              <Link to="/messages" className="block px-3 py-2 rounded-lg text-base font-medium text-slate-900 hover:bg-slate-50">Messages</Link>
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
