'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, RefreshCw, Sparkles, ChevronLeft, ChevronRight, Phone } from 'lucide-react';

const MESSAGES = [
  {
    icon: Truck,
    text: 'Cash on Delivery Available All Over Pakistan',
    highlight: 'COD Available',
  },
  {
    icon: Sparkles,
    text: 'Free Shipping on All Orders Above Rs. 2,999',
    highlight: 'Free Delivery',
  },
  {
    icon: RefreshCw,
    text: 'Easy 7-Day Replacement & Hassle-Free Returns',
    highlight: '7-Day Return',
  },
  {
    icon: ShieldCheck,
    text: '100% Pure Combed Cotton • Hypoallergenic for Newborns',
    highlight: 'Pure Cotton',
  },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + MESSAGES.length) % MESSAGES.length);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
  };

  const current = MESSAGES[currentIndex];
  const Icon = current.icon;

  return (
    <aside
      aria-label="Store Announcements"
      className="bg-[#282524] text-white text-xs py-2 px-3 sm:px-6 border-b border-white/10 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left / Center: Rotating Announcement Slider */}
        <div className="flex items-center space-x-2 mx-auto sm:mx-0 overflow-hidden text-center sm:text-left">
          {/* Navigation Arrows */}
          <button
            onClick={prev}
            aria-label="Previous announcement"
            className="p-1 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Animated Message Display */}
          <div className="flex items-center space-x-2 min-w-[280px] sm:min-w-[420px] justify-center sm:justify-start">
            <Icon className="w-3.5 h-3.5 flex-shrink-0 text-coral-light animate-pulse" />
            <span
              key={currentIndex}
              className="font-medium tracking-wide text-white/95 text-[11px] sm:text-xs truncate transition-all duration-500 animate-fade-in"
            >
              {current.text}
            </span>
          </div>

          <button
            onClick={next}
            aria-label="Next announcement"
            className="p-1 text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right WhatsApp Support Link on Desktop */}
        <div className="hidden md:flex items-center space-x-4 text-white/90 flex-shrink-0">
          <a
            href="https://wa.me/923366895035"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center space-x-1.5 transition-colors font-medium text-xs text-white/80 hover:text-white"
          >
            <Phone className="w-3 h-3 text-[#25D366]" />
            <span>Order on WhatsApp: <strong>0336-6895035</strong></span>
          </a>
        </div>
      </div>
    </aside>
  );
}
