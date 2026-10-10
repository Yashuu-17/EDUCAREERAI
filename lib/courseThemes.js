import {
  Code2,
  BrainCircuit,
  Cpu,
  GraduationCap,
  Briefcase,
  BookOpen,
} from 'lucide-react';

export const CATEGORIES_WITH_THEMES = [
  {
    id: 'ALL',
    label: 'All Courses',
    icon: BookOpen,
    activeGradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30 border border-cyan-400/40',
    indicator: 'bg-indigo-400',
    accentColor: 'text-indigo-400',
    bannerPill: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
  },
  {
    id: 'PROGRAMMING_LANGUAGES',
    label: 'Programming Languages',
    icon: Code2,
    activeGradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/50',
    indicator: 'bg-emerald-400',
    accentColor: 'text-emerald-400',
    bannerPill: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  },
  {
    id: 'AI_DATA',
    label: 'AI & Data Domains',
    icon: BrainCircuit,
    activeGradient: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 border border-purple-400/50',
    indicator: 'bg-purple-400',
    accentColor: 'text-purple-400',
    bannerPill: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
  },
  {
    id: 'MATHEMATICS',
    label: 'Mathematics',
    icon: Cpu,
    activeGradient: 'bg-gradient-to-r from-rose-600 via-orange-600 to-amber-500 text-white shadow-lg shadow-rose-500/30 border border-rose-400/50',
    indicator: 'bg-rose-400',
    accentColor: 'text-rose-400',
    bannerPill: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
  },
  {
    id: 'BTECH_DEPARTMENTS',
    label: 'B.Tech Department Subjects',
    icon: GraduationCap,
    activeGradient: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/50',
    indicator: 'bg-cyan-400',
    accentColor: 'text-cyan-400',
    bannerPill: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
  },
  {
    id: 'CAREER_SOFT_SKILLS',
    label: 'Career & Soft Skills',
    icon: Briefcase,
    activeGradient: 'bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 text-white shadow-lg shadow-amber-500/30 border border-amber-400/50',
    indicator: 'bg-amber-400',
    accentColor: 'text-amber-400',
    bannerPill: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  },
];

/**
 * Maps a course to its custom theme colors
 */
export function getCourseTheme(course) {
  if (!course) {
    return {
      badgeBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
      accentText: 'text-indigo-400',
      borderTop: 'border-t-2 border-t-indigo-400',
      glow: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10',
      gradient: 'from-indigo-600 to-purple-600',
      bannerGradient: 'from-indigo-950/60 via-purple-950/40 to-slate-900/80 border-indigo-500/30',
      capstoneBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200',
      capstoneTitle: 'text-indigo-300',
      levelBadge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
      progressBar: 'from-indigo-500 to-cyan-400',
      buttonBg: 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400',
    };
  }

  // 1. Programming Languages - Tailored by specific language
  if (
    course.category === 'PROGRAMMING_LANGUAGES' ||
    course.domain === 'Programming' ||
    course.language
  ) {
    const lang = (course.language || '').toLowerCase();
    const title = (course.title || '').toLowerCase();

    // Python -> Vibrant Emerald & Teal
    if (lang.includes('python') || title.includes('python')) {
      return {
        badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
        accentText: 'text-emerald-400',
        borderTop: 'border-t-2 border-t-emerald-400',
        glow: 'hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/15',
        gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
        bannerGradient: 'from-emerald-950/70 via-teal-950/50 to-slate-900/90 border-emerald-500/40',
        capstoneBg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200',
        capstoneTitle: 'text-emerald-300',
        levelBadge: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
        progressBar: 'from-emerald-500 to-teal-400',
        buttonBg: 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400',
        themeName: 'Python Developer (Emerald/Teal)',
      };
    }

    // C++ -> Electric Blue & Indigo
    if (lang.includes('c++') || lang.includes('cpp') || title.includes('c++')) {
      return {
        badgeBg: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
        accentText: 'text-blue-400',
        borderTop: 'border-t-2 border-t-blue-400',
        glow: 'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/15',
        gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
        bannerGradient: 'from-blue-950/70 via-indigo-950/50 to-slate-900/90 border-blue-500/40',
        capstoneBg: 'bg-blue-500/10 border-blue-500/25 text-blue-200',
        capstoneTitle: 'text-blue-300',
        levelBadge: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
        progressBar: 'from-blue-500 to-indigo-400',
        buttonBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
        themeName: 'C++ Systems (Electric Blue)',
      };
    }

    // JavaScript & TypeScript -> Cyberpunk Amber & Gold
    if (
      lang.includes('javascript') ||
      lang.includes('typescript') ||
      title.includes('javascript') ||
      title.includes('typescript') ||
      lang.includes('js')
    ) {
      return {
        badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        accentText: 'text-amber-400',
        borderTop: 'border-t-2 border-t-amber-400',
        glow: 'hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/15',
        gradient: 'from-amber-600 via-orange-500 to-yellow-500',
        bannerGradient: 'from-amber-950/70 via-orange-950/50 to-slate-900/90 border-amber-500/40',
        capstoneBg: 'bg-amber-500/10 border-amber-500/25 text-amber-200',
        capstoneTitle: 'text-amber-300',
        levelBadge: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300',
        progressBar: 'from-amber-500 to-orange-400',
        buttonBg: 'bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400',
        themeName: 'JavaScript Web (Golden Amber)',
      };
    }

    // Java -> Fiery Orange & Coral
    if (lang.includes('java') || title.includes('java')) {
      return {
        badgeBg: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
        accentText: 'text-orange-400',
        borderTop: 'border-t-2 border-t-orange-400',
        glow: 'hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/15',
        gradient: 'from-orange-600 via-rose-600 to-red-500',
        bannerGradient: 'from-orange-950/70 via-rose-950/50 to-slate-900/90 border-orange-500/40',
        capstoneBg: 'bg-orange-500/10 border-orange-500/25 text-orange-200',
        capstoneTitle: 'text-orange-300',
        levelBadge: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
        progressBar: 'from-orange-500 to-rose-400',
        buttonBg: 'bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500',
        themeName: 'Java Enterprise (Fiery Orange)',
      };
    }

    // Other Programming Languages (Rust, Go, C, etc.) -> Neon Teal & Cyan
    return {
      badgeBg: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
      accentText: 'text-teal-400',
      borderTop: 'border-t-2 border-t-teal-400',
      glow: 'hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/15',
      gradient: 'from-teal-600 via-cyan-600 to-emerald-500',
      bannerGradient: 'from-teal-950/70 via-cyan-950/50 to-slate-900/90 border-teal-500/40',
      capstoneBg: 'bg-teal-500/10 border-teal-500/25 text-teal-200',
      capstoneTitle: 'text-teal-300',
      levelBadge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
      progressBar: 'from-teal-500 to-cyan-400',
      buttonBg: 'bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400',
      themeName: 'Programming (Neon Teal)',
    };
  }

  // 2. AI & Data Domains -> Radiant Violet & Fuchsia
  if (course.category === 'AI_DATA') {
    return {
      badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
      accentText: 'text-purple-400',
      borderTop: 'border-t-2 border-t-purple-400',
      glow: 'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/15',
      gradient: 'from-purple-600 via-fuchsia-600 to-pink-500',
      bannerGradient: 'from-purple-950/70 via-fuchsia-950/50 to-slate-900/90 border-purple-500/40',
      capstoneBg: 'bg-purple-500/10 border-purple-500/25 text-purple-200',
      capstoneTitle: 'text-purple-300',
      levelBadge: 'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300',
      progressBar: 'from-purple-500 to-fuchsia-400',
      buttonBg: 'bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400',
      themeName: 'AI & Data (Violet/Fuchsia)',
    };
  }

  // 3. Mathematics -> Sunset Crimson & Rose
  if (course.category === 'MATHEMATICS') {
    return {
      badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
      accentText: 'text-rose-400',
      borderTop: 'border-t-2 border-t-rose-400',
      glow: 'hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/15',
      gradient: 'from-rose-600 via-orange-600 to-amber-500',
      bannerGradient: 'from-rose-950/70 via-orange-950/50 to-slate-900/90 border-rose-500/40',
      capstoneBg: 'bg-rose-500/10 border-rose-500/25 text-rose-200',
      capstoneTitle: 'text-rose-300',
      levelBadge: 'bg-pink-500/15 border-pink-500/30 text-pink-300',
      progressBar: 'from-rose-500 to-amber-400',
      buttonBg: 'bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400',
      themeName: 'Mathematics (Crimson/Rose)',
    };
  }

  // 4. B.Tech Department Subjects -> Tech Cyan & Sky
  if (course.category === 'BTECH_DEPARTMENTS') {
    return {
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
      accentText: 'text-cyan-400',
      borderTop: 'border-t-2 border-t-cyan-400',
      glow: 'hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/15',
      gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
      bannerGradient: 'from-cyan-950/70 via-blue-950/50 to-slate-900/90 border-cyan-500/40',
      capstoneBg: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-200',
      capstoneTitle: 'text-cyan-300',
      levelBadge: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
      progressBar: 'from-cyan-500 to-blue-400',
      buttonBg: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500',
      themeName: 'Engineering Core (Tech Cyan)',
    };
  }

  // 5. Default / All Courses -> Royal Indigo & Cyan
  return {
    badgeBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
    accentText: 'text-indigo-400',
    borderTop: 'border-t-2 border-t-indigo-400',
    glow: 'hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/15',
    gradient: 'from-indigo-600 via-purple-600 to-cyan-500',
    bannerGradient: 'from-indigo-950/70 via-purple-950/50 to-slate-900/90 border-indigo-500/40',
    capstoneBg: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-200',
    capstoneTitle: 'text-indigo-300',
    levelBadge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    progressBar: 'from-indigo-500 to-cyan-400',
    buttonBg: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500',
    themeName: 'Master Curriculum (Royal Indigo)',
  };
}
