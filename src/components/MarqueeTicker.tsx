'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Sparkles, HeartHandshake, Phone } from 'lucide-react';

const ITEMS = [
  { icon: Truck, text: 'Cash on Delivery All Over Pakistan' },
  { icon: Sparkles, text: '100% Pure Combed Cotton' },
  { icon: RefreshCw, text: '7-Day Easy Replacement Guarantee' },
  { icon: ShieldCheck, text: 'Free Delivery on Orders Above Rs. 2,999' },
  { icon: HeartHandshake, text: 'Gentle & Hypoallergenic on Newborn Skin' },
  { icon: Phone, text: 'WhatsApp Support: +92 336 6895035' },
];

export default function MarqueeTicker() {
  return (
    <div
      aria-label="Highlights Ticker"
      className="relative overflow-hidden bg-brand text-white py-3 border-y border-brand-dark/30 shadow-xs select-none"
    >
      <div className="animate-marquee flex items-center space-x-10 text-xs font-extrabold uppercase tracking-wider">
        {/* Double array for seamless loop */}
        {[...ITEMS, ...ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2.5 flex-shrink-0">
              <Icon className="w-4 h-4 text-cream-200" />
              <span className="text-white/95">{item.text}</span>
              <span className="text-cream-300/40 text-sm ml-6">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
