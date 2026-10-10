'use client';

import React from 'react';
import {
  FileText,
  FileSearch,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  Zap,
  Target,
  Download,
  Check,
} from 'lucide-react';

export default function ResumeToolsHubPage() {
  const tools = [
    {
      title: 'ATS Resume Builder & Maker',
      desc: 'Build recruiter-approved single-column technical resumes designed specifically to pass Applicant Tracking Systems (ATS) with 95%+ parse rates.',
      icon: FileText,
      href: '/resume-maker',
      badge: 'Interactive Builder',
      badgeColor: 'badge-indigo',
      features: [
        'Clean single-column ATS layout',
        'AI One-Click summary generator',
        'Auto-suggest high-yield technical skills',
        'Instant print & PDF export',
      ],
      cta: 'Launch Resume Builder',
      color: 'from-indigo-600 to-purple-600',
    },
    {
      title: 'AI Resume ATS Analyser & Scorer',
      desc: 'Paste your current resume and benchmark it against target roles (SDE, AI/ML, Full Stack, Core B.Tech). Get a 100-point score with missing keyword detection.',
      icon: FileSearch,
      href: '/resume-analyser',
      badge: 'Automated Scanner',
      badgeColor: 'badge-emerald',
      features: [
        'ATS 100-Point Score breakdown',
        'Keyword density and missing skills',
        'Google XYZ bullet point rewrites',
        'Direct links to courses for skill gaps',
      ],
      cta: 'Scan Your Resume Now',
      color: 'from-emerald-600 to-cyan-600',
    },
  ];

  return (
    <div className="app-container py-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-white/10 text-indigo-300 text-xs font-bold mb-4 shadow">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Campus Placement & Job Ready Toolkit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ATS <span className="text-indigo-400">Resume Suite & Career Toolkit</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
          Create high-scoring technical resumes from scratch or scan your existing draft against top software and core engineering job descriptions.
        </p>

        {/* Quick Switcher Nav */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <a
            href="/resume-maker"
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-white/5 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all hover:border-indigo-500/40"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Open Resume Maker</span>
          </a>
          <a
            href="/resume-analyser"
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-white/5 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all hover:border-emerald-500/40"
          >
            <FileSearch className="w-4 h-4 text-emerald-400" />
            <span>Open Resume Analyser</span>
          </a>
        </div>
      </div>

      {/* 2 Core Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <div
              key={idx}
              className="glass-card-interactive p-8 flex flex-col justify-between border-white/10 bg-slate-900/50"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`badge ${tool.badgeColor} text-[10px]`}>
                    {tool.badge}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">
                  {tool.title}
                </h2>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {tool.desc}
                </p>

                {/* Features checklist */}
                <div className="space-y-2.5 mb-8">
                  {tool.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={tool.href}
                className={`btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r ${tool.color}`}
              >
                <span>{tool.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Placement Standard Benchmark Highlights */}
      <div className="max-w-5xl mx-auto glass-panel p-8 bg-slate-900/60 border border-white/10 text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Recruiter Standard Specifications
        </div>
        <h3 className="text-lg font-bold text-white mb-6">
          Why Campus Placements & Tech Recruiters Require ATS-Compliant Resumes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
            <div className="text-indigo-400 font-bold text-sm mb-1">01. No Parsing Glitches</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-column tables, photos, and graphical skill bars cause Taleo & Workday scanners to reject 75% of fresher applications before HR ever reads them.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
            <div className="text-cyan-400 font-bold text-sm mb-1">02. Google XYZ Formula</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every bullet point follows: <em>Accomplished [X] as measured by [Y], by doing [Z]</em>. Shows quantifiable engineering impact.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
            <div className="text-emerald-400 font-bold text-sm mb-1">03. Keyword Coverage</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exact matches for framework versions, data structures, cloud tooling, and branch core subjects give you a 90+ matching percentile.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
