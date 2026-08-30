'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappNumber = '923366895035';
  const defaultMsg = 'Assalam o Alaikum tinykids.pk!  I want to inquire about baby clothes and place an order.';
  const link = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:flex items-center group">
      {/* Tooltip on desktop */}
      <div className="hidden md:flex items-center mr-3 px-3.5 py-1.5 bg-charcoal text-white text-xs font-bold rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
        <span>Need help? Chat on WhatsApp</span>
      </div>

      {/* Button */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with tinykids.pk on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
      >
        {/* Pulse ripple */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 relative z-10 fill-current" />

        {/* Live badge */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white z-20">
          1
        </span>
      </a>
    </div>
  );
}
