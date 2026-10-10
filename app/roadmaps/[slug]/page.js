'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  GitFork,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowLeft,
  Youtube,
  ExternalLink,
  BookOpen,
  Award,
  Layers,
  Briefcase,
  DollarSign,
  AlertCircle,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RoadmapDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const fetchRoadmap = async () => {
    try {
      const res = await fetch(`/api/roadmaps/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setRoadmap(data.roadmap);
        if (data.roadmap?.nodes?.length > 0 && !selectedNodeId) {
          setSelectedNodeId(data.roadmap.nodes[0].id);
        }
      }
    } catch (err) {
      console.error('Fetch roadmap error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchRoadmap();
  }, [slug]);

  const toggleNodeProgress = async (nodeId, isCurrentlyCompleted) => {
    if (!user) {
      router.push(`/login?redirect=/roadmaps/${slug}`);
      return;
    }

    const nextState = !isCurrentlyCompleted;

    // Optimistic UI update
    setRoadmap((prev) => {
      const list = prev.completedNodes || [];
      const updatedList = nextState
        ? [...list, nodeId]
        : list.filter((id) => id !== nodeId);
      const newPercent = Math.round((updatedList.length / prev.nodes.length) * 100);

      return {
        ...prev,
        completedNodes: updatedList,
        progressPercent: newPercent,
      };
    });

    try {
      const res = await fetch(`/api/roadmaps/${slug}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodeId, completed: nextState }),
      });

      if (res.ok) {
        const data = await res.json();
        setRoadmap((prev) => ({
          ...prev,
          progressPercent: data.progressPercent,
          completedNodes: data.completedNodes,
        }));

        if (data.progressPercent === 100) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error('Toggle node error:', err);
      fetchRoadmap();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-3" />
        <p className="text-xs text-slate-400">Loading interactive visual flow...</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="app-container py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Roadmap Not Found</h2>
        <a href="/roadmaps" className="btn-secondary py-2 px-4 text-xs mt-4 inline-flex">
          ← Back to Roadmaps
        </a>
      </div>
    );
  }

  const nodes = roadmap.nodes || [];
  const completedNodes = roadmap.completedNodes || [];
  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const isSelectedCompleted = completedNodes.includes(activeNode?.id);

  return (
    <div className="app-container py-10">
      
      {/* Back button */}
      <div className="mb-6">
        <a
          href="/roadmaps"
          className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Roadmaps</span>
        </a>
      </div>

      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-10 mb-8 bg-slate-900/60 border border-white/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge badge-indigo text-xs">{roadmap.category}</span>
              <span className="badge badge-cyan text-xs">{roadmap.department}</span>
              <span className="badge badge-emerald text-xs">{roadmap.estimatedTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {roadmap.title}
            </h1>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {roadmap.description}
            </p>
          </div>

          {/* Progress Box */}
          <div className="w-full lg:w-80 shrink-0 bg-slate-900/80 p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-400">Roadmap Progress</span>
              <span className="text-indigo-400">{roadmap.progressPercent || 0}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${roadmap.progressPercent || 0}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>{completedNodes.length} of {nodes.length} Milestones completed</span>
              <span className="text-emerald-400 font-semibold">{roadmap.salaryRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Flow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visual Flow Step Nodes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GitFork className="w-4 h-4 text-indigo-400" />
              Sequential Milestone Flow
            </h2>
            <span className="text-xs text-slate-500">Click a node to view learning order</span>
          </div>

          <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-4 my-4">
            {nodes.map((node, index) => {
              const isDone = completedNodes.includes(node.id);
              const isSelected = selectedNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/50 shadow-lg shadow-indigo-600/10'
                      : isDone
                      ? 'bg-slate-900/40 border-emerald-500/30 hover:border-white/20'
                      : 'bg-slate-900/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Indicator Dot on the timeline */}
                  <div
                    className={`absolute -left-[31px] top-6 w-4 h-4 rounded-full border-2 transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-400/50'
                        : isSelected
                        ? 'bg-indigo-500 border-indigo-400 shadow-sm shadow-indigo-400/50 animate-ping'
                        : 'bg-slate-900 border-slate-600'
                    }`}
                  />
                  <div
                    className={`absolute -left-[31px] top-6 w-4 h-4 rounded-full border-2 transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400'
                        : isSelected
                        ? 'bg-indigo-500 border-indigo-400'
                        : 'bg-slate-900 border-slate-600'
                    }`}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge badge-indigo text-[9px] py-0 px-2">
                          Step {index + 1}: {node.stage}
                        </span>
                        {isDone && (
                          <span className="badge badge-emerald text-[9px] py-0 px-2">
                            Completed
                          </span>
                        )}
                      </div>
                      <h3 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {node.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {node.description}
                      </p>
                    </div>

                    {/* Toggle button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNodeProgress(node.id, isDone);
                      }}
                      className="p-2 rounded-xl border border-white/10 hover:border-emerald-400 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                      title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: "Learn in Order" Details Panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 sticky top-24 bg-slate-900/70 border border-white/10">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {activeNode?.stage}
                </span>
                <h3 className="text-base font-bold text-white leading-tight mt-0.5">
                  {activeNode?.title}
                </h3>
              </div>
              <button
                onClick={() => toggleNodeProgress(activeNode.id, isSelectedCompleted)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelectedCompleted
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {isSelectedCompleted ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                <span>{isSelectedCompleted ? 'Done' : 'Mark Done'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {activeNode?.description}
            </p>

            {/* Learn in Order Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Learn in Recommended Order:
              </h4>

              {/* 1. Video */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Youtube className="w-4 h-4 text-red-400" />
                    <span>1. Watch Video Lecture</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Curated</span>
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  Channels: <strong className="text-slate-300">{activeNode?.videoChannel}</strong>
                </div>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeNode?.title + ' ' + activeNode?.videoChannel)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300"
                >
                  <span>Search on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* 2. Official Documentation */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>2. Read Official Docs</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Reference</span>
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  Deep dive into core architecture & syntax
                </div>
                {activeNode?.docsUrl && (
                  <a
                    href={activeNode.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Open Documentation</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* 3. Practical Exercise */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>3. Practice Problem</span>
                </div>
                <div className="text-xs text-slate-300">
                  {activeNode?.practiceTopic}
                </div>
              </div>

              {/* 4. Technical Quiz Check */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>4. Test Knowledge</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">Quiz</span>
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  Topic: <strong className="text-slate-300">{activeNode?.quizTopic}</strong>
                </div>
                <a
                  href={`/quizzes?topic=${encodeURIComponent(activeNode?.quizTopic || '')}`}
                  className="btn-outline py-1.5 px-3 text-xs inline-flex"
                >
                  <span>Take Topic Quiz →</span>
                </a>
              </div>

              {/* Linked Platform Course */}
              {activeNode?.courseSlug && (
                <div className="pt-2">
                  <a
                    href={`/courses/${activeNode.courseSlug}`}
                    className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Linked Course Syllabus</span>
                  </a>
                </div>
              )}
            </div>

            {/* Career & Salary Details */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Related Job Roles:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(roadmap.relatedRoles || []).map((role, idx) => (
                  <span key={idx} className="badge badge-indigo text-[10px]">
                    {role}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
