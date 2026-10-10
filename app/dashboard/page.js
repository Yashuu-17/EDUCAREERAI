'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  BookOpen,
  GitFork,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Flame,
  TrendingUp,
  BrainCircuit,
  Calendar,
  Target,
  RefreshCw,
  ArrowRight,
  Play,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4" />
          <h2 className="text-base font-bold text-white">Loading Your Learning Analytics...</h2>
          <p className="text-xs text-slate-400 mt-1">Authenticating JWT session & syncing streak logs</p>
        </div>
      </ProtectedRoute>
    );
  }

  const summary = data?.summary || {
    totalEnrolled: 4,
    completedLessons: 6,
    totalHoursSpent: '34.1',
    averageQuizScore: 85,
    streak: user?.streak || 7,
  };

  const enrolledCourses = data?.enrolledCourses || [];
  const activityHistory = data?.activityHistory || [];
  const categoryDistribution = data?.categoryDistribution || [];
  const skillRadar = data?.skillRadar || [];
  const badges = data?.badges || [];
  const weeklyStudyPlan = data?.weeklyStudyPlan || [];

  const displayName = user?.name || 'Alex Chen';
  const targetTrack = user?.department || 'Artificial Intelligence';
  const userLevel = user?.skillLevel || 'Intermediate';

  return (
    <ProtectedRoute>
      <div className="app-container py-8 sm:py-12">
        
        {/* =========================================================================
            EXACT REFERENCE SECTION: "Welcome back, Alex Chen!" + Authentication Card
            ========================================================================= */}
        <div className="max-w-4xl mx-auto mb-14 text-center">
          
          {/* Header Greeting matching user's photo */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-indigo-400">{displayName}</span>!
          </h1>
          
          <div className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">
            <span>Target Track: <strong className="text-slate-300">{targetTrack}</strong></span>
            <span className="mx-2 text-slate-600">•</span>
            <span>Level: <strong className="text-slate-300">{userLevel}</strong></span>
            <span className="mx-2 text-slate-600">•</span>
            <span>Daily Goal: <strong className="text-slate-300">45 mins</strong></span>
          </div>

          {/* Central "Authentication Verified" Card matching photo */}
          <div className="mt-8 p-8 sm:p-10 rounded-2xl glass-panel relative border border-white/10 shadow-2xl bg-slate-900/40 max-w-2xl mx-auto">
            
            {/* Glowing 4-point sparkle icon */}
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400 shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
              Authentication Verified
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
              Your profile is active with JWT security and streak tracking ({user?.streak || 7} days). Explore the course catalog, roadmaps, and practice questions below.
            </p>

            {/* 3 Action Buttons in row */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/courses"
                className="btn-primary py-2.5 px-5 text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse Courses</span>
              </a>

              <a
                href="/roadmaps"
                className="btn-secondary py-2.5 px-5 text-xs font-semibold flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border-white/10 text-slate-200"
              >
                <GitFork className="w-3.5 h-3.5 text-slate-400" />
                <span>View Roadmaps</span>
              </a>

              <a
                href="/quizzes"
                className="btn-secondary py-2.5 px-5 text-xs font-semibold flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border-white/10 text-slate-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Practice Questions</span>
              </a>
            </div>

          </div>
        </div>

        {/* =========================================================================
            DATA SECTION: 4 KPI Cards + GitHub Heatmap + Charts + Courses
            ========================================================================= */}
        
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-5 border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Courses</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {summary.totalEnrolled}
            </div>
            <div className="text-[11px] text-indigo-400 mt-1 font-medium">Across all domains</div>
          </div>

          <div className="glass-panel p-5 border-l-4 border-l-cyan-500">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Completed Lessons</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {summary.completedLessons}
            </div>
            <div className="text-[11px] text-cyan-400 mt-1 font-medium">Concepts mastered</div>
          </div>

          <div className="glass-panel p-5 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Learning Time</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {summary.totalHoursSpent} <span className="text-sm font-semibold text-slate-400">hrs</span>
            </div>
            <div className="text-[11px] text-purple-400 mt-1 font-medium">Total recorded study</div>
          </div>

          <div className="glass-panel p-5 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Quiz Score</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {summary.averageQuizScore}%
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">Technical benchmark</div>
          </div>
        </div>

        {/* GitHub-Style 30-Day Activity Heatmap */}
        <div className="glass-panel p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Daily Learning Activity Heatmap (GitHub Style)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every square tracks completed modules, study minutes, and quiz assessments.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2 sm:mt-0 font-medium">
              <span>Less</span>
              <span className="w-3 h-3 rounded-sm bg-slate-800" />
              <span className="w-3 h-3 rounded-sm bg-indigo-950" />
              <span className="w-3 h-3 rounded-sm bg-indigo-700" />
              <span className="w-3 h-3 rounded-sm bg-cyan-500" />
              <span className="w-3 h-3 rounded-sm bg-emerald-400" />
              <span>More</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-start p-2 bg-slate-900/40 rounded-xl overflow-x-auto">
            {activityHistory.map((act, i) => {
              let bg = 'bg-slate-800';
              if (act.minutesSpent >= 60) bg = 'bg-emerald-400 shadow-sm shadow-emerald-400/30';
              else if (act.minutesSpent >= 40) bg = 'bg-cyan-500';
              else if (act.minutesSpent >= 20) bg = 'bg-indigo-600';
              else if (act.minutesSpent > 0) bg = 'bg-indigo-900';

              return (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-sm ${bg} transition-all hover:scale-125 cursor-pointer`}
                  title={`${act.date}: ${act.minutesSpent} mins, ${act.lessonsCompleted} lessons`}
                />
              );
            })}
          </div>
          <div className="mt-3 text-xs text-slate-400 flex justify-between">
            <span>Past 30 Days</span>
            <span className="font-semibold text-emerald-400">🔥 7-Day Active Streak</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Chart 1: 30-Day Learning Activity (Line/Area) */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Learning Activity Trend (30 Days)
                </h3>
                <p className="text-[11px] text-slate-400">Minutes invested per day</p>
              </div>
              <span className="badge badge-indigo text-[10px]">Real-Time</span>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityHistory}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(str) => str.slice(5)} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                    labelFormatter={(val) => `Date: ${val}`}
                  />
                  <Area type="monotone" dataKey="minutesSpent" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMinutes)" name="Minutes" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Course Progress % (Bar Chart) */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Course Completion Progress (%)
                </h3>
                <p className="text-[11px] text-slate-400">Progress across enrolled subjects</p>
              </div>
              <span className="badge badge-cyan text-[10px]">Updated</span>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrolledCourses}>
                  <XAxis dataKey="title" stroke="#64748b" fontSize={9} tickFormatter={(t) => t.length > 14 ? t.slice(0, 14) + '...' : t} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Bar dataKey="progressPercent" fill="#06b6d4" radius={[8, 8, 0, 0]} name="Progress %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Category Breakdown */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-purple-400" />
                  Time Distribution by Category
                </h3>
                <p className="text-[11px] text-slate-400">Curriculum balance</p>
              </div>
            </div>

            <div className="w-full h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] mt-2">
              {categoryDistribution.map((cat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-300">{cat.name} ({cat.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 4: Radar Skill Strength */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  Multi-Domain Skill Strength (Radar)
                </h3>
                <p className="text-[11px] text-slate-400">Technical competency map</p>
              </div>
              <span className="badge badge-amber text-[10px]">Benchmark</span>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillRadar}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                  <Radar name="Strength" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Enrolled Courses */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Active Enrolled Courses
              </h2>
              <p className="text-xs text-slate-400">Continue learning and mark completed modules</p>
            </div>
            <a href="/courses" className="btn-secondary py-1.5 px-3.5 text-xs">
              Explore All Courses →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {enrolledCourses.map((c) => (
              <div key={c.id} className="glass-panel p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge badge-indigo text-[10px]">{c.department || c.category}</span>
                    <span className="text-[11px] text-slate-400 font-semibold">{c.estimatedHours} hrs</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">
                    {c.title}
                  </h3>
                  
                  <div className="my-3">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-cyan-400">{c.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <a
                  href={`/courses/${c.slug}`}
                  className="btn-primary w-full py-2 text-xs mt-3 font-semibold flex items-center justify-center gap-1.5"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Gamified Badges */}
        <div className="glass-panel p-6 mb-10">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Badges & Achievements
              </h2>
              <p className="text-xs text-slate-400">Maintain streaks and complete quizzes to unlock awards</p>
            </div>
            <span className="badge badge-amber text-xs">Level 3 Scholar</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  b.unlocked
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-slate-900/30 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2">{b.icon}</div>
                <div className="text-xs font-bold leading-tight">{b.name}</div>
                <div className="text-[10px] text-slate-400 mt-1">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Weekly Routine */}
        <div className="glass-panel p-6 mb-12">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                AI-Recommended Weekly Study Routine
              </h2>
              <p className="text-xs text-slate-400">Personalized schedule for {targetTrack} preparation</p>
            </div>
            <span className="badge badge-emerald text-xs">AI Generated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {weeklyStudyPlan.map((plan, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-white/10 bg-slate-900/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-indigo-400">{plan.day}</span>
                    <span className={`badge ${plan.status === 'Completed' ? 'badge-emerald' : plan.status === 'Today' ? 'badge-amber' : 'badge-indigo'} text-[9px]`}>
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-snug">
                    {plan.task}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold mt-3 pt-2 border-t border-white/5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Target: {plan.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer matching reference */}
        <div className="text-center pt-8 border-t border-white/5 text-xs text-slate-500">
          © 2026 EduCareer AI Platform • AI-Powered Personalized Learning & Mastery
        </div>

      </div>
    </ProtectedRoute>
  );
}
