'use client';

import React from 'react';
import { Truck, Phone } from 'lucide-react';

interface Props {
  announcementText?: string;
  whatsappNumber?: string;
}

export default function AnnouncementBar({
  announcementText = 'Cash on Delivery Available Nationwide • Easy 7-Day Returns',
  whatsappNumber = '923366895035',
}: Props) {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <aside aria-label="Announcement" className="bg-[#282524] text-white text-xs py-2 px-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0 overflow-hidden text-center">
          <Truck className="w-3.5 h-3.5 flex-shrink-0 text-coral-light" />
          <span className="font-medium tracking-wide truncate">{announcementText}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-white/90">
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center space-x-1 transition-colors font-medium"
          >
            <Phone className="w-3 h-3" />
            <span>Order on WhatsApp: +92 336 6895035</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
