import React from 'react';
import { UploadCloud, FileText, Briefcase } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-[#8BBB92]">Dashboard - MatchMyCV</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#12544F]/40 border border-[#12544F] p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-[#2A835F]/30 text-[#8BBB92] rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-300">Analyzed CVs</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
        </div>

        <div className="bg-[#12544F]/40 border border-[#12544F] p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-[#2A835F]/30 text-[#8BBB92] rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-300">Matched Jobs</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
        </div>

        <div className="bg-[#12544F]/40 border border-[#12544F] p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-[#2A835F]/30 text-[#8BBB92] rounded-lg">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-300">Highest Match Score</p>
            <p className="text-2xl font-bold text-white">0%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;