'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Phone, Heart, Sparkles, Truck } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import SearchModal from './SearchModal';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { name: 'All Products', href: '/products',  },
  { name: 'Starter Sets', href: '/category/newborn-starter-sets' },
  { name: 'Rompers', href: '/category/bodysuits-rompers' },
  { name: 'Dresses', href: '/category/baby-dresses-frocks' },
  { name: 'Sweaters', href: '/category/sweaters-winter-fleece' },
  { name: 'Caps & Booties', href: '/category/baby-caps-hats-socks' },
];

export default function Header() {
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-charcoal-border/70 shadow-xs">
      {/* Top Bismillah Calligraphy Bar */}
      <div className="bg-cream-100 text-charcoal border-b border-charcoal-border/40 py-1.5 px-4 text-center">
        <span className="font-arabic text-sm sm:text-base font-bold tracking-wider select-none text-charcoal/90">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </span>
      </div>
      <AnnouncementBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-2xl text-charcoal hover:bg-cream-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Brand Logo & Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-white shadow-soft border border-charcoal-border/60 transition-transform group-hover:scale-105">
                <Image src="/logo.png" alt="Tiny Kids Pakistan Logo" fill className="object-cover" priority />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl sm:text-2xl text-charcoal tracking-tight leading-none lowercase group-hover:text-brand transition-colors">
    tinykids<span className="text-brand">.pk</span>
  </span>
                <span className="text-[10px] text-charcoal-muted font-bold tracking-wider uppercase mt-0.5">
                  Baby Clothes Pakistan
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'text-brand bg-brand-soft shadow-xs'
                      : 'text-charcoal-light hover:text-charcoal hover:bg-cream-100'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    
                    <span>{link.name}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-2xl text-charcoal-light hover:text-charcoal hover:bg-cream-100 transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Helpline on desktop */}
            <a
              href="https://wa.me/923366895035"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-charcoal text-xs font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#25D366]" />
              <span>0336-6895035</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={openDrawer}
              className="relative p-2.5 rounded-2xl bg-brand hover:bg-brand-dark text-white transition-all shadow-card hover:shadow-hover active:scale-95 flex items-center space-x-1.5"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-black">Bag</span>
              {totalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-coral text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between p-6">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-charcoal-border/60 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-white shadow-xs border border-charcoal-border/50">
                    <Image src="/logo.png" alt="Tiny Kids" fill className="object-cover" />
                  </div>
                  <span className="font-extrabold text-lg text-charcoal lowercase">tinykids.pk</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-cream-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-charcoal hover:bg-cream-100 transition-colors"
                  >
                    <span className="flex items-center space-x-2">
                      
                      <span>{link.name}</span>
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Bottom Helpline & COD info */}
            <div className="pt-4 border-t border-charcoal-border/60 space-y-3">
              <a
                href="https://wa.me/923366895035"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-2 shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp: +92 336 6895035</span>
              </a>
              <div className="text-[11px] text-charcoal-muted text-center flex items-center justify-center space-x-1.5 font-semibold">
                <Truck className="w-3.5 h-3.5 text-brand" />
                <span>Cash on Delivery Nationwide</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
