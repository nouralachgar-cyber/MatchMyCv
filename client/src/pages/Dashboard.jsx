import React, { useState } from 'react';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('المرجو اختيار ملف CV أولاً!');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء تحليل الملف');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-bold text-emerald-400">MatchMyCV — AI Dashboard</h1>
        </div>

        {/* Upload Form */}
        <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-emerald-300">Upload & Analyze Your CV</h2>
          
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Select CV (PDF / DOCX)</label>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:cursor-pointer hover:file:bg-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Target Job Description (Optional)</label>
              <textarea
                rows="3"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to check for matching skills and keywords..."
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            {error && <div className="p-3 bg-red-900/40 border border-red-500 text-red-300 rounded-lg text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Analyzing CV with AI...' : 'Analyze CV Now 🚀'}
            </button>
          </form>
        </div>

        {/* Results Area */}
        {result && (
          <div className="space-y-6">
            
            {/* Top Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-6 rounded-xl border border-emerald-500/30 text-center">
                <span className="text-slate-400 text-sm">Overall CV Score</span>
                <div className="text-4xl font-extrabold text-emerald-400 my-2">{result.overallScore} / 100</div>
                <p className="text-xs text-slate-400">{result.scoreReason}</p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/30 text-center">
                <span className="text-slate-400 text-sm">ATS Compatibility Score</span>
                <div className="text-4xl font-extrabold text-blue-400 my-2">{result.atsScore}%</div>
                <p className="text-xs text-slate-400">Readability & Format match</p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-purple-500/30 text-center">
                <span className="text-slate-400 text-sm">Job Match Score</span>
                <div className="text-4xl font-extrabold text-purple-400 my-2">{result.jobMatch?.percentage || 0}%</div>
                <p className="text-xs text-slate-400">Match against job description</p>
              </div>
            </div>

            {/* Recommended Services Section */}
            {result.recommendedServices && result.recommendedServices.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-xl border border-emerald-500/40 shadow-lg">
                <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <span>💼</span> الخدمات والفرص الموصى بها بناءً على الـ CV ديالك:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.recommendedServices.map((service, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-slate-900/80 p-3 rounded-lg border border-slate-700 text-slate-200 text-sm">
                      <span className="text-emerald-400 font-bold">✨</span>
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-700 space-x-4">
              {['overview', 'ats', 'skills', 'errors', 'sections'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-3 font-medium capitalize border-b-2 transition-all ${
                    activeTab === tab
                      ? 'border-emerald-400 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              
              {/* Overview / Job Match */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">Job Matching Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-emerald-400 mb-2">Matched Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.jobMatch?.matchedSkills?.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-emerald-950 text-emerald-300 rounded-full text-xs border border-emerald-800">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-red-400 mb-2">Missing Skills & Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.jobMatch?.missingSkills?.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-red-950 text-red-300 rounded-full text-xs border border-red-800">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {result.jobMatch?.recommendations?.length > 0 && (
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-amber-400 mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {result.jobMatch.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ATS Tab */}
              {activeTab === 'ats' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">ATS Parsing & Format Checks</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-emerald-400 mb-2">Good ATS Practices</h4>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {result.atsDetails?.good?.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-amber-400 mb-2">Issues & Risks</h4>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {result.atsDetails?.issues?.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-400">Extracted Skills</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.skillsExtracted?.technical?.map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-900 text-emerald-400 border border-slate-700 rounded-lg text-xs">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.skillsExtracted?.soft?.map((s, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-900 text-blue-400 border border-slate-700 rounded-lg text-xs">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Errors Tab */}
              {activeTab === 'errors' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-400">Grammar, Spelling & Wording Fixes</h3>
                  {result.errorsDetected?.length === 0 ? (
                    <p className="text-emerald-400 text-sm">No critical errors found in your CV!</p>
                  ) : (
                    <div className="space-y-3">
                      {result.errorsDetected?.map((err, i) => (
                        <div key={i} className="bg-slate-900/80 p-4 rounded-lg border border-red-900/50">
                          <p className="text-red-300 font-semibold text-sm">Problem: "{err.issue}"</p>
                          <p className="text-emerald-400 text-sm mt-1">Suggested Fix: {err.fix}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sections Tab */}
              {activeTab === 'sections' && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Section-by-Section Breakdown</h3>
                  {result.sectionAnalysis && Object.entries(result.sectionAnalysis).map(([sec, data]) => (
                    <div key={sec} className="bg-slate-900/60 p-4 rounded-lg border border-slate-700 flex justify-between items-center">
                      <div>
                        <h4 className="capitalize font-bold text-slate-200">{sec}</h4>
                        <p className="text-xs text-slate-400 mt-1">{data.feedback}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        data.status === 'Good' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {data.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}