'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  GitFork,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  Search,
  Filter,
  DollarSign,
  GraduationCap,
} from 'lucide-react';

export default function RoadmapsPage() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const q = categoryFilter !== 'ALL' ? `?category=${categoryFilter}` : '';
      const res = await fetch(`/api/roadmaps${q}`);
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data.roadmaps || []);
      }
    } catch (err) {
      console.error('Fetch roadmaps error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [categoryFilter]);

  const filteredRoadmaps = roadmaps.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="app-container py-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-white/10 text-indigo-300 text-xs font-bold mb-4 shadow">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Step-by-Step Career Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Interactive <span className="text-indigo-400">Career & Curriculum Roadmaps</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Visual milestone nodes from fundamentals to production projects, industry certifications, and top placement roles.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="glass-panel p-5 mb-8 bg-slate-900/60 border border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
            {[
              { id: 'ALL', label: 'All Roadmaps' },
              { id: 'IT', label: 'IT & Software' },
              { id: 'CORE', label: 'Core Engineering' },
              { id: 'EXAMS', label: 'Exams & Placements' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  categoryFilter === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roadmaps..."
              className="form-input pl-9 py-2 text-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Roadmaps Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading interactive roadmaps...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((r) => (
            <div
              key={r.slug}
              className="glass-card-interactive p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="badge badge-indigo text-[10px]">{r.category}</span>
                  <span className="badge badge-cyan text-[10px]">{r.department}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {r.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {r.description}
                </p>

                {/* Salary Package Benchmark */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 mb-4 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {r.estimatedTime}
                    </span>
                    <span className="font-bold text-emerald-400">
                      {r.salaryRange}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Industry Compensation Benchmark</div>
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(r.skillsNeeded || []).slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300">
                      {skill}
                    </span>
                  ))}
                  {(r.skillsNeeded || []).length > 4 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                      +{(r.skillsNeeded || []).length - 4} more
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-400">Your Progress</span>
                    <span className="text-indigo-400">{r.progressPercent || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${r.progressPercent || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">
                  {(r.nodes || []).length} Milestones
                </span>
                <a
                  href={`/roadmaps/${r.slug}`}
                  className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Explore Visual Flow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
