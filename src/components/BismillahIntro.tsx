'use client';

import React, { useState, useEffect } from 'react';

export default function BismillahIntro() {
  const [visible, setVisible] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    // Check if shown in current session
    try {
      const alreadyShown = sessionStorage.getItem('tk_bismillah_welcome');
      if (!alreadyShown) {
        setVisible(true);
        sessionStorage.setItem('tk_bismillah_welcome', 'true');

        // Start fade-out animation after 2.4s
        const timerOut = setTimeout(() => {
          setAnimatingOut(true);
        }, 2200);

        // Remove from DOM after transition completes
        const timerRemove = setTimeout(() => {
          setVisible(false);
        }, 3000);

        return () => {
          clearTimeout(timerOut);
          clearTimeout(timerRemove);
        };
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Welcome"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF7F2] transition-all duration-700 ease-in-out px-6 text-center select-none ${
        animatingOut ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="max-w-md w-full mx-auto space-y-6 animate-fade-in">
        {/* Subtle Decorative Arch / Accent */}
        <div className="w-12 h-1 bg-brand/30 mx-auto rounded-full" />

        {/* Arabic Calligraphy Typography */}
        <div className="py-2">
          <h1 className="font-arabic text-3xl sm:text-5xl text-charcoal font-bold leading-relaxed sm:leading-loose tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h1>
        </div>

        {/* English Translation (Exact match to reference photo) */}
        <div className="space-y-1 text-xs sm:text-sm text-charcoal-light font-medium tracking-wide">
          <p>In the name of Allah, the Most Gracious,</p>
          <p>the Most Merciful.</p>
        </div>

        {/* Tiny subtle store brand */}
        <div className="pt-4">
          <span className="text-[11px] text-charcoal-muted uppercase font-bold tracking-widest">
            tinykids.pk • Premium Kids Store
          </span>
        </div>

        {/* Quick Skip button */}
        <div className="pt-2">
          <button
            onClick={() => {
              setAnimatingOut(true);
              setTimeout(() => setVisible(false), 500);
            }}
            className="text-[11px] text-charcoal-muted/70 hover:text-charcoal transition-colors underline underline-offset-4"
          >
            Enter Store
          </button>
        </div>
      </div>
    </div>
  );
}
