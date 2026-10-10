'use client';

import React from 'react';

/**
 * EduCareer AI Logo Component - Compact & Small Profile
 * Concept 1: Open Book with stylized uppercase 'E' and Dual Career Growth Arrows
 * Tagline: "Empowering Growth"
 *
 * Props:
 * - size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'sm')
 * - showText: boolean (default: true)
 * - showSubtitle: boolean (default: false, automatically true for 'lg' and 'xl')
 * - className: string (optional container classes)
 */
export default function Logo({
  size = 'sm',
  showText = true,
  showSubtitle,
  className = '',
}) {
  const reactId = React.useId();
  const safeId = reactId.replace(/[^a-zA-Z0-9]/g, '');
  const bookGradId = `educareer-book-${safeId}`;
  const arrowGradId = `educareer-arrow-${safeId}`;
  const glowGradId = `educareer-glow-${safeId}`;

  // Compact Dimension mapping
  const sizeMap = {
    xs: {
      box: 'w-6 h-6 rounded-md p-0.5',
      title: 'text-xs',
      sub: 'text-[6px] tracking-wider',
      gap: 'gap-1.5',
    },
    sm: {
      box: 'w-7 h-7 rounded-lg p-1',
      title: 'text-sm',
      sub: 'text-[7px] tracking-wider',
      gap: 'gap-2',
    },
    md: {
      box: 'w-8 h-8 rounded-lg p-1',
      title: 'text-base',
      sub: 'text-[7.5px] tracking-widest',
      gap: 'gap-2',
    },
    lg: {
      box: 'w-10 h-10 rounded-xl p-1.5',
      title: 'text-lg',
      sub: 'text-[8.5px] tracking-widest',
      gap: 'gap-2.5',
    },
    xl: {
      box: 'w-12 h-12 rounded-xl p-2',
      title: 'text-xl',
      sub: 'text-[9.5px] tracking-widest',
      gap: 'gap-3',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.sm;

  // Decide whether to show subtitle: if explicitly passed use that; otherwise only for lg or xl
  const shouldShowSubtitle =
    typeof showSubtitle === 'boolean'
      ? showSubtitle
      : size === 'lg' || size === 'xl';

  return (
    <div className={`flex items-center ${currentSize.gap} select-none group ${className}`}>
      {/* Logo Mark: Open Book + 'E' + Double Career Growth Arrows */}
      <div
        className={`${currentSize.box} flex items-center justify-center shrink-0 relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400/50`}
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(11, 15, 25, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 2px 10px -2px rgba(56, 189, 248, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
        title="EduCareer AI - Empowering Growth"
      >
        {/* Subtle Ambient Backlight */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #38bdf8 0%, transparent 70%)',
          }}
        />

        {/* Scalable High-Fidelity Vector Graphic */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          <defs>
            {/* Gradient for Book & 'E' outline */}
            <linearGradient id={bookGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="55%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            {/* Gradient for Career Growth Arrows */}
            <linearGradient id={arrowGradId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>

            {/* Subtle Inner Glow */}
            <filter id={glowGradId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="1" floodColor="#38bdf8" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 1. Outer Left Framing Bracket '[' */}
          <path
            d="M 15 24 L 11 24 L 11 72 L 15 72"
            stroke={`url(#${bookGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 2. Outer Right Framing Bracket ']' */}
          <path
            d="M 85 24 L 89 24 L 89 72 L 85 72"
            stroke={`url(#${bookGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3. Bottom Book Pages / Cover Curve */}
          <path
            d="M 15 77 C 28 84 40 85 50 80 C 60 85 72 84 85 77"
            stroke={`url(#${bookGradId})`}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 4. Open Book Main Page Silhouette */}
          <path
            d="M 50 28 C 40 21 28 20 18 22 L 18 71 C 28 69 40 71 50 78 C 60 71 72 69 82 71 L 82 22 C 72 20 60 21 50 28 Z"
            stroke={`url(#${bookGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 5. Center Spine Fold Line */}
          <line
            x1="50"
            y1="28"
            x2="50"
            y2="78"
            stroke={`url(#${bookGradId})`}
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* 6. Left Page: Stylized Uppercase "E" */}
          <path
            d="M 43 36 L 27 36 L 27 63 L 43 63"
            stroke={`url(#${bookGradId})`}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="27"
            y1="49.5"
            x2="39"
            y2="49.5"
            stroke={`url(#${bookGradId})`}
            strokeWidth="3.4"
            strokeLinecap="round"
          />

          {/* 7. Right Page: Lower Career Growth Arrow */}
          <path
            d="M 50 73 C 54 62 61 54 68 45"
            stroke={`url(#${arrowGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points="73,40 63,43 68,50"
            fill={`url(#${arrowGradId})`}
            filter={`url(#${glowGradId})`}
          />

          {/* 8. Right Page: Upper Career Growth Arrow */}
          <path
            d="M 59 45 C 64 38 69 31 75 22"
            stroke={`url(#${arrowGradId})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points="80,18 70,21 75,28"
            fill={`url(#${arrowGradId})`}
            filter={`url(#${glowGradId})`}
          />
        </svg>
      </div>

      {/* Typography: EDUCAREER AI (+ optional compact tagline) */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center leading-none">
            <span className={`font-black tracking-tight text-white ${currentSize.title}`}>
              EDUCAREER
            </span>
            <span className={`ml-1 font-extrabold bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent ${currentSize.title}`}>
              AI
            </span>
          </div>
          {shouldShowSubtitle && (
            <span
              className={`font-semibold uppercase text-slate-400 mt-0.5 leading-none ${currentSize.sub}`}
              style={{ letterSpacing: '0.16em' }}
            >
              Empowering Growth
            </span>
          )}
        </div>
      )}
    </div>
  );
}
