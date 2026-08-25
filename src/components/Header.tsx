'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, Phone, Sparkles, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchModal from './SearchModal';
import { Category } from '@/lib/types';

interface Props {
  storeName?: string;
  whatsappNumber?: string;
  categories?: Category[];
}

export default function Header({
  storeName = 'Tiny Kids',
  whatsappNumber = '923000000000',
  categories = [],
}: Props) {
  const { totalItems, openDrawer } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-charcoal-border/70 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu & Search trigger */}
            <div className="flex items-center space-x-2 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-charcoal hover:text-brand transition-colors rounded-xl hover:bg-cream-100"
                aria-label="Open categories menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-charcoal hover:text-brand transition-colors rounded-xl hover:bg-cream-100"
                aria-label="Search store"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo / Store Name */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 shadow-sm">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-charcoal group-hover:text-brand transition-colors font-sans">
                    {storeName}
                  </span>
                  <span className="hidden sm:block text-[10px] text-charcoal-muted font-medium tracking-wider uppercase -mt-1">
                    Baby & Kids Essentials
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-cream-100/90 hover:bg-cream-200/90 text-charcoal-muted text-xs sm:text-sm rounded-2xl border border-charcoal-border/70 transition-all shadow-inner group"
              >
                <div className="flex items-center space-x-2.5">
                  <Search className="w-4 h-4 text-charcoal-muted group-hover:text-brand transition-colors" />
                  <span>Search starter sets, rompers, blankets...</span>
                </div>
                <kbd className="hidden xl:inline-block px-2 py-0.5 text-[10px] font-semibold text-charcoal-muted bg-white rounded-md border border-charcoal-border shadow-xs">
                  Ctrl K
                </kbd>
              </button>
            </div>

            {/* Right Actions: WhatsApp Helpline & Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-semibold transition-colors"
                title="Customer Support on WhatsApp"
              >
                <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Help: 0300-1234567</span>
              </a>

              <button
                onClick={openDrawer}
                aria-label={`Open shopping cart with ${totalItems} items`}
                className="relative inline-flex items-center p-2.5 sm:px-4 sm:py-2.5 bg-brand hover:bg-brand-dark text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-card hover:shadow-hover"
              >
                <ShoppingBag className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:static sm:ml-2 sm:-top-0 bg-coral text-white text-[11px] font-bold w-5 h-5 sm:w-auto sm:h-auto sm:px-1.5 sm:py-0.2 rounded-full flex items-center justify-center border-2 border-white sm:border-0 shadow-sm animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Category Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-charcoal-border flex items-center justify-between bg-cream-50">
              <span className="font-bold text-sm text-charcoal">Browse Categories</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-charcoal hover:bg-cream-100 rounded-xl"
              >
                Home
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-charcoal-light hover:text-brand hover:bg-cream-100 rounded-xl transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
