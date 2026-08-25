import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export default function TrustBar() {
  const items = [
    {
      icon: Truck,
      title: 'Cash on Delivery',
      desc: 'Pay at your doorstep anywhere in Pakistan',
    },
    {
      icon: RotateCcw,
      title: 'Easy 7-Day Returns',
      desc: 'Hassle-free exchanges and money back',
    },
    {
      icon: ShieldCheck,
      title: 'Baby-Safe Quality',
      desc: '100% gentle, non-toxic organic cotton',
    },
    {
      icon: Headphones,
      title: 'WhatsApp Helpline',
      desc: 'Instant assistance for sizes & inquiries',
    },
  ];

  return (
    <section className="border-y border-charcoal-border/60 bg-cream-50/70 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center space-x-3 p-3 rounded-2xl bg-white/80 border border-charcoal-border/40 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal truncate">{item.title}</h4>
                  <p className="text-[11px] text-charcoal-muted truncate">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
