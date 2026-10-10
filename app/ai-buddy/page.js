'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BUDDY_THEMES, DEFAULT_BUDDY_THEME } from '@/lib/buddyThemes';
import {
  Bot,
  User,
  Send,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  BookOpen,
  GitFork,
  CheckCircle2,
  FileText,
  Lightbulb,
  Copy,
  Check,
  ArrowRight,
  Palette,
} from 'lucide-react';

export default function AiBuddyPage() {
  const { user } = useAuth();
  const { lang, setLang } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_BUDDY_THEME);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize theme from storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('buddy-theme');
      if (saved && BUDDY_THEMES[saved]) setCurrentTheme(saved);
    }
  }, []);

  // Listen for global theme synchronization
  useEffect(() => {
    const onThemeChanged = (e) => {
      if (e.detail && BUDDY_THEMES[e.detail]) {
        setCurrentTheme(e.detail);
      }
    };
    window.addEventListener('buddy-theme-changed', onThemeChanged);
    return () => window.removeEventListener('buddy-theme-changed', onThemeChanged);
  }, []);

  const handleSelectTheme = (tid) => {
    setCurrentTheme(tid);
    if (typeof window !== 'undefined') {
      localStorage.setItem('buddy-theme', tid);
      window.dispatchEvent(new CustomEvent('buddy-theme-changed', { detail: tid }));
    }
    setShowThemePicker(false);
  };

  // Load initial welcome or fetch previous chat
  useEffect(() => {
    async function loadChat() {
      try {
        const res = await fetch('/api/chat');
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(
            data.messages.map((m) => ({
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
            }))
          );
          return;
        }
      } catch (e) {
        // Fallback to welcome message
      }

      const greeting = user
        ? `Hello ${user.name}! 🌟 I'm Buddy, your dedicated AI Mentor for ${user.department || 'B.Tech Engineering'} studies, career roadmaps, and placement preparation. You're on a ${user.streak || 1}-day learning streak 🔥! How can I empower your growth today?`
        : `Hello! 🌟 I'm Buddy, your 24/7 AI learning and career mentor at EduCareer AI. Ask me anything about programming languages, engineering branch subjects, semester exams, career roadmaps, or placement interview prep!`;

      setMessages([{ role: 'assistant', content: greeting }]);
    }

    loadChat();
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    {
      icon: Lightbulb,
      title: 'Explain Concepts',
      prompt: 'Explain Dijkstra algorithm and its time complexity in simple terms with an engineering example.',
    },
    {
      icon: GitFork,
      title: 'Career Roadmap',
      prompt: `Suggest a personalized 6-month career roadmap for a ${user?.department || 'CSE'} student targeting top tech placement offers.`,
    },
    {
      icon: CheckCircle2,
      title: 'Mock Interview',
      prompt: 'Ask me 3 technical interview questions for a Junior Software Engineer position, one at a time.',
    },
    {
      icon: FileText,
      title: 'ATS Resume Review',
      prompt: 'What are the top 5 high-impact ATS action verbs and keywords I should include in my engineering resume projects?',
    },
    {
      icon: BookOpen,
      title: 'Semester Study Plan',
      prompt: 'Give me a week-by-week study plan to master Data Structures and Algorithms alongside semester exams.',
    },
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text.trim(), createdAt: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          language: lang,
        }),
      });

      const data = await res.json();
      const reply =
        data.reply ||
        "I'm here to support your learning journey! What other questions or topics would you like to explore?";

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply, createdAt: new Date() },
      ]);

      // Voice readout if enabled
      if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply.replace(/[*#_`]/g, ''));
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oops, I encountered a brief network glitch. Please try asking again!',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    if (confirm('Are you sure you want to clear your chat history with Buddy?')) {
      try {
        await fetch('/api/chat', { method: 'DELETE' });
      } catch (e) {}

      setMessages([
        {
          role: 'assistant',
          content: `Chat history cleared! Fresh slate ready. What are we tackling next, ${user?.name || 'friend'}? 🚀`,
          createdAt: new Date(),
        },
      ]);
    }
  };

  const handleCopy = (content, idx) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const theme = BUDDY_THEMES[currentTheme] || BUDDY_THEMES[DEFAULT_BUDDY_THEME];

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Header Banner with Dynamic Theme */}
        <div className={`glass-panel p-6 sm:p-8 mb-6 relative overflow-hidden border ${theme.modalBorder} bg-gradient-to-r ${theme.bannerGradient} shadow-2xl transition-all duration-300`}>
          <div className={`absolute top-0 right-0 w-96 h-96 ${theme.bannerGlow} rounded-full blur-3xl pointer-events-none`} />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.avatarGradient} flex items-center justify-center text-white shadow-xl ${theme.avatarGlow} border border-white/20`}>
                  <Bot className="w-8 h-8" />
                </div>
                <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 ${theme.dot} border-2 border-slate-900 rounded-full animate-ping`} />
                <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 ${theme.dot} border-2 border-slate-900 rounded-full`} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    Buddy <span className={theme.accentText}>AI Mentor</span>
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                    Online 24/7
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Empowering Growth • Personalized study companion, code debugger, roadmap advisor & placement coach.
                </p>
              </div>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-2 flex-wrap relative">
              {user && (
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user.streak || 1}d Streak</span>
                </div>
              )}

              {/* Theme Palette Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowThemePicker(!showThemePicker)}
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-md"
                  title={`Change Theme (Current: ${theme.name})`}
                >
                  <Palette className={`w-3.5 h-3.5 ${theme.accentText}`} />
                  <span>{theme.name}</span>
                </button>

                {showThemePicker && (
                  <div className="absolute right-0 top-10 w-44 bg-slate-900/95 border border-white/15 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-md animate-fadeIn">
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Select Theme
                    </div>
                    {Object.values(BUDDY_THEMES).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelectTheme(t.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          currentTheme === t.id
                            ? 'bg-white/10 text-white'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${t.dot}`} />
                          <span>{t.name}</span>
                        </div>
                        {currentTheme === t.id && <Check className="w-3 h-3 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  voiceEnabled
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
                }`}
                title={voiceEnabled ? 'Disable Voice Speech' : 'Enable Voice Speech Output'}
              >
                {voiceEnabled ? <Volume2 className={`w-3.5 h-3.5 ${theme.accentText}`} /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
              </button>

              <button
                onClick={handleClearChat}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-xs font-semibold text-slate-400 hover:text-rose-300 transition-all flex items-center gap-1.5"
                title="Clear Chat History"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Recommended Mentor Topics</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {quickPrompts.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className={`p-3 rounded-xl glass-panel bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 ${theme.badgeBorder} text-left transition-all duration-200 flex items-start gap-2.5 group`}
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${theme.avatarGradient} flex items-center justify-center shrink-0 text-white shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold text-white group-hover:${theme.accentText} transition-colors`}>
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.prompt}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Studio Container */}
        <div className={`glass-panel rounded-2xl border ${theme.modalBorder} bg-slate-900/70 overflow-hidden flex flex-col h-[560px] shadow-2xl transition-all duration-300`}>
          
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${theme.avatarGradient} flex items-center justify-center text-white shrink-0 shadow-md ${theme.avatarGlow}`}>
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                      isUser
                        ? `${theme.userBubble} rounded-br-none shadow-lg`
                        : `${theme.assistantBubble} rounded-bl-none shadow-md`
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {!isUser && (
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Buddy • EduCareer AI ({theme.name})</span>
                        <button
                          onClick={() => handleCopy(msg.content, idx)}
                          className="hover:text-white flex items-center gap-1 transition-colors"
                          title="Copy message"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/20 text-slate-200 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing status */}
            {isTyping && (
              <div className="flex gap-3 items-center">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${theme.avatarGradient} flex items-center justify-center text-white shrink-0`}>
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-3 text-xs text-slate-400 flex items-center gap-2">
                  <span>Buddy is formulating a response</span>
                  <span className="flex gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.typingDot} animate-bounce`} style={{ animationDelay: '0ms' }} />
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.typingDot} animate-bounce`} style={{ animationDelay: '150ms' }} />
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.typingDot} animate-bounce`} style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer Composer */}
          <div className="p-4 border-t border-white/10 bg-slate-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2.5"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Buddy anything about engineering, coding, roadmaps, or placement..."
                className={`flex-1 bg-slate-900/90 border border-white/15 ${theme.inputBorder} rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner`}
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className={`btn-primary py-3 px-5 text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-lg ${theme.sendButton}`}
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 text-[10px] text-slate-500 text-center flex items-center justify-center gap-3">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Context tailored to {user?.department || 'Engineering'}</span>
              <span>•</span>
              <span>Language: {lang}</span>
              <span>•</span>
              <span className={theme.accentText}>Theme: {theme.name}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
