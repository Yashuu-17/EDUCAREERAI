'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { BUDDY_THEMES, DEFAULT_BUDDY_THEME } from '@/lib/buddyThemes';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Bot,
  User,
  Flame,
  ChevronDown,
  Palette,
  Check,
} from 'lucide-react';

export default function BuddyChatbot() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
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

  // Listen for global open event (e.g. from navbar or hero buttons)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-buddy', handleOpen);
    return () => window.removeEventListener('open-ai-buddy', handleOpen);
  }, []);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting = user
        ? `Hey ${user.name}! 🌟 I'm Buddy, your AI mentor for ${user.department || 'B.Tech'} studies and career prep. You're on a ${user.streak || 1}-day streak 🔥! What are we conquering today?`
        : `Hey there! 🌟 I'm Buddy, your AI learning and career mentor at EduCareer AI. Sign in to personalize your track, or ask me anything about programming, engineering core subjects, roadmaps, or placements!`;

      setMessages([{ role: 'assistant', content: initialGreeting }]);
    }
  }, [user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    'Explain this topic',
    'Quiz me on my branch',
    'Suggest a career roadmap',
    'Improve my resume',
    'Start a mock interview',
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text.trim() };
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
        data.reply || "I'm right here! How else can I assist you with your learning goals?";

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

      // Speech output if enabled
      if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply.replace(/[*#_`]/g, ''));
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Oops, I encountered a brief issue. Let's try again!" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await fetch('/api/chat', { method: 'DELETE' });
    } catch (e) {}
    setMessages([
      {
        role: 'assistant',
        content: `Chat cleared! Ready for fresh questions, ${user?.name || 'friend'}! 🚀`,
      },
    ]);
  };

  const theme = BUDDY_THEMES[currentTheme] || BUDDY_THEMES[DEFAULT_BUDDY_THEME];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] select-none font-sans">
      
      {/* 1. Floating Launcher Button in Right Side Bottom Corner */}
      {!isOpen && (
        <div className="flex flex-col items-end gap-2 group">
          {/* Attention Badge Styled with Current Theme */}
          <div className={`bg-slate-900/95 border ${theme.badgeBorder} ${theme.badgeText} text-[11px] font-bold px-3 py-1 rounded-full shadow-xl flex items-center gap-1.5 animate-bounce select-none pointer-events-none`}>
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Buddy is here!</span>
          </div>

          {/* Glowing Avatar Button */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Buddy"
            className={`flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full bg-gradient-to-r ${theme.launcherBg} text-white shadow-2xl ${theme.launcherShadow} hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20`}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${theme.dot} border-2 border-slate-950 rounded-full animate-ping`} />
              <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${theme.dot} border-2 border-slate-950 rounded-full`} />
            </div>
            
            <div className="text-left flex flex-col">
              <span className="text-[10px] font-semibold text-white/90 leading-none">AI Mentor</span>
              <span className="text-xs font-black tracking-wide leading-tight flex items-center gap-1 text-white">
                Buddy
                <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} inline-block`} />
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 2. Floating Chat Modal in Right Side Bottom Corner */}
      {isOpen && (
        <div
          className={`w-[90vw] sm:w-[380px] h-[520px] max-h-[82vh] rounded-2xl glass-panel flex flex-col shadow-2xl border ${theme.modalBorder} overflow-hidden animate-fade-in relative`}
          style={{ background: 'rgba(11, 15, 25, 0.98)' }}
        >
          {/* Header */}
          <div className={`px-4 py-3 border-b border-white/10 bg-gradient-to-r ${theme.headerBg} flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${theme.avatarGradient} flex items-center justify-center text-white shadow-md ${theme.avatarGlow}`}>
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5 text-white">
                  Buddy AI Mentor
                  <span className="badge badge-emerald text-[8px] py-0 px-1.5">Online</span>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span>{user?.department ? `${user.department.slice(0, 16)}` : 'Career Guide'}</span>
                  {user?.streak && (
                    <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                      • <Flame className="w-2.5 h-2.5 inline" /> {user.streak}d
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 relative">
              {/* Theme Palette Switcher */}
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title={`Change Theme (Current: ${theme.name})`}
              >
                <Palette className={`w-3.5 h-3.5 ${theme.accentText}`} />
              </button>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-1.5 rounded-lg border text-[10px] transition-colors ${
                  voiceEnabled
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'border-white/10 text-slate-400 hover:text-white'
                }`}
                title={voiceEnabled ? 'Voice output enabled' : 'Enable voice speech'}
              >
                {voiceEnabled ? <Volume2 className={`w-3.5 h-3.5 ${theme.accentText}`} /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear Chat History"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close AI Buddy"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Theme Dropdown Menu */}
              {showThemePicker && (
                <div className="absolute right-0 top-9 w-44 bg-slate-900/95 border border-white/15 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-md animate-fadeIn">
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
          </div>

          {/* Quick-Prompt Suggestions Styled with Theme */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap border transition-all font-medium ${theme.promptPill}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
            {messages.map((m, i) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={i}
                  className={`flex gap-2 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${theme.avatarGradient} flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5`}>
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                      isAssistant
                        ? theme.assistantBubble
                        : `${theme.userBubble} rounded-tr-sm`
                    }`}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {m.content}
                  </div>

                  {!isAssistant && (
                    <div className="w-6 h-6 rounded-lg bg-slate-800 border border-white/20 flex items-center justify-center shrink-0 text-slate-300 mt-0.5">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 items-center">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${theme.avatarGradient} flex items-center justify-center text-white shrink-0`}>
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-slate-800/80 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.typingDot} animate-pulse`} />
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.typingDot} animate-pulse delay-75`} />
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.typingDot} animate-pulse delay-150`} />
                  <span className="ml-1">Buddy is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 border-t border-white/10 bg-slate-950/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask Buddy (${lang})...`}
              className={`flex-1 bg-slate-900 border border-white/15 ${theme.inputBorder} rounded-xl px-3 py-2 text-[11px] text-white placeholder-slate-500 outline-none transition-all`}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`p-2 rounded-xl ${theme.sendButton} text-white disabled:opacity-50 active:scale-95 transition-all shrink-0 shadow-md`}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
