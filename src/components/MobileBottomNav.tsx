'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();

  // Hide on checkout page to prevent distractions
  if (pathname === '/checkout' || pathname === '/checkout/success') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-charcoal-border/80 md:hidden py-2 px-4 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-colors ${
            pathname === '/' ? 'text-brand font-extrabold' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-bold">Home</span>
        </Link>

        {/* Categories / All Products */}
        <Link
          href="/products"
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-colors ${
            pathname === '/products' || pathname.startsWith('/category')
              ? 'text-brand font-extrabold'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-bold">Categories</span>
        </Link>

        {/* WhatsApp Support */}
        <a
          href="https://wa.me/923366895035?text=Hello%20tinykids.pk,%20I%20need%20help%20with%20baby%20clothes%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center py-1 px-3 rounded-2xl text-[#25D366] hover:text-[#20bd5a] transition-colors"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] mt-1 font-bold text-charcoal">WhatsApp</span>
        </a>

        {/* Bag / Cart with Badge */}
        <button
          onClick={openDrawer}
          className="flex flex-col items-center py-1 px-3 rounded-2xl text-charcoal-muted hover:text-charcoal transition-colors relative"
          aria-label="Open Cart Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-brand text-white text-[9px] font-black flex items-center justify-center shadow-card">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-bold">Cart</span>
        </button>
      </div>
    </nav>
  );
}