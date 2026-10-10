'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';
import {
  BookOpen,
  GitFork,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Flame,
  Sun,
  Moon,
  Globe,
  User,
  Bot,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: 'Courses', icon: BookOpen },
    { href: '/roadmaps', label: 'Roadmaps', icon: GitFork },
    { href: '/quizzes', label: 'Interview & Quizzes', icon: CheckCircle2 },
    { href: '/resume-tools', label: 'Resume Tools', icon: FileText },
    { href: '/ai-buddy', label: 'AI Buddy', icon: Bot, isSpecial: true },
  ];

  const languages = ['English', 'Hindi', 'Telugu'];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-md" style={{ backgroundColor: 'rgba(12, 15, 23, 0.9)' }}>
      <div className="app-container flex items-center justify-between" style={{ height: '68px' }}>
        
        {/* Brand Logo - EduCareer AI */}
        <a href="/">
          <Logo size="sm" showText={true} />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isResume = item.href === '/resume-tools';
            const isActive = isResume
              ? (pathname.startsWith('/resume') || pathname.startsWith('/resumes'))
              : (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));
            const isSpecial = item.isSpecial;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-white bg-indigo-600/30 border border-indigo-500/40 shadow-sm'
                    : isSpecial
                    ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 hover:text-white shadow-sm shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? 'text-indigo-400'
                      : isSpecial
                      ? 'text-cyan-400 animate-pulse'
                      : 'text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
                {isSpecial && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Theme, Lang, Streak, Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Language Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-28 rounded-xl glass-panel shadow-2xl py-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      changeLanguage(l);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium ${
                      lang === l ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-white/10 text-slate-400 hover:text-white bg-slate-900/60"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          {/* User Session */}
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Streak Badge matching reference: 🔥 7d */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{user.streak || 7}d</span>
              </div>

              {/* User Avatar with first name: [A] Alex */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-white/10 bg-slate-900/80 hover:border-indigo-500/40 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[80px] truncate">
                    {user.name ? user.name.split(' ')[0] : 'Alex'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-panel shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <div className="text-xs font-bold text-white truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="badge badge-indigo text-[9px]">{user.department || 'CSE'}</span>
                        <span className="badge badge-cyan text-[9px]">{user.careerGoal || 'IT'}</span>
                      </div>
                    </div>
                    <a
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </a>
                    <a
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </a>
                    <div className="border-t border-white/10 my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a href="/login" className="btn-secondary py-1.5 px-3 text-xs">
                Log In
              </a>
              <a href="/register" className="btn-primary py-1.5 px-3 text-xs">
                Sign Up
              </a>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-white/10 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 glass-panel border-t border-white/10 mx-3 mb-3">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
