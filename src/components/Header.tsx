'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, Phone, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import SearchModal from './SearchModal';
import { useCart } from '@/context/CartContext';
import { formatPrice, getR2ImageUrl } from '@/lib/formatters';

const NAV_LINKS = [
  { name: 'All Products', href: '/products' },
  { name: 'Starter Sets', href: '/category/newborn-starter-sets' },
  { name: 'Rompers & Bodysuits', href: '/category/bodysuits-rompers' },
  { name: 'Dresses & Frocks', href: '/category/baby-dresses-frocks' },
  { name: 'Sweaters & Fleece', href: '/category/sweaters-winter-fleece' },
  { name: 'Caps & Booties', href: '/category/baby-caps-hats-socks' },
  { name: 'Tops & Bottoms', href: '/category/tops-bottoms' },
  { name: 'Machine Embroidery', href: '/category/machine-embroidery-customize' },
  { name: 'Printing Customize', href: '/category/printing-customize' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openDrawer } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live Auto-Suggestion Search State
  const [desktopQuery, setDesktopQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load search index
  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data) => setSearchIndex(data))
      .catch(() => {});
  }, []);

  // Filter suggestions
  useEffect(() => {
    if (!desktopQuery.trim()) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }

    const q = desktopQuery.toLowerCase().trim();
    const matches = searchIndex
      .filter((p) => p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q)))
      .slice(0, 5);

    setSuggestions(matches);
    setIsSuggestionsOpen(true);
  }, [desktopQuery, searchIndex]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleDesktopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desktopQuery.trim()) return;
    setIsSuggestionsOpen(false);
    router.push(`/search?q=${encodeURIComponent(desktopQuery.trim())}`);
  };

  // Lock body scroll on mobile drawer
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-charcoal-border/70 shadow-xs">
        <AnnouncementBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Left: Mobile Hamburger & Logo */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-charcoal hover:text-brand hover:bg-cream-100 rounded-xl transition-colors"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl overflow-hidden bg-cream-100 shadow-soft flex-shrink-0 border border-charcoal-border/60">
                  <Image
                    src="/logo.png"
                    alt="tinykids.pk"
                    fill
                    sizes="44px"
                    className="object-cover group-hover:scale-105 transition-transform"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl sm:text-2xl text-charcoal tracking-tight lowercase group-hover:text-brand transition-colors">
                    tinykids<span className="text-brand">.pk</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-charcoal-muted font-bold tracking-wider uppercase -mt-0.5">
                    Premium Kids Store
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Permanent Live Search Bar with Auto-Suggestions */}
            <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-md mx-4 relative">
              <form onSubmit={handleDesktopSearchSubmit} className="relative">
                <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={desktopQuery}
                  onChange={(e) => setDesktopQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setIsSuggestionsOpen(true);
                  }}
                  placeholder="Search baby clothes, rompers, starter sets..."
                  className="w-full pl-10 pr-10 py-2.5 bg-cream-50 hover:bg-white focus:bg-white rounded-2xl border border-charcoal-border/80 text-xs font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all shadow-inner-xs"
                />
                {desktopQuery && (
                  <button
                    type="button"
                    onClick={() => setDesktopQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Live Search Auto-Suggestions Dropdown */}
              {isSuggestionsOpen && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl border border-charcoal-border/80 shadow-2xl overflow-hidden z-50 divide-y divide-charcoal-border/40">
                  <div className="p-2.5 bg-cream-50 text-[11px] font-bold text-charcoal-muted flex items-center justify-between">
                    <span>Products found for &ldquo;{desktopQuery}&rdquo;</span>
                    <span className="text-brand font-extrabold">{suggestions.length} Results</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {suggestions.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={() => setIsSuggestionsOpen(false)}
                        className="flex items-center p-3 hover:bg-cream-50 transition-colors group"
                      >
                        <div className="relative w-11 h-11 rounded-xl bg-cream-100 overflow-hidden flex-shrink-0 border border-charcoal-border/60">
                          <Image
                            src={getR2ImageUrl(item.imageStem, '300w')}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-xs font-bold text-charcoal truncate group-hover:text-brand transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[11px] font-extrabold text-brand mt-0.5">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-charcoal-muted opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={`/search?q=${encodeURIComponent(desktopQuery)}`}
                    onClick={() => setIsSuggestionsOpen(false)}
                    className="block p-3 bg-brand-soft hover:bg-brand text-brand hover:text-white font-extrabold text-xs text-center transition-colors"
                  >
                    View all results for &ldquo;{desktopQuery}&rdquo; &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Right: Search (Mobile), WhatsApp Helpline, Cart Icon */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2.5 text-charcoal hover:text-brand hover:bg-cream-100 rounded-2xl transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Direct WhatsApp Helpline */}
              <a
                href="https://wa.me/923366895035"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-[#25D366] hover:bg-[#25D366]/10 rounded-2xl transition-colors flex items-center space-x-1.5"
                title="WhatsApp Order Helpline: 0336-6895035"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span className="hidden xl:inline text-xs font-bold text-charcoal">0336-6895035</span>
              </a>

              {/* Shopping Cart Button */}
              <button
                onClick={openDrawer}
                className="relative p-2.5 text-charcoal hover:text-brand hover:bg-cream-100 rounded-2xl transition-colors flex items-center space-x-2"
                aria-label={`Shopping bag with ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand text-white text-[11px] font-extrabold flex items-center justify-center shadow-card animate-scale-in">
                    {totalItems}
                  </span>
                )}
                <span className="hidden sm:inline text-xs font-bold text-charcoal">Bag</span>
              </button>
            </div>
          </div>

          {/* Desktop Category Navigation Menu Bar */}
          <nav className="hidden lg:flex items-center justify-center space-x-8 py-2.5 border-t border-charcoal-border/50 text-xs font-bold">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 relative ${
                    isActive ? 'text-brand font-extrabold' : 'text-charcoal-light hover:text-brand'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-[10000] flex flex-col justify-between p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-charcoal-border/60 pb-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2.5"
                >
                  <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-cream-100">
                    <Image src="/logo.png" alt="tinykids.pk" fill className="object-cover" />
                  </div>
                  <span className="font-extrabold text-lg text-charcoal lowercase">
                    tinykids<span className="text-brand">.pk</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-cream-100 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 text-sm font-bold text-charcoal">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-2xl hover:bg-cream-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/shipping"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-2xl hover:bg-cream-100 transition-colors text-charcoal-muted"
                >
                  Delivery & Shipping
                </Link>
                <Link
                  href="/returns"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-2xl hover:bg-cream-100 transition-colors text-charcoal-muted"
                >
                  7-Day Return Policy
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-2xl hover:bg-cream-100 transition-colors text-charcoal-muted"
                >
                  Contact Helpline
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-charcoal-border/60 space-y-3">
              <a
                href="https://wa.me/923366895035"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] text-white font-extrabold text-xs rounded-2xl shadow-xs flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>WhatsApp: 0336-6895035</span>
              </a>
              <p className="text-[11px] text-center text-charcoal-muted font-medium">
                Cash on Delivery Nationwide in Pakistan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}