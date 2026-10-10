'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  GraduationCap,
  Building,
  Briefcase,
  Layers,
  Globe,
  Flame,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
} from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science (CSE)',
  'Information Technology (IT)',
  'AI & Machine Learning (AIML)',
  'Data Science (DS)',
  'Cyber Security',
  'Electronics & Communication (ECE)',
  'Electrical & Electronics (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Chemical Engineering',
  'Biotechnology',
  'Aerospace Engineering',
  'Automobile Engineering',
  'Mining Engineering',
  'Petroleum Engineering',
  'Agricultural Engineering',
  'Production & Industrial',
  'Instrumentation & Control',
  'Metallurgical Engineering',
  'Food Technology',
  'Textile Engineering',
];

const YEAR_SEMESTERS = [
  '1st Year / Semester 1 & 2',
  '2nd Year / Semester 3 & 4',
  '3rd Year / Semester 5 & 6',
  '4th Year / Semester 7 & 8',
  'Graduate / Looking for Placements',
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    department: 'Computer Science (CSE)',
    yearSemester: '3rd Year / Semester 5 & 6',
    careerGoal: 'IT',
    skillLevel: 'Beginner',
    preferredLanguage: 'English',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        department: user.department || 'Computer Science (CSE)',
        yearSemester: user.yearSemester || '3rd Year / Semester 5 & 6',
        careerGoal: user.careerGoal || 'IT',
        skillLevel: user.skillLevel || 'Beginner',
        preferredLanguage: user.preferredLanguage || 'English',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    const res = await updateProfile(formData);
    setSaving(false);

    if (res.success) {
      setSuccess('Profile updated successfully! Courses & roadmaps are recalibrated.');
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(res.error || 'Failed to update profile.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="app-container py-10">
        
        {/* Header Profile Banner */}
        <div className="glass-panel p-8 mb-8 relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 border border-indigo-500/25">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl shadow-indigo-500/25">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  {user?.name}
                  <span className="badge badge-indigo text-xs">{user?.department}</span>
                </h1>
                <p className="text-sm text-slate-300 mt-1">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="badge badge-cyan text-xs">Goal: {user?.careerGoal || 'IT'}</span>
                  <span className="badge badge-emerald text-xs">Level: {user?.skillLevel || 'Beginner'}</span>
                  <span className="badge badge-amber text-xs">Language: {user?.preferredLanguage || 'English'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Flame className="w-6 h-6 fill-amber-400" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-amber-400">{user?.streak || 1} Days</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Daily Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-6 sm:p-10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-color)]">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Edit Academic & Career Preferences
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Update your B.Tech branch, goal, and study language anytime.
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase">
                    College / University
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase">
                    B.Tech Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase">
                    Year / Semester
                  </label>
                  <select
                    name="yearSemester"
                    value={formData.yearSemester}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {YEAR_SEMESTERS.map((ys) => (
                      <option key={ys} value={ys}>
                        {ys}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase">
                    Career Goal
                  </label>
                  <select
                    name="careerGoal"
                    value={formData.careerGoal}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="IT">IT / Software / AI</option>
                    <option value="Non-IT">Non-IT / Core Engg</option>
                    <option value="GATE/PSU">GATE / PSU Exams</option>
                    <option value="Higher Studies">MS Abroad / MBA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase">
                    Skill Level
                  </label>
                  <select
                    name="skillLevel"
                    value={formData.skillLevel}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase">
                    Preferred Language
                  </label>
                  <select
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-3 px-6 text-xs font-bold"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Account Security & Password Card */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="glass-panel p-6 sm:p-8 bg-slate-900/60 border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Password & Account Security</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Need to change or update your student login password? Launch the secure password reset flow.
                  </p>
                </div>
                <a
                  href="/forgot-password"
                  className="btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-1.5 shrink-0 bg-slate-800/80 hover:bg-slate-800 border-white/10 text-slate-200 hover:text-white"
                >
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Change Password</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
