import React from 'react';
import { Navigate } from 'react-router-dom';
import { User, Mail, ShieldCheck } from 'lucide-react';

const Settings = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <div className="bg-[#12544F]/40 border border-[#12544F] p-8 rounded-2xl shadow-xl">

        <div className="flex items-center gap-4 mb-8">
          <span className="w-16 h-16 rounded-full bg-[#2A835F] text-white flex items-center justify-center text-2xl font-bold">
            {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
          </span>

          <div>
            <h2 className="text-2xl font-bold text-[#8BBB92]">{userInfo.name}</h2>
            <p className="text-slate-400 text-sm">{userInfo.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-[#092328] border border-[#12544F] rounded-lg px-4 py-3">
            <User className="w-5 h-5 text-[#8BBB92]" />
            <div>
              <p className="text-xs text-slate-400">Full Name</p>
              <p className="text-sm text-slate-200">{userInfo.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#092328] border border-[#12544F] rounded-lg px-4 py-3">
            <Mail className="w-5 h-5 text-[#8BBB92]" />
            <div>
              <p className="text-xs text-slate-400">Email Address</p>
              <p className="text-sm text-slate-200">{userInfo.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#092328] border border-[#12544F] rounded-lg px-4 py-3">
            <ShieldCheck className="w-5 h-5 text-[#8BBB92]" />
            <div>
              <p className="text-xs text-slate-400">Account Status</p>
              <p className="text-sm text-slate-200">Active</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
