'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileSearch,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Wand2,
  TrendingUp,
  Target,
  Layers,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResumeAnalyserPage() {
  const router = useRouter();

  const [resumeText, setResumeText] = useState(
    `Alex Chen
Email: student@btech.edu | Phone: +91 98765 43210
Education: B.Tech in Artificial Intelligence, National Institute of Technology, CGPA: 8.8

Technical Skills:
Python, C++, JavaScript, React, Next.js, SQL, Machine Learning, Git

Projects:
- EduCareer AI Platform: Built student learning portal with course catalog and quiz testing.
- Placement Predictor: Worked on an ML model using Scikit-Learn with 88% accuracy across 1000 records.

Certifications:
Machine Learning Specialization`
  );

  const [targetRole, setTargetRole] = useState('Software Developer');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setAnalyzing(true);
    try {
      const res = await fetch('/api/resumes/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);

        if (data.overallScore >= 80) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="app-container py-10">
      
      {/* Tool Navigation Switcher */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <a
          href="/resume-maker"
          className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-white/10 text-slate-400 hover:text-white flex items-center gap-2 transition-all hover:border-indigo-500/30"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>ATS Resume Maker</span>
        </a>
        <a
          href="/resume-analyser"
          className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md shadow-emerald-600/30 flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>ATS Resume Analyser</span>
        </a>
        <a
          href="/resume-tools"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900/60 border border-white/5 text-slate-500 hover:text-slate-300"
        >
          <span>Tools Overview</span>
        </a>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-white/10 text-indigo-300 text-xs font-bold mb-4 shadow">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Automated ATS Resume Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Resume <span className="text-indigo-400">ATS Analyser & Keyword Scorer</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Benchmark your resume against target roles, identify missing keywords, and get Google XYZ rewritten bullet points.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Input Form */}
        <div className="glass-panel p-6 sm:p-8 bg-slate-900/60 border border-white/10">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Engineering Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="form-select text-xs py-2"
              >
                <option value="Software Developer">Software Developer / SDE Fresher</option>
                <option value="Machine Learning">Machine Learning & AI Engineer</option>
                <option value="Full Stack">Full Stack Web Developer</option>
                <option value="Mechanical">Mechanical Design & CAD/CAE</option>
                <option value="ECE">ECE VLSI & Embedded Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Paste Resume Text
              </label>
              <textarea
                rows={14}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your plain resume text or bullet points here..."
                className="form-textarea text-xs leading-relaxed font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <FileSearch className="w-4 h-4" />
              <span>{analyzing ? 'Scanning Keywords & ATS Rules...' : 'Run Instant ATS Analysis'}</span>
            </button>
          </form>
        </div>

        {/* Right: Results Dashboard */}
        <div>
          {!result ? (
            <div className="glass-panel p-12 text-center bg-slate-900/40 border border-white/10 text-slate-400">
              <FileSearch className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Analysis Run Yet</h3>
              <p className="text-xs mt-1">
                Paste your resume text on the left and click "Run Instant ATS Analysis" to evaluate keywords, metrics, and formatting.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Overall Score Box */}
              <div className="glass-panel p-6 bg-slate-900/80 border border-indigo-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Overall ATS Match Score
                    </span>
                    <div className="text-4xl font-extrabold text-white mt-1">
                      {result.overallScore} <span className="text-base text-slate-400 font-semibold">/ 100</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      {result.overallScore >= 80
                        ? '🟢 Excellent ATS score! Well-structured for recruiter screening.'
                        : '🟡 Moderate score. Address the missing keywords below to pass filters.'}
                    </div>
                  </div>

                  <a
                    href="/resume-maker"
                    className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Fix in Resume Maker</span>
                  </a>
                </div>

                {/* Score Breakdown Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/10 text-xs">
                  <div>
                    <div className="text-slate-400 text-[11px]">Keywords Match</div>
                    <div className="font-bold text-white">{result.scoreBreakdown.keywords} / 25</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Standard Sections</div>
                    <div className="font-bold text-white">{result.scoreBreakdown.sections} / 20</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Action Verbs</div>
                    <div className="font-bold text-white">{result.scoreBreakdown.actionVerbs} / 20</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Measurable Metrics</div>
                    <div className="font-bold text-white">{result.scoreBreakdown.measurableImpact} / 15</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Length & Format</div>
                    <div className="font-bold text-white">{result.scoreBreakdown.formatting} / 20</div>
                  </div>
                </div>
              </div>

              {/* Missing Keywords & Skills */}
              {result.missingKeywords.length > 0 && (
                <div className="glass-panel p-5 bg-slate-900/60 border border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing Role Keywords (Crucial for ATS):
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="badge badge-amber text-[10px]">
                        + {kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Recruiter filters search for these exact terms. Incorporate them in your technical projects or skills section.
                  </p>
                </div>
              )}

              {/* Skill Gap Direct Platform Course Links */}
              {result.skillGaps.length > 0 && (
                <div className="glass-panel p-5 bg-slate-900/60 border border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Learn Missing Skills on EduCareer AI:
                  </h3>
                  <div className="space-y-2">
                    {result.skillGaps.map((gap, i) => (
                      <a
                        key={i}
                        href={`/courses/${gap.courseSlug}`}
                        className="p-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-indigo-400 flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="font-semibold text-slate-200">{gap.courseTitle}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Weak Bullet Points with AI Rewrites */}
              {result.weakBullets.length > 0 && (
                <div className="glass-panel p-5 bg-slate-900/60 border border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                    AI Bullet Point Enhancer (Google XYZ Formula):
                  </h3>
                  <div className="space-y-3">
                    {result.weakBullets.map((bullet, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-900 border border-white/5 text-xs">
                        <div className="text-slate-400 text-[11px] mb-1">
                          <span className="text-rose-400 font-bold">Weak: </span>
                          <span className="line-through">{bullet.weak}</span>
                        </div>
                        <div className="text-emerald-300 font-semibold leading-relaxed">
                          <span className="font-bold">AI Improved: </span>
                          {bullet.improved}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
