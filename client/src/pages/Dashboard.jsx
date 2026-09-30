import React, { useState } from 'react';
import { UploadCloud, FileText, Briefcase } from 'lucide-react';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) return alert('المرجو اختيار ملف CV ووصف الوظيفة!');

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء التحليل!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white">
      <h1 className="text-2xl font-bold mb-6 text-[#8BBB92]">Dashboard - MatchMyCV</h1>

      {/* 1️⃣ كروت الإحصائيات مع الأيقونات الاحترافية */}
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

      {/* 2️⃣ قسم رفع السيفي وتحليل الـ AI */}
      <div className="bg-[#12544F]/30 border border-[#12544F] p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-[#8BBB92] mb-4">Analyze Your Resume</h2>
        
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-300">Upload CV (PDF / DOCX):</label>
            <input 
              type="file" 
              accept=".pdf,.docx" 
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2A835F] file:text-white hover:file:bg-[#12544F] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Job Description:</label>
            <textarea 
              rows="4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here..."
              className="w-full p-3 bg-gray-900/60 border border-[#12544F] rounded-lg text-white focus:outline-none focus:border-[#8BBB92]"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#8BBB92] hover:bg-[#2A835F] text-black font-bold py-3 rounded-lg transition"
          >
            {loading ? 'AI is Analyzing...' : 'Analyze CV Now ✨'}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-gray-900/80 border border-[#8BBB92]/40 rounded-lg">
            <h3 className="text-lg font-bold text-[#8BBB92]">Match Result: {result.matchScore}%</h3>
            <p className="mt-2 text-gray-300">{result.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}