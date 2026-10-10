'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  BrainCircuit,
  GraduationCap,
  Briefcase,
  Play,
} from 'lucide-react';
import { CATEGORIES_WITH_THEMES, getCourseTheme } from '@/lib/courseThemes';

const CATEGORIES = CATEGORIES_WITH_THEMES;

const DEPARTMENTS = [
  'ALL',
  'CSE',
  'IT',
  'AI & ML',
  'Data Science',
  'Cyber Security',
  'ECE',
  'EEE',
  'Mechanical',
  'Civil',
  'Chemical',
  'Biotech',
  'Aerospace',
];

function CoursesContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'ALL');
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('dept') || 'ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'ALL') queryParams.set('category', selectedCategory);
      if (selectedDepartment !== 'ALL') queryParams.set('department', selectedDepartment);
      if (selectedLevel !== 'ALL') queryParams.set('level', selectedLevel);
      if (searchQuery) queryParams.set('search', searchQuery);

      const res = await fetch(`/api/courses?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Fetch courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedDepartment, selectedLevel, searchQuery]);

  const handleEnroll = async (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/courses/${slug}/enroll`, {
        method: 'POST',
      });
      if (res.ok) {
        // Refresh list
        fetchCourses();
      }
    } catch (err) {
      console.error('Enroll error:', err);
    }
  };

  return (
    <div className="app-container py-10">
      
      {/* Catalog Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-indigo-500/30 text-indigo-300 text-xs font-bold mb-4 shadow">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Curriculum & Placement Knowledge Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Comprehensive <span className="text-gradient-primary">Engineering Course Catalog</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          From 30+ programming languages to AI/Data disciplines and B.Tech semester-wise core branches.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel p-5 mb-8">
        
        {/* Search Input */}
        <div className="relative mb-5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, language (Python, C++), B.Tech branch, or keyword..."
            className="form-input pl-11 py-3 text-sm"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        </div>

        {/* 6 Category Tabs with Dedicated Themes */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? cat.activeGradient
                    : 'bg-slate-900/60 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : cat.accentColor}`} />
                <span>{cat.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Department & Level Sub-filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Department:</span>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="form-select py-1.5 px-3 text-xs w-auto"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.slice(1).map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-medium ml-2">
              <span>Level:</span>
            </div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="form-select py-1.5 px-3 text-xs w-auto"
            >
              <option value="ALL">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="text-xs font-semibold text-[var(--text-muted)]">
            Showing <span className="text-white font-bold">{courses.length}</span> curated courses
          </div>
        </div>

      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-xs text-[var(--text-secondary)]">Loading curriculum courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-panel p-12 text-center my-8">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">No courses found matching your filter</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Try resetting your search query or selecting "All Categories".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedDepartment('ALL');
              setSelectedLevel('ALL');
              setSearchQuery('');
            }}
            className="btn-secondary py-2 px-4 text-xs mt-4"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const modules = course.modules || [];
            let totalLessons = 0;
            modules.forEach(m => totalLessons += (m.lessons || []).length);
            const theme = getCourseTheme(course);

            return (
              <div
                key={course.id}
                className={`glass-card-interactive p-6 flex flex-col justify-between ${theme.borderTop} ${theme.glow} transition-all duration-300 relative group overflow-hidden`}
              >
                {/* Subtle Ambient Gradient Flare */}
                <div
                  className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${theme.gradient} opacity-5 group-hover:opacity-15 rounded-full blur-2xl pointer-events-none transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${theme.badgeBg}`}>
                      {course.department || course.language || course.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${theme.levelBadge}`}>
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-3.5 h-3.5 ${theme.accentText}`} />
                      <span>{course.estimatedHours} Hours</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{modules.length} Modules ({totalLessons} Lessons)</span>
                    </div>
                  </div>

                  {course.miniProject && (
                    <div className={`p-3 rounded-xl border text-[11px] mb-4 ${theme.capstoneBg}`}>
                      <span className={`font-bold ${theme.capstoneTitle}`}>Capstone: </span>
                      {course.miniProject}
                    </div>
                  )}

                  {/* If Enrolled, show Progress Bar */}
                  {course.isEnrolled && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-400">Enrolled Progress</span>
                        <span className="text-emerald-400 font-bold">{course.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${theme.progressBar} rounded-full transition-all duration-500`}
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
                  <a
                    href={`/courses/${course.slug}`}
                    className={`text-xs font-bold ${theme.accentText} hover:brightness-125 flex items-center gap-1 transition-all`}
                  >
                    <span>View Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  {course.isEnrolled ? (
                    <a
                      href={`/courses/${course.slug}`}
                      className={`btn-primary py-2 px-4 text-xs font-bold ${theme.buttonBg}`}
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Continue</span>
                    </a>
                  ) : (
                    <button
                      onClick={(e) => handleEnroll(e, course.slug)}
                      className="btn-secondary py-2 px-4 text-xs font-semibold hover:border-cyan-400 text-slate-200 hover:text-white"
                    >
                      <span>Enroll Free</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Courses...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
