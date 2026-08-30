'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, MessageCircle, HeartHandshake, Sparkles } from 'lucide-react';

const BADGES = [
  {
    icon: Sparkles,
    title: '100% Pure Cotton',
    description: 'Soft, breathable and pure cotton fabrics that are gentle on baby skin.',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    icon: Truck,
    title: 'Cash on Delivery',
    description: 'Pay cash at your doorstep in Karachi, Lahore, Islamabad & 200+ cities.',
    color: 'text-brand bg-brand-soft border-brand/30',
  },
  {
    icon: RefreshCw,
    title: '7 Days Easy Exchange',
    description: 'Simple size and design exchange within 7 days without any trouble.',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Order & Help',
    description: 'Direct help for baby sizes and orders on WhatsApp at 0336-6895035.',
    color: 'text-[#128C7E] bg-[#25D366]/10 border-[#25D366]/30',
  },
];

export default function TrustBadges() {
  return (
    <section className="py-10 bg-white border-y border-charcoal-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-extrabold tracking-wider text-brand block mb-1">
            Why Parents Choose <span className="lowercase font-black">tinykids.pk</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Soft, Safe & Affordable Baby Clothes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-cream-50/60 border border-charcoal-border/60 hover:border-brand/40 transition-all hover:shadow-soft flex flex-col items-start space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${badge.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-charcoal">{badge.title}</h3>
                  <p className="text-xs text-charcoal-muted mt-1 leading-relaxed font-medium">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
