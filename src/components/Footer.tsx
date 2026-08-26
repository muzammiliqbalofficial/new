'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck } from 'lucide-react';

const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-12 sm:pt-16 pb-8 border-t border-charcoal-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-white flex-shrink-0 shadow-sm">
                <Image src="/logo.png" alt="Tiny Kids Logo" fill className="object-cover" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">Tiny Kids™</span>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed max-w-sm">
              Pakistan’s trusted online baby clothing store. Crafting ultra-soft, 100% pure combed cotton
              newborn starter packs, rompers, frocks, and accessories with nationwide Cash on Delivery.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <a
                href="https://wa.me/923366895035"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold hover:bg-[#25D366]/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Helpline: +92 336 6895035</span>
              </a>
            </div>
          </div>

          {/* Baby Collections */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-coral mb-3">
              Baby Collections
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link href="/products" className="hover:text-white transition-colors font-bold text-brand-light">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/newborn-starter-sets" className="hover:text-white transition-colors">
                  Newborn Starter Sets & Packs
                </Link>
              </li>
              <li>
                <Link href="/category/bodysuits-rompers" className="hover:text-white transition-colors">
                  Bodysuits & Rompers
                </Link>
              </li>
              <li>
                <Link href="/category/baby-dresses-frocks" className="hover:text-white transition-colors">
                  Baby Girl Dresses & Frocks
                </Link>
              </li>
              <li>
                <Link href="/category/sweaters-winter-fleece" className="hover:text-white transition-colors">
                  Sweaters & Winter Fleece
                </Link>
              </li>
              <li>
                <Link href="/category/baby-caps-hats-socks" className="hover:text-white transition-colors">
                  Caps, Mittens & Booties
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-coral mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  7-Day Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Customer Care
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy & Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-coral mb-3">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-muted">
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-coral flex-shrink-0" />
                <span>+92 336 6895035</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-coral flex-shrink-0" />
                <span>info@tinykids.pk</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-coral flex-shrink-0 mt-0.5" />
                <span>Karachi, Pakistan — Delivering Nationwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Nationwide City Delivery SEO Tag Cloud */}
        <div className="pt-8 border-t border-charcoal-light/20 space-y-2">
          <span className="text-[11px] font-bold text-charcoal-muted block uppercase tracking-wider">
            Fast Cash on Delivery Across Pakistan:
          </span>
          <div className="flex flex-wrap gap-1.5 text-[11px] text-charcoal-muted/80">
            {CITIES.map((city, idx) => (
              <span key={city}>
                {city}
                {idx < CITIES.length - 1 && ' • '}
              </span>
            ))}
            <span> & 200+ towns nationwide.</span>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-6 border-t border-charcoal-light/20 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted gap-4">
          <p>© {new Date().getFullYear()} Tiny Kids Pakistan (tinykids.pk). All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-brand-light font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>Cash on Delivery</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Guaranteed Quality</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
