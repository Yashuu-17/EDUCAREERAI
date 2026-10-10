'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';
import {
  Sparkles,
  BookOpen,
  GitFork,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Award,
  Layers,
  Code2,
  Cpu,
  GraduationCap,
  Briefcase,
  Bot,
  LogIn,
  LogOut,
  UserPlus,
  KeyRound,
  ShieldCheck,
  User,
  Check,
} from 'lucide-react';

export default function HomePage() {
  const { user, login, logout } = useAuth();
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState('');
  const [loadingDemo, setLoadingDemo] = useState(false);

  const displayName = user?.name || 'Alex Chen';
  const targetTrack = user?.department || 'Artificial Intelligence';
  const userLevel = user?.skillLevel || 'Intermediate';
  const userStreak = user?.streak || 7;

  const handleDemoLogin = async () => {
    setLoadingDemo(true);
    setFeedback('Authenticating demo account...');
    try {
      const res = await login('student@btech.edu', 'password123');
      if (res.success) {
        setFeedback('✓ Signed in as Alex Chen (student@btech.edu)');
        setTimeout(() => setFeedback(''), 3500);
      } else {
        setFeedback(res.error || 'Failed to authenticate demo account.');
      }
    } catch (e) {
      setFeedback('Error logging in.');
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleLogout = () => {
    logout();
    setFeedback('✓ Logged out successfully. You can sign in anytime.');
    setTimeout(() => setFeedback(''), 3500);
  };

  const features = [
    {
      title: 'Course Catalog (5 Categories)',
      desc: 'Master 30+ programming languages, complete AI & Machine Learning tracks, Engineering Maths, and semester-wise core subjects.',
      icon: BookOpen,
      href: '/courses',
      tag: '50+ Curricula',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Interactive Career Roadmaps',
      desc: 'Visual node flows for IT roles, Core Engineering branches (Mechanical, Civil, ECE, EEE), and competitive exam tracks.',
      icon: GitFork,
      href: '/roadmaps',
      tag: '40+ Roadmaps',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Interview & Quizzes',
      desc: '1,000+ technical interview questions with timed mock mode, instant answer explanations, and weak-topic analytics.',
      icon: CheckCircle2,
      href: '/quizzes',
      tag: 'Mock Mode',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'ATS Resume Maker & Analyser',
      desc: 'Step-by-step fresher resume builder with single-column templates and automated PDF scoring with keyword gap analysis.',
      icon: FileText,
      href: '/resume-tools',
      tag: 'ATS 100 Score',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Real-Time Learning Dashboard',
      desc: 'GitHub-style daily activity heatmap, Radar skill strength chart, and 30-day learning progress analytics.',
      icon: TrendingUp,
      href: '/dashboard',
      tag: 'Live Analytics',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Buddy AI Mentor',
      desc: 'Context-aware learning companion who knows your department, debugs code, explains concepts, and conducts mock interviews.',
      icon: Bot,
      href: '/ai-buddy',
      tag: '24/7 AI Guide',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  const departments = [
    'Artificial Intelligence', 'CSE', 'IT', 'Data Science', 'Cyber Security',
    'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology',
    'Aerospace'
  ];

  return (
    <div className="py-8 sm:py-14">
      <div className="app-container">

        {/* Feedback Alert Pill */}
        {feedback && (
          <div className="max-w-md mx-auto mb-6 p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-center text-xs font-bold text-indigo-300 animate-fadeIn">
            {feedback}
          </div>
        )}

        {/* =========================================================================
            HERO SECTION WITH COMPLETE AUTHENTICATION CONTROLS
            ========================================================================= */}
        <div className="max-w-4xl mx-auto mb-16 text-center">

          {user ? (
            /* Logged-In User Hero Header */
            <>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="text-indigo-400">{user.name || displayName}</span>!
              </h1>

              <div className="mt-3 text-xs sm:text-sm text-slate-400 font-medium flex flex-wrap items-center justify-center gap-2">
                <span>Target Track: <strong className="text-slate-200">{targetTrack}</strong></span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span>Level: <strong className="text-slate-200">{userLevel}</strong></span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  🔥 {userStreak} Days Streak
                </span>
              </div>
            </>
          ) : (
            /* Guest / Visitor Hero Header */
            <>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4 shadow-lg shadow-cyan-500/10">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="tracking-wide">EDUCAREER AI • EMPOWERING GROWTH</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Welcome to <span className="text-indigo-400">EduCareer AI</span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
                The AI-Powered Personalized Learning & Career Operating System for B.Tech Engineers. Master semester courses, track roadmaps, and land top placement offers.
              </p>
            </>
          )}

          {/* Central Authentication & Action Card */}
          <div className="mt-8 p-6 sm:p-10 rounded-2xl glass-panel relative border border-white/10 shadow-2xl bg-slate-900/60 max-w-2xl mx-auto">

            {user ? (
              /* State A: User is Authenticated */
              <div>
                {/* 4-point sparkle icon */}
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400 shadow-lg shadow-indigo-500/10">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Authentication Verified • JWT Active</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {user.email || 'student@btech.edu'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
                  Your student session is synchronized with real-time course completions, quiz scores, and daily streak tracking ({userStreak} days).
                </p>

                {/* 3 Main Platform Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                  <a
                    href="/courses"
                    className="btn-primary py-2.5 px-5 text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Browse Courses</span>
                  </a>

                  <a
                    href="/roadmaps"
                    className="btn-secondary py-2.5 px-5 text-xs font-semibold flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border-white/10 text-slate-200"
                  >
                    <GitFork className="w-4 h-4 text-slate-400" />
                    <span>View Roadmaps</span>
                  </a>

                  <a
                    href="/quizzes"
                    className="btn-secondary py-2.5 px-5 text-xs font-semibold flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border-white/10 text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                    <span>Practice Questions</span>
                  </a>

                  <a
                    href="/ai-buddy"
                    className="btn-secondary py-2.5 px-5 text-xs font-bold flex items-center gap-2 bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 hover:from-cyan-500/25 hover:to-indigo-500/25 border-cyan-500/30 text-cyan-300 shadow-md shadow-cyan-500/5"
                  >
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>Ask AI Buddy</span>
                  </a>
                </div>

                {/* Quick Account Actions Toolbar (Profile, Forgot Password, Switch Login, Logout) */}
                <div className="pt-5 border-t border-white/10">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Account & Session Management
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <a
                      href="/profile"
                      className="px-3 py-1.5 rounded-xl border border-white/10 bg-slate-800/60 hover:bg-white/5 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition-all"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Edit Profile</span>
                    </a>

                    <a
                      href="/forgot-password"
                      className="px-3 py-1.5 rounded-xl border border-white/10 bg-slate-800/60 hover:bg-white/5 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition-all"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Forget / Reset Password</span>
                    </a>

                    <a
                      href="/login"
                      className="px-3 py-1.5 rounded-xl border border-white/10 bg-slate-800/60 hover:bg-white/5 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold transition-all"
                    >
                      <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Switch Account (Sign In)</span>
                    </a>

                    <button
                      onClick={handleLogout}
                      className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 flex items-center gap-1.5 text-xs font-bold transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* State B: User is a Guest / Not Logged In */
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 text-indigo-400 shadow-lg shadow-indigo-500/10">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Student Portal Authentication
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
                  Sign in or create a student profile to save course progress, attempt timed technical interview quizzes, and track your daily streak.
                </p>

                {/* Primary Auth Buttons: Sign In / Log In + Sign Up / Register + 1-Click Demo */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
                  <a
                    href="/login"
                    className="btn-primary py-2.5 px-6 text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In / Log In</span>
                  </a>

                  <a
                    href="/register"
                    className="btn-secondary py-2.5 px-6 text-xs font-semibold flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border-white/10 text-white"
                  >
                    <UserPlus className="w-4 h-4 text-cyan-400" />
                    <span>Sign Up (Register)</span>
                  </a>

                  <button
                    onClick={handleDemoLogin}
                    disabled={loadingDemo}
                    className="py-2.5 px-5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{loadingDemo ? 'Authenticating...' : '1-Click Demo Sign In'}</span>
                  </button>
                </div>

                {/* Secondary Quick Links (Forgot Password & Guest Access) */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs">
                  <a
                    href="/forgot-password"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Forget Password?</span>
                  </a>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <a href="/courses" className="text-slate-400 hover:text-white transition-colors">
                    Browse Courses as Guest
                  </a>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <a href="/roadmaps" className="text-slate-400 hover:text-white transition-colors">
                    Explore Roadmaps
                  </a>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <a href="/ai-buddy" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Ask AI Buddy</span>
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* =========================================================================
            ACCOUNT & AUTHENTICATION QUICK ACCESS CENTER
            ========================================================================= */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-white/10 text-indigo-300 text-[11px] font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Authentication Gateway & Account Access</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Manage Your <span className="text-indigo-400">Student Account & Access</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            
            {/* 1. Sign In / Log In Card */}
            <div className="glass-panel p-5 bg-slate-900/50 border border-white/10 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
              <div>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3">
                  <LogIn className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Sign In / Log In
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Access your enrolled courses, resume tracking, and view live heatmap analytics.
                </p>
              </div>
              <a
                href="/login"
                className="btn-primary py-2 px-3 text-xs font-bold flex items-center justify-between"
              >
                <span>Log In Now</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* 2. Sign Up / Register Card */}
            <div className="glass-panel p-5 bg-slate-900/50 border border-white/10 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
              <div>
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Sign Up (New Student)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Register your B.Tech department, academic year, and career tracks for tailored curricula.
                </p>
              </div>
              <a
                href="/register"
                className="btn-secondary py-2 px-3 text-xs font-semibold flex items-center justify-between bg-slate-800/80 border-white/10 text-slate-200 hover:text-white"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* 3. Forget Password Card */}
            <div className="glass-panel p-5 bg-slate-900/50 border border-white/10 flex flex-col justify-between hover:border-amber-500/40 transition-all">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Forget Password?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Forgot your credentials? Request an instant secure reset link via your email.
                </p>
              </div>
              <a
                href="/forgot-password"
                className="btn-secondary py-2 px-3 text-xs font-semibold flex items-center justify-between bg-slate-800/80 border-white/10 text-slate-200 hover:text-white"
              >
                <span>Reset Password</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* 4. Active Session & Log Out Card */}
            <div className="glass-panel p-5 bg-slate-900/50 border border-white/10 flex flex-col justify-between hover:border-rose-500/40 transition-all">
              <div>
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3">
                  <LogOut className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Log Out & Session Security
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {user
                    ? `Currently signed in as ${user.name || 'Alex Chen'}. Terminate current session securely.`
                    : 'Manage active student session, clear stored credentials, or try 1-click demo login.'}
                </p>
              </div>
              <div className="space-y-2">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 px-3 rounded-xl border border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold flex items-center justify-between transition-all"
                  >
                    <span>Log Out Now</span>
                    <LogOut className="w-3 h-3" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleDemoLogin}
                      disabled={loadingDemo}
                      className="w-full py-2 px-3 rounded-xl border border-amber-500/30 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold flex items-center justify-between transition-all"
                    >
                      <span>{loadingDemo ? 'Signing in...' : '1-Click Demo Login'}</span>
                      <Sparkles className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full py-1.5 px-3 rounded-xl border border-white/5 bg-slate-800/40 hover:bg-rose-500/10 text-slate-400 hover:text-rose-300 text-[11px] font-semibold flex items-center justify-between transition-all"
                    >
                      <span>Clear Session / Log Out</span>
                      <LogOut className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            PLATFORM HIGHLIGHTS & DEPARTMENT TILES
            ========================================================================= */}

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl glass-panel border-white/10 mb-14 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">35+</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">Programming Languages</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">15+</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">B.Tech Departments</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">40+</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">Interactive Roadmaps</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">ATS Resume Score</div>
          </div>
        </div>

        {/* B.Tech Department Ribbon */}
        <div className="mb-14 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Covering Every Engineering Branch & Curriculum
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {departments.map((dept) => (
              <a
                key={dept}
                href={`/courses?dept=${encodeURIComponent(dept)}`}
                className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-slate-900/60 hover:border-indigo-400 text-xs font-semibold text-slate-300 hover:text-white transition-all"
              >
                {dept}
              </a>
            ))}
          </div>
        </div>

        {/* 6 Core Feature Cards */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineered for Your <span className="text-gradient-primary">Career Breakthrough</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              The complete ecosystem from B.Tech semester exams to tier-1 placement offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <a
                  key={idx}
                  href={feat.href}
                  className="glass-card-interactive p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="badge badge-indigo text-[10px]">{feat.tag}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-indigo-400">
                    <span>Explore module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
