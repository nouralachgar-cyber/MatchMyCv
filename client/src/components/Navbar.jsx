import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileSearch, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-200 hover:text-[#8BBB92] transition px-3 py-2 rounded-lg hover:bg-[#12544F]/50"
              >
                <LayoutDashboard className="w-4 h-4" />
                لوحة التحكم
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 px-3 py-2 rounded-lg border border-red-900/30 transition"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            </>
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