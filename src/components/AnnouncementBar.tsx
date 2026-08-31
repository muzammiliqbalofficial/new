'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Phone, ChevronLeft, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';

const ANNOUNCEMENTS = [
  {
    text: 'Free Delivery on orders over PKR 2,500 all over Pakistan',
    icon: Truck,
  },
  {
    text: 'Orders & Customer Helpline: +92 336 6895035 (9 AM - 10 PM)',
    icon: Phone,
  },
  {
    text: '100% Pure Combed Cotton • Safe for Newborn Skin',
    icon: Sparkles,
  },
  {
    text: 'Cash on Delivery (COD) Available Nationwide with 7-Day Exchange',
    icon: ShieldCheck,
  },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);

  const current = ANNOUNCEMENTS[currentIndex];
  const Icon = current.icon;

  return (
    <aside className="bg-charcoal text-white text-xs py-2 px-4 border-b border-charcoal-light/20 relative z-30 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left / Center Rotating Announcement */}
        <div className="flex items-center space-x-2 flex-1 justify-center sm:justify-start">
          <button
            onClick={prev}
            aria-label="Previous announcement"
            className="p-1 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center space-x-2 flex-1 min-w-0 max-w-full justify-center sm:justify-start">
            <Icon className="w-3.5 h-3.5 flex-shrink-0 text-coral-light animate-pulse" />
            <span
              key={currentIndex}
              className="font-semibold tracking-wide text-white text-[11px] sm:text-xs truncate transition-all duration-500 animate-fade-in"
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
            className="hover:text-white flex items-center space-x-1.5 transition-colors font-bold text-xs text-white/90 hover:text-white"
          >
            <Phone className="w-3 h-3 text-[#25D366]" />
            <span>Orders & Support: <strong>+92 336 6895035</strong></span>
          </a>
        </div>
      </div>
    </aside>
  );
}