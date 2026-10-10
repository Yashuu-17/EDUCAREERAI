'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import {
  User,
  Mail,
  Lock,
  Building,
  GraduationCap,
  Layers,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

const DEPARTMENTS = [
  'Artificial Intelligence (AI & ML)',
  'Computer Science (CSE)',
  'Information Technology (IT)',
  'Data Science (DS)',
  'Cyber Security',
  'Electronics & Communication (ECE)',
  'Electrical & Electronics (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Chemical Engineering',
  'Biotechnology',
  'Aerospace Engineering',
];

const YEAR_SEMESTERS = [
  '1st Year / Semester 1 & 2',
  '2nd Year / Semester 3 & 4',
  '3rd Year / Semester 5 & 6',
  '4th Year / Semester 7 & 8',
  'Graduate / Looking for Placements',
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    department: 'Artificial Intelligence (AI & ML)',
    yearSemester: '3rd Year / Semester 5 & 6',
    careerGoal: 'IT',
    skillLevel: 'Intermediate',
    preferredLanguage: 'English',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please provide your name, email, and password.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-[90vh] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo size="md" showText={false} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Create Your <span className="text-indigo-400">EduCareer AI Profile</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Empowering Growth • Personalize your engineering journey, curriculum roadmaps, and placement toolkit.
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-6 sm:p-10 relative bg-slate-900/60 border border-white/10">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Chen"
                    className="form-input pl-10"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  College / University
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. National Institute of Tech"
                    className="form-input pl-10"
                  />
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@college.edu"
                    className="form-input pl-10"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password * (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="form-input pl-10 pr-10"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded focus:outline-none"
                    title={showPassword ? 'Hide password' : 'View password'}
                    aria-label={showPassword ? 'Hide password' : 'View password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-indigo-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Target Track / Department *
                </label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-select pl-10"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Year / Semester *
                </label>
                <div className="relative">
                  <select
                    name="yearSemester"
                    value={formData.yearSemester}
                    onChange={handleChange}
                    className="form-select pl-10"
                  >
                    {YEAR_SEMESTERS.map((ys) => (
                      <option key={ys} value={ys}>
                        {ys}
                      </option>
                    ))}
                  </select>
                  <Layers className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
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
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm mt-4 font-bold shadow-lg"
            >
              {loading ? (
                <span>Configuring your profile...</span>
              ) : (
                <>
                  <span>Create Account & Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <a href="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
              Sign In
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
