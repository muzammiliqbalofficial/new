'use client';

import React from 'react';
import { Truck, Phone, Sparkles } from 'lucide-react';

interface Props {
  announcementText?: string;
  whatsappNumber?: string;
}

export default function AnnouncementBar({
  announcementText = 'Cash on Delivery Available Nationwide • Easy 7-Day Returns',
  whatsappNumber = '923000000000',
}: Props) {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <aside aria-label="Announcement" className="bg-brand text-white text-xs py-2 px-4 border-b border-brand-dark/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0 overflow-hidden text-center">
          <Truck className="w-3.5 h-3.5 flex-shrink-0 text-coral-light animate-pulse" />
          <span className="font-medium tracking-wide truncate">{announcementText}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-white/90">
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center space-x-1 transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>Order via WhatsApp</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
