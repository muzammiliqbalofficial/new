'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ShieldCheck, Truck } from 'lucide-react';

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
    <footer className="bg-charcoal text-white pt-14 pb-24 md:pb-12 border-t border-charcoal-light/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-charcoal-light/30">
          {/* Col 1 & 2: Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-white shadow-soft flex-shrink-0">
                <Image src="/logo.png" alt="tinykids.pk" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl text-white tracking-tight lowercase">
                  tinykids<span className="text-brand-light">.pk</span>
                </span>
                <span className="text-[10px] text-charcoal-muted font-bold tracking-wider uppercase mt-0.5">
                  Premium Kids Store
                </span>
              </div>
            </Link>

            <p className="text-xs text-charcoal-muted leading-relaxed max-w-sm">
              Pakistan&apos;s premier kids boutique specializing in pure combed cotton newborn gift packs,
              infant rompers, suits, and accessories. Dedicated to softness, comfort, and nationwide delivery.
            </p>

            <div className="space-y-2 pt-2 text-xs text-charcoal-muted">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-brand-light flex-shrink-0" />
                <a href="tel:+923366895035" className="hover:text-white transition-colors">
                  +92 336 6895035
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-brand-light flex-shrink-0" />
                <a href="mailto:info@tinykids.pk" className="hover:text-white transition-colors">
                  info@tinykids.pk
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-brand-light flex-shrink-0" />
                <span>Karachi, Pakistan — Delivering Nationwide</span>
              </div>
            </div>
          </div>

          {/* Col 3: Collections */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-white">Collections</span>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/newborn-starter-sets" className="hover:text-white transition-colors">
                  Starter Sets
                </Link>
              </li>
              <li>
                <Link href="/category/bodysuits-rompers" className="hover:text-white transition-colors">
                  Rompers &amp; Bodysuits
                </Link>
              </li>
              <li>
                <Link href="/category/baby-dresses-frocks" className="hover:text-white transition-colors">
                  Dresses &amp; Frocks
                </Link>
              </li>
              <li>
                <Link href="/category/sweaters-winter-fleece" className="hover:text-white transition-colors">
                  Sweaters &amp; Fleece
                </Link>
              </li>
              <li>
                <Link href="/category/baby-caps-hats-socks" className="hover:text-white transition-colors">
                  Caps &amp; Booties
                </Link>
              </li>
              <li>
                <Link href="/category/tops-bottoms" className="hover:text-white transition-colors">
                  Tops &amp; Bottoms
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-white">Customer Service</span>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Delivery & Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  7-Day Return Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About tinykids.pk
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Helpline
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Nationwide Coverage */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-white">Delivery Across Pakistan</span>
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              Fast Cash on Delivery across 200+ cities in Pakistan:
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {CITIES.slice(0, 10).map((city) => (
                <span
                  key={city}
                  className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-charcoal-muted border border-white/10"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <p>© {new Date().getFullYear()} tinykids.pk. All rights reserved.</p>
            <div className="flex items-center space-x-3 text-brand-light">
              <a href="https://facebook.com/tinykids.pk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-[11px] font-bold">Facebook</a>
              <span>•</span>
              <a href="https://instagram.com/tinykids.pk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-[11px] font-bold">Instagram</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-light" />
              <span>100% Pure Combed Cotton</span>
            </span>
            <span className="flex items-center space-x-1">
              <Truck className="w-3.5 h-3.5 text-brand-light" />
              <span>Cash on Delivery</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
