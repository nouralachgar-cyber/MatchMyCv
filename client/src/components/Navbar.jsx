import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileSearch, LogIn, UserPlus, LayoutDashboard, LogOut, Settings, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setOpen(false);
    navigate('/');
  };

  const initial = userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="border-b border-[#12544F] bg-[#092328]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-90 transition">
          <FileSearch className="w-7 h-7 text-[#8BBB92]" />
          <span className="text-[#8BBB92] font-extrabold tracking-wide">
            MatchMyCV
          </span>
        </Link>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-4">
          {userInfo ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-[#8BBB92] transition px-2 py-1.5 rounded-lg hover:bg-[#12544F]/50"
              >
                <span className="w-8 h-8 rounded-full bg-[#2A835F] text-white flex items-center justify-center font-bold">
                  {initial}
                </span>
                <span className="hidden sm:block max-w-[120px] truncate">{userInfo.name}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0C2F36] border border-[#12544F] rounded-xl shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#12544F]">
                    <p className="text-sm font-semibold text-slate-100 truncate">{userInfo.name}</p>
                    <p className="text-xs text-slate-400 truncate">{userInfo.email}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-200 hover:bg-[#12544F]/60 hover:text-[#8BBB92] transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    لوحة التحكم
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-200 hover:bg-[#12544F]/60 hover:text-[#8BBB92] transition"
                  >
                    <Settings className="w-4 h-4" />
                    الإعدادات
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition border-t border-[#12544F]"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-200 hover:text-[#8BBB92] transition px-3 py-2 rounded-lg hover:bg-[#12544F]/50"
              >
                <LogIn className="w-4 h-4" />
                دخول
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-1.5 text-sm font-medium bg-[#2A835F] hover:bg-[#2A835F]/80 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-[#2A835F]/20"
              >
                <UserPlus className="w-4 h-4" />
                حساب جديد
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
