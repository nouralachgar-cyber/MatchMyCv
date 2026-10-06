import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, FileCheck, Target, Cpu } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center text-center">

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12544F]/60 border border-[#2A835F]/40 text-[#8BBB92] text-sm mb-6">
        <Sparkles className="w-4 h-4" />
        AI Powered
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
        Analyze your CV and match it with the right job using{' '}
        <span className="text-[#8BBB92]">
          MatchMyCV
        </span>
      </h1>

      <p className="mt-6 text-lg text-slate-300 max-w-2xl">
        Get instant feedback on your resume, spot skill gaps, and optimize your candidate profile for your dream role.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-[#2A835F] hover:bg-[#2A835F]/80 text-white font-medium px-6 py-3 rounded-xl transition shadow-lg shadow-[#2A835F]/20"
        >
          Try Free Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">

        <div className="bg-[#12544F]/40 border border-[#12544F] p-6 rounded-2xl">
          <FileCheck className="w-8 h-8 text-[#8BBB92] mb-4" />
          <h3 className="text-xl font-bold mb-2">
            CV Analysis
          </h3>
          <p className="text-sm text-slate-300">
            Accurately extract skills, experience, and structure quality.
          </p>
        </div>

        <div className="bg-[#12544F]/40 border border-[#12544F] p-6 rounded-2xl">
          <Target className="w-8 h-8 text-[#8BBB92] mb-4" />
          <h3 className="text-xl font-bold mb-2">
            Career Matching
          </h3>
          <p className="text-sm text-slate-300">
            Discover the jobs that best match your skills, experience, and career profile.
          </p>
        </div>

        <div className="bg-[#12544F]/40 border border-[#12544F] p-6 rounded-2xl">
          <Cpu className="w-8 h-8 text-[#8BBB92] mb-4" />
          <h3 className="text-xl font-bold mb-2">
            AI Suggestions
          </h3>
          <p className="text-sm text-slate-300">
            Smart tips and rewrites to boost your interview chances.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Home;