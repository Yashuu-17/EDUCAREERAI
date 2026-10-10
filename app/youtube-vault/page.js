'use client';

import React, { useState } from 'react';
import {
  Youtube,
  Search,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
  CheckCircle2,
  Video,
} from 'lucide-react';

const CHANNELS = [
  // Programming & Software
  {
    name: 'freeCodeCamp.org',
    category: 'PROGRAMMING',
    language: 'English',
    subscribers: '10M+',
    desc: 'Exhaustive 10+ hour comprehensive zero-to-hero courses covering Python, Fullstack, C++, and Docker.',
    topics: ['Python', 'JavaScript', 'C++', 'SQL', 'Git'],
    url: 'https://www.youtube.com/@freecodecamp',
  },
  {
    name: 'Chai aur Code',
    category: 'PROGRAMMING',
    language: 'Hindi',
    subscribers: '650K+',
    desc: 'Hitesh Choudhary’s deep-dive practical series into JavaScript, React, Backend Architecture, and Python.',
    topics: ['JavaScript', 'React', 'Node.js', 'Python'],
    url: 'https://www.youtube.com/@chaiaurcode',
  },
  {
    name: 'CodeWithHarry',
    category: 'PROGRAMMING',
    language: 'Hindi',
    subscribers: '5.8M+',
    desc: 'Popular 100 Days of Code series for Python, Web Development, C, and Java with handwritten notes.',
    topics: ['Python', 'Web Dev', 'Java', 'C Language'],
    url: 'https://www.youtube.com/@CodeWithHarry',
  },
  {
    name: 'Traversy Media',
    category: 'PROGRAMMING',
    language: 'English',
    subscribers: '2.2M+',
    desc: 'Pragmatic project-based tutorials covering Next.js, TypeScript, TailwindCSS, and REST APIs.',
    topics: ['Next.js', 'TypeScript', 'TailwindCSS', 'APIs'],
    url: 'https://www.youtube.com/@TraversyMedia',
  },
  {
    name: 'Amulya Academy',
    category: 'PROGRAMMING',
    language: 'Telugu / English',
    subscribers: '350K+',
    desc: 'In-depth Python programming, Data Structures, and beginner algorithms with clear explanations.',
    topics: ['Python', 'Data Structures', 'Algorithms'],
    url: 'https://www.youtube.com/@AmulyaAcademy',
  },

  // DSA & Placements
  {
    name: 'Striver (take U forward)',
    category: 'DSA_PLACEMENTS',
    language: 'English',
    subscribers: '800K+',
    desc: 'The definitive A2Z DSA Sheet creator with step-by-step intuition, code walkthroughs, and LeetCode problem breakdowns.',
    topics: ['DSA', 'Dynamic Programming', 'Graphs', 'Trees'],
    url: 'https://www.youtube.com/@takeUforward',
  },
  {
    name: 'Love Babbar',
    category: 'DSA_PLACEMENTS',
    language: 'Hindi',
    subscribers: '1.2M+',
    desc: 'Structured C++ and DSA placement course with 450 DSA Sheet explanations and FAANG preparation tips.',
    topics: ['C++', 'DSA', 'System Design', 'Placements'],
    url: 'https://www.youtube.com/@LoveBabbar',
  },
  {
    name: 'NeetCode',
    category: 'DSA_PLACEMENTS',
    language: 'English',
    subscribers: '750K+',
    desc: 'Crisp, animated whiteboard explanations for NeetCode 150 and Blind 75 algorithmic patterns.',
    topics: ['Blind 75', 'Two Pointers', 'Binary Search', 'DP'],
    url: 'https://www.youtube.com/@NeetCode',
  },
  {
    name: 'Gate Smashers',
    category: 'BTECH_CORE',
    language: 'Hindi / English',
    subscribers: '1.8M+',
    desc: 'Varun Singla’s legendary lectures for B.Tech CSE semester exams and GATE in OS, DBMS, TOC, and CN.',
    topics: ['Operating Systems', 'DBMS', 'Computer Networks', 'TOC'],
    url: 'https://www.youtube.com/@GateSmashers',
  },
  {
    name: 'Neso Academy',
    category: 'BTECH_CORE',
    language: 'English',
    subscribers: '2.5M+',
    desc: 'Engineering syllabus lectures with animated diagrams for Digital Electronics, Signals, Microprocessors, and C.',
    topics: ['Digital Electronics', 'VLSI', 'Signals & Systems', 'Microprocessors'],
    url: 'https://www.youtube.com/@nesoacademy',
  },
  {
    name: 'Learn Engineering (Lesics)',
    category: 'BTECH_CORE',
    language: 'English',
    subscribers: '6.2M+',
    desc: '3D animated mechanical engineering and automotive design breakdowns (IC Engines, Turbines, Gears).',
    topics: ['Thermodynamics', 'Fluid Mechanics', 'Automotive', 'EVs'],
    url: 'https://www.youtube.com/@Lesics',
  },

  // AI & Mathematics
  {
    name: '3Blue1Brown',
    category: 'AI_MATH',
    language: 'English',
    subscribers: '6.5M+',
    desc: 'Grant Sanderson’s visual animations for Linear Algebra, Calculus, Neural Networks, and Probability.',
    topics: ['Linear Algebra', 'Calculus', 'Neural Networks', 'Fourier'],
    url: 'https://www.youtube.com/@3blue1brown',
  },
  {
    name: 'StatQuest with Josh Starmer',
    category: 'AI_MATH',
    language: 'English',
    subscribers: '1.1M+',
    desc: 'BAM! Crystal-clear intuitions for Machine Learning, PCA, Random Forests, Transformers, and Statistics.',
    topics: ['Machine Learning', 'Statistics', 'PCA', 'Transformers'],
    url: 'https://www.youtube.com/@statquest',
  },
  {
    name: 'DeepLearning.AI',
    category: 'AI_MATH',
    language: 'English',
    subscribers: '300K+',
    desc: 'Andrew Ng’s official channel for modern Generative AI, Prompt Engineering, LangChain, and RAG.',
    topics: ['Deep Learning', 'Generative AI', 'LLMs', 'Prompt Engineering'],
    url: 'https://www.youtube.com/@Deeplearningai',
  },
];

export default function YoutubeVaultPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = CHANNELS.filter((ch) => {
    if (selectedCategory !== 'ALL' && ch.category !== selectedCategory) return false;
    if (selectedLanguage !== 'ALL' && !ch.language.includes(selectedLanguage)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ch.name.toLowerCase().includes(q) ||
        ch.desc.toLowerCase().includes(q) ||
        ch.topics.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="app-container py-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-white/10 text-red-400 text-xs font-bold mb-4 shadow">
          <Youtube className="w-4 h-4 fill-red-400 text-red-400" />
          <span>Curated Free Educational Creators</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Engineering <span className="text-red-400">YouTube Learning Vault</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Verified YouTube masters teaching full-length courses across B.Tech departments, programming languages, and placements.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-5 mb-8 bg-slate-900/60 border border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
            {[
              { id: 'ALL', label: 'All Channels' },
              { id: 'PROGRAMMING', label: 'Programming & Web' },
              { id: 'DSA_PLACEMENTS', label: 'DSA & FAANG' },
              { id: 'AI_MATH', label: 'AI/ML & Mathematics' },
              { id: 'BTECH_CORE', label: 'B.Tech Core Branches' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Language Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="form-select text-xs py-1.5 w-28 shrink-0"
            >
              <option value="ALL">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Telugu">Telugu</option>
            </select>

            <div className="relative w-full md:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search channels & topics..."
                className="form-input pl-8 py-1.5 text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChannels.map((ch, idx) => (
          <div
            key={idx}
            className="glass-card-interactive p-6 flex flex-col justify-between border-white/10 bg-slate-900/50"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-500 fill-red-500" />
                  <span className="text-[11px] font-bold text-slate-400">{ch.subscribers}</span>
                </div>
                <span className="badge badge-indigo text-[10px]">{ch.language}</span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                {ch.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {ch.desc}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {ch.topics.map((t, tIdx) => (
                  <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Free Access</span>
              <a
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary py-1.5 px-3 text-xs font-semibold flex items-center gap-1.5 text-red-400 border-red-500/20 hover:border-red-500/40"
              >
                <span>Visit Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
