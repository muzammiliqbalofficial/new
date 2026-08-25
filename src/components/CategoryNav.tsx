'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  currentSlug?: string;
}

export default function CategoryNav({ categories, currentSlug }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="bg-cream-50/90 border-b border-charcoal-border/50 sticky top-16 sm:top-20 z-30 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-2 z-10 p-1.5 rounded-full bg-white/90 shadow-md border border-charcoal-border/60 text-charcoal hover:bg-cream-100 transition-all items-center justify-center -translate-x-2"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Horizontal Track */}
        <div
          ref={scrollRef}
          className="flex items-center space-x-2 overflow-x-auto py-2.5 scrollbar-none no-scrollbar scroll-smooth w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <Link
            href="/"
            className={`flex-shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !currentSlug
                ? 'bg-brand text-white shadow-xs'
                : 'bg-white text-charcoal-light hover:text-charcoal hover:bg-cream-200/80 border border-charcoal-border/50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All</span>
          </Link>

          {categories.map((cat) => {
            const isActive = currentSlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand text-white font-semibold shadow-xs'
                    : 'bg-white text-charcoal-light hover:text-brand hover:bg-cream-200/80 border border-charcoal-border/50'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-2 z-10 p-1.5 rounded-full bg-white/90 shadow-md border border-charcoal-border/60 text-charcoal hover:bg-cream-100 transition-all items-center justify-center translate-x-2"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
