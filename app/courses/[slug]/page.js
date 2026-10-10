'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  Youtube,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Award,
  Video,
  FileText,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getCourseTheme } from '@/lib/courseThemes';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
      }
    } catch (err) {
      console.error('Fetch course error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchCourse();
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }
    setEnrolling(true);
    try {
      const res = await fetch(`/api/courses/${slug}/enroll`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchCourse();
      }
    } catch (err) {
      console.error('Enroll error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleLessonComplete = async (lessonId, currentCompleted) => {
    if (!user) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }

    const nextState = !currentCompleted;

    // Optimistic UI update
    setCourse((prev) => {
      const completedList = prev.completedLessonIds || [];
      const updatedList = nextState
        ? [...completedList, lessonId]
        : completedList.filter((id) => id !== lessonId);

      return {
        ...prev,
        isEnrolled: true,
        completedLessonIds: updatedList,
      };
    });

    try {
      const res = await fetch(`/api/courses/${slug}/lessons/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: nextState }),
      });

      if (res.ok) {
        const data = await res.json();
        setCourse((prev) => ({
          ...prev,
          progressPercent: data.progressPercent,
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
      console.error('Toggle complete error:', err);
      fetchCourse(); // Rollback on error
    }
  };

  const markVideoWatched = async (lessonId) => {
    if (!user) return;
    try {
      await fetch(`/api/courses/${slug}/lessons/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isWatched: true }),
      });
      setCourse((prev) => ({
        ...prev,
        watchedLessonIds: [...(prev.watchedLessonIds || []), lessonId],
      }));
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-3" />
        <p className="text-xs text-[var(--text-secondary)]">Loading Syllabus & Curriculum Modules...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="app-container py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Course Not Found</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">The requested course slug does not exist.</p>
        <a href="/courses" className="btn-secondary py-2 px-4 text-xs mt-4 inline-flex">
          ← Back to Catalog
        </a>
      </div>
    );
  }

  const modules = course.modules || [];
  const completedIds = course.completedLessonIds || [];
  const watchedIds = course.watchedLessonIds || [];
  const theme = getCourseTheme(course);

  return (
    <div className="app-container py-10">
      
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <a
          href="/courses"
          className={`inline-flex items-center gap-1.5 text-xs ${theme.accentText} hover:brightness-125 font-semibold transition-all`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Courses</span>
        </a>
      </div>

      {/* Header Course Card with Dynamic Course Theme */}
      <div className={`glass-panel p-6 sm:p-10 mb-8 bg-gradient-to-r ${theme.bannerGradient} relative overflow-hidden shadow-2xl`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${theme.badgeBg}`}>
                {course.department || course.language || course.category}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${theme.levelBadge}`}>
                {course.level}
              </span>
              <span className="badge badge-emerald text-xs">{course.estimatedHours} Hours Estimated</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              {course.description}
            </p>

            {course.prerequisites && (
              <div className="mt-4 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Prerequisites:</span> {course.prerequisites}
              </div>
            )}
          </div>

          {/* Enrollment / Progress Actions */}
          <div className="w-full lg:w-80 shrink-0 bg-slate-900/80 p-5 rounded-2xl border border-white/10 shadow-lg">
            {course.isEnrolled ? (
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Your Progress</span>
                  <span className="text-emerald-400 font-extrabold">{course.progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full bg-gradient-to-r ${theme.progressBar} rounded-full transition-all duration-500`}
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Enrolled & Synchronized</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs text-slate-400 mb-3">
                  Enroll to track completed lessons, watched videos, and update your live dashboard.
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className={`btn-primary w-full py-3 text-xs font-bold ${theme.buttonBg}`}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll in Course (Free)'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Modules Syllabus + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Modules & Lessons Syllabus */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Syllabus & Modules
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-semibold">
              {modules.length} Modules
            </span>
          </div>

          {modules.map((mod, mIdx) => {
            const lessons = mod.lessons || [];
            const isExpanded = activeModuleIndex === mIdx;

            return (
              <div key={mIdx} className="glass-panel overflow-hidden">
                {/* Module Header Bar */}
                <button
                  onClick={() => setActiveModuleIndex(isExpanded ? -1 : mIdx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {mIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">{mod.title}</h3>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{lessons.length} lessons</div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-color)] divide-y divide-[var(--border-color)] bg-slate-900/20">
                    {lessons.map((lesson, lIdx) => {
                      const isCompleted = completedIds.includes(lesson.id);
                      const isWatched = watchedIds.includes(lesson.id);

                      // Generated dynamic search query for YouTube (safe from broken URLs)
                      const ytQuery = encodeURIComponent(`${course.title} ${lesson.title} tutorial`);
                      const ytUrl = `https://www.youtube.com/results?search_query=${ytQuery}`;

                      return (
                        <div
                          key={lesson.id || lIdx}
                          className="p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/20 transition-colors"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            {/* Complete Checkbox Button */}
                            <button
                              onClick={() => toggleLessonComplete(lesson.id, isCompleted)}
                              className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                              title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>

                            <div>
                              <div className={`text-xs font-semibold ${isCompleted ? 'line-through text-slate-400' : 'text-[var(--text-primary)]'}`}>
                                {lesson.title}
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lesson.durationMinutes || 30} mins
                                </span>
                                {isWatched && (
                                  <span className="badge badge-cyan text-[9px] py-0 px-1.5">
                                    Watched
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Learning External Links */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {/* Watch on YouTube button with dynamic search URL */}
                            <a
                              href={ytUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => markVideoWatched(lesson.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold transition-colors"
                              title="Watch free explanation on YouTube"
                            >
                              <Youtube className="w-3.5 h-3.5 text-red-400" />
                              <span>YouTube</span>
                            </a>

                            {/* Free Resource Docs Link */}
                            {lesson.freeResourceUrl && (
                              <a
                                href={lesson.freeResourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] hover:text-white text-slate-300 text-xs font-semibold transition-colors"
                                title="Open official documentation"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Docs</span>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Mini-Project & YouTube Learning Channels */}
        <div className="space-y-6">
          
          {/* Mini Project Capstone Box */}
          {course.miniProject && (
            <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
              <div className="flex items-center gap-2 mb-2 text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Capstone Mini Project</h3>
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2">
                {course.miniProject}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                Recommended to build and publish on GitHub. You can highlight this capstone directly in the platform Resume Maker!
              </p>
              <a
                href="/resume-maker"
                className="btn-outline w-full py-2 text-xs flex items-center justify-center gap-1.5"
              >
                <span>Add to Resume Maker →</span>
              </a>
            </div>
          )}

          {/* Recommended Channels Panel */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border-color)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-400" />
                Curated YouTube Masters
              </h3>
              <a href="/youtube-vault" className="text-[11px] text-indigo-400 hover:underline">
                View Vault
              </a>
            </div>

            <div className="space-y-3">
              {[
                { name: 'freeCodeCamp.org', lang: 'English', desc: 'Full-length 10-hour crash courses' },
                { name: 'Chai aur Code / CodeWithHarry', lang: 'Hindi', desc: 'Step-by-step beginner friendly' },
                { name: 'Gate Smashers / Neso Academy', lang: 'English/Hindi', desc: 'B.Tech Core branch syllabus' },
                { name: 'StatQuest with Josh Starmer', lang: 'English', desc: 'Intuitive AI/ML & Math concepts' },
              ].map((ch, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/40 border border-[var(--border-color)]">
                  <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                    <span>{ch.name}</span>
                    <span className="badge badge-indigo text-[9px] py-0 px-1.5">{ch.lang}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{ch.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
