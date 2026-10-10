'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Award,
  ArrowRight,
  BookOpen,
  Layers,
  ChevronRight,
  BarChart2,
  Play,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TOPICS = [
  { id: 'mock', name: '10-Question Mock Interview Mode', desc: 'Randomized high-yield technical and behavioral questions across all engineering domains', badge: 'Mock Mode', isMock: true },
  { id: 'Python', name: 'Python Programming', desc: 'Syntax, closures, OOP, GIL, and dynamic typing', badge: 'Language' },
  { id: 'C++ & DSA', name: 'C++ & Data Structures', desc: 'Pointers, trees, graphs, STL, and algorithmic complexity', badge: 'DSA' },
  { id: 'JavaScript', name: 'JavaScript & Web', desc: 'Event loop, promises, async execution, prototypes', badge: 'Web' },
  { id: 'Machine Learning', name: 'Machine Learning & AI', desc: 'Bias-variance, regularization, gradient descent, loss functions', badge: 'AI/Data' },
  { id: 'Deep Learning', name: 'Deep Learning & Transformers', desc: 'Backprop, self-attention mechanisms, CNN architectures', badge: 'AI/Data' },
  { id: 'Computer Science', name: 'CSE Core: OS & DBMS', desc: 'Deadlocks, B+ trees, scheduling, paging, ACID transactions', badge: 'B.Tech Core' },
  { id: 'Mechanical Engineering', name: 'Mechanical: Thermal & Cycles', desc: 'Laws of thermodynamics, Otto vs Diesel cycles, entropy', badge: 'B.Tech Core' },
  { id: 'ECE', name: 'ECE: Op-Amps & CMOS VLSI', desc: 'Virtual ground, MOSFET characteristics, CMOS inverter', badge: 'B.Tech Core' },
  { id: 'HR & Behavioral', name: 'HR Behavioral & STAR Method', desc: 'Elevator pitch, weakness framing, situational leadership', badge: 'Career/HR' },
];

function QuizzesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get('topic');

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState(null); // array of questions
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: option }
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('topics'); // 'topics' | 'history'

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Auto-start quiz if topic query param is passed (e.g. from Roadmaps)
  useEffect(() => {
    if (initialTopic) {
      startQuiz({ id: initialTopic, isMock: initialTopic === 'mock' });
    }
  }, [initialTopic]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/quizzes/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.attempts || []);
      }
    } catch (e) {
    } finally {
      setLoadingHistory(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!activeQuiz || quizSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeQuiz, quizSubmitted, timeLeft]);

  const startQuiz = async (topicObj) => {
    try {
      const q = topicObj.isMock ? '?mock=true' : `?topic=${encodeURIComponent(topicObj.id)}`;
      const res = await fetch(`/api/quizzes/questions${q}`);
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setActiveQuiz(data.questions);
          setCurrentIdx(0);
          setSelectedAnswers({});
          setTimeLeft(data.questions.length * 90); // 90 secs per question
          setQuizSubmitted(false);
          setEvaluationResult(null);
        }
      }
    } catch (err) {
      console.error('Start quiz error:', err);
    }
  };

  const handleSelectOption = (qId, option) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (quizSubmitted || !activeQuiz) return;
    setQuizSubmitted(true);

    try {
      const res = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeQuiz[0]?.topic || 'Technical Assessment',
          category: activeQuiz[0]?.category || 'GENERAL',
          answers: selectedAnswers,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setEvaluationResult(result);
        fetchHistory();

        if (result.percentage >= 80) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error('Submit quiz error:', err);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // If currently taking a quiz
  if (activeQuiz) {
    const currentQuestion = activeQuiz[currentIdx];
    const isAnswered = !!selectedAnswers[currentQuestion.id];
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
      <div className="app-container py-10 max-w-3xl mx-auto">
        
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {initialTopic ? `Assessment: ${initialTopic}` : 'Technical Assessment Mode'}
            </div>
            <h2 className="text-lg font-bold text-white">
              Question {currentIdx + 1} of {activeQuiz.length}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={() => {
                setActiveQuiz(null);
                if (initialTopic) {
                  window.history.replaceState({}, '', '/quizzes');
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-white"
            >
              Exit Quiz
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-panel p-6 sm:p-8 bg-slate-900/60 border border-white/10 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-indigo text-[10px]">{currentQuestion.topic}</span>
            <span className="badge badge-cyan text-[10px]">{currentQuestion.level}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed mb-6 whitespace-pre-wrap">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selectedAnswers[currentQuestion.id] === opt;
              return (
                <button
                  key={i}
                  disabled={quizSubmitted}
                  onClick={() => handleSelectOption(currentQuestion.id, opt)}
                  className={`w-full p-4 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                      : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation / Submit bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="btn-secondary py-2 px-4 text-xs font-semibold disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="text-xs text-slate-400">
            {answeredCount} of {activeQuiz.length} Answered
          </span>

          {currentIdx === activeQuiz.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={quizSubmitted || answeredCount === 0}
              className="btn-primary py-2 px-6 text-xs font-bold"
            >
              Submit Assessment
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx((i) => Math.min(activeQuiz.length - 1, i + 1))}
              className="btn-primary py-2 px-5 text-xs font-bold"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results Modal / Bottom Panel */}
        {quizSubmitted && evaluationResult && (
          <div className="mt-8 glass-panel p-6 sm:p-8 border border-indigo-500/30 bg-slate-900/80">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Assessment Complete!</h3>
              <div className="text-3xl font-extrabold text-indigo-400 mt-2">
                {evaluationResult.score} / {evaluationResult.totalQuestions} ({evaluationResult.percentage}%)
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {evaluationResult.percentage >= 80 ? '🎉 Excellent performance! Interview ready.' : 'Good effort! Review the weak areas below.'}
              </p>
            </div>

            {/* Weak Topics */}
            {evaluationResult.weakTopics.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <div className="font-bold text-amber-300 mb-1">Identified Weak Areas:</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {evaluationResult.weakTopics.map((topic, i) => (
                    <span key={i} className="badge badge-amber text-[10px]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Wrong Answers Review */}
            {evaluationResult.wrongAnswers.length > 0 && (
              <div className="space-y-4 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Review Explanations:
                </div>
                {evaluationResult.wrongAnswers.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 text-xs">
                    <div className="font-bold text-white mb-2">{item.question}</div>
                    <div className="text-rose-400 mb-1">Your answer: {item.yourAnswer}</div>
                    <div className="text-emerald-400 font-semibold mb-2">Correct answer: {item.correctAnswer}</div>
                    <div className="text-slate-400 p-2.5 rounded-lg bg-black/20 border border-white/5">
                      <strong>Explanation:</strong> {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setActiveQuiz(null)}
                className="btn-primary py-2.5 px-6 text-xs font-bold"
              >
                Done & Return to Topics
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // Topic selection & history view
  return (
    <div className="app-container py-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-white/10 text-indigo-300 text-xs font-bold mb-4 shadow">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Real-Time Interview Readiness</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Technical <span className="text-indigo-400">Interview & Quizzes Hub</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Timed mock interviews, coding output predictions, and department technical MCQs with instant explanations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'topics'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          Assessment Topics
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          My Assessment History ({history.length})
        </button>
      </div>

      {activeTab === 'topics' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              className={`glass-card-interactive p-6 flex flex-col justify-between ${
                topic.isMock ? 'border-indigo-500/50 bg-indigo-950/20' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge ${topic.isMock ? 'badge-amber' : 'badge-indigo'} text-[10px]`}>
                    {topic.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">10-15 Mins</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {topic.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {topic.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Timed & Scored</span>
                <button
                  onClick={() => startQuiz(topic)}
                  className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Start Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {loadingHistory ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <div className="text-sm font-bold text-white">No Quiz Attempts Yet</div>
              <p className="text-xs mt-1">Take your first technical assessment above to track scores and weak areas!</p>
            </div>
          ) : (
            history.map((att) => (
              <div key={att.id} className="glass-panel p-5 flex items-center justify-between bg-slate-900/60">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-indigo text-[10px]">{att.category}</span>
                    <span className="text-xs font-bold text-white">{att.topic}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Taken on {new Date(att.createdAt).toLocaleDateString()}
                  </div>
                  {(att.weakTopics || []).length > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-amber-400">
                      <span>Weak:</span>
                      {(att.weakTopics || []).map((w, i) => (
                        <span key={i} className="badge badge-amber text-[9px] py-0">{w}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-indigo-400">
                    {att.score} / {att.totalQuestions}
                  </div>
                  <div className={`text-xs font-bold ${att.percentage >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {att.percentage}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}

export default function QuizzesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Quizzes...</div>}>
      <QuizzesContent />
    </Suspense>
  );
}
