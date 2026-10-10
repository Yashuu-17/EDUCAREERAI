import React from 'react';
import Logo from '@/components/Logo';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 py-12" style={{ backgroundColor: 'rgba(10, 13, 20, 0.95)' }}>
      <div className="app-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-1">
            <div className="mb-3">
              <Logo size="sm" showText={true} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Personalized Learning & Mastery. From B.Tech semester curriculum to top-tier software and core placement offers.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Curriculum Tracks
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400 list-none p-0">
              <li><a href="/courses" className="hover:text-indigo-400">All Course Domains</a></li>
              <li><a href="/roadmaps" className="hover:text-indigo-400">Interactive Career Roadmaps</a></li>
              <li><a href="/quizzes" className="hover:text-indigo-400">Interview & Quizzes</a></li>
              <li><a href="/ai-buddy" className="text-cyan-400 hover:text-cyan-300 font-semibold">Buddy AI Mentor 24/7</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Account & Security
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-slate-400 list-none p-0">
              <li><a href="/login" className="hover:text-indigo-400">Sign In / Log In</a></li>
              <li><a href="/register" className="hover:text-indigo-400">Sign Up / Register</a></li>
              <li><a href="/forgot-password" className="hover:text-indigo-400">Forget / Reset Password</a></li>
              <li><a href="/profile" className="hover:text-indigo-400">Student Profile</a></li>
              <li><a href="/resume-tools" className="hover:text-indigo-400">ATS Resume Suite</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Engineering Disciplines
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Artificial Intelligence', 'CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Data Science'].map(dept => (
                <span key={dept} className="badge badge-indigo text-[10px]">{dept}</span>
              ))}
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 EduCareer AI Platform • AI-Powered Personalized Learning & Mastery</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Engineered with Precision & Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
